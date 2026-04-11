/**
 * Central Paystack Webhook Router
 *
 * POST /api/paystack-webhook
 *
 * Verifies the Paystack HMAC-SHA512 signature once, then dispatches
 * to the correct handler based on metadata.type. This way Paystack
 * only needs one webhook URL and new payment types can be added easily.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { handleDevignFXPayment } from "./devignfx/webhook";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";

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

  const type = data?.metadata?.type || "";

  // ── Route to the correct handler ──────────────────────
  switch (type) {
    case "devignfx":
      return handleDevignFXPayment(data, res);

    // Future handlers go here:
    // case "courses":
    //   return handleCoursePayment(data, res);
    // case "invoices":
    //   return handleInvoicePayment(data, res);

    default:
      // Unknown type — log and acknowledge so Paystack doesn't retry
      console.log(`Unhandled payment type: "${type}"`, data?.reference);
      return res.status(200).json({ message: `No handler for type: ${type}` });
  }
}
