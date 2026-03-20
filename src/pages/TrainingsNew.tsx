import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import CourseCard from "../components/services/CourseCard";
import CourseModal from "../components/services/CourseModal";
import CourseApplicationForm from "../components/services/CourseApplicationForm";
import Modal from "../components/layout/Modal";
import CourseCardSkeleton from "../components/common/CourseCardSkeleton";
import { SEO } from "../components/common/SEO";
import { supabase } from "../utils/supabase";

import OrbitalBackground from "../components/animations/OrbitalBackground";
import {
  Reveal,
  DotGrid,
  DiagonalLines,
  ConcentricCircles,
  CrossMark,
  AccentLine,
  FloatingRule,
  SectionConnector,
} from "../components/animations/DesignElements";

import MagneticButton from "../components/animations/MagneticButton";
import AnimatedCounter from "../components/animations/AnimatedCounter";
import MarqueeText from "../components/animations/MarqueeText";

/* ── types ── */
interface Course {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  commitment_fee: number;
  cohort_name?: string;
  start_date?: string;
  applications_open: boolean;
  category?: string;
  requirements?: string[];
  what_you_learn?: string[];
  created_at?: string;
}

/* ── constants ── */
const springSnappy = { type: "spring" as const, stiffness: 300, damping: 20 };

const features = [
  {
    icon: "\uD83C\uDF93",
    title: "Sponsored",
    desc: "Only a commitment fee required",
    stat: 95,
    statSuffix: "%",
    statLabel: "Sponsored",
  },
  {
    icon: "\uD83D\uDC68\u200D\uD83D\uDCBC",
    title: "Expert Instructors",
    desc: "Learn from industry professionals",
    stat: 50,
    statSuffix: "+",
    statLabel: "Experts",
  },
  {
    icon: "\uD83D\uDCBC",
    title: "Job Support",
    desc: "Career guidance and placement assistance",
    stat: 80,
    statSuffix: "%",
    statLabel: "Placed",
  },
  {
    icon: "\uD83C\uDFC6",
    title: "Certificates",
    desc: "Earn recognized certificates upon completion",
    stat: 100,
    statSuffix: "%",
    statLabel: "Certified",
  },
];

/* ══════════════════════════════════════════════════════════════
   TRAININGS PAGE — premium dark sticky-parallax design
   ══════════════════════════════════════════════════════════════ */
const TrainingsPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  /* ── Supabase fetch ── */
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setCourses(data || []);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setCourseModalOpen(true);
  };

  const handleApplyClick = () => {
    setCourseModalOpen(false);
    setApplicationModalOpen(true);
  };

  const handleCloseModals = () => {
    setCourseModalOpen(false);
    setApplicationModalOpen(false);
    setSelectedCourse(null);
  };

  /* ── filtering ── */
  const filteredCourses =
    filterCategory === "all"
      ? courses
      : courses.filter((course) => course.category === filterCategory);

  const categories: string[] = [
    "all",
    ...(Array.from(
      new Set(courses.map((c) => c.category).filter(Boolean))
    ) as string[]),
  ];

  return (
    <PageTransition>
      <SEO
        title="Tech Training"
        description="Browse Our Courses. World-class training programs to launch your tech career. Sponsored opportunities available with a commitment fee."
      />

      <main className="flex flex-col">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-oxford-deep sticky top-0 z-10">
          <OrbitalBackground variant="hero" />

          {/* Geometric decorations */}
          <DotGrid className="top-12 left-8 text-skyblue/15" />
          <DotGrid className="bottom-16 right-12 text-orange/10" />
          <DiagonalLines className="top-0 right-0 text-skyblue/6" />
          <ConcentricCircles className="-bottom-40 -left-40 text-iceblue/8" />
          <CrossMark className="absolute top-[22%] right-[18%] text-orange/15" size={18} />
          <CrossMark className="absolute bottom-[30%] left-[12%] text-skyblue/12" size={14} />

          {/* Noise overlay */}
          <div
            className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />

          <Container className="relative z-10 text-center py-20">
            <Reveal direction="down" delay={0.1}>
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-oxford-border rounded-full px-6 py-2.5 mb-8">
                <motion.span
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <p className="text-sm text-iceblue font-medium tracking-widest uppercase">
                  Sponsored Tech Training
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-2">
                Browse Our
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-skyblue via-iceblue to-skyblue bg-clip-text text-transparent mb-8">
                Sponsored Courses
              </h1>
            </Reveal>

            <Reveal delay={0.6}>
              <AccentLine color="skyblue" thickness="medium" width="w-24" className="mx-auto mb-8" />
            </Reveal>

            <Reveal delay={0.7}>
              <p className="text-lg md:text-xl text-iceblue/70 max-w-3xl mx-auto leading-relaxed mb-10">
                World-class training programs to launch your tech career. All
                courses are largely sponsored with a small commitment fee.
                Choose a course and start your journey today!
              </p>
            </Reveal>

            <Reveal delay={0.9}>
              <MagneticButton strength={20}>
                <a
                  href="#courses"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-skyblue to-skyblue/80 text-white font-bold px-8 py-4 rounded-full text-lg hover:shadow-[0_0_40px_rgba(0,152,218,0.4)] transition-shadow duration-500 border border-skyblue/30"
                >
                  Explore Courses
                  <motion.span
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: [0.22, 0.6, 0.36, 1] }}
                  >
                    ↓
                  </motion.span>
                </a>
              </MagneticButton>
            </Reveal>
          </Container>

          <SectionConnector color="skyblue" side="center" />
        </section>

        {/* ═══════════════ MARQUEE DIVIDER ═══════════════ */}
        <section className="bg-oxford-deep py-5 border-y border-oxford-border sticky top-0 z-20 overflow-hidden">
          <MarqueeText
            text="TECH TRAINING — CAREER GROWTH — EXPERT MENTORS — SPONSORED PROGRAMS — INDUSTRY CERTIFICATES"
            speed={30}
            className="text-xl md:text-2xl font-black text-white/5 uppercase tracking-widest"
          />
        </section>

        {/* ═══════════════ COURSES SECTION ═══════════════ */}
        <section
          id="courses"
          className="relative py-20 md:py-32 bg-oxford-deep sticky top-0 z-30 overflow-hidden"
        >
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DiagonalLines className="bottom-0 left-0 text-orange/6" thick />
          <DotGrid className="top-12 right-8 text-skyblue/10" />
          <CrossMark className="absolute top-[10%] left-[8%] text-orange/12" size={16} />
          <CrossMark className="absolute bottom-[15%] right-[12%] text-skyblue/10" size={12} />

          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

          <Container className="relative z-10">
            {/* Section heading */}
            <Reveal>
              <div className="text-center mb-16">
                <AccentLine color="orange" thickness="thick" width="w-14" className="mx-auto mb-5" />
                <span className="inline-block text-sm font-bold tracking-widest uppercase text-skyblue mb-4">
                  Our Programs
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
                  Available{" "}
                  <span className="bg-gradient-to-r from-skyblue to-orange bg-clip-text text-transparent">
                    Courses
                  </span>
                </h2>
              </div>
            </Reveal>

            {/* Category Filter */}
            <AnimatePresence>
              {categories.length > 1 && (
                <Reveal delay={0.15}>
                  <div className="flex flex-wrap gap-3 justify-center mb-14">
                    {categories.map((category, i) => (
                      <MagneticButton key={category} strength={15}>
                        <motion.button
                          onClick={() => setFilterCategory(category)}
                          className={`relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-400 overflow-hidden ${
                            filterCategory === category
                              ? "bg-skyblue text-white shadow-lg shadow-skyblue/20"
                              : "bg-white/5 text-iceblue/70 hover:bg-white/10 border border-oxford-border"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, ...springSnappy }}
                        >
                          {filterCategory === category && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-skyblue to-oxford rounded-full"
                              layoutId="activeFilter"
                              transition={{
                                type: "spring" as const,
                                stiffness: 400,
                                damping: 30,
                              }}
                            />
                          )}
                          <span className="relative z-10">
                            {category === "all"
                              ? "All Courses"
                              : category.charAt(0).toUpperCase() +
                                category.slice(1)}
                          </span>
                        </motion.button>
                      </MagneticButton>
                    ))}
                  </div>
                </Reveal>
              )}
            </AnimatePresence>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <Reveal key={index} delay={index * 0.1}>
                    <CourseCardSkeleton />
                  </Reveal>
                ))}
              </div>
            )}

            {/* Error State */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ ease: [0.22, 0.6, 0.36, 1] }}
                  className="bg-red-500/10 border border-red-500/30 text-red-300 px-8 py-6 rounded-2xl max-w-2xl mx-auto backdrop-blur-sm"
                >
                  <p className="font-bold text-lg mb-1 text-red-200">Error</p>
                  <p className="text-red-300">{error}</p>
                  <MagneticButton strength={10}>
                    <button
                      onClick={fetchCourses}
                      className="mt-4 text-sm font-semibold underline underline-offset-4 hover:no-underline text-red-400 hover:text-red-200 transition-colors"
                    >
                      Try again
                    </button>
                  </MagneticButton>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            <AnimatePresence>
              {!loading && !error && filteredCourses.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ ease: [0.22, 0.6, 0.36, 1] }}
                  className="text-center py-16"
                >
                  <motion.div
                    className="text-7xl mb-6"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📚
                  </motion.div>
                  <p className="text-3xl font-black text-white mb-3">
                    No courses available
                  </p>
                  <p className="text-iceblue/70 text-lg max-w-md mx-auto">
                    {filterCategory !== "all"
                      ? "No courses found in this category. Try selecting a different category."
                      : "No courses are currently available. Please check back later!"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Courses Grid */}
            <AnimatePresence mode="wait">
              {!loading && !error && filteredCourses.length > 0 && (
                <motion.div
                  key={filterCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 0.6, 0.36, 1] }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course, index) => (
                      <Reveal key={course.id} delay={index * 0.08}>
                        <motion.div
                          whileHover={{ y: -6 }}
                          transition={springSnappy}
                        >
                          <CourseCard
                            course={course}
                            onClick={() => handleCourseClick(course)}
                          />
                        </motion.div>
                      </Reveal>
                    ))}
                  </div>

                  {/* Course Count */}
                  <Reveal delay={0.3}>
                    <p className="text-center text-iceblue/40 mt-10 text-sm font-medium tracking-wide">
                      Showing{" "}
                      <span className="text-white font-bold">
                        {filteredCourses.length}
                      </span>{" "}
                      course
                      {filteredCourses.length !== 1 ? "s" : ""}
                      {filterCategory !== "all" && (
                        <span>
                          {" "}
                          in{" "}
                          <span className="text-skyblue font-bold">
                            "{filterCategory}"
                          </span>
                        </span>
                      )}
                    </p>
                  </Reveal>
                </motion.div>
              )}
            </AnimatePresence>
          </Container>

          <SectionConnector color="orange" side="right" />
        </section>

        {/* ═══════════════ MARQUEE DIVIDER ═══════════════ */}
        <section className="bg-oxford-deep py-5 border-y border-oxford-border sticky top-0 z-40 overflow-hidden">
          <MarqueeText
            text="LEARN — BUILD — GROW — INNOVATE — SUCCEED — TRANSFORM"
            speed={25}
            className="text-2xl md:text-3xl font-black text-white/5 uppercase tracking-[0.3em]"
            reverse
          />
        </section>

        {/* ═══════════════ WHY CHOOSE SECTION ═══════════════ */}
        <section className="relative py-20 md:py-32 bg-oxford-deep sticky top-0 z-50 overflow-hidden">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="top-16 left-12 text-orange/10" />
          <DiagonalLines className="bottom-0 right-0 text-skyblue/6" />
          <ConcentricCircles className="-top-48 -right-48 text-skyblue/6" />
          <CrossMark className="absolute top-[20%] right-[22%] text-orange/15" size={18} />
          <CrossMark className="absolute bottom-[18%] left-[15%] text-skyblue/10" size={14} />

          <FloatingRule className="top-0 left-0 w-full" color="orange" dashed thick />

          <Container className="relative z-10">
            {/* Section heading */}
            <Reveal>
              <div className="text-center mb-16">
                <AccentLine color="orange" thickness="thick" width="w-16" className="mx-auto mb-5" />
                <span className="inline-block text-sm font-bold tracking-widest uppercase text-orange mb-4">
                  Why Us
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                  Why Choose{" "}
                  <span className="bg-gradient-to-r from-skyblue to-orange bg-clip-text text-transparent">
                    GR8QM
                  </span>{" "}
                  Training?
                </h2>
              </div>
            </Reveal>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Reveal
                  key={index}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.12}
                >
                  <div className="group relative bg-white/5 backdrop-blur-sm border border-oxford-border rounded-2xl p-8 text-center hover:bg-white/8 hover:border-skyblue/30 transition-all duration-500 h-full overflow-hidden">
                    {/* Noise overlay on card */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-[0.02] pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      }}
                    />

                    <motion.div
                      className="text-5xl mb-5"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{
                        type: "spring" as const,
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      {feature.icon}
                    </motion.div>

                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-skyblue transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-iceblue/70 text-sm mb-5 leading-relaxed">
                      {feature.desc}
                    </p>

                    {/* Animated stat */}
                    <div className="pt-4 border-t border-oxford-border">
                      <AnimatedCounter
                        target={feature.stat}
                        suffix={feature.statSuffix}
                        className="text-3xl font-black bg-gradient-to-r from-skyblue to-iceblue bg-clip-text text-transparent"
                      />
                      <p className="text-xs text-iceblue/40 font-medium mt-1 tracking-wide uppercase">
                        {feature.statLabel}
                      </p>
                    </div>

                    {/* Hover line at bottom */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-skyblue to-orange rounded-b-2xl"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 0.6, 0.36, 1] }}
                      style={{ originX: 0 }}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>

          <SectionConnector color="skyblue" side="left" />
        </section>

        {/* ═══════════════ BOTTOM CTA MARQUEE (last section — relative) ═══════════════ */}
        <section className="relative bg-oxford-deep py-6 border-t border-oxford-border z-[60] overflow-hidden">
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed thick />
          <DotGrid className="top-0 left-4 text-skyblue/8" />

          <MarqueeText
            text="START YOUR TECH JOURNEY TODAY — APPLY NOW — TRANSFORM YOUR CAREER"
            speed={20}
            className="text-xl md:text-2xl font-black text-white/5 uppercase tracking-widest"
          />
        </section>

        {/* ── Course Detail Modal ── */}
        {selectedCourse && (
          <CourseModal
            open={courseModalOpen}
            onClose={handleCloseModals}
            course={selectedCourse}
            onApply={handleApplyClick}
          />
        )}

        {/* ── Application Form Modal ── */}
        {selectedCourse && (
          <Modal open={applicationModalOpen} onClose={handleCloseModals}>
            <CourseApplicationForm
              course={selectedCourse}
              onClose={handleCloseModals}
            />
          </Modal>
        )}
      </main>
    </PageTransition>
  );
};

export default TrainingsPage;
