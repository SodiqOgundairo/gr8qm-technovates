/**
 * DevignFX Download API — serves signed build ZIPs.
 *
 * Three modes:
 *   GET ?token=XXX   — one-time download token (from download page or email)
 *   GET ?key=DEVFX-X — admin/repeat download (license key, serves latest stable)
 *   GET ?build=BLD-X  — admin direct build download (specific build by ID)
 *
 * Token-based downloads: token consumed at redirect time, logged in download_log.
 * Key-based downloads: admin only, no consumption limit.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_URL = process.env.VITE_SITE_URL || "https://devignfx.gr8qm.com";
const BUCKET = "devignfx-builds";

/** Get a signed URL for a storage path */
async function getSignedUrl(storagePath: string): Promise<string | null> {
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 3600);
  return data?.signedUrl || null;
}

/** Find latest build from Storage bucket (fallback for legacy pre-DB builds) */
async function findLatestBuild(tier: string): Promise<string | null> {
  // Try builds table first
  const { data: build } = await supabase
    .from("devignfx_builds")
    .select("storage_path")
    .in("tier", [tier, "root"])
    .eq("channel", "stable")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (build?.storage_path) {
    return getSignedUrl(build.storage_path);
  }

  // Fallback: scan Storage directly (legacy)
  for (const folder of [tier, ""]) {
    const { data: files } = await supabase.storage
      .from(BUCKET)
      .list(folder || undefined, {
        sortBy: { column: "created_at", order: "desc" },
        limit: 10,
      });

    const zip = files?.find((f) => f.name.endsWith(".zip"));
    if (zip) {
      const path = folder ? `${folder}/${zip.name}` : zip.name;
      return getSignedUrl(path);
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
  const buildParam = (req.query.build as string || "").trim().toUpperCase();
  const ip = (req.headers["x-forwarded-for"] as string || "unknown").split(",")[0].trim();

  // ── Mode 1: Token-based download (from download page or email) ──
  if (token) {
    try {
      // Check new download_tokens table first
      const { data: tokenRow, error: tokenErr } = await supabase
        .from("devignfx_download_tokens")
        .select("token, license_key, build_id, consumed, expires_at")
        .eq("token", token)
        .single();

      if (!tokenErr && tokenRow) {
        // New token system
        if (tokenRow.consumed) {
          return res.redirect(302, `${SITE_URL}/devignfx/download-expired`);
        }
        if (new Date(tokenRow.expires_at) < new Date()) {
          return res.redirect(302, `${SITE_URL}/devignfx/download-expired`);
        }

        // Get the build
        const { data: build } = await supabase
          .from("devignfx_builds")
          .select("storage_path, build_id")
          .eq("build_id", tokenRow.build_id)
          .single();

        if (!build) {
          return res.status(404).json({ error: "Build not found" });
        }

        const signedUrl = await getSignedUrl(build.storage_path);
        if (!signedUrl) {
          return res.status(404).json({ error: "Build file not found in storage" });
        }

        // Consume the token — this is the actual download moment
        await supabase
          .from("devignfx_download_tokens")
          .update({ consumed: true, consumed_at: new Date().toISOString(), ip_address: ip })
          .eq("token", token);

        // Log in download_log (one per license+build)
        await supabase
          .from("devignfx_download_log")
          .upsert(
            { license_key: tokenRow.license_key, build_id: tokenRow.build_id, ip_address: ip },
            { onConflict: "license_key,build_id" }
          );

        // Also log in activation_log
        await supabase.from("devignfx_activation_log").insert({
          license_key: tokenRow.license_key,
          event: "download",
          ip_address: ip,
          details: { build_id: tokenRow.build_id, method: "token" },
        });

        return res.redirect(302, signedUrl);
      }

      // Fallback: check legacy download_token on licenses table
      const { data: license, error: legacyErr } = await supabase
        .from("devignfx_licenses")
        .select("license_key, status, tier, download_token")
        .eq("download_token", token)
        .single();

      if (legacyErr || !license) {
        return res.redirect(302, `${SITE_URL}/devignfx/download-expired`);
      }
      if (license.status !== "active") {
        return res.redirect(302, `${SITE_URL}/devignfx/download-expired`);
      }

      const signedUrl = await findLatestBuild(license.tier);
      if (!signedUrl) {
        return res.status(404).json({ error: "No build available. Contact hello@gr8qm.com." });
      }

      // Clear legacy token
      await supabase
        .from("devignfx_licenses")
        .update({ download_token: null, updated_at: new Date().toISOString() })
        .eq("download_token", token);

      await supabase.from("devignfx_activation_log").insert({
        license_key: license.license_key,
        event: "download",
        ip_address: ip,
        details: { tier: license.tier, method: "legacy_token" },
      });

      return res.redirect(302, signedUrl);
    } catch (err) {
      console.error("Token download error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // ── Mode 2: Admin direct build download ──
  if (buildParam && buildParam.startsWith("BLD-")) {
    try {
      const { data: build } = await supabase
        .from("devignfx_builds")
        .select("storage_path")
        .eq("build_id", buildParam)
        .single();

      if (!build) return res.status(404).json({ error: "Build not found" });

      const signedUrl = await getSignedUrl(build.storage_path);
      if (!signedUrl) return res.status(404).json({ error: "File not found in storage" });

      return res.redirect(302, signedUrl);
    } catch (err) {
      console.error("Build download error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // ── Mode 3: License key download (admin / re-issue) ──
  if (!key || !key.startsWith("DEVFX-")) {
    return res.status(400).json({ error: "Missing token or license key" });
  }

  try {
    const { data: license, error } = await supabase
      .from("devignfx_licenses")
      .select("status, tier")
      .eq("license_key", key)
      .single();

    if (error || !license) return res.status(404).json({ error: "License not found" });
    if (license.status !== "active") return res.status(403).json({ error: "License is not active" });

    const signedUrl = await findLatestBuild(license.tier);
    if (!signedUrl) {
      return res.status(404).json({ error: "No build available. Contact hello@gr8qm.com." });
    }

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
