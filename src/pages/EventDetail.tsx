import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { GR8Event } from "../types/events";
import {
  EVENT_TYPE_CONFIG,
  EVENT_STATUS_CONFIG,
} from "../types/events";
import {
  getEventBySlug,
  registerForEvent,
  getGoogleCalendarUrl,
} from "../lib/events";
import { SEO } from "../components/common/SEO";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import { Button } from "devign";
import { ArrowLeft } from "lucide-react";

/* ─── constants ─── */
const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

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
        prev
          ? { ...prev, registered_count: prev.registered_count + 1 }
          : prev
      );
    } catch (err) {
      setRegError(
        err instanceof Error ? err.message : "Registration failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <PageTransition>
        <main className="flex flex-col bg-[#0a0a0f]">
          <div className="h-64 md:h-80 bg-white/[0.03] animate-pulse" />
          <Container className="py-12 -mt-20 relative">
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-20 bg-white/[0.04] rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-white/[0.04] rounded-full animate-pulse" />
            </div>
            <div className="h-10 bg-white/[0.04] rounded w-2/3 mb-8 animate-pulse" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 bg-white/[0.04] rounded w-full animate-pulse" />
                <div className="h-4 bg-white/[0.04] rounded w-full animate-pulse" />
                <div className="h-4 bg-white/[0.04] rounded w-4/5 animate-pulse" />
                <div className="h-4 bg-white/[0.04] rounded w-3/5 animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-white/[0.02] border border-white/[0.06] rounded-xl animate-pulse" />
                <div className="h-40 bg-white/[0.02] border border-white/[0.06] rounded-xl animate-pulse" />
              </div>
            </div>
          </Container>
        </main>
      </PageTransition>
    );
  }

  /* ── Not Found ── */
  if (notFound || !event) {
    return (
      <PageTransition>
        <SEO title="Event Not Found | GR8QM Technovates" description="" />
        <main className="flex flex-col bg-[#0a0a0f]">
          <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-white mb-3">
                Event Not Found
              </h1>
              <p className="text-white/35 mb-6">
                This event doesn't exist or has been removed.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-skyblue transition-colors font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                View all events
              </Link>
            </motion.div>
          </div>
        </main>
      </PageTransition>
    );
  }

  const typeConf = EVENT_TYPE_CONFIG[event.type];
  const statusConf = EVENT_STATUS_CONFIG[event.status];
  const d = new Date(event.date);
  const isFull =
    event.max_attendees > 0 &&
    event.registered_count >= event.max_attendees;
  const canRegister =
    event.status !== "cancelled" &&
    event.status !== "completed" &&
    !isFull;

  return (
    <PageTransition>
      <SEO
        title={`${event.title} | GR8QM Technovates`}
        description={event.description.slice(0, 160)}
      />

      <main className="flex flex-col bg-[#0a0a0f]">
        {/* Hero Cover */}
        <div className="relative">
          <div className="absolute inset-0" style={gridBg} />
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
        </div>

        <Container className="-mt-20 relative z-10 pb-20">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE_SMOOTH }}
            className="flex gap-2 mb-4"
          >
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${typeConf.bg} ${typeConf.color}`}
            >
              {typeConf.label}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}
            >
              {statusConf.label}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: EASE_SMOOTH }}
            className="text-3xl md:text-4xl font-bold text-white tracking-[-0.03em] mb-8"
          >
            {event.title}
          </motion.h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, ease: EASE_SMOOTH }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-3">
                  About This Event
                </h2>
                <p className="text-white/35 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </motion.div>

              {/* Speakers */}
              {event.speakers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, ease: EASE_SMOOTH }}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6"
                >
                  <h2 className="text-lg font-bold text-white mb-3">
                    Speakers
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {event.speakers.map((speaker) => (
                      <span
                        key={speaker}
                        className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] text-white/60 rounded-full text-sm"
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
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-white/[0.04] text-white/20 rounded-full text-xs font-mono"
                    >
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
                transition={{ delay: 0.15, ease: EASE_SMOOTH }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4"
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
                  })}${
                    event.end_date
                      ? ` – ${new Date(event.end_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: event.timezone })}`
                      : ""
                  }`}
                />
                <DetailItem
                  icon={event.is_online ? "💻" : "📍"}
                  label={event.is_online ? "Online" : "Location"}
                  value={
                    event.is_online
                      ? "Virtual Event"
                      : event.location || "TBA"
                  }
                />

                {/* Capacity */}
                {event.max_attendees > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-white/25 mb-1 font-mono">
                      <span>Registered</span>
                      <span>
                        {event.registered_count} / {event.max_attendees}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
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
                {event.is_online &&
                  event.meeting_link &&
                  event.status !== "cancelled" && (
                    <a
                      href={event.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-skyblue rounded-xl text-sm font-medium transition-all duration-300"
                    >
                      Join Meeting
                    </a>
                  )}

                {/* Calendar */}
                {event.status !== "cancelled" &&
                  event.status !== "completed" && (
                    <a
                      href={getGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/40 hover:text-white/60 rounded-xl text-sm transition-all duration-300"
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
                  transition={{ delay: 0.25, ease: EASE_SMOOTH }}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5"
                >
                  {registered ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <h3 className="text-green-400 font-bold">
                        You're Registered!
                      </h3>
                      <p className="text-white/25 text-sm mt-1">
                        See you at the event.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-white font-bold mb-3">Register</h3>
                      <form
                        onSubmit={handleRegister}
                        className="space-y-3"
                      >
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name *"
                          required
                          className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-white/20 focus:border-skyblue/40 focus:outline-none transition-colors"
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address *"
                          required
                          className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-white/20 focus:border-skyblue/40 focus:outline-none transition-colors"
                        />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone (optional)"
                          className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-white/20 focus:border-skyblue/40 focus:outline-none transition-colors"
                        />
                        {regError && (
                          <p className="text-red-400 text-xs">{regError}</p>
                        )}
                        <Button
                          variant="primary"
                          size="md"
                          type="submit"
                          disabled={submitting}
                          className="w-full"
                        >
                          {submitting ? "Registering..." : "Register Now"}
                        </Button>
                      </form>
                    </>
                  )}
                </motion.div>
              )}

              {isFull && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <p className="text-red-400 text-sm font-medium">
                    This event is fully booked.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-12 border-t border-white/[0.06] pt-8">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm text-white/25 hover:text-skyblue transition-colors font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All events
            </Link>
          </div>
        </Container>
      </main>
    </PageTransition>
  );
};

// ── Detail Item ───────────────────────────────────────────

const DetailItem: React.FC<{
  icon: string;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <span className="text-base flex-shrink-0">{icon}</span>
    <div>
      <p className="text-white/20 text-[10px] uppercase tracking-wider font-mono">
        {label}
      </p>
      <p className="text-white text-sm">{value}</p>
    </div>
  </div>
);

export default EventDetail;
