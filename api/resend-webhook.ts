import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, data } = req.body;
    const resendEmailId = data?.email_id;

    if (!resendEmailId) {
      return res.status(200).json({ message: "No email_id, skipping" });
    }

    // Look up the campaign message by resend_email_id
    const { data: message } = await supabase
      .from("email_campaign_messages")
      .select("id, campaign_id, status, tracked_open, tracked_click")
      .eq("resend_email_id", resendEmailId)
      .single();

    if (!message) {
      return res.status(200).json({ message: "No matching campaign message" });
    }

    // Prevent status regressions
    const terminalStatuses = ["bounced", "complained"];
    if (terminalStatuses.includes(message.status)) {
      return res.status(200).json({ message: "Terminal status, skipping" });
    }

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {};
    const analyticsIncrements: Record<string, number> = {};

    switch (type) {
      case "email.delivered":
        updates.status = "delivered";
        updates.delivered_at = now;
        analyticsIncrements.delivered = 1;
        break;

      case "email.opened":
        updates.status = "opened";
        updates.opened_at = now;
        analyticsIncrements.opened = 1;
        if (!message.tracked_open) {
          updates.tracked_open = true;
          analyticsIncrements.uniqueOpened = 1;
        }
        break;

      case "email.clicked":
        updates.status = "clicked";
        updates.clicked_at = now;
        analyticsIncrements.clicked = 1;
        if (!message.tracked_click) {
          updates.tracked_click = true;
          analyticsIncrements.uniqueClicked = 1;
        }
        break;

      case "email.bounced":
        updates.status = "bounced";
        analyticsIncrements.bounced = 1;
        break;

      case "email.complained":
        updates.status = "complained";
        analyticsIncrements.complained = 1;
        break;

      default:
        return res.status(200).json({ message: `Unhandled event: ${type}` });
    }

    // Update message record
    await supabase
      .from("email_campaign_messages")
      .update(updates)
      .eq("id", message.id);

    // Update campaign analytics
    if (Object.keys(analyticsIncrements).length > 0) {
      const { data: campaign } = await supabase
        .from("email_campaigns")
        .select("analytics")
        .eq("id", message.campaign_id)
        .single();

      if (campaign) {
        const analytics = campaign.analytics as Record<string, number>;
        for (const [key, inc] of Object.entries(analyticsIncrements)) {
          analytics[key] = (analytics[key] || 0) + inc;
        }

        await supabase
          .from("email_campaigns")
          .update({ analytics })
          .eq("id", message.campaign_id);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
