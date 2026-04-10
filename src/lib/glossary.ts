import { supabase } from "../utils/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  letter: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ── Public ────────────────────────────────────────────

export async function getPublishedTerms(): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("published", true)
    .order("term", { ascending: true });
  if (error) throw error;
  return (data || []) as GlossaryTerm[];
}

// ── Admin CRUD ────────────────────────────────────────

export function subscribeGlossary(
  callback: (terms: GlossaryTerm[]) => void
): RealtimeChannel {
  const fetch = () =>
    supabase
      .from("glossary_terms")
      .select("*")
      .order("term", { ascending: true })
      .then(({ data }) => callback((data as GlossaryTerm[]) || []));

  fetch();

  return supabase
    .channel("glossary_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "glossary_terms" },
      () => fetch()
    )
    .subscribe();
}

export async function createTerm(
  term: Pick<GlossaryTerm, "term" | "definition" | "category" | "published">
) {
  const { data, error } = await supabase
    .from("glossary_terms")
    .insert(term)
    .select()
    .single();
  if (error) throw error;
  return data as GlossaryTerm;
}

export async function updateTerm(
  id: string,
  updates: Partial<Pick<GlossaryTerm, "term" | "definition" | "category" | "published">>
) {
  const { error } = await supabase
    .from("glossary_terms")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteTerm(id: string) {
  const { error } = await supabase.from("glossary_terms").delete().eq("id", id);
  if (error) throw error;
}
