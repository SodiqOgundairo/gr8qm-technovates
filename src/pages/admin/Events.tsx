import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import type {
  GR8Event,
  EventRegistration,
  EventType,
  EventStatus,
} from "../../types/events";
import {
  EVENT_TYPE_CONFIG,
  EVENT_STATUS_CONFIG,
  TIMEZONE_OPTIONS,
} from "../../types/events";
import {
  subscribeEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  generateSlug,
  getEventRegistrations,
  deleteRegistration,
} from "../../lib/events";

type Filter = "all" | EventStatus;

const EventsAdmin: React.FC = () => {
  const [events, setEvents] = useState<GR8Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState<GR8Event | null>(null);
  const [attendeesEvent, setAttendeesEvent] = useState<GR8Event | null>(null);

  useEffect(() => {
    const ch = subscribeEvents((data) => {
      setEvents(data);
      setLoading(false);
    });
    return () => { ch.unsubscribe(); };
  }, []);

  const filtered = useMemo(() => {
    let result = events;
    if (filter !== "all") result = result.filter((e) => e.status === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [events, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: events.length };
    for (const e of events) c[e.status] = (c[e.status] || 0) + 1;
    return c;
  }, [events]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event? All registrations will also be deleted.")) return;
    await deleteEvent(id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Events</h1>
            <p className="text-gray-400 mt-1">Manage workshops, webinars, and community events.</p>
          </div>
          <button
            onClick={() => { setEditEvent(null); setShowModal(true); }}
            className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            + Create Event
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 bg-oxford-card rounded-lg p-1 flex-wrap">
            {(["all", "upcoming", "live", "completed", "cancelled"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filter === f ? "bg-skyblue text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {f === "all" ? "All" : EVENT_STATUS_CONFIG[f].label}
                <span className="ml-1 opacity-60">({counts[f] || 0})</span>
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="flex-1 bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-skyblue border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No events found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => { setEditEvent(event); setShowModal(true); }}
                onDelete={() => handleDelete(event.id)}
                onViewAttendees={() => setAttendeesEvent(event)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <EventFormModal
          event={editEvent}
          onClose={() => { setShowModal(false); setEditEvent(null); }}
        />
      )}

      {attendeesEvent && (
        <AttendeesModal
          event={attendeesEvent}
          onClose={() => setAttendeesEvent(null)}
        />
      )}
    </AdminLayout>
  );
};

// ═══════════════════════════════════════════════════════════
// EVENT CARD
// ═══════════════════════════════════════════════════════════

const EventCard: React.FC<{
  event: GR8Event;
  onEdit: () => void;
  onDelete: () => void;
  onViewAttendees: () => void;
}> = ({ event: e, onEdit, onDelete, onViewAttendees }) => {
  const typeConf = EVENT_TYPE_CONFIG[e.type];
  const statusConf = EVENT_STATUS_CONFIG[e.status];
  const d = new Date(e.date);
  const isFull = e.max_attendees > 0 && e.registered_count >= e.max_attendees;

  return (
    <div
      className={`bg-oxford-card border rounded-lg overflow-hidden transition-all hover:border-skyblue/50 ${
        e.status === "live" ? "border-green-500/40" : "border-oxford-border"
      }`}
    >
      {/* Cover / date badge area */}
      <div
        className="h-28 relative"
        style={{
          background: e.cover_image_url
            ? `url(${e.cover_image_url}) center/cover`
            : `linear-gradient(135deg, ${typeConf.bg.replace("bg-", "").replace("/20", "")}33, #05235a)`,
        }}
      >
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-black/70 rounded-lg px-2.5 py-1.5 text-center backdrop-blur-sm">
          <div className="text-skyblue text-[10px] font-bold uppercase">
            {d.toLocaleDateString("en-GB", { month: "short" })}
          </div>
          <div className="text-white text-lg font-black leading-tight">{d.getDate()}</div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeConf.bg} ${typeConf.color}`}>
            {typeConf.label}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConf.bg} ${statusConf.color}`}>
            {statusConf.label}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{e.title}</h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{e.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-500">
          <span>
            {d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: e.timezone })}
          </span>
          {e.is_online ? (
            <span className="text-blue-400">Online</span>
          ) : (
            <span className="truncate">{e.location || "TBA"}</span>
          )}
          <span className="ml-auto">
            {e.registered_count}{e.max_attendees > 0 ? `/${e.max_attendees}` : ""} registered
          </span>
        </div>

        {/* Capacity bar */}
        {e.max_attendees > 0 && (
          <div className="mt-2 h-1 bg-oxford-elevated rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-skyblue"}`}
              style={{ width: `${Math.min(100, (e.registered_count / e.max_attendees) * 100)}%` }}
            />
          </div>
        )}

        {/* Tags */}
        {e.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {e.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-white/5 text-gray-500 rounded text-[10px]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-oxford-border/50">
          <button onClick={onViewAttendees} className="text-skyblue hover:text-skyblue/80 text-xs transition-colors">
            Attendees ({e.registered_count})
          </button>
          <button onClick={onEdit} className="text-gray-400 hover:text-white text-xs transition-colors">
            Edit
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/events/${e.slug}`)}
            className="text-gray-400 hover:text-white text-xs transition-colors"
          >
            Copy Link
          </button>
          <button onClick={onDelete} className="text-red-400 hover:text-red-300 text-xs transition-colors ml-auto">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// EVENT FORM MODAL
// ═══════════════════════════════════════════════════════════

const EventFormModal: React.FC<{
  event: GR8Event | null;
  onClose: () => void;
}> = ({ event: e, onClose }) => {
  const [title, setTitle] = useState(e?.title || "");
  const [description, setDescription] = useState(e?.description || "");
  const [type, setType] = useState<EventType>(e?.type || "workshop");
  const [status, setStatus] = useState<EventStatus>(e?.status || "upcoming");
  const [date, setDate] = useState(
    e?.date ? new Date(e.date).toISOString().slice(0, 16) : ""
  );
  const [endDate, setEndDate] = useState(
    e?.end_date ? new Date(e.end_date).toISOString().slice(0, 16) : ""
  );
  const [timezone, setTimezone] = useState(e?.timezone || "Africa/Lagos");
  const [isOnline, setIsOnline] = useState(e?.is_online ?? true);
  const [location, setLocation] = useState(e?.location || "");
  const [meetingLink, setMeetingLink] = useState(e?.meeting_link || "");
  const [maxAttendees, setMaxAttendees] = useState(e?.max_attendees || 0);
  const [speakers, setSpeakers] = useState(e?.speakers.join(", ") || "");
  const [tags, setTags] = useState(e?.tags.join(", ") || "");
  const [coverUrl, setCoverUrl] = useState(e?.cover_image_url || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !date) {
      alert("Title and date are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: e?.slug || generateSlug(title),
        description: description.trim(),
        type,
        status,
        date: new Date(date).toISOString(),
        end_date: endDate ? new Date(endDate).toISOString() : null,
        timezone,
        is_online: isOnline,
        location: location.trim() || null,
        meeting_link: meetingLink.trim() || null,
        max_attendees: maxAttendees,
        speakers: speakers
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        cover_image_url: coverUrl.trim() || null,
      };
      if (e) {
        await updateEvent(e.id, payload);
      } else {
        await createEvent(payload);
      }
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-oxford-card border border-oxford-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-oxford-border">
          <h2 className="text-lg font-bold text-white">{e ? "Edit" : "Create"} Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Title *">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Event title" />
          </Field>

          <Field label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} placeholder="What's this event about?" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select value={type} onChange={(e) => setType(e.target.value as EventType)} className={inputCls}>
                {(Object.keys(EVENT_TYPE_CONFIG) as EventType[]).map((t) => (
                  <option key={t} value={t}>{EVENT_TYPE_CONFIG[t].label}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value as EventStatus)} className={inputCls}>
                {(Object.keys(EVENT_STATUS_CONFIG) as EventStatus[]).map((s) => (
                  <option key={s} value={s}>{EVENT_STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date & Time *">
              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            </Field>
            <Field label="End Date & Time">
              <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Timezone">
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputCls}>
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Max Attendees (0 = unlimited)">
              <input type="number" value={maxAttendees} onChange={(e) => setMaxAttendees(parseInt(e.target.value) || 0)} min={0} className={inputCls} />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} className="rounded" />
            Online event
          </label>

          {isOnline ? (
            <Field label="Meeting Link">
              <input type="url" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} className={inputCls} placeholder="https://zoom.us/j/..." />
            </Field>
          ) : (
            <Field label="Location">
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} placeholder="Venue address" />
            </Field>
          )}

          <Field label="Speakers (comma-separated)">
            <input type="text" value={speakers} onChange={(e) => setSpeakers(e.target.value)} className={inputCls} placeholder="John Doe, Jane Smith" />
          </Field>

          <Field label="Tags (comma-separated)">
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputCls} placeholder="web, design, react" />
          </Field>

          <Field label="Cover Image URL">
            <input type="url" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className={inputCls} placeholder="https://..." />
          </Field>
          {coverUrl && (
            <img src={coverUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-oxford-border">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : e ? "Update Event" : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ATTENDEES MODAL
// ═══════════════════════════════════════════════════════════

const AttendeesModal: React.FC<{
  event: GR8Event;
  onClose: () => void;
}> = ({ event, onClose }) => {
  const [regs, setRegs] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventRegistrations(event.id).then((data) => {
      setRegs(data);
      setLoading(false);
    });
  }, [event.id]);

  const handleRemove = async (reg: EventRegistration) => {
    if (!confirm(`Remove ${reg.name} from this event?`)) return;
    await deleteRegistration(reg.id, event.id);
    setRegs((prev) => prev.filter((r) => r.id !== reg.id));
  };

  const handleExportCsv = () => {
    const header = "Name,Email,Phone,Registered At\n";
    const rows = regs
      .map(
        (r) =>
          `"${r.name}","${r.email}","${r.phone || ""}","${new Date(r.registered_at).toLocaleDateString()}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.slug}-attendees.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-oxford-card border border-oxford-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-oxford-border">
          <div>
            <h2 className="text-lg font-bold text-white">Attendees</h2>
            <p className="text-gray-500 text-xs mt-0.5">{event.title} — {regs.length} registered</p>
          </div>
          <div className="flex items-center gap-2">
            {regs.length > 0 && (
              <button onClick={handleExportCsv} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded text-xs transition-colors">
                Export CSV
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin w-6 h-6 border-2 border-skyblue border-t-transparent rounded-full mx-auto" />
            </div>
          ) : regs.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No registrations yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {regs.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 bg-oxford-elevated rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-skyblue/20 text-skyblue flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {r.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{r.name}</p>
                    <p className="text-gray-500 text-xs truncate">{r.email}{r.phone ? ` • ${r.phone}` : ""}</p>
                  </div>
                  <span className="text-gray-600 text-[10px] flex-shrink-0">
                    {new Date(r.registered_at).toLocaleDateString()}
                  </span>
                  <button onClick={() => handleRemove(r)} className="text-red-400 hover:text-red-300 text-xs flex-shrink-0">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════════════════════

const inputCls =
  "w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    {children}
  </div>
);

export default EventsAdmin;
