/**
 * DevignFX Paystack Webhook — auto-provisions licenses on payment.
 *
 * POST /api/devignfx/webhook
 *
 * Flow: Paystack payment success → webhook fires → license created → email sent
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const ADMIN_TG_TOKEN = process.env.ADMIN_TG_TOKEN || "";
const ADMIN_TG_CHAT = process.env.ADMIN_TG_CHAT || "";

// Tier configuration — maps tier name to license settings
const TIER_CONFIG: Record<string, {
  max_days: number | null;
  max_profit_pct: number | null;
  expires_days: number | null; // days from now
}> = {
  standard: { max_days: 30, max_profit_pct: null, expires_days: 30 },
  premium: { max_days: 90, max_profit_pct: null, expires_days: 90 },
  enterprise: { max_days: null, max_profit_pct: null, expires_days: 365 },
};

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

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify Paystack signature
  if (PAYSTACK_SECRET) {
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({ error: "Invalid signature" });
    }
  }

  const { event, data } = req.body || {};

  // Only handle successful charges
  if (event !== "charge.success") {
    return res.status(200).json({ message: "Event ignored" });
  }

  const metadata = data?.metadata || {};

  // Only handle devignfx payments
  if (metadata.type !== "devignfx") {
    return res.status(200).json({ message: "Not a DevignFX payment" });
  }

  const email = data?.customer?.email || metadata.email || "";
  const name = metadata.customer_name || email.split("@")[0] || "";
  const tier = metadata.tier || "standard";
  const reference = data?.reference || "";
  const amount = (data?.amount || 0) / 100; // Paystack sends in kobo
  const couponCode = metadata.coupon_code || null;

  try {
    // Generate license key
    const { data: keyData, error: keyError } = await supabase.rpc("generate_devignfx_key");
    if (keyError) throw keyError;
    const licenseKey = keyData as string;

    // Get tier config
    const config = TIER_CONFIG[tier] || TIER_CONFIG.standard;

    // Calculate expiry
    const expires = config.expires_days ? addDays(config.expires_days) : null;

    // Create the license
    const { error: insertError } = await supabase
      .from("devignfx_licenses")
      .insert({
        license_key: licenseKey,
        name,
        email,
        status: "active",
        expires,
        max_days: config.max_days,
        max_profit_pct: config.max_profit_pct,
        tier,
        payment_reference: reference,
        amount_paid: amount,
        coupon_code: couponCode,
      });

    if (insertError) throw insertError;

    // Log the activation
    await supabase.from("devignfx_activation_log").insert({
      license_key: licenseKey,
      event: "purchase",
      details: {
        email,
        name,
        tier,
        amount,
        reference,
        coupon_code: couponCode,
      },
    });

    // Send license delivery email
    const supabaseUrl = process.env.VITE_SUPABASE_URL!;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

    await fetch(`${supabaseUrl}/functions/v1/send-receipt-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        to: email,
        subject: `Your DevignFX License Key — ${licenseKey}`,
        html: buildLicenseEmail(name, licenseKey, tier, expires, amount, reference),
        text: `DevignFX License Delivery\n\nHi ${name},\n\nYour license key: ${licenseKey}\nTier: ${tier}\n${expires ? `Expires: ${expires}\n` : ""}\nSetup:\n1. Download DevignFXBot from the link provided\n2. Create a .env file with your MT5 credentials\n3. Set LICENSE_KEY=${licenseKey}\n4. Set LICENSE_URL=https://devignfx.gr8qm.com/api/devignfx/licenses?key=${licenseKey}\n5. Run the bot\n\nContact hello@gr8qm.com for help.\n\nDevignFX by GR8QM`,
      }),
    });

    // Notify admin
    await notifyAdmin(
      `<b>NEW SALE</b>\n` +
      `Key: <code>${licenseKey}</code>\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Tier: ${tier}\n` +
      `Amount: ₦${amount.toLocaleString()}\n` +
      `Reference: ${reference}\n` +
      (couponCode ? `Coupon: ${couponCode}\n` : "") +
      `\nLicense auto-created and emailed.`
    );

    return res.status(200).json({ success: true, license_key: licenseKey });
  } catch (err) {
    console.error("DevignFX webhook error:", err);
    await notifyAdmin(
      `<b>WEBHOOK ERROR</b>\n` +
      `Reference: ${reference}\n` +
      `Email: ${email}\n` +
      `Error: ${err instanceof Error ? err.message : "Unknown"}\n\n` +
      `Payment received but license NOT created. Manual action needed.`
    );
    return res.status(500).json({ error: "Failed to provision license" });
  }
}

function buildLicenseEmail(
  name: string,
  key: string,
  tier: string,
  expires: string | null,
  amount: number,
  reference: string
): string {
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
    .license-box { background: #0d1117; border: 2px solid #00c853; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .license-key { font-size: 24px; font-weight: 700; color: #00c853; font-family: monospace; letter-spacing: 2px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #2a2a4a; }
    .info-row:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #888; }
    .value { color: #e0e0e0; }
    .setup-box { background: #0d1117; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .setup-box h3 { color: #00c853; margin-top: 0; }
    .setup-box ol { padding-left: 20px; }
    .setup-box li { margin-bottom: 8px; }
    .setup-box code { background: #1a1a2e; padding: 2px 6px; border-radius: 4px; color: #00c853; font-size: 13px; }
    .footer { background: #0d1117; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    .footer a { color: #00c853; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DevignFX</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Your license is ready, ${name}</p>
    </div>
    <div class="content">
      <div class="license-box">
        <p style="margin: 0 0 10px 0; color: #888; font-size: 14px;">YOUR LICENSE KEY</p>
        <div class="license-key">${key}</div>
      </div>

      <div style="margin: 20px 0;">
        <div class="info-row">
          <span class="label">Tier:</span>
          <span class="value" style="text-transform: capitalize;">${tier}</span>
        </div>
        <div class="info-row">
          <span class="label">Amount Paid:</span>
          <span class="value" style="font-weight: 700; color: #00c853;">₦${amount.toLocaleString()}</span>
        </div>
        <div class="info-row">
          <span class="label">Reference:</span>
          <span class="value">${reference}</span>
        </div>
        ${expires ? `<div class="info-row"><span class="label">Expires:</span><span class="value">${expires}</span></div>` : ""}
      </div>

      <div class="setup-box">
        <h3>Quick Setup</h3>
        <ol>
          <li>Download DevignFXBot from the link provided to you</li>
          <li>Open MetaTrader 5 and log in to your account</li>
          <li>Create a <code>.env</code> file next to the bot with your credentials</li>
          <li>Set <code>LICENSE_KEY=${key}</code></li>
          <li>Set <code>LICENSE_URL=https://devignfx.gr8qm.com/api/devignfx/licenses?key=${key}</code></li>
          <li>Run the bot — it will auto-activate on your machine</li>
        </ol>
      </div>

      <p style="color: #888; font-size: 13px;">
        Your license is bound to one device. The bot will auto-lock to your machine on first run.
        Contact us if you need to transfer your license.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #e0e0e0;">DevignFX by GR8QM</p>
      <p style="margin: 0;">
        Need help? <a href="mailto:hello@gr8qm.com">hello@gr8qm.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
