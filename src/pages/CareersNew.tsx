import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Search, ArrowRight } from "lucide-react";
import { BriefcaseIcon } from "../components/icons";
import JobDetailModal from "../components/careers/JobDetailModal";
import PageTransition from "../components/layout/PageTransition";
import { SEO } from "../components/common/SEO";
import Container from "../components/layout/Container";
import OrbitalBackground from "../components/animations/OrbitalBackground";
import {
  Reveal,
  DotGrid,
  DiagonalLines,
  CrossMark,
  AccentLine,
  FloatingRule,
  SectionConnector,
} from "../components/animations/DesignElements";

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
  const [searchFocused, setSearchFocused] = useState(false);

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

  const getEmploymentTypeBadge = (type?: string) => {
    if (!type) return null;

    const styles: Record<string, string> = {
      "full-time":
        "bg-skyblue/10 text-skyblue border border-skyblue/20",
      "part-time":
        "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      contract:
        "bg-orange/10 text-orange border border-orange/20",
      internship:
        "bg-pink-500/10 text-pink-400 border border-pink-500/20",
      temporary:
        "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    };

    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
          styles[type] || "bg-white/10 text-white/60 border border-white/20"
        }`}
      >
        {type
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </motion.span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

      <main className="flex flex-col bg-oxford-deep">
        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden z-10 sticky top-0">
          <OrbitalBackground variant="hero" />

          {/* Geometric decorations */}
          <DotGrid className="top-8 left-8 text-skyblue/20" />
          <DiagonalLines className="bottom-0 right-0 text-orange/10" thick />
          <CrossMark className="absolute top-[12%] right-[18%] text-skyblue/15" size={20} />
          <CrossMark className="absolute bottom-[18%] left-[12%] text-orange/15" size={14} />

          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />
          <FloatingRule className="bottom-0 left-0 w-full" color="orange" />

          <Container className="relative z-10 text-center py-12 md:py-28 lg:py-36">
            <Reveal delay={0}>
              <motion.div
                className="inline-flex items-center gap-2 bg-skyblue/10 border border-oxford-border rounded-full px-5 py-2.5 mb-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm text-iceblue/70 font-medium tracking-widest uppercase">
                  We're Hiring
                </span>
              </motion.div>
            </Reveal>

            <Reveal delay={0.1}>
              <AccentLine color="skyblue" thickness="medium" width="w-16" className="mx-auto mb-6" />
            </Reveal>

            <Reveal delay={0.2}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                <span className="text-white">Build The Future</span>{" "}
                <span className="text-skyblue">With Us</span>
              </h1>
            </Reveal>

            <Reveal delay={0.4}>
              <p className="text-lg md:text-xl text-iceblue/70 max-w-2xl mx-auto mb-12 leading-relaxed">
                Explore exciting opportunities and grow your career at GR8QM
                Technovates. We're looking for passionate creators, builders,
                and innovators.
              </p>
            </Reveal>

            {/* Search Bar */}
            <Reveal delay={0.6}>
              <motion.div
                className="max-w-2xl mx-auto"
                animate={{
                  boxShadow: searchFocused
                    ? "0 0 60px rgba(0, 152, 218, 0.15)"
                    : "0 0 0px rgba(0, 152, 218, 0)",
                }}
                transition={{ duration: 0.4, ease: [0.22, 0.6, 0.36, 1] as const }}
              >
                <div className="relative group">
                  <motion.div
                    className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-skyblue via-oxford to-orange opacity-0 blur-sm transition-opacity duration-500"
                    animate={{
                      opacity: searchFocused ? 0.4 : 0,
                    }}
                  />
                  <div className="relative flex items-center bg-white/5 backdrop-blur-sm rounded-2xl border border-oxford-border overflow-hidden">
                    <motion.div
                      animate={{ rotate: searchFocused ? 90 : 0 }}
                      transition={{ type: "spring" as const, stiffness: 200, damping: 15 }}
                      className="pl-5"
                    >
                      <Search className="text-iceblue/40 w-5 h-5" />
                    </motion.div>
                    <input
                      type="text"
                      placeholder="Search jobs by title, department, or keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="w-full pl-4 pr-6 py-5 bg-transparent text-white placeholder-iceblue/30 focus:outline-none text-lg"
                    />
                    <AnimatePresence>
                      {searchTerm && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          onClick={() => setSearchTerm("")}
                          className="pr-5 text-iceblue/40 hover:text-white transition-colors"
                        >
                          &times;
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Job count */}
            <Reveal delay={0.8}>
              <motion.p
                className="mt-6 text-iceblue/30 text-sm tracking-widest uppercase"
                animate={{ opacity: loading ? 0.3 : 0.5 }}
              >
                {loading
                  ? "Loading positions..."
                  : `${filteredJobs.length} open position${filteredJobs.length !== 1 ? "s" : ""}`}
              </motion.p>
            </Reveal>
          </Container>

          <SectionConnector color="skyblue" side="right" />
        </section>

        {/* ═══════════════ FILTERS SECTION ═══════════════ */}
        <section className="relative py-16 bg-oxford-deep overflow-hidden z-20 sticky top-0">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <CrossMark className="absolute top-[10%] left-[8%] text-skyblue/10" size={18} />
          <FloatingRule className="top-0 left-0 w-full" color="iceblue" dashed />

          <Container className="relative z-10">
            <Reveal direction="left" delay={0.1}>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xs font-semibold text-iceblue/30 uppercase tracking-widest mr-2">
                  Filter by:
                </span>
                <motion.button
                  onClick={() => setDepartmentFilter("all")}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    departmentFilter === "all"
                      ? "bg-skyblue text-white border-skyblue shadow-lg shadow-skyblue/25"
                      : "bg-white/5 backdrop-blur-sm text-iceblue/60 border-oxford-border hover:border-skyblue/30 hover:text-white"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                >
                  All Departments
                </motion.button>

                {departments.map((dept, i) => (
                  <motion.button
                    key={dept}
                    onClick={() => setDepartmentFilter(dept)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, ease: [0.22, 0.6, 0.36, 1] as const }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                      departmentFilter === dept
                        ? "bg-skyblue text-white border-skyblue shadow-lg shadow-skyblue/25"
                        : "bg-white/5 backdrop-blur-sm text-iceblue/60 border-oxford-border hover:border-skyblue/30 hover:text-white"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {dept}
                  </motion.button>
                ))}
              </div>
            </Reveal>
          </Container>

          <SectionConnector color="orange" side="left" />
        </section>

        {/* ═══════════════ JOB LISTINGS ═══════════════ */}
        <section className="relative py-24 md:py-32 bg-oxford-deep overflow-hidden z-30 sticky top-0">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="bottom-12 right-12 text-orange/15" />
          <DiagonalLines className="top-0 left-0 text-skyblue/8" />
          <CrossMark className="absolute top-[8%] right-[12%] text-skyblue/10" size={18} />
          <CrossMark className="absolute bottom-[12%] left-[6%] text-orange/12" size={14} />
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

          <Container className="relative z-10">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-32">
                <motion.div
                  className="inline-flex flex-col items-center gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full border-2 border-skyblue/20 border-t-skyblue"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <p className="text-iceblue/40 text-lg tracking-wide">
                    Loading opportunities...
                  </p>
                </motion.div>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredJobs.length === 0 && (
              <Reveal>
                <div className="text-center py-32">
                  <motion.div
                    className="inline-flex flex-col items-center gap-6 bg-white/5 backdrop-blur-sm rounded-3xl p-16 border border-oxford-border"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                      <Search className="w-8 h-8 text-iceblue/20" />
                    </div>
                    <p className="text-iceblue/40 text-xl font-medium">
                      No job openings found matching your criteria.
                    </p>
                    <p className="text-iceblue/20 text-sm">
                      Try adjusting your search or filter settings.
                    </p>
                    {(searchTerm || departmentFilter !== "all") && (
                      <motion.button
                        onClick={() => {
                          setSearchTerm("");
                          setDepartmentFilter("all");
                        }}
                        className="mt-4 px-6 py-3 rounded-full border border-skyblue/30 text-skyblue text-sm font-semibold hover:bg-skyblue/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Clear all filters
                      </motion.button>
                    )}
                  </motion.div>
                </div>
              </Reveal>
            )}

            {/* Job Grid */}
            {!loading && filteredJobs.length > 0 && (
              <>
                <Reveal>
                  <div className="text-center mb-16">
                    <AccentLine color="skyblue" thickness="medium" width="w-12" className="mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Open Positions
                    </h2>
                    <p className="text-iceblue/70 text-lg max-w-2xl mx-auto">
                      Find a role that matches your skills and ambitions
                    </p>
                  </div>
                </Reveal>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredJobs.map((job, index) => (
                      <Reveal
                        key={job.id}
                        direction={index % 2 === 0 ? "left" : "right"}
                        delay={index * 0.08}
                      >
                        <motion.div
                          onClick={() => setSelectedJob(job)}
                          className="group cursor-pointer relative bg-white/5 backdrop-blur-sm rounded-2xl border border-oxford-border hover:border-skyblue/30 transition-all duration-500 overflow-hidden"
                          whileHover={{
                            y: -6,
                            scale: 1.01,
                            boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                        >
                          {/* Top gradient line */}
                          <div className="h-[2px] bg-gradient-to-r from-transparent via-skyblue/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                          <div className="p-7">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-5 gap-4">
                              <div className="flex-1 min-w-0">
                                <motion.h3 className="text-2xl font-bold text-white group-hover:text-skyblue transition-colors duration-300 mb-2 truncate">
                                  {job.title}
                                </motion.h3>
                                {job.department && (
                                  <p className="text-iceblue/40 font-medium text-sm tracking-wide uppercase">
                                    {job.department}
                                  </p>
                                )}
                              </div>
                              {getEmploymentTypeBadge(job.employment_type)}
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-5">
                              {job.location && (
                                <motion.div
                                  className="flex items-center gap-3 text-iceblue/50"
                                  whileHover={{ x: 4 }}
                                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                                >
                                  <MapPin className="w-4 h-4 text-skyblue/70 flex-shrink-0" />
                                  <span className="text-sm">{job.location}</span>
                                </motion.div>
                              )}
                              {job.posted_date && (
                                <motion.div
                                  className="flex items-center gap-3 text-iceblue/50"
                                  whileHover={{ x: 4 }}
                                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                                >
                                  <Clock className="w-4 h-4 text-skyblue/70 flex-shrink-0" />
                                  <span className="text-sm">
                                    Posted {formatDate(job.posted_date)}
                                  </span>
                                </motion.div>
                              )}
                              {job.salary_range && (
                                <motion.div
                                  className="flex items-center gap-3 text-iceblue/50"
                                  whileHover={{ x: 4 }}
                                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                                >
                                  <BriefcaseIcon
                                    size={16}
                                    className="text-skyblue/70 flex-shrink-0"
                                  />
                                  <span className="text-sm font-medium">
                                    {job.salary_range}
                                  </span>
                                </motion.div>
                              )}
                            </div>

                            {/* Description Preview */}
                            <p className="text-iceblue/30 text-sm leading-relaxed line-clamp-3 mb-6">
                              {job.description}
                            </p>

                            {/* CTA */}
                            <div className="flex items-center justify-between pt-5 border-t border-oxford-border">
                              <span className="text-sm font-semibold text-skyblue group-hover:text-white transition-colors duration-300">
                                View Details & Apply
                              </span>
                              <motion.div
                                className="w-10 h-10 rounded-full bg-skyblue/10 flex items-center justify-center group-hover:bg-skyblue/20 transition-colors duration-300"
                                whileHover={{ scale: 1.1, rotate: -45 }}
                                transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                              >
                                <ArrowRight className="w-4 h-4 text-skyblue" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Bottom glow on hover */}
                          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-skyblue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </motion.div>
                      </Reveal>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </Container>

          <SectionConnector color="skyblue" side="right" />
        </section>

        {/* ═══════════════ CTA SECTION ═══════════════ */}
        <section className="relative py-24 md:py-32 bg-oxford-deep overflow-hidden z-40 sticky top-0">
          <OrbitalBackground variant="cta" />

          {/* Geometric decorations */}
          <DotGrid className="top-12 left-12 text-skyblue/15" />
          <DiagonalLines className="bottom-0 right-0 text-orange/10" />
          <CrossMark className="absolute top-[18%] left-[22%] text-orange/12" size={16} />
          <CrossMark className="absolute bottom-[20%] right-[18%] text-skyblue/10" size={14} />
          <FloatingRule className="top-0 left-0 w-full" color="orange" dashed />

          <Container className="relative z-10 text-center">
            <Reveal>
              <AccentLine color="orange" thickness="thick" width="w-16" className="mx-auto mb-8" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Don't See a Fit?
              </h2>
              <p className="text-iceblue/70 text-lg mb-8 max-w-2xl mx-auto">
                We're always looking for exceptional talent. Reach out and tell
                us about yourself -- the right role might be just around the corner.
              </p>
              <motion.a
                href="mailto:careers@gr8qm.com"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-skyblue to-oxford text-white font-bold text-lg shadow-lg shadow-skyblue/20 hover:shadow-skyblue/40 transition-shadow duration-500 border border-oxford-border"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
              >
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </Reveal>
          </Container>
        </section>

        {/* ═══════════════ JOB DETAIL MODAL ═══════════════ */}
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
