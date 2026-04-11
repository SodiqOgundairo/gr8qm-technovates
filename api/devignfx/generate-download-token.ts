/**
 * Generate a one-time download token for a specific build.
 *
 * POST /api/devignfx/generate-download-token
 * Body: { licenseKey, buildId }
 *
 * Token is only consumed when the actual download redirect happens,
 * not when the customer visits the download page.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_URL = process.env.VITE_SITE_URL || "https://devignfx.gr8qm.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { licenseKey, buildId } = req.body || {};
  const key = (licenseKey || "").trim().toUpperCase();

  if (!key || !buildId) {
    return res.status(400).json({ error: "licenseKey and buildId required" });
  }

  try {
    // Validate license
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

    // Validate build
    const { data: build, error: buildErr } = await supabase
      .from("devignfx_builds")
      .select("build_id, tier, status, channel")
      .eq("build_id", buildId)
      .single();

    if (buildErr || !build) {
      return res.status(404).json({ error: "Build not found" });
    }

    if (build.status !== "published" && build.status !== "archived") {
      return res.status(400).json({ error: "Build is not available for download" });
    }

    // Check tier match (root builds available to all tiers)
    if (build.tier !== "root" && build.tier !== license.tier) {
      return res.status(403).json({ error: "Build not available for your tier" });
    }

    // Check if already downloaded (only for archived builds, latest 3 allow re-download)
    // For published builds, we allow re-generating tokens if previous ones expired unused
    const { data: existingDownload } = await supabase
      .from("devignfx_download_log")
      .select("id")
      .eq("license_key", key)
      .eq("build_id", buildId)
      .single();

    if (existingDownload) {
      return res.status(409).json({ error: "You have already downloaded this version" });
    }

    // Invalidate any previous unused tokens for this license+build
    await supabase
      .from("devignfx_download_tokens")
      .update({ consumed: true, consumed_at: new Date().toISOString() })
      .eq("license_key", key)
      .eq("build_id", buildId)
      .eq("consumed", false);

    // Generate new token — 1 hour expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const { error: insertErr } = await supabase
      .from("devignfx_download_tokens")
      .insert({
        token,
        license_key: key,
        build_id: buildId,
        expires_at: expiresAt,
      });

    if (insertErr) throw insertErr;

    const downloadUrl = `${SITE_URL}/api/devignfx/download?token=${token}`;

    return res.status(200).json({
      success: true,
      token,
      downloadUrl,
      expiresAt,
    });
  } catch (err: any) {
    console.error("Generate token error:", err);
    return res.status(500).json({ error: err.message || "Failed to generate token" });
  }
}
