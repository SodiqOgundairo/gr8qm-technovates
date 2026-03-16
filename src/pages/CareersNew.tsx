import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Search, Sparkles, ArrowRight } from "lucide-react";
import { BriefcaseIcon } from "../components/icons";
import JobDetailModal from "../components/careers/JobDetailModal";
import PageTransition from "../components/layout/PageTransition";
import { SEO } from "../components/common/SEO";
import Container from "../components/layout/Container";
import RevealOnScroll from "../components/animations/RevealOnScroll";
import SplitText from "../components/animations/SplitText";
import Scene3D from "../components/animations/Scene3D";
import MarqueeText from "../components/animations/MarqueeText";
import MagneticButton from "../components/animations/MagneticButton";
import GlowCard from "../components/animations/GlowCard";

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

      <div className="min-h-screen bg-dark text-white overflow-hidden">
        {/* ========== HERO SECTION ========== */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Scene3D Background */}
          <Scene3D variant="hero" />

          {/* Floating gradient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
            <motion.div
              className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-skyblue/8 blur-[120px]"
              animate={{
                x: [0, 40, -20, 0],
                y: [0, -30, 20, 0],
                scale: [1, 1.1, 0.95, 1],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full bg-orange/6 blur-[100px]"
              animate={{
                x: [0, -30, 20, 0],
                y: [0, 40, -20, 0],
                scale: [1, 0.9, 1.1, 1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-oxford/10 blur-[150px]"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Noise overlay */}
          <div className="noise-overlay absolute inset-0 z-[2] pointer-events-none opacity-30" />

          {/* Hero Content */}
          <Container className="relative z-10 text-center py-32">
            <RevealOnScroll direction="scale" delay={0.1}>
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-white/10 mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4 text-orange" />
                <span className="text-sm font-medium text-white/80 tracking-wide">
                  We're Hiring
                </span>
              </motion.div>
            </RevealOnScroll>

            <div className="mb-6">
              <SplitText
                as="h1"
                className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white"
                type="words"
                stagger={0.08}
                delay={0.2}
              >
                Build The
              </SplitText>
            </div>
            <div className="mb-8">
              <SplitText
                as="h1"
                className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight gradient-text"
                type="words"
                stagger={0.08}
                delay={0.5}
              >
                Future With Us
              </SplitText>
            </div>

            <RevealOnScroll direction="up" delay={0.8}>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                Explore exciting opportunities and grow your career at GR8QM
                Technovates. We're looking for passionate creators, builders,
                and innovators.
              </p>
            </RevealOnScroll>

            {/* Animated Search Bar */}
            <RevealOnScroll direction="up" delay={1}>
              <motion.div
                className="max-w-2xl mx-auto"
                animate={{
                  boxShadow: searchFocused
                    ? "0 0 60px rgba(0, 152, 218, 0.2)"
                    : "0 0 0px rgba(0, 152, 218, 0)",
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative group">
                  <motion.div
                    className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-skyblue via-oxford to-orange opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"
                    animate={{
                      opacity: searchFocused ? 0.6 : 0,
                    }}
                  />
                  <div className="relative flex items-center glass-card rounded-2xl border border-white/10 overflow-hidden">
                    <motion.div
                      animate={{ rotate: searchFocused ? 90 : 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="pl-5"
                    >
                      <Search className="text-white/40 w-5 h-5" />
                    </motion.div>
                    <input
                      type="text"
                      placeholder="Search jobs by title, department, or keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="w-full pl-4 pr-6 py-5 bg-transparent text-white placeholder-white/30 focus:outline-none text-lg"
                    />
                    <AnimatePresence>
                      {searchTerm && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          onClick={() => setSearchTerm("")}
                          className="pr-5 text-white/40 hover:text-white transition-colors"
                        >
                          &times;
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </RevealOnScroll>

            {/* Job count */}
            <RevealOnScroll direction="up" delay={1.2}>
              <motion.p
                className="mt-6 text-white/30 text-sm tracking-widest uppercase"
                animate={{ opacity: loading ? 0.3 : 0.5 }}
              >
                {loading
                  ? "Loading positions..."
                  : `${filteredJobs.length} open position${filteredJobs.length !== 1 ? "s" : ""}`}
              </motion.p>
            </RevealOnScroll>
          </Container>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark to-transparent z-[3]" />
        </section>

        {/* ========== MARQUEE DIVIDER ========== */}
        <div className="relative py-4 border-y border-white/5">
          <MarqueeText
            text="DESIGN  ///  TECHNOLOGY  ///  INNOVATION  ///  CAREERS  ///  GROWTH"
            speed={30}
            className="text-sm font-bold tracking-[0.3em] text-white/10 uppercase"
          />
        </div>

        {/* ========== FILTERS SECTION ========== */}
        <section className="relative py-16">
          <Container>
            <RevealOnScroll direction="left" delay={0.1}>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xs font-semibold text-white/30 uppercase tracking-widest mr-2">
                  Filter by:
                </span>
                <MagneticButton strength={15}>
                  <motion.button
                    onClick={() => setDepartmentFilter("all")}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                      departmentFilter === "all"
                        ? "bg-skyblue text-white border-skyblue shadow-lg shadow-skyblue/25"
                        : "glass-card text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    All Departments
                  </motion.button>
                </MagneticButton>

                {departments.map((dept, i) => (
                  <MagneticButton key={dept} strength={15}>
                    <motion.button
                      onClick={() => setDepartmentFilter(dept)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                        departmentFilter === dept
                          ? "bg-skyblue text-white border-skyblue shadow-lg shadow-skyblue/25"
                          : "glass-card text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {dept}
                    </motion.button>
                  </MagneticButton>
                ))}
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ========== JOB LISTINGS ========== */}
        <section className="relative pb-32">
          {/* Background orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute top-[20%] right-[5%] w-[350px] h-[350px] rounded-full bg-skyblue/4 blur-[100px]"
              animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-[30%] left-[5%] w-[300px] h-[300px] rounded-full bg-orange/4 blur-[80px]"
              animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </div>

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
                  <p className="text-white/40 text-lg tracking-wide">
                    Loading opportunities...
                  </p>
                </motion.div>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredJobs.length === 0 && (
              <RevealOnScroll direction="scale">
                <div className="text-center py-32">
                  <motion.div
                    className="inline-flex flex-col items-center gap-6 glass-card rounded-3xl p-16 border border-white/5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                      <Search className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40 text-xl font-medium">
                      No job openings found matching your criteria.
                    </p>
                    <p className="text-white/20 text-sm">
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
              </RevealOnScroll>
            )}

            {/* Job Grid */}
            {!loading && filteredJobs.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredJobs.map((job, index) => (
                    <RevealOnScroll
                      key={job.id}
                      direction={index % 2 === 0 ? "left" : "right"}
                      delay={index * 0.08}
                    >
                      <GlowCard
                        className="group cursor-pointer rounded-2xl"
                        glowColor="rgba(0, 152, 218, 0.12)"
                      >
                        <motion.div
                          layoutId={`job-card-${job.id}`}
                          onClick={() => setSelectedJob(job)}
                          className="relative glass-card rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-500 overflow-hidden"
                          whileHover={{ y: -4 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                        >
                          {/* Top gradient line */}
                          <div className="h-[2px] bg-gradient-to-r from-transparent via-skyblue/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                          <div className="p-7">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-5 gap-4">
                              <div className="flex-1 min-w-0">
                                <motion.h3
                                  className="text-2xl font-bold text-white group-hover:text-skyblue transition-colors duration-300 mb-2 truncate"
                                >
                                  {job.title}
                                </motion.h3>
                                {job.department && (
                                  <p className="text-white/40 font-medium text-sm tracking-wide uppercase">
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
                                  className="flex items-center gap-3 text-white/50"
                                  whileHover={{ x: 4 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <MapPin className="w-4 h-4 text-skyblue/70 flex-shrink-0" />
                                  <span className="text-sm">{job.location}</span>
                                </motion.div>
                              )}
                              {job.posted_date && (
                                <motion.div
                                  className="flex items-center gap-3 text-white/50"
                                  whileHover={{ x: 4 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <Clock className="w-4 h-4 text-skyblue/70 flex-shrink-0" />
                                  <span className="text-sm">
                                    Posted {formatDate(job.posted_date)}
                                  </span>
                                </motion.div>
                              )}
                              {job.salary_range && (
                                <motion.div
                                  className="flex items-center gap-3 text-white/50"
                                  whileHover={{ x: 4 }}
                                  transition={{ type: "spring", stiffness: 300 }}
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
                            <p className="text-white/30 text-sm leading-relaxed line-clamp-3 mb-6">
                              {job.description}
                            </p>

                            {/* CTA */}
                            <motion.div
                              className="flex items-center justify-between pt-5 border-t border-white/5"
                              whileHover={{ gap: "1rem" }}
                            >
                              <span className="text-sm font-semibold text-skyblue group-hover:text-white transition-colors duration-300 hover-line">
                                View Details & Apply
                              </span>
                              <motion.div
                                className="w-10 h-10 rounded-full bg-skyblue/10 flex items-center justify-center group-hover:bg-skyblue/20 transition-colors duration-300"
                                whileHover={{ scale: 1.1, rotate: -45 }}
                              >
                                <ArrowRight className="w-4 h-4 text-skyblue" />
                              </motion.div>
                            </motion.div>
                          </div>

                          {/* Bottom glow on hover */}
                          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-skyblue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </motion.div>
                      </GlowCard>
                    </RevealOnScroll>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Container>
        </section>

        {/* ========== BOTTOM CTA / MARQUEE ========== */}
        <section className="relative py-20 border-t border-white/5">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-skyblue/5 blur-[120px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10">
            <MarqueeText
              text="JOIN US  ///  INNOVATE  ///  CREATE  ///  BUILD  ///  GROW"
              speed={25}
              className="text-7xl md:text-8xl lg:text-9xl font-black text-white/[0.03] uppercase mb-12"
              reverse
            />

            <Container className="text-center">
              <RevealOnScroll direction="up" delay={0.2}>
                <p className="text-white/40 text-lg max-w-xl mx-auto mb-8">
                  Don't see a role that fits? We're always looking for
                  exceptional talent. Reach out and tell us about yourself.
                </p>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={0.4}>
                <MagneticButton strength={20}>
                  <motion.a
                    href="mailto:careers@gr8qm.com"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-skyblue to-oxford text-white font-bold text-lg shadow-lg shadow-skyblue/20 hover:shadow-skyblue/40 transition-shadow duration-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get in Touch
                    <ArrowRight className="w-5 h-5" />
                  </motion.a>
                </MagneticButton>
              </RevealOnScroll>
            </Container>
          </div>
        </section>

        {/* ========== JOB DETAIL MODAL ========== */}
        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default Careers;
