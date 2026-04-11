import { supabase } from "../utils/supabase";
import type { EmailTemplate } from "../types/emailMarketing";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function subscribeEmailTemplates(
  callback: (templates: EmailTemplate[]) => void
): RealtimeChannel {
  // Initial fetch
  supabase
    .from("email_templates")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data }) => callback((data as EmailTemplate[]) || []));

  // Realtime subscription
  return supabase
    .channel("email_templates_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "email_templates" },
      () => {
        supabase
          .from("email_templates")
          .select("*")
          .order("created_at", { ascending: false })
          .then(({ data }) => callback((data as EmailTemplate[]) || []));
      }
    )
    .subscribe();
}

export async function createEmailTemplate(
  template: Omit<EmailTemplate, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("email_templates")
    .insert(template)
    .select()
    .single();
  if (error) throw error;
  return data as EmailTemplate;
}

export async function updateEmailTemplate(
  id: string,
  updates: Partial<Omit<EmailTemplate, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("email_templates")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as EmailTemplate;
}

export async function deleteEmailTemplate(id: string) {
  const { error } = await supabase.from("email_templates").delete().eq("id", id);
  if (error) throw error;
}

// ── Starter templates for new users ────────────────────────
export const starterTemplates: Omit<EmailTemplate, "id" | "created_at" | "updated_at">[] = [
  {
    name: "Welcome Email",
    subject: "Welcome to GR8QM Technovates!",
    preview_text: "We're excited to have you on board",
    category: "general",
    html: `<div style="font-family:'Urbanist',Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#0098da,#f58634);padding:40px 20px;text-align:center;color:#fff;border-radius:8px 8px 0 0;">
    <h1 style="margin:0;font-size:28px;">Welcome to GR8QM!</h1>
  </div>
  <div style="padding:30px;background:#fff;">
    <p>Hi {{first_name}},</p>
    <p>Thank you for joining us! We're thrilled to have you as part of the GR8QM community.</p>
    <p>Here's what you can expect from us:</p>
    <ul>
      <li>Tech training updates and new courses</li>
      <li>Design and development insights</li>
      <li>Exclusive offers and events</li>
    </ul>
    <p>Stay connected and feel free to reach out if you need anything.</p>
    <p>— The GR8QM Team</p>
  </div>
  <div style="padding:20px;text-align:center;color:#666;font-size:13px;">
    <p>GR8QM Technovates &middot; Faith that builds. Impact that lasts.</p>
  </div>
</div>`,
  },
  {
    name: "Training Reminder",
    subject: "Your training starts soon!",
    preview_text: "Don't miss your upcoming class",
    category: "training",
    html: `<div style="font-family:'Urbanist',Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0098da;padding:40px 20px;text-align:center;color:#fff;border-radius:8px 8px 0 0;">
    <h1 style="margin:0;font-size:28px;">Training Reminder</h1>
  </div>
  <div style="padding:30px;background:#fff;">
    <p>Hi {{first_name}},</p>
    <p>This is a friendly reminder that your training session is coming up soon.</p>
    <p>Make sure to:</p>
    <ul>
      <li>Have your laptop charged and ready</li>
      <li>Join the class link on time</li>
      <li>Review any pre-class materials</li>
    </ul>
    <p>See you there!</p>
  </div>
  <div style="padding:20px;text-align:center;color:#666;font-size:13px;">
    <p>GR8QM Technovates &middot; hello@gr8qm.com</p>
  </div>
</div>`,
  },
  {
    name: "Newsletter",
    subject: "What's New at GR8QM",
    preview_text: "Monthly updates from the team",
    category: "general",
    html: `<div style="font-family:'Urbanist',Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#05235a,#0098da);padding:40px 20px;text-align:center;color:#fff;border-radius:8px 8px 0 0;">
    <h1 style="margin:0;font-size:28px;">GR8QM Newsletter</h1>
    <p style="margin:10px 0 0;opacity:0.9;">Monthly updates &middot; {{month}} Edition</p>
  </div>
  <div style="padding:30px;background:#fff;">
    <p>Hi {{first_name}},</p>
    <p>Here's what's been happening at GR8QM Technovates this month:</p>
    <h3 style="color:#0098da;">New Courses</h3>
    <p>[Add course updates here]</p>
    <h3 style="color:#f58634;">Recent Projects</h3>
    <p>[Add project highlights here]</p>
    <h3 style="color:#05235a;">Upcoming Events</h3>
    <p>[Add events here]</p>
  </div>
  <div style="padding:20px;text-align:center;color:#666;font-size:13px;">
    <p>GR8QM Technovates &middot; Faith that builds. Impact that lasts.</p>
  </div>
</div>`,
  },
];
