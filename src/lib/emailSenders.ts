import { supabase } from "../utils/supabase";
import type { EmailSender } from "../types/emailMarketing";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function subscribeEmailSenders(
  callback: (senders: EmailSender[]) => void
): RealtimeChannel {
  supabase
    .from("email_senders")
    .select("*")
    .order("created_at", { ascending: true })
    .then(({ data }) => callback((data as EmailSender[]) || []));

  return supabase
    .channel("email_senders_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "email_senders" },
      () => {
        supabase
          .from("email_senders")
          .select("*")
          .order("created_at", { ascending: true })
          .then(({ data }) => callback((data as EmailSender[]) || []));
      }
    )
    .subscribe();
}

export async function createEmailSender(
  sender: Omit<EmailSender, "id" | "created_at">
) {
  if (sender.is_default) {
    await supabase
      .from("email_senders")
      .update({ is_default: false })
      .eq("is_default", true);
  }
  const { data, error } = await supabase
    .from("email_senders")
    .insert(sender)
    .select()
    .single();
  if (error) throw error;
  return data as EmailSender;
}

export async function updateEmailSender(
  id: string,
  updates: Partial<Omit<EmailSender, "id" | "created_at">>
) {
  if (updates.is_default) {
    await supabase
      .from("email_senders")
      .update({ is_default: false })
      .eq("is_default", true);
  }
  const { data, error } = await supabase
    .from("email_senders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as EmailSender;
}

export async function deleteEmailSender(id: string) {
  const { error } = await supabase.from("email_senders").delete().eq("id", id);
  if (error) throw error;
}

export async function getDefaultSender(): Promise<EmailSender | null> {
  const { data } = await supabase
    .from("email_senders")
    .select("*")
    .eq("is_default", true)
    .single();
  return (data as EmailSender) || null;
}
