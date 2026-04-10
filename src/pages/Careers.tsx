import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../utils/supabase";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Search, ArrowRight, X, ChevronRight } from "lucide-react";
import { BriefcaseIcon } from "../components/icons";
import { Button } from "devign";
import JobDetailModal from "../components/careers/JobDetailModal";
import PageTransition from "../components/layout/PageTransition";
import { SEO } from "../components/common/SEO";
import Container from "../components/layout/Container";
import MagneticButton from "../components/animations/MagneticButton";

/* ─── constants ─── */
const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];
const EASE_DECEL: [number, number, number, number] = [0.16, 1, 0.3, 1];

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

interface JobPosting {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salary_range?: string;
  application_form_id: string;
  posted_date?: string;
  closing_date?: string;
}

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [departments, setDepartments] = useState<string[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 80]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, departmentFilter, jobs]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("status", "published")
        .order("posted_date", { ascending: false });

      if (error) throw error;

      setJobs(data || []);

      const uniqueDepts = Array.from(
        new Set(
          (data || [])
            .map((job) => job.department)
            .filter((dept): dept is string => !!dept),
        ),
      );
      setDepartments(uniqueDepts);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.department?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((job) => job.department === departmentFilter);
    }

    setFilteredJobs(filtered);
  };

  const getTypeBadgeClass = (type?: string) => {
    const styles: Record<string, string> = {
      "full-time": "text-skyblue border-skyblue/20",
      "part-time": "text-purple-400 border-purple-500/20",
      contract: "text-orange border-orange/20",
      internship: "text-pink-400 border-pink-500/20",
      temporary: "text-yellow-400 border-yellow-500/20",
    };
    return styles[type || ""] || "text-white/40 border-white/[0.08]";
  };

  const formatType = (type?: string) =>
    type
      ? type
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <PageTransition>
      <SEO
        title="Careers"
        description="Join the GR8QM Technovates team. Explore exciting career opportunities in design, technology, and education."
        keywords={[
          "careers Lagos",
          "tech jobs Nigeria",
          "design jobs Lagos",
          "GR8QM careers",
        ]}
      />

      <main className="flex flex-col bg-[#0a0a0f]">
        {/* ════════════════ HERO ════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-white/[0.06]"
        >
          {/* Subtle grid bg */}
          <div className="absolute inset-0" style={gridBg} />

          {/* Soft ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-skyblue/[0.04] blur-[160px] pointer-events-none" />

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 text-center px-4 w-full max-w-3xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_SMOOTH }}
              className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/30 mb-6"
            >
              We're Hiring
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_DECEL }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] text-white leading-[0.95] mb-6"
            >
              Build the future with us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE_SMOOTH }}
              className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-10"
            >
              We're looking for passionate creators, builders, and innovators to
              join our team.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE_SMOOTH }}
              className="relative max-w-lg mx-auto"
            >
              <div className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm transition-colors duration-300 focus-within:border-white/[0.16]">
                <Search className="w-4 h-4 text-white/25 shrink-0" />
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent w-full text-white/80 placeholder-white/20 outline-none text-sm"
                />
                <AnimatePresence>
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      onClick={() => setSearchTerm("")}
                      className="text-white/30 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Job count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-5 text-xs font-mono text-white/20 uppercase tracking-[0.2em]"
            >
              {loading
                ? "Loading..."
                : `${filteredJobs.length} open position${filteredJobs.length !== 1 ? "s" : ""}`}
            </motion.p>
          </motion.div>
        </section>

        {/* ════════════════ FILTERS + LISTINGS ════════════════ */}
        <section className="relative overflow-hidden">
          {/* Very subtle ambient light */}
          <div className="absolute top-[40%] -left-40 w-[500px] h-[500px] rounded-full bg-skyblue/[0.02] blur-[140px] pointer-events-none" />

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
                Open Positions
              </h2>

              {/* Department pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDepartmentFilter("all")}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.15em] transition-all duration-300 border ${
                    departmentFilter === "all"
                      ? "bg-skyblue text-white border-skyblue"
                      : "bg-transparent text-white/30 border-white/[0.08] hover:border-white/[0.2] hover:text-white/50"
                  }`}
                >
                  All
                </button>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setDepartmentFilter(dept)}
                    className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.15em] transition-all duration-300 border ${
                      departmentFilter === dept
                        ? "bg-skyblue text-white border-skyblue"
                        : "bg-transparent text-white/30 border-white/[0.08] hover:border-white/[0.2] hover:text-white/50"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* States */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 rounded-xl bg-white/[0.03] animate-pulse"
                  />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center py-32"
              >
                <p className="text-white/25 text-lg mb-2">
                  No positions match your criteria.
                </p>
                <p className="text-white/15 text-sm mb-6">
                  Try adjusting your search or filters.
                </p>
                {(searchTerm || departmentFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setDepartmentFilter("all");
                    }}
                    className="text-xs font-mono uppercase tracking-[0.15em] text-white/30 hover:text-white/50 border border-white/[0.08] hover:border-white/[0.16] rounded-full px-5 py-2 transition-all duration-300"
                  >
                    Clear filters
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: EASE_SMOOTH,
                      }}
                    >
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="group w-full text-left rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-transparent hover:bg-white/[0.02] transition-all duration-300 p-6 md:p-8"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                          {/* Title + department */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1 tracking-[-0.02em]">
                              <span className="bg-gradient-to-r from-white to-white bg-[length:0%_1px] bg-left-bottom bg-no-repeat group-hover:bg-[length:100%_1px] transition-[background-size] duration-500 ease-[cubic-bezier(0.8,0,0.2,1)] pb-0.5">
                                {job.title}
                              </span>
                            </h3>
                            {job.department && (
                              <p className="text-xs font-mono text-white/20 uppercase tracking-[0.15em]">
                                {job.department}
                              </p>
                            )}
                          </div>

                          {/* Meta pills */}
                          <div className="flex flex-wrap items-center gap-3">
                            {job.employment_type && (
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] border ${getTypeBadgeClass(job.employment_type)}`}
                              >
                                {formatType(job.employment_type)}
                              </span>
                            )}
                            {job.location && (
                              <span className="flex items-center gap-1.5 text-xs text-white/20">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                            )}
                            {job.posted_date && (
                              <span className="flex items-center gap-1.5 text-xs text-white/15">
                                <Clock className="w-3 h-3" />
                                {formatDate(job.posted_date)}
                              </span>
                            )}
                            {job.salary_range && (
                              <span className="flex items-center gap-1.5 text-xs text-white/20 font-medium">
                                <BriefcaseIcon size={12} />
                                {job.salary_range}
                              </span>
                            )}
                          </div>

                          {/* Arrow */}
                          <div className="hidden md:flex items-center">
                            <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors duration-300 group-hover:translate-x-1 transform" />
                          </div>
                        </div>

                        {/* Description preview */}
                        <p className="text-white/15 text-sm leading-relaxed line-clamp-2 mt-3 max-w-3xl">
                          {job.description}
                        </p>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Container>
        </section>

        {/* ════════════════ CTA ════════════════ */}
        <section className="border-t border-white/[0.06]">
          <Container className="py-20 md:py-28 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/15 mb-4">
              Don't see a fit?
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-[-0.03em] mb-4">
              We're always looking for talent
            </h2>
            <p className="text-white/25 text-base max-w-lg mx-auto mb-8">
              Reach out and tell us about yourself — the right role might be just
              around the corner.
            </p>
            <MagneticButton>
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  (window.location.href = "mailto:careers@gr8qm.com")
                }
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Get in Touch
              </Button>
            </MagneticButton>
          </Container>
        </section>

        {/* ════════════════ JOB DETAIL MODAL ════════════════ */}
        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </main>
    </PageTransition>
  );
};

export default Careers;
