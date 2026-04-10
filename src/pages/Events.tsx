import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { GR8Event, EventType } from "../types/events";
import { EVENT_TYPE_CONFIG } from "../types/events";
import { getAllPublicEvents } from "../lib/events";
import { SEO } from "../components/common/SEO";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";

/* ─── constants ─── */
const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];
const EASE_DECEL: [number, number, number, number] = [0.16, 1, 0.3, 1];

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<GR8Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<EventType | "all">("all");
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 80]);

  useEffect(() => {
    getAllPublicEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const upcoming = useMemo(
    () => events.filter((e) => e.status === "upcoming" || e.status === "live"),
    [events]
  );
  const past = useMemo(
    () => events.filter((e) => e.status === "completed"),
    [events]
  );

  const filterEvents = (list: GR8Event[]) =>
    filterType === "all" ? list : list.filter((e) => e.type === filterType);

  return (
    <PageTransition>
      <SEO
        title="Events | GR8QM Technovates"
        description="Workshops, webinars, and community events from GR8QM Technovates."
      />

      <main className="flex flex-col bg-[#0a0a0f]">
        {/* ════════════════ HERO ════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-white/[0.06]"
        >
          <div className="absolute inset-0" style={gridBg} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-skyblue/[0.04] blur-[160px] pointer-events-none" />

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 text-center px-4"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_SMOOTH }}
              className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/30 mb-6"
            >
              Workshops & Meetups
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_DECEL }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] text-white leading-[0.95] mb-6"
            >
              Our Events
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE_SMOOTH }}
              className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed"
            >
              Join our workshops, webinars, and community meetups. Level up your
              skills.
            </motion.p>
          </motion.div>
        </section>

        {/* ════════════════ FILTERS + CONTENT ════════════════ */}
        <section className="relative overflow-hidden">
          <div className="absolute top-[30%] -right-40 w-[500px] h-[500px] rounded-full bg-skyblue/[0.02] blur-[140px] pointer-events-none" />

          <Container className="py-16 md:py-24 relative z-10">
            {/* Filter bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE_SMOOTH }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-white/[0.06] pb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-[-0.03em]">
                All Events
              </h2>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.15em] transition-all duration-300 border ${
                    filterType === "all"
                      ? "bg-skyblue text-white border-skyblue"
                      : "bg-transparent text-white/30 border-white/[0.08] hover:border-white/[0.2] hover:text-white/50"
                  }`}
                >
                  All
                </button>
                {(Object.keys(EVENT_TYPE_CONFIG) as EventType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.15em] transition-all duration-300 border ${
                      filterType === t
                        ? "bg-skyblue text-white border-skyblue"
                        : "bg-transparent text-white/30 border-white/[0.08] hover:border-white/[0.2] hover:text-white/50"
                    }`}
                  >
                    {EVENT_TYPE_CONFIG[t].label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* States */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                  >
                    <div className="h-36 bg-white/[0.03] animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-white/[0.04] rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-white/[0.04] rounded w-full animate-pulse" />
                      <div className="h-3 bg-white/[0.04] rounded w-2/3 animate-pulse" />
                      <div className="flex gap-3 pt-2">
                        <div className="h-3 bg-white/[0.04] rounded w-16 animate-pulse" />
                        <div className="h-3 bg-white/[0.04] rounded w-20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-32"
              >
                <p className="text-white/25 text-lg mb-2">No events yet</p>
                <p className="text-white/15 text-sm">
                  Check back soon for upcoming events.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-16">
                {/* Upcoming / Live */}
                {filterEvents(upcoming).length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <h3 className="text-xl font-bold text-skyblue">
                        Upcoming Events
                      </h3>
                      <span className="text-xs font-mono text-white/20 uppercase tracking-[0.2em]">
                        ({filterEvents(upcoming).length})
                      </span>
                      <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      <AnimatePresence mode="popLayout">
                        {filterEvents(upcoming)
                          .sort(
                            (a, b) =>
                              new Date(a.date).getTime() -
                              new Date(b.date).getTime()
                          )
                          .map((event, i) => (
                            <PublicEventCard
                              key={event.id}
                              event={event}
                              index={i}
                            />
                          ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Past */}
                {filterEvents(past).length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <h3 className="text-xl font-bold text-white">
                        Past Events
                      </h3>
                      <span className="text-xs font-mono text-white/20 uppercase tracking-[0.2em]">
                        ({filterEvents(past).length})
                      </span>
                      <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      <AnimatePresence mode="popLayout">
                        {filterEvents(past).map((event, i) => (
                          <PublicEventCard
                            key={event.id}
                            event={event}
                            index={i}
                            past
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* No results after filter */}
                {filterEvents(upcoming).length === 0 &&
                  filterEvents(past).length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-32"
                    >
                      <p className="text-white/25 text-lg mb-2">
                        No events match this filter.
                      </p>
                      <p className="text-white/15 text-sm">
                        Try selecting a different category.
                      </p>
                    </motion.div>
                  )}
              </div>
            )}
          </Container>
        </section>

        {/* ════════════════ BOTTOM BORDER ════════════════ */}
        <div className="border-t border-white/[0.06]" />
      </main>
    </PageTransition>
  );
};

// ── Event Card ────────────────────────────────────────────

const PublicEventCard: React.FC<{
  event: GR8Event;
  index: number;
  past?: boolean;
}> = ({ event: e, index, past }) => {
  const typeConf = EVENT_TYPE_CONFIG[e.type];
  const d = new Date(e.date);
  const isFull = e.max_attendees > 0 && e.registered_count >= e.max_attendees;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 0.6, 0.36, 1] }}
    >
      <Link
        to={`/events/${e.slug}`}
        className={`group block rounded-xl overflow-hidden transition-all duration-300 border bg-white/[0.02] hover:bg-white/[0.04] ${
          e.status === "live"
            ? "border-green-500/30 hover:border-green-500/50"
            : past
              ? "border-white/[0.04] opacity-80 hover:opacity-100 hover:border-white/[0.12]"
              : "border-white/[0.06] hover:border-skyblue/30"
        }`}
      >
        {/* Cover */}
        <div
          className="h-36 relative"
          style={{
            background: e.cover_image_url
              ? `url(${e.cover_image_url}) center/cover`
              : `linear-gradient(135deg, #0a1628, #0d2847)`,
          }}
        >
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-3 left-3 bg-black/70 rounded-lg px-2.5 py-1.5 text-center backdrop-blur-sm">
            <div className="text-skyblue text-[10px] font-bold uppercase">
              {d.toLocaleDateString("en-GB", { month: "short" })}
            </div>
            <div className="text-white text-xl font-black leading-tight">
              {d.getDate()}
            </div>
          </div>

          <div className="absolute top-3 right-3 flex gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeConf.bg} ${typeConf.color}`}
            >
              {typeConf.label}
            </span>
            {e.status === "live" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/20 text-green-300 animate-pulse">
                Live Now
              </span>
            )}
          </div>

          {isFull && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/20 text-red-300">
                Fully Booked
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-white font-semibold text-lg group-hover:text-skyblue transition-colors duration-300">
            {e.title}
          </h3>
          <p className="text-white/25 text-sm mt-2 line-clamp-2">
            {e.description}
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs text-white/20 font-mono">
            <span>
              {d.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: e.timezone,
              })}
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
            <span>{e.is_online ? "Online" : e.location || "TBA"}</span>
            {e.speakers.length > 0 && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
                <span className="ml-auto">
                  {e.speakers.length} speaker
                  {e.speakers.length !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>

          {e.tags.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {e.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-white/[0.04] text-white/20 rounded-full text-[10px] font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default EventsPage;
