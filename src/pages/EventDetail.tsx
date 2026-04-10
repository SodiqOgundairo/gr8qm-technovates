import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { GR8Event } from "../types/events";
import { EVENT_TYPE_CONFIG, EVENT_STATUS_CONFIG } from "../types/events";
import { getEventBySlug, registerForEvent, getGoogleCalendarUrl } from "../lib/events";
import { SEO } from "../components/common/SEO";

const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<GR8Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Registration form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [regError, setRegError] = useState("");

  useEffect(() => {
    if (!slug) return;
    getEventBySlug(slug).then((data) => {
      if (data) {
        setEvent(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [slug]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !name.trim() || !email.trim()) return;
    setSubmitting(true);
    setRegError("");
    try {
      await registerForEvent({
        event_id: event.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });
      setRegistered(true);
      setEvent((prev) =>
        prev ? { ...prev, registered_count: prev.registered_count + 1 } : prev
      );
    } catch (err) {
      setRegError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-skyblue border-t-transparent rounded-full" />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <>
        <SEO title="Event Not Found | GR8QM Technovates" description="" />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-black text-white">Event Not Found</h1>
            <p className="text-gray-400 mt-3">This event doesn't exist or has been removed.</p>
            <Link to="/events" className="text-skyblue hover:underline mt-4 inline-block">
              &larr; View all events
            </Link>
          </div>
        </div>
      </>
    );
  }

  const typeConf = EVENT_TYPE_CONFIG[event.type];
  const statusConf = EVENT_STATUS_CONFIG[event.status];
  const d = new Date(event.date);
  const isFull = event.max_attendees > 0 && event.registered_count >= event.max_attendees;
  const canRegister = event.status !== "cancelled" && event.status !== "completed" && !isFull;

  return (
    <>
      <SEO
        title={`${event.title} | GR8QM Technovates`}
        description={event.description.slice(0, 160)}
      />

      <div className="min-h-screen">
        {/* Hero Cover */}
        <div
          className="h-64 md:h-80 relative"
          style={{
            background: event.cover_image_url
              ? `url(${event.cover_image_url}) center/cover`
              : `linear-gradient(135deg, #05235a, #0d2847)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/40" />
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-20 relative pb-20">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mb-4"
          >
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeConf.bg} ${typeConf.color}`}>
              {typeConf.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
              {statusConf.label}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black text-white"
          >
            {event.title}
          </motion.h1>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {/* Main content */}
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-lg font-bold text-white mb-3">About This Event</h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </motion.div>

              {/* Speakers */}
              {event.speakers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h2 className="text-lg font-bold text-white mb-3">Speakers</h2>
                  <div className="flex gap-2 flex-wrap">
                    {event.speakers.map((speaker) => (
                      <span
                        key={speaker}
                        className="px-3 py-1.5 bg-oxford-card border border-oxford-border text-gray-300 rounded-full text-sm"
                      >
                        {speaker}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {event.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-white/5 text-gray-500 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Event details card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-oxford-card border border-oxford-border rounded-xl p-5 space-y-4"
              >
                <DetailItem
                  icon="📅"
                  label="Date"
                  value={d.toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
                <DetailItem
                  icon="🕐"
                  label="Time"
                  value={`${d.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: event.timezone,
                  })}${event.end_date ? ` – ${new Date(event.end_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: event.timezone })}` : ""}`}
                />
                <DetailItem
                  icon={event.is_online ? "💻" : "📍"}
                  label={event.is_online ? "Online" : "Location"}
                  value={event.is_online ? "Virtual Event" : event.location || "TBA"}
                />

                {/* Capacity */}
                {event.max_attendees > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Registered</span>
                      <span>
                        {event.registered_count} / {event.max_attendees}
                      </span>
                    </div>
                    <div className="h-1.5 bg-oxford-elevated rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-skyblue"}`}
                        style={{
                          width: `${Math.min(100, (event.registered_count / event.max_attendees) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Meeting Link */}
                {event.is_online && event.meeting_link && event.status !== "cancelled" && (
                  <a
                    href={event.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-white/5 hover:bg-white/10 text-skyblue rounded-lg text-sm transition-colors"
                  >
                    Join Meeting
                  </a>
                )}

                {/* Calendar */}
                {event.status !== "cancelled" && event.status !== "completed" && (
                  <a
                    href={getGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors"
                  >
                    + Add to Calendar
                  </a>
                )}
              </motion.div>

              {/* Registration form */}
              {canRegister && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-oxford-card border border-oxford-border rounded-xl p-5"
                >
                  {registered ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <h3 className="text-green-400 font-bold">You're Registered!</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        See you at the event.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-white font-bold mb-3">Register</h3>
                      <form onSubmit={handleRegister} className="space-y-3">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name *"
                          required
                          className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-600"
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address *"
                          required
                          className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-600"
                        />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone (optional)"
                          className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-600"
                        />
                        {regError && (
                          <p className="text-red-400 text-xs">{regError}</p>
                        )}
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full px-4 py-2.5 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {submitting ? "Registering..." : "Register Now"}
                        </button>
                      </form>
                    </>
                  )}
                </motion.div>
              )}

              {isFull && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <p className="text-red-400 text-sm font-medium">This event is fully booked.</p>
                </div>
              )}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-12">
            <Link to="/events" className="text-gray-500 hover:text-skyblue text-sm transition-colors">
              &larr; All events
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Detail Item ───────────────────────────────────────────

const DetailItem: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex gap-3">
    <span className="text-base flex-shrink-0">{icon}</span>
    <div>
      <p className="text-gray-500 text-[10px] uppercase tracking-wider">{label}</p>
      <p className="text-white text-sm">{value}</p>
    </div>
  </div>
);

export default EventDetail;
