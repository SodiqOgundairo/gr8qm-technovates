import { supabase } from "../utils/supabase";
import type { Contact } from "../types/emailMarketing";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function subscribeContacts(
  callback: (contacts: Contact[]) => void
): RealtimeChannel {
  supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data }) => callback((data as Contact[]) || []));

  return supabase
    .channel("contacts_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "contacts" },
      () => {
        supabase
          .from("contacts")
          .select("*")
          .order("created_at", { ascending: false })
          .then(({ data }) => callback((data as Contact[]) || []));
      }
    )
    .subscribe();
}

export async function createContact(
  contact: Omit<Contact, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("contacts")
    .insert(contact)
    .select()
    .single();
  if (error) throw error;
  return data as Contact;
}

export async function updateContact(
  id: string,
  updates: Partial<Omit<Contact, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("contacts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Contact;
}

export async function deleteContact(id: string) {
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw error;
}

export async function bulkDeleteContacts(ids: string[]) {
  const { error } = await supabase.from("contacts").delete().in("id", ids);
  if (error) throw error;
}

export async function bulkAddLabels(ids: string[], labels: string[]) {
  // Fetch current contacts
  const { data: contacts, error: fetchError } = await supabase
    .from("contacts")
    .select("id, labels")
    .in("id", ids);
  if (fetchError) throw fetchError;

  // Update each with merged labels
  const updates = (contacts || []).map((c) => ({
    id: c.id,
    labels: [...new Set([...(c.labels || []), ...labels])],
    updated_at: new Date().toISOString(),
  }));

  for (const u of updates) {
    const { error } = await supabase
      .from("contacts")
      .update({ labels: u.labels, updated_at: u.updated_at })
      .eq("id", u.id);
    if (error) throw error;
  }
}

export async function bulkRemoveLabels(ids: string[], labels: string[]) {
  const { data: contacts, error: fetchError } = await supabase
    .from("contacts")
    .select("id, labels")
    .in("id", ids);
  if (fetchError) throw fetchError;

  for (const c of contacts || []) {
    const { error } = await supabase
      .from("contacts")
      .update({
        labels: (c.labels || []).filter((l: string) => !labels.includes(l)),
        updated_at: new Date().toISOString(),
      })
      .eq("id", c.id);
    if (error) throw error;
  }
}

export async function bulkChangeCategory(ids: string[], category: string) {
  const { error } = await supabase
    .from("contacts")
    .update({ category, updated_at: new Date().toISOString() })
    .in("id", ids);
  if (error) throw error;
}

// ── CSV Import/Export ──────────────────────────────────────
export function parseCsvContacts(
  csvText: string
): Omit<Contact, "id" | "created_at" | "updated_at">[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const emailIdx = headers.findIndex((h) => h === "email");
  const firstIdx = headers.findIndex((h) =>
    ["first_name", "first", "firstname"].includes(h)
  );
  const lastIdx = headers.findIndex((h) =>
    ["last_name", "last", "lastname"].includes(h)
  );
  const phoneIdx = headers.findIndex((h) => h === "phone");
  const categoryIdx = headers.findIndex((h) => h === "category");
  const labelsIdx = headers.findIndex((h) => h === "labels");

  if (emailIdx === -1) return [];

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    return {
      first_name: firstIdx >= 0 ? cols[firstIdx] : "",
      last_name: lastIdx >= 0 ? cols[lastIdx] : null,
      email: cols[emailIdx],
      phone: phoneIdx >= 0 ? cols[phoneIdx] : null,
      category: categoryIdx >= 0 ? cols[categoryIdx] : "general",
      labels:
        labelsIdx >= 0 && cols[labelsIdx]
          ? cols[labelsIdx].split(";").map((l) => l.trim())
          : [],
      source: "csv_import",
    };
  });
}

export async function importContacts(
  contacts: Omit<Contact, "id" | "created_at" | "updated_at">[]
) {
  let imported = 0;
  let skipped = 0;

  for (const contact of contacts) {
    const { error } = await supabase.from("contacts").upsert(
      { ...contact, updated_at: new Date().toISOString() },
      { onConflict: "email", ignoreDuplicates: false }
    );
    if (error) {
      skipped++;
    } else {
      imported++;
    }
  }

  return { imported, skipped };
}

export function exportContactsCsv(contacts: Contact[]): string {
  const headers = "first_name,last_name,email,phone,category,labels";
  const rows = contacts.map(
    (c) =>
      `${c.first_name},${c.last_name || ""},${c.email},${c.phone || ""},${c.category},${(c.labels || []).join(";")}`
  );
  return [headers, ...rows].join("\n");
}

export async function getUnsubscribedEmails(): Promise<string[]> {
  const { data } = await supabase
    .from("email_unsubscribes")
    .select("email");
  return (data || []).map((d) => d.email.toLowerCase());
}
