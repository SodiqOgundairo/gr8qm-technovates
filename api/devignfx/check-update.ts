/**
 * Check for DevignFX bot updates — polled by the bot itself.
 *
 * GET /api/devignfx/check-update?key=DEVFX-XXX&current_build=BLD-XXX
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_URL = process.env.VITE_SITE_URL || "https://devignfx.gr8qm.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const key = ((req.query.key as string) || "").trim().toUpperCase();
  const currentBuild = ((req.query.current_build as string) || "").trim().toUpperCase();

  if (!key || !key.startsWith("DEVFX-")) {
    return res.status(400).json({ error: "Valid license key required" });
  }

  try {
    const { data: license, error: licErr } = await supabase
      .from("devignfx_licenses")
      .select("license_key, status, tier")
      .eq("license_key", key)
      .single();

    if (licErr || !license) {
      return res.status(404).json({ error: "License not found" });
    }
    if (license.status !== "active") {
      return res.status(403).json({ error: "License is not active" });
    }

    // Find latest published stable build for this tier
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
      return res.status(200).json({
        update_available: false,
        message: "No published builds available",
      });
    }

    const updateAvailable = !currentBuild || currentBuild !== latest.build_id;

    return res.status(200).json({
      update_available: updateAvailable,
      latest_build_id: latest.build_id,
      latest_version: latest.version,
      release_notes: latest.release_notes || "",
      download_url: `${SITE_URL}/download`,
    });
  } catch (err: any) {
    console.error("Check update error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
