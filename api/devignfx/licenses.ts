/**
 * DevignFX License Check API — called by the trading bot.
 *
 * GET /api/devignfx/licenses?key=DEVFX-XXXXXXXXXXXX
 *
 * Returns the exact same JSON shape as the old GitHub Gist so the bot
 * requires zero code changes. The bot's LICENSE_URL just points here.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for bot requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = (req.query.key as string || "").trim().toUpperCase();
  if (!key || !key.startsWith("DEVFX-")) {
    return res.status(400).json({ error: "Missing or invalid license key" });
  }

  try {
    // Fetch the license
    const { data: license, error } = await supabase
      .from("devignfx_licenses")
      .select("*")
      .eq("license_key", key)
      .single();

    if (error || !license) {
      // Return valid JSON so bot sees "key not found" (same as Gist behavior)
      return res.status(200).json({ licenses: {} });
    }

    // Update last_check_at
    await supabase
      .from("devignfx_licenses")
      .update({ last_check_at: new Date().toISOString() })
      .eq("license_key", key);

    // Log the check (lightweight — only log every ~5 min from the bot)
    const ip = (req.headers["x-forwarded-for"] as string || "unknown").split(",")[0].trim();
    await supabase.from("devignfx_activation_log").insert({
      license_key: key,
      event: "check",
      ip_address: ip,
      machine: license.machine,
    });

    // Return Gist-compatible JSON shape
    const entry: Record<string, unknown> = {
      name: license.name || "",
      status: license.status,
      expires: license.expires,
      max_days: license.max_days,
      max_profit_pct: license.max_profit_pct,
      silent_kill: license.silent_kill,
      message: license.message || "",
      machine: license.machine,
      build_id: license.build_id || "",
    };

    return res.status(200).json({
      licenses: {
        [key]: entry,
      },
    });
  } catch (err) {
    console.error("License check error:", err);
    // Return empty so bot falls into grace period (don't kill on server error)
    return res.status(500).json({ licenses: {} });
  }
}
