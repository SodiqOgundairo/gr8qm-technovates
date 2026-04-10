import { supabase } from "../utils/supabase";
import type { EmailCampaign, CampaignAnalytics } from "../types/emailMarketing";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getUnsubscribedEmails } from "./contacts";

const emptyAnalytics: CampaignAnalytics = {
  sent: 0,
  delivered: 0,
  opened: 0,
  uniqueOpened: 0,
  clicked: 0,
  uniqueClicked: 0,
  bounced: 0,
  complained: 0,
  unsubscribed: 0,
};

export function subscribeEmailCampaigns(
  callback: (campaigns: EmailCampaign[]) => void
): RealtimeChannel {
  supabase
    .from("email_campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data }) => callback((data as EmailCampaign[]) || []));

  return supabase
    .channel("email_campaigns_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "email_campaigns" },
      () => {
        supabase
          .from("email_campaigns")
          .select("*")
          .order("created_at", { ascending: false })
          .then(({ data }) => callback((data as EmailCampaign[]) || []));
      }
    )
    .subscribe();
}

export async function createDraftCampaign(
  campaign: Pick<
    EmailCampaign,
    "subject" | "html_body" | "recipient_group" | "sender_name" | "sender_email"
  > & { template_id?: string; template_name?: string }
): Promise<EmailCampaign> {
  const { data, error } = await supabase
    .from("email_campaigns")
    .insert({
      ...campaign,
      status: "draft",
      analytics: emptyAnalytics,
    })
    .select()
    .single();
  if (error) throw error;
  return data as EmailCampaign;
}

export async function scheduleCampaign(
  id: string,
  scheduledAt: string
): Promise<void> {
  const { error } = await supabase
    .from("email_campaigns")
    .update({ status: "scheduled", scheduled_at: scheduledAt })
    .eq("id", id);
  if (error) throw error;
}

export async function cancelScheduledCampaign(id: string): Promise<void> {
  const { error } = await supabase
    .from("email_campaigns")
    .update({ status: "draft", scheduled_at: null })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabase
    .from("email_campaigns")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

/**
 * Send a campaign immediately.
 * Fetches recipients, filters unsubscribes, sends via Edge Function in batches.
 */
export async function sendCampaign(
  campaign: EmailCampaign,
  onProgress?: (sent: number, total: number) => void
): Promise<void> {
  // 1. Get recipients based on recipient_group
  const recipients = await getRecipientEmails(campaign.recipient_group);
  const unsubscribed = await getUnsubscribedEmails();
  const filtered = recipients.filter(
    (email) => !unsubscribed.includes(email.toLowerCase())
  );

  if (filtered.length === 0) {
    throw new Error("No recipients after filtering unsubscribed emails");
  }

  // 2. Mark as sending
  await supabase
    .from("email_campaigns")
    .update({
      status: "sending",
      recipient_count: filtered.length,
    })
    .eq("id", campaign.id);

  // 3. Send in batches of 5
  const BATCH_SIZE = 5;
  let sentCount = 0;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  for (let i = 0; i < filtered.length; i += BATCH_SIZE) {
    const batch = filtered.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(async (email) => {
        const res = await fetch(
          `${supabaseUrl}/functions/v1/send-receipt-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              to: email,
              subject: campaign.subject,
              html: appendUnsubscribeFooter(campaign.html_body, email, campaign.id),
              from: campaign.sender_name
                ? `${campaign.sender_name} <${campaign.sender_email || "hello@gr8qm.com"}>`
                : undefined,
            }),
          }
        );
        const data = await res.json();
        return { email, resendId: data.id || null, success: res.ok };
      })
    );

    // Store message records for tracking
    const messages = results
      .filter(
        (r): r is PromiseFulfilledResult<{ email: string; resendId: string | null; success: boolean }> =>
          r.status === "fulfilled" && r.value.success
      )
      .map((r) => ({
        campaign_id: campaign.id,
        recipient_email: r.value.email,
        resend_email_id: r.value.resendId,
        status: "sent" as const,
      }));

    if (messages.length > 0) {
      await supabase.from("email_campaign_messages").insert(messages);
    }

    sentCount += messages.length;
    onProgress?.(sentCount, filtered.length);

    // Small delay between batches
    if (i + BATCH_SIZE < filtered.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // 4. Update campaign status
  await supabase
    .from("email_campaigns")
    .update({
      status: sentCount > 0 ? "sent" : "failed",
      sent_at: new Date().toISOString(),
      recipient_count: sentCount,
      analytics: { ...emptyAnalytics, sent: sentCount },
    })
    .eq("id", campaign.id);
}

// ── Helpers ────────────────────────────────────────────────

async function getRecipientEmails(
  group: EmailCampaign["recipient_group"]
): Promise<string[]> {
  if (group.type === "custom" && group.emails) {
    return group.emails;
  }

  let query = supabase.from("contacts").select("email");

  if (group.type === "category" && group.category) {
    query = query.eq("category", group.category);
  } else if (group.type === "labels" && group.labels?.length) {
    query = query.overlaps("labels", group.labels);
  }

  const { data } = await query;
  return (data || []).map((c) => c.email);
}

function appendUnsubscribeFooter(
  html: string,
  email: string,
  campaignId: string
): string {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://www.gr8qm.com";
  const unsubUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}&cid=${campaignId}`;

  const footer = `
    <div style="margin-top:30px;padding:20px;border-top:1px solid #e5e5e5;text-align:center;font-size:12px;color:#999;">
      <p>You're receiving this because you're subscribed to GR8QM Technovates emails.</p>
      <p><a href="${unsubUrl}" style="color:#0098da;">Unsubscribe</a> from future emails.</p>
      <p>GR8QM Technovates &middot; hello@gr8qm.com</p>
    </div>`;

  // Insert before closing </div> or append
  if (html.includes("</body>")) {
    return html.replace("</body>", `${footer}</body>`);
  }
  return html + footer;
}
