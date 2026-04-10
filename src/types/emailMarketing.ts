// ── Email Template ──────────────────────────────────────────
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preview_text: string | null;
  html: string;
  category: "general" | "training" | "service";
  created_at: string;
  updated_at: string;
}

// ── Email Campaign ─────────────────────────────────────────
export interface CampaignAnalytics {
  sent: number;
  delivered: number;
  opened: number;
  uniqueOpened: number;
  clicked: number;
  uniqueClicked: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
}

export interface RecipientGroup {
  type: "all" | "category" | "labels" | "custom";
  category?: string;
  labels?: string[];
  emails?: string[];
}

export type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "failed";

export interface EmailCampaign {
  id: string;
  template_id: string | null;
  template_name: string | null;
  subject: string;
  html_body: string;
  recipient_group: RecipientGroup;
  recipient_count: number;
  status: CampaignStatus;
  analytics: CampaignAnalytics;
  sender_name: string | null;
  sender_email: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

// ── Campaign Message (per-recipient) ───────────────────────
export interface CampaignMessage {
  id: string;
  resend_email_id: string | null;
  campaign_id: string;
  recipient_email: string;
  status: "sent" | "delivered" | "opened" | "clicked" | "bounced" | "complained";
  tracked_open: boolean;
  tracked_click: boolean;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  created_at: string;
}

// ── Contact ────────────────────────────────────────────────
export interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  category: string;
  labels: string[];
  source: string | null;
  created_at: string;
  updated_at: string;
}

// ── Email Sender ───────────────────────────────────────────
export interface EmailSender {
  id: string;
  name: string;
  email: string;
  is_default: boolean;
  created_at: string;
}

// ── Email Unsubscribe ──────────────────────────────────────
export interface EmailUnsubscribe {
  id: string;
  email: string;
  campaign_id: string | null;
  reason: string | null;
  created_at: string;
}
