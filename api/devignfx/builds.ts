import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

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
  } catch (_e) { /* best-effort */ }
}

async function requireAuth(req: VercelRequest): Promise<boolean> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return !error && !!user;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.status(200).end();

    const action = (req.query.action as string) || "";

    if (action === "ping") {
      return res.status(200).json({ ok: true, env: { url: !!process.env.VITE_SUPABASE_URL, key: !!process.env.SUPABASE_SERVICE_ROLE_KEY } });
    }

    if (action === "register") {
      if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
      if (!(await requireAuth(req))) return res.status(401).json({ error: "Unauthorized" });

      const body = req.body || {};
      if (!body.storagePath || !body.version) {
        return res.status(400).json({ error: "storagePath and version required" });
      }

      const buildId = "BLD-" + randomBytes(4).toString("hex").toUpperCase();
      const fileName = (body.storagePath as string).split("/").pop() || "build.zip";

      const { data: row, error: err } = await supabase
        .from("devignfx_builds")
        .insert({
          build_id: buildId,
          version: body.version || "0.0.0",
          channel: body.channel || "stable",
          status: "draft",
          tier: body.tier || "standard",
          storage_path: body.storagePath,
          file_name: fileName,
          file_size: body.fileSize || 0,
          sha256: null,
          signature: null,
          signed: false,
          release_notes: body.releaseNotes || "",
        })
        .select()
        .single();

      if (err) return res.status(500).json({ error: "DB insert failed: " + err.message });
      return res.status(200).json({ success: true, build: row });
    }

    if (action === "publish") {
      if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
      if (!(await requireAuth(req))) return res.status(401).json({ error: "Unauthorized" });

      const { buildId, notify = true } = req.body || {};
      if (!buildId) return res.status(400).json({ error: "buildId required" });

      const { data: build, error: fetchErr } = await supabase
        .from("devignfx_builds").select("*").eq("build_id", buildId).single();

      if (fetchErr || !build) return res.status(404).json({ error: "Build not found" });
      if (build.status === "published") return res.status(400).json({ error: "Already published" });

      await supabase.from("devignfx_builds")
        .update({ status: "archived", updated_at: new Date().toISOString() })
        .eq("tier", build.tier).eq("channel", build.channel).eq("status", "published");

      const now = new Date().toISOString();
      const { data: published, error: pubErr } = await supabase
        .from("devignfx_builds")
        .update({ status: "published", published_at: now, updated_at: now })
        .eq("build_id", buildId).select().single();

      if (pubErr) return res.status(500).json({ error: "Publish failed: " + pubErr.message });

      await notifyTelegram(
        "<b>BUILD PUBLISHED</b>\n" +
        "Build: <code>" + buildId + "</code>\n" +
        "Version: " + build.version + " (" + build.channel + ")\n" +
        "Tier: " + build.tier
      );

      let notified = 0;
      if (notify && build.channel === "stable") {
        const tiers = build.tier === "root" ? ["standard", "premium", "enterprise"] : [build.tier];
        const { data: licenses } = await supabase
          .from("devignfx_licenses").select("email, name, license_key, tier")
          .in("tier", tiers).eq("status", "active");

        if (licenses && licenses.length > 0) {
          const sbUrl = process.env.VITE_SUPABASE_URL!;
          const sbKey = process.env.VITE_SUPABASE_ANON_KEY!;
          const dlUrl = SITE_URL + "/download";

          for (const lic of licenses) {
            try {
              await fetch(sbUrl + "/functions/v1/send-receipt-email", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: "Bearer " + sbKey },
                body: JSON.stringify({
                  to: lic.email,
                  subject: "DevignFX v" + build.version + " - New Update Available",
                  html: buildUpdateEmail(lic.name || lic.email.split("@")[0], build.version, build.release_notes || "", lic.license_key, dlUrl),
                  text: "Hi " + lic.name + ",\n\nDevignFX v" + build.version + " is now available.\n\nDownload: " + dlUrl + "\nLicense key: " + lic.license_key + "\n\nDevignFX by GR8QM",
                }),
              });
              notified++;
            } catch (_e) { /* best-effort */ }
          }
        }
      }

      return res.status(200).json({ success: true, build: published, notified });
    }

    if (action === "token") {
      if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

      const licKey = ((req.body?.licenseKey as string) || "").trim().toUpperCase();
      const bId = (req.body?.buildId as string) || "";
      if (!licKey || !bId) return res.status(400).json({ error: "licenseKey and buildId required" });

      const { data: lic, error: le } = await supabase
        .from("devignfx_licenses").select("license_key, status, tier")
        .eq("license_key", licKey).single();
      if (le || !lic) return res.status(404).json({ error: "License not found" });
      if (lic.status !== "active") return res.status(403).json({ error: "License not active" });

      const { data: bld, error: be } = await supabase
        .from("devignfx_builds").select("build_id, tier, status")
        .eq("build_id", bId).single();
      if (be || !bld) return res.status(404).json({ error: "Build not found" });
      if (bld.status !== "published" && bld.status !== "archived") return res.status(400).json({ error: "Build not available" });
      if (bld.tier !== "root" && bld.tier !== lic.tier) return res.status(403).json({ error: "Tier mismatch" });

      const { data: dl } = await supabase
        .from("devignfx_download_log").select("id")
        .eq("license_key", licKey).eq("build_id", bId).single();
      if (dl) return res.status(409).json({ error: "Already downloaded this version" });

      await supabase.from("devignfx_download_tokens")
        .update({ consumed: true, consumed_at: new Date().toISOString() })
        .eq("license_key", licKey).eq("build_id", bId).eq("consumed", false);

      const tok = randomBytes(32).toString("hex");
      const exp = new Date(Date.now() + 3600000).toISOString();

      const { error: ie } = await supabase
        .from("devignfx_download_tokens")
        .insert({ token: tok, license_key: licKey, build_id: bId, expires_at: exp });
      if (ie) return res.status(500).json({ error: "Token creation failed: " + ie.message });

      return res.status(200).json({ success: true, token: tok, downloadUrl: SITE_URL + "/api/devignfx/download?token=" + tok, expiresAt: exp });
    }

    if (action === "list") {
      if (req.method !== "GET") return res.status(405).json({ error: "GET only" });

      const key = ((req.query.key as string) || "").trim().toUpperCase();
      if (!key || !key.startsWith("DEVFX-")) return res.status(400).json({ error: "Valid license key required" });

      const { data: lic, error: le } = await supabase
        .from("devignfx_licenses").select("license_key, status, tier, name, email")
        .eq("license_key", key).single();
      if (le || !lic) return res.status(404).json({ error: "License not found" });
      if (lic.status !== "active") return res.status(403).json({ error: "License not active" });

      const { data: builds } = await supabase
        .from("devignfx_builds")
        .select("build_id, version, channel, status, tier, file_size, release_notes, published_at, file_name")
        .in("tier", [lic.tier, "root"]).in("status", ["published", "archived"])
        .order("published_at", { ascending: false }).limit(20);

      if (!builds || builds.length === 0) {
        return res.status(200).json({ builds: [], license: { tier: lic.tier, name: lic.name } });
      }

      const { data: dls } = await supabase
        .from("devignfx_download_log").select("build_id").eq("license_key", key);
      const dlSet = new Set((dls || []).map((d: any) => d.build_id));

      const stable = builds.filter(b => b.channel === "stable");
      const beta = builds.filter(b => b.channel === "beta");
      const result: any[] = [];

      if (stable[0]) result.push({ ...stable[0], label: "Latest", downloadable: true, already_downloaded: dlSet.has(stable[0].build_id) });
      if (beta[0]) result.push({ ...beta[0], label: "Beta", downloadable: true, already_downloaded: dlSet.has(beta[0].build_id) });
      if (stable[1]) result.push({ ...stable[1], label: "Previous", downloadable: true, already_downloaded: dlSet.has(stable[1].build_id) });

      const shown = new Set(result.map(r => r.build_id));
      for (const b of builds) {
        if (!shown.has(b.build_id) && result.length < 6) {
          result.push({ ...b, label: "Archived", downloadable: false, already_downloaded: dlSet.has(b.build_id) });
        }
      }

      return res.status(200).json({ builds: result, license: { tier: lic.tier, name: lic.name } });
    }

    if (action === "check-update") {
      if (req.method !== "GET") return res.status(405).json({ error: "GET only" });

      const key = ((req.query.key as string) || "").trim().toUpperCase();
      const cur = ((req.query.current_build as string) || "").trim().toUpperCase();
      if (!key || !key.startsWith("DEVFX-")) return res.status(400).json({ error: "Valid license key required" });

      const { data: lic, error: le } = await supabase
        .from("devignfx_licenses").select("license_key, status, tier")
        .eq("license_key", key).single();
      if (le || !lic) return res.status(404).json({ error: "License not found" });
      if (lic.status !== "active") return res.status(403).json({ error: "License not active" });

      const { data: latest } = await supabase
        .from("devignfx_builds")
        .select("build_id, version, published_at, release_notes")
        .in("tier", [lic.tier, "root"]).eq("channel", "stable").eq("status", "published")
        .order("published_at", { ascending: false }).limit(1).single();

      if (!latest) return res.status(200).json({ update_available: false, message: "No published builds" });

      return res.status(200).json({
        update_available: !cur || cur !== latest.build_id,
        latest_build_id: latest.build_id,
        latest_version: latest.version,
        release_notes: latest.release_notes || "",
        download_url: SITE_URL + "/download",
      });
    }

    return res.status(400).json({ error: "Unknown action: " + action });
  } catch (err: any) {
    console.error("Builds API error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

function buildUpdateEmail(name: string, version: string, notes: string, licenseKey: string, downloadPageUrl: string): string {
  var css = "body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.6;color:#e0e0e0;margin:0;padding:0;background:#0a0a0a}";
  css += ".c{max-width:600px;margin:20px auto;background:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #2a2a4a}";
  css += ".h{background:linear-gradient(135deg,#00c853,#00897b);padding:40px 20px;text-align:center;color:#fff}";
  css += ".h h1{margin:0;font-size:28px;font-weight:700}";
  css += ".ct{padding:40px 30px}";
  css += ".vb{display:inline-block;background:#00c853;color:#0a0a0a;padding:6px 16px;border-radius:20px;font-weight:700;font-size:18px;margin-bottom:20px}";
  css += ".n{background:#0d1117;border-radius:8px;padding:20px;margin:20px 0;border-left:3px solid #00c853}";
  css += ".f{background:#0d1117;padding:30px;text-align:center;color:#666;font-size:14px}";
  css += ".f a{color:#00c853;text-decoration:none}";

  var html = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">";
  html += "<style>" + css + "</style></head><body><div class=\"c\">";
  html += "<div class=\"h\"><h1>DevignFX Update</h1>";
  html += "<p style=\"margin:10px 0 0;font-size:16px\">A new version is available</p></div>";
  html += "<div class=\"ct\"><p>Hi " + name + ",</p>";
  html += "<div class=\"vb\">v" + version + "</div>";
  if (notes) {
    html += "<div class=\"n\"><h3 style=\"margin:0 0 10px;color:#00c853;font-size:14px\">What's New</h3>";
    html += "<p style=\"margin:0;color:#ccc;font-size:14px;white-space:pre-wrap\">" + notes + "</p></div>";
  }
  html += "<p style=\"color:#888\">Your license key: <code style=\"background:#0d1117;color:#00c853;padding:2px 8px;border-radius:4px\">" + licenseKey + "</code></p>";
  html += "<div style=\"text-align:center;margin:30px 0\">";
  html += "<a href=\"" + downloadPageUrl + "\" style=\"display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#00c853,#00897b);color:#fff;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px\">Download Update</a></div>";
  html += "<p style=\"color:#888;font-size:13px\">Visit the download page and enter your license key to get the latest version.</p></div>";
  html += "<div class=\"f\"><p style=\"margin:0 0 10px;font-weight:600;color:#e0e0e0\">DevignFX by GR8QM</p>";
  html += "<p style=\"margin:0\">Need help? <a href=\"mailto:hello@gr8qm.com\">hello@gr8qm.com</a></p></div></div></body></html>";
  return html;
}
