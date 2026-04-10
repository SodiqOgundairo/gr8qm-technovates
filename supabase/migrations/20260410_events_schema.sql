-- ============================================================
-- Event Management System for GR8QM Technovates
-- Tables: events, event_registrations
-- ============================================================

-- 1. Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'workshop' CHECK (type IN ('webinar', 'workshop', 'meetup', 'ama')),
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  timezone TEXT NOT NULL DEFAULT 'Africa/Lagos',
  is_online BOOLEAN NOT NULL DEFAULT true,
  location TEXT,
  meeting_link TEXT,
  max_attendees INTEGER NOT NULL DEFAULT 0, -- 0 = unlimited
  registered_count INTEGER NOT NULL DEFAULT 0,
  speakers JSONB NOT NULL DEFAULT '[]',
  tags JSONB NOT NULL DEFAULT '[]',
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage events"
  ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read events"
  ON events FOR SELECT USING (true);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(date);

-- 2. Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage event_registrations"
  ON event_registrations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can register for events"
  ON event_registrations FOR INSERT WITH CHECK (true);

CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE UNIQUE INDEX idx_event_registrations_unique ON event_registrations(event_id, LOWER(email));

-- 3. RPC: Increment registration count
CREATE OR REPLACE FUNCTION increment_event_registrations(p_event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events SET registered_count = registered_count + 1 WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC: Decrement registration count
CREATE OR REPLACE FUNCTION decrement_event_registrations(p_event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events SET registered_count = GREATEST(0, registered_count - 1) WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE event_registrations;
