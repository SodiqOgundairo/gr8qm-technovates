import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const email =
    typeof req.query.email === "string"
      ? req.query.email
      : req.body?.email;
  const campaignId =
    typeof req.query.cid === "string"
      ? req.query.cid
      : req.body?.campaign_id;
  const reason = req.body?.reason;

  if (!email) {
    if (req.method === "GET") {
      return res.redirect(302, "/unsubscribe?error=missing_email");
    }
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Upsert into email_unsubscribes
    const { error } = await supabase.from("email_unsubscribes").upsert(
      {
        email: email.toLowerCase().trim(),
        campaign_id: campaignId || null,
        reason: reason || null,
      },
      { onConflict: "email" }
    );

    if (error) throw error;

    // Increment campaign unsubscribe counter if campaign_id provided
    if (campaignId) {
      const { data: campaign } = await supabase
        .from("email_campaigns")
        .select("analytics")
        .eq("id", campaignId)
        .single();

      if (campaign) {
        const analytics = campaign.analytics as Record<string, number>;
        analytics.unsubscribed = (analytics.unsubscribed || 0) + 1;
        await supabase
          .from("email_campaigns")
          .update({ analytics })
          .eq("id", campaignId);
      }
    }

    if (req.method === "GET") {
      return res.redirect(
        302,
        `/unsubscribe?success=true&email=${encodeURIComponent(email)}`
      );
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    if (req.method === "GET") {
      return res.redirect(302, "/unsubscribe?error=server_error");
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
