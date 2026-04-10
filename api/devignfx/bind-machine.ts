/**
 * DevignFX Machine Binding API — called by the bot on first activation.
 *
 * POST /api/devignfx/bind-machine
 * Body: { key: "DEVFX-XXX", machine: "abc123...", build_id: "BLD-XXX", balance: 12345.67 }
 *
 * Auto-binds the machine fingerprint on first activation.
 * Returns conflict if already bound to a different machine.
 * Sends Telegram notification to admin on new binding or conflict.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_TG_TOKEN = process.env.ADMIN_TG_TOKEN || "";
const ADMIN_TG_CHAT = process.env.ADMIN_TG_CHAT || "";

async function notifyAdmin(message: string) {
  if (!ADMIN_TG_TOKEN || !ADMIN_TG_CHAT) return;
  try {
    await fetch(`https://api.telegram.org/bot${ADMIN_TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ADMIN_TG_CHAT,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch {
    // Best-effort
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key, machine, build_id, balance } = req.body || {};

  if (!key || !machine) {
    return res.status(400).json({ error: "Missing key or machine" });
  }

  const ip = (req.headers["x-forwarded-for"] as string || "unknown").split(",")[0].trim();

  try {
    const { data: license, error } = await supabase
      .from("devignfx_licenses")
      .select("*")
      .eq("license_key", key)
      .single();

    if (error || !license) {
      return res.status(404).json({ error: "License not found" });
    }

    // Already bound to this machine — OK
    if (license.machine === machine) {
      return res.status(200).json({ status: "ok", message: "Already bound" });
    }

    // Bound to a DIFFERENT machine — conflict
    if (license.machine && license.machine !== machine) {
      await supabase.from("devignfx_activation_log").insert({
        license_key: key,
        event: "device_conflict",
        machine,
        ip_address: ip,
        details: {
          bound_to: license.machine,
          attempted_from: machine,
          build_id: build_id || "",
        },
      });

      await notifyAdmin(
        `<b>DEVICE CONFLICT</b>\n` +
        `Key: <code>${key}</code>\n` +
        `Name: ${license.name}\n` +
        `Bound to: <code>${license.machine}</code>\n` +
        `Attempted from: <code>${machine}</code>\n` +
        `IP: ${ip}\n\n` +
        `Someone may be sharing this license.`
      );

      return res.status(409).json({
        status: "conflict",
        message: "License already bound to another device",
      });
    }

    // First activation — bind machine
    await supabase
      .from("devignfx_licenses")
      .update({
        machine,
        activated_at: new Date().toISOString(),
        build_id: build_id || license.build_id,
        updated_at: new Date().toISOString(),
      })
      .eq("license_key", key);

    await supabase.from("devignfx_activation_log").insert({
      license_key: key,
      event: "bind_machine",
      machine,
      ip_address: ip,
      details: {
        build_id: build_id || "",
        balance: balance || 0,
      },
    });

    await notifyAdmin(
      `<b>New Activation</b>\n` +
      `Key: <code>${key}</code>\n` +
      `Name: ${license.name}\n` +
      `Email: ${license.email}\n` +
      `Tier: ${license.tier}\n` +
      `Machine: <code>${machine}</code>\n` +
      `Build: ${build_id || "unknown"}\n` +
      `Balance: ${balance || "unknown"}\n` +
      `IP: ${ip}\n\n` +
      `Machine auto-bound.`
    );

    return res.status(200).json({
      status: "ok",
      message: "Machine bound successfully",
    });
  } catch (err) {
    console.error("Bind machine error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
