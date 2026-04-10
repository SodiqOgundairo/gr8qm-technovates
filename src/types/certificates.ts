// ── Design Element (visual template designer) ────────────
export interface DesignElement {
  id: string;
  type: "text" | "variable" | "line" | "qrcode" | "image";
  label: string;
  x: number; // mm from left
  y: number; // mm from top
  width: number; // mm
  height: number; // mm
  content?: string; // text content or template e.g. "Issued: {{date}}"
  fontSize?: number; // pt
  fontWeight?: "normal" | "bold";
  color?: string;
  textAlign?: "left" | "center" | "right";
  textTransform?: "none" | "uppercase" | "capitalize";
  letterSpacing?: number;
  lineColor?: string;
  lineThickness?: number; // mm
  imageUrl?: string;
  opacity?: number;
  zIndex: number;
}

// ── Certificate Template ───────────────────────────────────
export interface CertificateTemplate {
  id: string;
  name: string;
  orientation: "landscape" | "portrait";
  background_color: string;
  accent_color: string;
  logo_url: string | null;
  border_style: "none" | "single" | "double" | "ornate";
  header_text: string;
  subheader_text: string | null;
  footer_text: string | null;
  signature_name: string | null;
  signature_title: string | null;
  signature_image_url: string | null;
  show_qr_code: boolean;
  course_prefix: string;
  elements: DesignElement[] | null;
  created_at: string;
  updated_at: string;
}

// ── Alumni ─────────────────────────────────────────────────
export interface Alumni {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  bio: string | null;
  linkedin_url: string | null;
  cohort: string | null;
  created_at: string;
  updated_at: string;
}

// Alumni with certificate count for the public page
export interface AlumniWithCerts extends Alumni {
  certificate_count: number;
  certificates: Certificate[];
}

// ── Certificate (issued) ──────────────────────────────────
export interface Certificate {
  id: string;
  certificate_number: string;
  alumni_id: string;
  template_id: string | null;
  course_name: string;
  course_id: string | null;
  issue_date: string;
  expiry_date: string | null;
  status: "active" | "revoked" | "expired";
  pdf_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Certificate with alumni details (for verification)
export interface CertificateWithAlumni extends Certificate {
  alumni: Alumni;
  template: CertificateTemplate | null;
}
