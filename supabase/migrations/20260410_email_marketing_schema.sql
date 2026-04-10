-- ============================================================
-- Email Marketing System for GR8QM Technovates
-- Tables: email_templates, email_campaigns, email_campaign_messages,
--         contacts, email_unsubscribes, email_senders
-- ============================================================

-- 1. Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  html TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'training', 'service')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage email_templates"
  ON email_templates FOR ALL USING (auth.role() = 'authenticated');

-- 2. Email Senders
CREATE TABLE IF NOT EXISTS email_senders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE email_senders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage email_senders"
  ON email_senders FOR ALL USING (auth.role() = 'authenticated');

-- Insert default sender
INSERT INTO email_senders (name, email, is_default)
VALUES ('Faith from Gr8QM', 'hello@gr8qm.com', true)
ON CONFLICT DO NOTHING;

-- 3. Email Campaigns
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  template_name TEXT,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  recipient_group JSONB NOT NULL DEFAULT '{"type":"all"}',
  recipient_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  analytics JSONB NOT NULL DEFAULT '{"sent":0,"delivered":0,"opened":0,"uniqueOpened":0,"clicked":0,"uniqueClicked":0,"bounced":0,"complained":0,"unsubscribed":0}',
  sender_name TEXT,
  sender_email TEXT,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage email_campaigns"
  ON email_campaigns FOR ALL USING (auth.role() = 'authenticated');

-- 4. Email Campaign Messages (per-recipient tracking)
CREATE TABLE IF NOT EXISTS email_campaign_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resend_email_id TEXT,
  campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained')),
  tracked_open BOOLEAN NOT NULL DEFAULT false,
  tracked_click BOOLEAN NOT NULL DEFAULT false,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE email_campaign_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage email_campaign_messages"
  ON email_campaign_messages FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX idx_campaign_messages_resend_id ON email_campaign_messages(resend_email_id);
CREATE INDEX idx_campaign_messages_campaign ON email_campaign_messages(campaign_id);

-- 5. Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  labels TEXT[] NOT NULL DEFAULT '{}',
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage contacts"
  ON contacts FOR ALL USING (auth.role() = 'authenticated');

CREATE UNIQUE INDEX idx_contacts_email_unique ON contacts (LOWER(email));

-- 6. Email Unsubscribes
CREATE TABLE IF NOT EXISTS email_unsubscribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE email_unsubscribes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage email_unsubscribes"
  ON email_unsubscribes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can insert unsubscribes"
  ON email_unsubscribes FOR INSERT WITH CHECK (true);

CREATE UNIQUE INDEX idx_unsubscribes_email_unique ON email_unsubscribes (LOWER(email));

-- Enable Realtime for all email marketing tables
ALTER PUBLICATION supabase_realtime ADD TABLE email_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE email_campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE email_campaign_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE email_unsubscribes;
ALTER PUBLICATION supabase_realtime ADD TABLE email_senders;
