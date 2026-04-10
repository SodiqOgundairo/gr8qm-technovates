import { supabase } from "../utils/supabase";
import type {
  CertificateTemplate,
  Alumni,
  Certificate,
  AlumniWithCerts,
  CertificateWithAlumni,
} from "../types/certificates";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ════════════════════════════════════════════════════════════
// CERTIFICATE TEMPLATES
// ════════════════════════════════════════════════════════════

export function subscribeCertificateTemplates(
  callback: (templates: CertificateTemplate[]) => void
): RealtimeChannel {
  supabase
    .from("certificate_templates")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data }) => callback((data as CertificateTemplate[]) || []));

  return supabase
    .channel("certificate_templates_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "certificate_templates" },
      () => {
        supabase
          .from("certificate_templates")
          .select("*")
          .order("created_at", { ascending: false })
          .then(({ data }) => callback((data as CertificateTemplate[]) || []));
      }
    )
    .subscribe();
}

export async function createCertificateTemplate(
  template: Omit<CertificateTemplate, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("certificate_templates")
    .insert(template)
    .select()
    .single();
  if (error) throw error;
  return data as CertificateTemplate;
}

export async function updateCertificateTemplate(
  id: string,
  updates: Partial<Omit<CertificateTemplate, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("certificate_templates")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as CertificateTemplate;
}

export async function deleteCertificateTemplate(id: string) {
  const { error } = await supabase
    .from("certificate_templates")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════
// ALUMNI
// ════════════════════════════════════════════════════════════

export function subscribeAlumni(
  callback: (alumni: Alumni[]) => void
): RealtimeChannel {
  supabase
    .from("alumni")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data }) => callback((data as Alumni[]) || []));

  return supabase
    .channel("alumni_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "alumni" },
      () => {
        supabase
          .from("alumni")
          .select("*")
          .order("created_at", { ascending: false })
          .then(({ data }) => callback((data as Alumni[]) || []));
      }
    )
    .subscribe();
}

export async function createAlumni(
  alumni: Omit<Alumni, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("alumni")
    .insert(alumni)
    .select()
    .single();
  if (error) throw error;
  return data as Alumni;
}

export async function updateAlumni(
  id: string,
  updates: Partial<Omit<Alumni, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("alumni")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Alumni;
}

export async function deleteAlumni(id: string) {
  const { error } = await supabase.from("alumni").delete().eq("id", id);
  if (error) throw error;
}

/** Fetch alumni with their certificate counts, sorted by cert count desc */
export async function getAlumniWithCertificates(): Promise<AlumniWithCerts[]> {
  const { data: alumniList, error: aErr } = await supabase
    .from("alumni")
    .select("*")
    .order("created_at", { ascending: false });
  if (aErr) throw aErr;

  const { data: certs, error: cErr } = await supabase
    .from("certificates")
    .select("*")
    .eq("status", "active")
    .order("issue_date", { ascending: false });
  if (cErr) throw cErr;

  const certsByAlumni = new Map<string, Certificate[]>();
  for (const cert of (certs || []) as Certificate[]) {
    const list = certsByAlumni.get(cert.alumni_id) || [];
    list.push(cert);
    certsByAlumni.set(cert.alumni_id, list);
  }

  const result: AlumniWithCerts[] = ((alumniList || []) as Alumni[]).map((a) => ({
    ...a,
    certificates: certsByAlumni.get(a.id) || [],
    certificate_count: (certsByAlumni.get(a.id) || []).length,
  }));

  // Sort by certificate count descending
  result.sort((a, b) => b.certificate_count - a.certificate_count);
  return result;
}

// ════════════════════════════════════════════════════════════
// CERTIFICATES
// ════════════════════════════════════════════════════════════

export function subscribeCertificates(
  callback: (certs: Certificate[]) => void
): RealtimeChannel {
  supabase
    .from("certificates")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data }) => callback((data as Certificate[]) || []));

  return supabase
    .channel("certificates_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "certificates" },
      () => {
        supabase
          .from("certificates")
          .select("*")
          .order("created_at", { ascending: false })
          .then(({ data }) => callback((data as Certificate[]) || []));
      }
    )
    .subscribe();
}

/** Generate certificate number: PREFIX-YEAR-XXXX */
export async function generateCertificateNumber(
  prefix: string
): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("certificates")
    .select("*", { count: "exact", head: true })
    .like("certificate_number", `${prefix}-${year}-%`);

  const seq = String((count || 0) + 1).padStart(4, "0");
  return `${prefix}-${year}-${seq}`;
}

export async function issueCertificate(
  cert: Omit<Certificate, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from("certificates")
    .insert(cert)
    .select()
    .single();
  if (error) throw error;
  return data as Certificate;
}

export async function revokeCertificate(id: string) {
  const { error } = await supabase
    .from("certificates")
    .update({ status: "revoked" })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCertificate(id: string) {
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) throw error;
}

/** Verify a certificate by number — public API */
export async function verifyCertificate(
  certificateNumber: string
): Promise<CertificateWithAlumni | null> {
  const { data, error } = await supabase
    .from("certificates")
    .select("*, alumni(*), template:certificate_templates(*)")
    .eq("certificate_number", certificateNumber.toUpperCase().trim())
    .single();

  if (error || !data) return null;

  return {
    ...data,
    alumni: data.alumni as Alumni,
    template: data.template as CertificateTemplate | null,
  } as CertificateWithAlumni;
}
