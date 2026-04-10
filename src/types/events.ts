export type EventType = "webinar" | "workshop" | "meetup" | "ama";
export type EventStatus = "upcoming" | "live" | "completed" | "cancelled";

export interface GR8Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: EventType;
  status: EventStatus;
  date: string;
  end_date: string | null;
  timezone: string;
  is_online: boolean;
  location: string | null;
  meeting_link: string | null;
  max_attendees: number;
  registered_count: number;
  speakers: string[];
  tags: string[];
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  registered_at: string;
}

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; color: string; bg: string }
> = {
  webinar: { label: "Webinar", color: "text-blue-300", bg: "bg-blue-500/20" },
  workshop: { label: "Workshop", color: "text-purple-300", bg: "bg-purple-500/20" },
  meetup: { label: "Meetup", color: "text-green-300", bg: "bg-green-500/20" },
  ama: { label: "AMA", color: "text-amber-300", bg: "bg-amber-500/20" },
};

export const EVENT_STATUS_CONFIG: Record<
  EventStatus,
  { label: string; color: string; bg: string }
> = {
  upcoming: { label: "Upcoming", color: "text-blue-300", bg: "bg-blue-500/20" },
  live: { label: "Live", color: "text-green-300", bg: "bg-green-500/20" },
  completed: { label: "Completed", color: "text-gray-400", bg: "bg-gray-500/20" },
  cancelled: { label: "Cancelled", color: "text-red-300", bg: "bg-red-500/20" },
};

export const TIMEZONE_OPTIONS = [
  { value: "Africa/Lagos", label: "West Africa (WAT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "America/New_York", label: "New York (EST/EDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "UTC", label: "UTC" },
];
