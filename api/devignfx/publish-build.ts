/**
 * Publish a DevignFX build — marks it as published, archives previous,
 * and optionally emails all active license holders for the tier.
 *
 * POST /api/devignfx/publish-build
 * Body: { buildId, notify?: boolean }
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_TG_TOKEN = process.env.ADMIN_TG_TOKEN || "";
const ADMIN_TG_CHAT = process.env.ADMIN_TG_CHAT || "";
const SITE_URL = process.env.VITE_SITE_URL || "https://devignfx.gr8qm.com";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: "Invalid session" });

  const { buildId, notify = true } = req.body || {};
  if (!buildId) return res.status(400).json({ error: "buildId required" });

  try {
    // Get the build
    const { data: build, error: fetchErr } = await supabase
      .from("devignfx_builds")
      .select("*")
      .eq("build_id", buildId)
      .single();

    if (fetchErr || !build) {
      return res.status(404).json({ error: "Build not found" });
    }

    if (build.status === "published") {
      return res.status(400).json({ error: "Build is already published" });
    }

    // Archive previous published builds of same tier+channel
    await supabase
      .from("devignfx_builds")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("tier", build.tier)
      .eq("channel", build.channel)
      .eq("status", "published");

    // Publish this build
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
      `Tier: ${build.tier}\n` +
      `Signed: ${build.signed ? "Yes" : "No"}`
    );

    // Send notification emails to active license holders
    let notified = 0;
    if (notify && build.channel === "stable") {
      const tiers = build.tier === "root"
        ? ["standard", "premium", "enterprise"]
        : [build.tier];

      const { data: licenses } = await supabase
        .from("devignfx_licenses")
        .select("email, name, license_key, tier")
        .in("tier", tiers)
        .eq("status", "active");

      if (licenses && licenses.length > 0) {
        const supabaseUrl = process.env.VITE_SUPABASE_URL!;
        const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

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
                html: buildUpdateEmail(lic.name || lic.email.split("@")[0], build.version, build.release_notes || "", lic.license_key),
                text: `Hi ${lic.name},\n\nDevignFX v${build.version} is now available.\n\n${build.release_notes || ""}\n\nDownload: ${SITE_URL}/download\nUse your license key: ${lic.license_key}\n\nDevignFX by GR8QM`,
              }),
            });
            notified++;
          } catch {
            // best-effort per email
          }
        }
      }
    }

    return res.status(200).json({ success: true, build: published, notified });
  } catch (err: any) {
    console.error("Publish build error:", err);
    return res.status(500).json({ error: err.message || "Publish failed" });
  }
}

function buildUpdateEmail(name: string, version: string, notes: string, licenseKey: string): string {
  const downloadPageUrl = `${SITE_URL}/download`;
  return `
<!DOCTYPE html>
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
      ${notes ? `
      <div class="notes">
        <h3>What's New</h3>
        <p>${notes}</p>
      </div>` : ""}
      <p style="color: #888;">Your license key: <code style="background: #0d1117; color: #00c853; padding: 2px 8px; border-radius: 4px;">${licenseKey}</code></p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${downloadPageUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #00c853, #00897b); color: white; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px;">
          Download Update
        </a>
      </div>
      <p style="color: #888; font-size: 13px;">
        Visit the download page and enter your license key to get the latest version.
        You can download each version once.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #e0e0e0;">DevignFX by GR8QM</p>
      <p style="margin: 0;">Need help? <a href="mailto:hello@gr8qm.com">hello@gr8qm.com</a></p>
    </div>
  </div>
</body>
</html>`;
}
