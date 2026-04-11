/**
 * List available builds for a customer's license.
 *
 * GET /api/devignfx/customer-builds?key=DEVFX-XXX
 *
 * Returns the last 3 published/archived builds for the license tier,
 * with download eligibility and labels.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const key = ((req.query.key as string) || "").trim().toUpperCase();
  if (!key || !key.startsWith("DEVFX-")) {
    return res.status(400).json({ error: "Valid license key required" });
  }

  try {
    // Validate license
    const { data: license, error: licErr } = await supabase
      .from("devignfx_licenses")
      .select("license_key, status, tier, name, email")
      .eq("license_key", key)
      .single();

    if (licErr || !license) {
      return res.status(404).json({ error: "License not found" });
    }
    if (license.status !== "active") {
      return res.status(403).json({ error: "License is not active" });
    }

    // Fetch builds for this tier + root builds
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

    // Check which builds this license already downloaded
    const { data: downloads } = await supabase
      .from("devignfx_download_log")
      .select("build_id")
      .eq("license_key", key);

    const downloadedSet = new Set((downloads || []).map((d: any) => d.build_id));

    // Categorize builds
    const stableBuilds = builds.filter(b => b.channel === "stable");
    const betaBuilds = builds.filter(b => b.channel === "beta");

    const result: any[] = [];

    // Latest stable
    if (stableBuilds[0]) {
      result.push({
        ...stableBuilds[0],
        label: "Latest",
        downloadable: true,
        already_downloaded: downloadedSet.has(stableBuilds[0].build_id),
      });
    }

    // Latest beta
    if (betaBuilds[0]) {
      result.push({
        ...betaBuilds[0],
        label: "Beta",
        downloadable: true,
        already_downloaded: downloadedSet.has(betaBuilds[0].build_id),
      });
    }

    // Previous stable (second stable build)
    if (stableBuilds[1]) {
      result.push({
        ...stableBuilds[1],
        label: "Previous",
        downloadable: true,
        already_downloaded: downloadedSet.has(stableBuilds[1].build_id),
      });
    }

    // Older builds — visible but disabled
    const shown = new Set(result.map(r => r.build_id));
    for (const b of builds) {
      if (!shown.has(b.build_id) && result.length < 6) {
        result.push({
          ...b,
          label: "Archived",
          downloadable: false,
          already_downloaded: downloadedSet.has(b.build_id),
        });
      }
    }

    return res.status(200).json({
      builds: result,
      license: { tier: license.tier, name: license.name },
    });
  } catch (err: any) {
    console.error("Customer builds error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
