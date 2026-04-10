import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { GR8Event, EventType } from "../types/events";
import { EVENT_TYPE_CONFIG } from "../types/events";
import { getAllPublicEvents } from "../lib/events";
import { SEO } from "../components/common/SEO";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<GR8Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<EventType | "all">("all");

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
    <>
      <SEO
        title="Events | GR8QM Technovates"
        description="Workshops, webinars, and community events from GR8QM Technovates."
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-12 px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white"
          >
            Our <span className="text-skyblue">Events</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto"
          >
            Join our workshops, webinars, and community meetups. Level up your skills.
          </motion.p>
        </section>

        {/* Filters */}
        <section className="max-w-6xl mx-auto px-4 pb-4">
          <div className="flex gap-2 flex-wrap justify-center">
            <FilterPill
              active={filterType === "all"}
              onClick={() => setFilterType("all")}
              label="All Events"
            />
            {(Object.keys(EVENT_TYPE_CONFIG) as EventType[]).map((t) => (
              <FilterPill
                key={t}
                active={filterType === t}
                onClick={() => setFilterType(t)}
                label={EVENT_TYPE_CONFIG[t].label}
              />
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-skyblue border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-500 mt-4">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No events yet</p>
              <p className="mt-2">Check back soon for upcoming events.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Upcoming / Live */}
              {filterEvents(upcoming).length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-skyblue mb-6">
                    Upcoming Events
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({filterEvents(upcoming).length})
                    </span>
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filterEvents(upcoming)
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((event, i) => (
                        <PublicEventCard key={event.id} event={event} index={i} />
                      ))}
                  </div>
                </div>
              )}

              {/* Past */}
              {filterEvents(past).length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">
                    Past Events
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({filterEvents(past).length})
                    </span>
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filterEvents(past).map((event, i) => (
                      <PublicEventCard key={event.id} event={event} index={i} past />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/events/${e.slug}`}
        className={`block bg-oxford-card border rounded-xl overflow-hidden transition-all hover:border-skyblue/50 ${
          e.status === "live"
            ? "border-green-500/40"
            : past
              ? "border-oxford-border/50 opacity-80 hover:opacity-100"
              : "border-oxford-border"
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
          <div className="absolute top-3 left-3 bg-black/70 rounded-lg px-2.5 py-1.5 text-center backdrop-blur-sm">
            <div className="text-skyblue text-[10px] font-bold uppercase">
              {d.toLocaleDateString("en-GB", { month: "short" })}
            </div>
            <div className="text-white text-xl font-black leading-tight">{d.getDate()}</div>
          </div>

          <div className="absolute top-3 right-3 flex gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeConf.bg} ${typeConf.color}`}>
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
          <h3 className="text-white font-semibold text-lg">{e.title}</h3>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{e.description}</p>

          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span>
              {d.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: e.timezone,
              })}
            </span>
            <span>{e.is_online ? "Online" : e.location || "TBA"}</span>
            {e.speakers.length > 0 && (
              <span className="ml-auto">{e.speakers.length} speaker{e.speakers.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {e.tags.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {e.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-white/5 text-gray-500 rounded-full text-[10px]">
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

// ── Filter Pill ───────────────────────────────────────────

const FilterPill: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
}> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
      active
        ? "bg-skyblue text-white"
        : "bg-oxford-card border border-oxford-border text-gray-400 hover:text-white hover:border-skyblue/50"
    }`}
  >
    {label}
  </button>
);

export default EventsPage;
