/**
 * DevignFX Download API — serves signed build ZIPs.
 *
 * Two modes:
 *   GET /api/devignfx/download?token=XXXXX   — one-time download link (from email)
 *   GET /api/devignfx/download?key=DEVFX-XXX — admin/repeat download (license key)
 *
 * Token-based downloads are single-use: the token is cleared after first download.
 * Key-based downloads require an active license (for admin testing / re-issue).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_URL = process.env.VITE_SITE_URL || "https://devignfx.gr8qm.com";

async function findLatestBuild(tier: string): Promise<string | null> {
  for (const folder of [tier, ""]) {
    const { data: files } = await supabase.storage
      .from("devignfx-builds")
      .list(folder || undefined, {
        sortBy: { column: "created_at", order: "desc" },
        limit: 10,
      });

    const zip = files?.find((f) => f.name.endsWith(".zip"));
    if (zip) {
      const path = folder ? `${folder}/${zip.name}` : zip.name;
      const { data } = await supabase.storage
        .from("devignfx-builds")
        .createSignedUrl(path, 3600);
      if (data?.signedUrl) return data.signedUrl;
    }
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = (req.query.token as string || "").trim();
  const key = (req.query.key as string || "").trim().toUpperCase();
  const ip = (req.headers["x-forwarded-for"] as string || "unknown").split(",")[0].trim();

  // ── Mode 1: One-time token download ──
  if (token) {
    try {
      const { data: license, error } = await supabase
        .from("devignfx_licenses")
        .select("license_key, status, tier, download_token")
        .eq("download_token", token)
        .single();

      if (error || !license) {
        // Token not found or already used — redirect to expired page
        return res.redirect(302, `${SITE_URL}/download-expired`);
      }

      if (license.status !== "active") {
        return res.redirect(302, `${SITE_URL}/download-expired`);
      }

      const signedUrl = await findLatestBuild(license.tier);
      if (!signedUrl) {
        return res.status(404).json({
          error: "No build available. Contact hello@gr8qm.com.",
        });
      }

      // Clear the token — makes this a one-time download
      await supabase
        .from("devignfx_licenses")
        .update({ download_token: null, updated_at: new Date().toISOString() })
        .eq("download_token", token);

      // Log the download
      await supabase.from("devignfx_activation_log").insert({
        license_key: license.license_key,
        event: "download",
        ip_address: ip,
        details: { tier: license.tier, method: "token" },
      });

      return res.redirect(302, signedUrl);
    } catch (err) {
      console.error("Token download error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // ── Mode 2: License key download (admin / re-issue) ──
  if (!key || !key.startsWith("DEVFX-")) {
    return res.status(400).json({ error: "Missing token or license key" });
  }

  try {
    const { data: license, error } = await supabase
      .from("devignfx_licenses")
      .select("status, tier")
      .eq("license_key", key)
      .single();

    if (error || !license) {
      return res.status(404).json({ error: "License not found" });
    }

    if (license.status !== "active") {
      return res.status(403).json({ error: "License is not active" });
    }

    const signedUrl = await findLatestBuild(license.tier);
    if (!signedUrl) {
      return res.status(404).json({
        error: "No build available. Contact hello@gr8qm.com.",
      });
    }

    // Log the download
    await supabase.from("devignfx_activation_log").insert({
      license_key: key,
      event: "download",
      ip_address: ip,
      details: { tier: license.tier, method: "key" },
    });

    return res.redirect(302, signedUrl);
  } catch (err) {
    console.error("Download error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
