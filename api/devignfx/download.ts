/**
 * DevignFX Download API — serves signed build ZIPs.
 *
 * GET /api/devignfx/download?key=DEVFX-XXX
 *
 * Validates the license, then returns a signed Supabase Storage URL
 * for the latest build. The build ZIP is uploaded to the
 * 'devignfx-builds' bucket by the admin.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = (req.query.key as string || "").trim().toUpperCase();
  if (!key || !key.startsWith("DEVFX-")) {
    return res.status(400).json({ error: "Missing or invalid license key" });
  }

  try {
    // Validate license
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

    // Find the latest build in storage
    // First check tier-specific folder, then root. Picks the most recent .zip.
    let signedUrl = null;

    for (const folder of [license.tier, ""]) {
      const { data: files } = await supabase.storage
        .from("devignfx-builds")
        .list(folder || undefined, { sortBy: { column: "created_at", order: "desc" }, limit: 10 });

      const zip = files?.find((f) => f.name.endsWith(".zip"));
      if (zip) {
        const path = folder ? `${folder}/${zip.name}` : zip.name;
        const { data } = await supabase.storage
          .from("devignfx-builds")
          .createSignedUrl(path, 3600); // 1 hour expiry
        if (data?.signedUrl) {
          signedUrl = data.signedUrl;
          break;
        }
      }
    }

    if (!signedUrl) {
      return res.status(404).json({
        error: "No build available. Contact hello@gr8qm.com.",
      });
    }

    // Log the download
    const ip = (req.headers["x-forwarded-for"] as string || "unknown").split(",")[0].trim();
    await supabase.from("devignfx_activation_log").insert({
      license_key: key,
      event: "download",
      ip_address: ip,
      details: { tier: license.tier },
    });

    // Redirect to signed URL
    return res.redirect(302, signedUrl);
  } catch (err) {
    console.error("Download error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
