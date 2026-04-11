/**
 * DevignFX Builds Router — consolidated endpoint for build management.
 *
 * Routes by query param `action`:
 *   POST ?action=register   — sign & register an uploaded build
 *   POST ?action=publish    — publish a draft build + notify users
 *   POST ?action=token      — generate a one-time download token
 *   GET  ?action=list&key=  — list builds for a customer license
 *   GET  ?action=check-update&key=&current_build= — bot update check
 *
 * This consolidates 5 endpoints into 1 serverless function (Hobby plan limit).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "devignfx-builds";
const SITE_URL = process.env.VITE_SITE_URL || "https://devignfx.gr8qm.com";
const ADMIN_TG_TOKEN = process.env.ADMIN_TG_TOKEN || "";
const ADMIN_TG_CHAT = process.env.ADMIN_TG_CHAT || "";

async function notifyTelegram(message: string) {
  if (!ADMIN_TG_TOKEN || !ADMIN_TG_CHAT) return;
  try {
    await fetch(`https://api.telegram.org/bot${ADMIN_TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: ADMIN_TG_CHAT, text: message, parse_mode: "HTML" }),
    });
  } catch { /* best-effort */ }
}

async function requireAuth(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: "Invalid session" });
    return false;
  }
  return true;
}

// ═══════════════════════════════════════════════════════════
// ACTION: register — sign & register an uploaded build
// ═══════════════════════════════════════════════════════════
async function handleRegister(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!(await requireAuth(req, res))) return;

  const { storagePath, tier, version, channel, releaseNotes, fileSize } = req.body || {};
  if (!storagePath || !version) {
    return res.status(400).json({ error: "storagePath and version are required" });
  }

  const buildId = "BLD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  const buildFileName = `DevignFX-${buildId}.zip`;
  const newPath = tier === "root" ? buildFileName : `${tier}/${buildFileName}`;

  // Download file from storage for signing + renaming
  const { data: fileData, error: dlError } = await supabase.storage
    .from(BUCKET)
    .download(storagePath);

  if (dlError || !fileData) {
    return res.status(400).json({ error: `File not found: ${dlError?.message}` });
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());

  // Upload with new name
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(newPath, buffer, { contentType: "application/zip", upsert: true });

  if (uploadError) {
    return res.status(500).json({ error: `Rename failed: ${uploadError.message}` });
  }

  if (newPath !== storagePath) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
  }

  // Sign with Ed25519 if key available
  let sha256: string | null = crypto.createHash("sha256").update(buffer).digest("hex");
  let signature: string | null = null;
  let signed = false;

  const signingKeyB64 = process.env.DEVIGNFX_SIGNING_KEY;
  if (signingKeyB64) {
    try {
      const pemKey = Buffer.from(signingKeyB64, "base64").toString("utf-8");
      const privateKey = crypto.createPrivateKey(pemKey);
      const sig = crypto.sign(null, buffer, privateKey);
      signature = sig.toString("base64");
      signed = true;

      const sigContent = [
        "-----BEGIN DEVIGNFX SIGNATURE-----",
        `File: ${buildFileName}`,
        `Build: ${buildId}`,
        `SHA256: ${sha256}`,
        `Signature: ${signature}`,
        "-----END DEVIGNFX SIGNATURE-----",
      ].join("\n");

      await supabase.storage
        .from(BUCKET)
        .upload(newPath + ".sig", Buffer.from(sigContent), { contentType: "text/plain", upsert: true });
    } catch (err) {
      console.error("Signing failed:", err);
    }
  }

  const { data: buildRow, error: insertError } = await supabase
    .from("devignfx_builds")
    .insert({
      build_id: buildId,
      version: version || "0.0.0",
      channel: channel || "stable",
      status: "draft",
      tier: tier || "standard",
      storage_path: newPath,
      file_name: buildFileName,
      file_size: fileSize || buffer.length,
      sha256,
      signature,
      signed,
      release_notes: releaseNotes || "",
    })
    .select()
    .single();

  if (insertError) {
    return res.status(500).json({ error: `DB insert failed: ${insertError.message}` });
  }

  return res.status(200).json({ success: true, build: buildRow });
}

// ═══════════════════════════════════════════════════════════
// ACTION: publish — publish a draft build + notify users
// ═══════════════════════════════════════════════════════════
async function handlePublish(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!(await requireAuth(req, res))) return;

  const { buildId, notify = true } = req.body || {};
  if (!buildId) return res.status(400).json({ error: "buildId required" });

  const { data: build, error: fetchErr } = await supabase
    .from("devignfx_builds")
    .select("*")
    .eq("build_id", buildId)
    .single();

  if (fetchErr || !build) return res.status(404).json({ error: "Build not found" });
  if (build.status === "published") return res.status(400).json({ error: "Already published" });

  // Archive previous published builds of same tier+channel
  await supabase
    .from("devignfx_builds")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("tier", build.tier)
    .eq("channel", build.channel)
    .eq("status", "published");

  const now = new Date().toISOString();
  const { data: published, error: pubErr } = await supabase
    .from("devignfx_builds")
    .update({ status: "published", published_at: now, updated_at: now })
    .eq("build_id", buildId)
    .select()
    .single();

  if (pubErr) throw pubErr;

  await notifyTelegram(
    `<b>BUILD PUBLISHED</b>\n` +
    `Build: <code>${buildId}</code>\n` +
    `Version: ${build.version} (${build.channel})\n` +
    `Tier: ${build.tier}\nSigned: ${build.signed ? "Yes" : "No"}`
  );

  // Email notifications
  let notified = 0;
  if (notify && build.channel === "stable") {
    const tiers = build.tier === "root" ? ["standard", "premium", "enterprise"] : [build.tier];

    const { data: licenses } = await supabase
      .from("devignfx_licenses")
      .select("email, name, license_key, tier")
      .in("tier", tiers)
      .eq("status", "active");

    if (licenses && licenses.length > 0) {
      const supabaseUrl = process.env.VITE_SUPABASE_URL!;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
      const downloadPageUrl = `${SITE_URL}/download`;

      for (const lic of licenses) {
        try {
          await fetch(`${supabaseUrl}/functions/v1/send-receipt-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({
              to: lic.email,
              subject: `DevignFX v${build.version} — New Update Available`,
              html: buildUpdateEmail(lic.name || lic.email.split("@")[0], build.version, build.release_notes || "", lic.license_key, downloadPageUrl),
              text: `Hi ${lic.name},\n\nDevignFX v${build.version} is now available.\n\n${build.release_notes || ""}\n\nDownload: ${downloadPageUrl}\nUse your license key: ${lic.license_key}\n\nDevignFX by GR8QM`,
            }),
          });
          notified++;
        } catch { /* best-effort */ }
      }
    }
  }

  return res.status(200).json({ success: true, build: published, notified });
}

// ═══════════════════════════════════════════════════════════
// ACTION: token — generate one-time download token
// ═══════════════════════════════════════════════════════════
async function handleGenerateToken(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { licenseKey, buildId } = req.body || {};
  const key = (licenseKey || "").trim().toUpperCase();
  if (!key || !buildId) return res.status(400).json({ error: "licenseKey and buildId required" });

  // Validate license
  const { data: license, error: licErr } = await supabase
    .from("devignfx_licenses")
    .select("license_key, status, tier")
    .eq("license_key", key)
    .single();

  if (licErr || !license) return res.status(404).json({ error: "License not found" });
  if (license.status !== "active") return res.status(403).json({ error: "License is not active" });

  // Validate build
  const { data: build, error: buildErr } = await supabase
    .from("devignfx_builds")
    .select("build_id, tier, status")
    .eq("build_id", buildId)
    .single();

  if (buildErr || !build) return res.status(404).json({ error: "Build not found" });
  if (build.status !== "published" && build.status !== "archived") {
    return res.status(400).json({ error: "Build not available for download" });
  }
  if (build.tier !== "root" && build.tier !== license.tier) {
    return res.status(403).json({ error: "Build not available for your tier" });
  }

  // Check if already downloaded
  const { data: existingDownload } = await supabase
    .from("devignfx_download_log")
    .select("id")
    .eq("license_key", key)
    .eq("build_id", buildId)
    .single();

  if (existingDownload) {
    return res.status(409).json({ error: "You have already downloaded this version" });
  }

  // Invalidate previous unused tokens
  await supabase
    .from("devignfx_download_tokens")
    .update({ consumed: true, consumed_at: new Date().toISOString() })
    .eq("license_key", key)
    .eq("build_id", buildId)
    .eq("consumed", false);

  // Generate token (1 hour expiry)
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const { error: insertErr } = await supabase
    .from("devignfx_download_tokens")
    .insert({ token, license_key: key, build_id: buildId, expires_at: expiresAt });

  if (insertErr) throw insertErr;

  return res.status(200).json({
    success: true,
    token,
    downloadUrl: `${SITE_URL}/api/devignfx/download?token=${token}`,
    expiresAt,
  });
}

// ═══════════════════════════════════════════════════════════
// ACTION: list — list builds for a customer license
// ═══════════════════════════════════════════════════════════
async function handleList(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const key = ((req.query.key as string) || "").trim().toUpperCase();
  if (!key || !key.startsWith("DEVFX-")) {
    return res.status(400).json({ error: "Valid license key required" });
  }

  const { data: license, error: licErr } = await supabase
    .from("devignfx_licenses")
    .select("license_key, status, tier, name, email")
    .eq("license_key", key)
    .single();

  if (licErr || !license) return res.status(404).json({ error: "License not found" });
  if (license.status !== "active") return res.status(403).json({ error: "License is not active" });

  const { data: builds } = await supabase
    .from("devignfx_builds")
    .select("build_id, version, channel, status, tier, file_size, release_notes, published_at, file_name")
    .in("tier", [license.tier, "root"])
    .in("status", ["published", "archived"])
    .order("published_at", { ascending: false })
    .limit(20);

  if (!builds || builds.length === 0) {
    return res.status(200).json({ builds: [], license: { tier: license.tier, name: license.name } });
  }

  const { data: downloads } = await supabase
    .from("devignfx_download_log")
    .select("build_id")
    .eq("license_key", key);

  const downloadedSet = new Set((downloads || []).map((d: any) => d.build_id));

  const stableBuilds = builds.filter(b => b.channel === "stable");
  const betaBuilds = builds.filter(b => b.channel === "beta");
  const result: any[] = [];

  if (stableBuilds[0]) result.push({ ...stableBuilds[0], label: "Latest", downloadable: true, already_downloaded: downloadedSet.has(stableBuilds[0].build_id) });
  if (betaBuilds[0]) result.push({ ...betaBuilds[0], label: "Beta", downloadable: true, already_downloaded: downloadedSet.has(betaBuilds[0].build_id) });
  if (stableBuilds[1]) result.push({ ...stableBuilds[1], label: "Previous", downloadable: true, already_downloaded: downloadedSet.has(stableBuilds[1].build_id) });

  const shown = new Set(result.map(r => r.build_id));
  for (const b of builds) {
    if (!shown.has(b.build_id) && result.length < 6) {
      result.push({ ...b, label: "Archived", downloadable: false, already_downloaded: downloadedSet.has(b.build_id) });
    }
  }

  return res.status(200).json({ builds: result, license: { tier: license.tier, name: license.name } });
}

// ═══════════════════════════════════════════════════════════
// ACTION: check-update — bot polling endpoint
// ═══════════════════════════════════════════════════════════
async function handleCheckUpdate(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const key = ((req.query.key as string) || "").trim().toUpperCase();
  const currentBuild = ((req.query.current_build as string) || "").trim().toUpperCase();

  if (!key || !key.startsWith("DEVFX-")) {
    return res.status(400).json({ error: "Valid license key required" });
  }

  const { data: license, error: licErr } = await supabase
    .from("devignfx_licenses")
    .select("license_key, status, tier")
    .eq("license_key", key)
    .single();

  if (licErr || !license) return res.status(404).json({ error: "License not found" });
  if (license.status !== "active") return res.status(403).json({ error: "License is not active" });

  const { data: latest } = await supabase
    .from("devignfx_builds")
    .select("build_id, version, published_at, release_notes")
    .in("tier", [license.tier, "root"])
    .eq("channel", "stable")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (!latest) {
    return res.status(200).json({ update_available: false, message: "No published builds" });
  }

  return res.status(200).json({
    update_available: !currentBuild || currentBuild !== latest.build_id,
    latest_build_id: latest.build_id,
    latest_version: latest.version,
    release_notes: latest.release_notes || "",
    download_url: `${SITE_URL}/download`,
  });
}

// ═══════════════════════════════════════════════════════════
// ACTION: upload-url — generate signed upload URL (bypasses RLS)
// ═══════════════════════════════════════════════════════════
async function handleUploadUrl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!(await requireAuth(req, res))) return;

  const { fileName, tier } = req.body || {};
  if (!fileName) return res.status(400).json({ error: "fileName required" });

  const tempName = `_temp_${Date.now()}_${fileName}`;
  const storagePath = tier === "root" ? tempName : `${tier || "standard"}/${tempName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    return res.status(500).json({ error: `Failed to create upload URL: ${error?.message}` });
  }

  return res.status(200).json({
    success: true,
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
    storagePath,
  });
}

// ═══════════════════════════════════════════════════════════
// MAIN HANDLER — routes by ?action=
// ═══════════════════════════════════════════════════════════
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const action = (req.query.action as string) || "";

  try {
    switch (action) {
      case "upload-url": return await handleUploadUrl(req, res);
      case "register": return await handleRegister(req, res);
      case "publish": return await handlePublish(req, res);
      case "token": return await handleGenerateToken(req, res);
      case "list": return await handleList(req, res);
      case "check-update": return await handleCheckUpdate(req, res);
      default:
        return res.status(400).json({ error: `Unknown action: ${action}. Use: upload-url, register, publish, token, list, check-update` });
    }
  } catch (err: any) {
    console.error("Builds API error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

// ═══════════════════════════════════════════════════════════
// EMAIL TEMPLATE
// ═══════════════════════════════════════════════════════════
function buildUpdateEmail(name: string, version: string, notes: string, licenseKey: string, downloadPageUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #e0e0e0; margin: 0; padding: 0; background-color: #0a0a0a; }
    .container { max-width: 600px; margin: 20px auto; background: #1a1a2e; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a4a; }
    .header { background: linear-gradient(135deg, #00c853 0%, #00897b 100%); padding: 40px 20px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .version-badge { display: inline-block; background: #00c853; color: #0a0a0a; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 18px; margin-bottom: 20px; }
    .notes { background: #0d1117; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 3px solid #00c853; }
    .notes h3 { margin: 0 0 10px 0; color: #00c853; font-size: 14px; }
    .notes p { margin: 0; color: #ccc; font-size: 14px; white-space: pre-wrap; }
    .footer { background: #0d1117; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    .footer a { color: #00c853; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DevignFX Update</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">A new version is available</p>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <div class="version-badge">v${version}</div>
      ${notes ? `<div class="notes"><h3>What's New</h3><p>${notes}</p></div>` : ""}
      <p style="color: #888;">Your license key: <code style="background: #0d1117; color: #00c853; padding: 2px 8px; border-radius: 4px;">${licenseKey}</code></p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${downloadPageUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #00c853, #00897b); color: white; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px;">
          Download Update
        </a>
      </div>
      <p style="color: #888; font-size: 13px;">Visit the download page and enter your license key to get the latest version.</p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #e0e0e0;">DevignFX by GR8QM</p>
      <p style="margin: 0;">Need help? <a href="mailto:hello@gr8qm.com">hello@gr8qm.com</a></p>
    </div>
  </div>
</body>
</html>`;
}
