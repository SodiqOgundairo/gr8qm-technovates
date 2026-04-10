import { supabase } from "../utils/supabase";
import type { GR8Event, EventRegistration } from "../types/events";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ════════════════════════════════════════════════════════════
// EVENTS
// ════════════════════════════════════════════════════════════

export function subscribeEvents(
  callback: (events: GR8Event[]) => void
): RealtimeChannel {
  const fetch = () =>
    supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .then(({ data }) => callback((data as GR8Event[]) || []));

  fetch();

  return supabase
    .channel("events_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "events" },
      () => fetch()
    )
    .subscribe();
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createEvent(
  event: Omit<GR8Event, "id" | "registered_count" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("events")
    .insert({ ...event, registered_count: 0 })
    .select()
    .single();
  if (error) throw error;
  return data as GR8Event;
}

export async function updateEvent(
  id: string,
  updates: Partial<Omit<GR8Event, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("events")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as GR8Event;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

/** Fetch a single event by slug — public API */
export async function getEventBySlug(slug: string): Promise<GR8Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return data as GR8Event;
}

/** Fetch upcoming public events */
export async function getUpcomingEvents(): Promise<GR8Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .in("status", ["upcoming", "live"])
    .order("date", { ascending: true });
  if (error) throw error;
  return (data as GR8Event[]) || [];
}

/** Fetch all public events (for events listing page) */
export async function getAllPublicEvents(): Promise<GR8Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .neq("status", "cancelled")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as GR8Event[]) || [];
}

// ════════════════════════════════════════════════════════════
// REGISTRATIONS
// ════════════════════════════════════════════════════════════

export function subscribeEventRegistrations(
  eventId: string,
  callback: (regs: EventRegistration[]) => void
): RealtimeChannel {
  const fetch = () =>
    supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", eventId)
      .order("registered_at", { ascending: false })
      .then(({ data }) => callback((data as EventRegistration[]) || []));

  fetch();

  return supabase
    .channel(`event_regs_${eventId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "event_registrations",
        filter: `event_id=eq.${eventId}`,
      },
      () => fetch()
    )
    .subscribe();
}

export async function getEventRegistrations(
  eventId: string
): Promise<EventRegistration[]> {
  const { data, error } = await supabase
    .from("event_registrations")
    .select("*")
    .eq("event_id", eventId)
    .order("registered_at", { ascending: false });
  if (error) throw error;
  return (data as EventRegistration[]) || [];
}

/** Public: register for an event */
export async function registerForEvent(registration: {
  event_id: string;
  name: string;
  email: string;
  phone?: string;
}): Promise<EventRegistration> {
  // Check if already registered
  const { data: existing } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", registration.event_id)
    .ilike("email", registration.email)
    .single();

  if (existing) {
    throw new Error("You are already registered for this event.");
  }

  // Check capacity
  const { data: event } = await supabase
    .from("events")
    .select("max_attendees, registered_count, status")
    .eq("id", registration.event_id)
    .single();

  if (!event || event.status === "cancelled") {
    throw new Error("This event is not accepting registrations.");
  }

  if (event.max_attendees > 0 && event.registered_count >= event.max_attendees) {
    throw new Error("This event is fully booked.");
  }

  // Create registration
  const { data, error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: registration.event_id,
      name: registration.name.trim(),
      email: registration.email.trim().toLowerCase(),
      phone: registration.phone?.trim() || null,
    })
    .select()
    .single();
  if (error) throw error;

  // Increment count
  await supabase.rpc("increment_event_registrations", {
    p_event_id: registration.event_id,
  });

  return data as EventRegistration;
}

export async function deleteRegistration(id: string, eventId: string) {
  const { error } = await supabase
    .from("event_registrations")
    .delete()
    .eq("id", id);
  if (error) throw error;

  // Decrement count
  await supabase.rpc("decrement_event_registrations", {
    p_event_id: eventId,
  });
}

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

/** Generate a Google Calendar link */
export function getGoogleCalendarUrl(event: GR8Event): string {
  const start = new Date(event.date).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = event.end_date
    ? new Date(event.end_date).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
    : new Date(new Date(event.date).getTime() + 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description,
    location: event.is_online ? event.meeting_link || "Online" : event.location || "",
    ctz: event.timezone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
