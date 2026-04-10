import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import CourseCard from "../components/services/CourseCard";
import CourseModal from "../components/services/CourseModal";
import CourseApplicationForm from "../components/services/CourseApplicationForm";
import Modal from "../components/layout/Modal";
import CourseCardSkeleton from "../components/common/CourseCardSkeleton";
import { SEO } from "../components/common/SEO";
import { supabase } from "../utils/supabase";

import MagneticButton from "../components/animations/MagneticButton";
import { Button } from "devign";
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

/* ── style helpers ── */
const radialSpot = (color: string, y = "50%") =>
  `radial-gradient(ellipse 60% 50% at 50% ${y}, ${color}, transparent)`;

/* ══════════════════════════════════════════════════════════════
   TRAININGS PAGE — premium dark scroll-driven design
   ══════════════════════════════════════════════════════════════ */
const TrainingsPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  /* ── refs ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  /* ── hero: scroll-driven parallax ── */
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -180]);
  const heroOpacity = useTransform(heroProgress, [0, 0.65], [1, 0]);

  // staggered hero elements
  const heroBadgeY = useTransform(heroProgress, [0.0, 0.25], [0, -40]);
  const heroBadgeO = useTransform(heroProgress, [0.0, 0.15], [1, 1]);
  const heroH1aY = useTransform(heroProgress, [0.0, 0.3], [0, -60]);
  const heroH1bY = useTransform(heroProgress, [0.0, 0.35], [0, -80]);
  const heroParaY = useTransform(heroProgress, [0.0, 0.4], [0, -100]);
  const heroBtnY = useTransform(heroProgress, [0.0, 0.45], [0, -120]);

  // hero entrance stagger (scroll-driven fade-in)
  const heroBadgeEnterO = useTransform(heroProgress, [0.0, 0.08], [0, 1]);
  const heroH1aEnterO = useTransform(heroProgress, [0.04, 0.12], [0, 1]);
  const heroH1aEnterY = useTransform(heroProgress, [0.04, 0.12], [40, 0]);
  const heroH1bEnterO = useTransform(heroProgress, [0.08, 0.16], [0, 1]);
  const heroH1bEnterY = useTransform(heroProgress, [0.08, 0.16], [40, 0]);
  const heroLineEnterO = useTransform(heroProgress, [0.12, 0.20], [0, 1]);
  const heroParaEnterO = useTransform(heroProgress, [0.14, 0.22], [0, 1]);
  const heroParaEnterY = useTransform(heroProgress, [0.14, 0.22], [30, 0]);
  const heroBtnEnterO = useTransform(heroProgress, [0.18, 0.26], [0, 1]);
  const heroBtnEnterY = useTransform(heroProgress, [0.18, 0.26], [30, 0]);

  /* ── why choose: scroll-driven per-card transforms ── */
  const { scrollYProgress: whyProgress } = useScroll({
    target: whyRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });

  // title stays visible until cards finish entering, then fades
  const whyTitleY = useTransform(whyProgress, [0.65, 0.82], [0, -60]);
  const whyTitleScale = useTransform(whyProgress, [0.65, 0.82], [1, 0.85]);
  const whyTitleOpacity = useTransform(whyProgress, [0.0, 0.12, 0.65, 0.82], [0, 1, 1, 0]);

  // background vector rotates with scroll
  const whyVecRotate = useTransform(whyProgress, [0, 1], [0, 20]);

  // staggered per-card transforms
  const w0y = useTransform(whyProgress, [0.08, 0.30], [120, 0]);
  const w0o = useTransform(whyProgress, [0.08, 0.22], [0, 1]);
  const w1y = useTransform(whyProgress, [0.16, 0.38], [120, 0]);
  const w1o = useTransform(whyProgress, [0.16, 0.30], [0, 1]);
  const w2y = useTransform(whyProgress, [0.24, 0.46], [120, 0]);
  const w2o = useTransform(whyProgress, [0.24, 0.38], [0, 1]);
  const w3y = useTransform(whyProgress, [0.32, 0.54], [120, 0]);
  const w3o = useTransform(whyProgress, [0.32, 0.46], [0, 1]);

  const whyCardStyles = [
    { y: w0y, opacity: w0o },
    { y: w1y, opacity: w1o },
    { y: w2y, opacity: w2o },
    { y: w3y, opacity: w3o },
  ];

  /* ── CTA: scroll-driven staggered transforms ── */
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const ctaMarqueeO = useTransform(ctaProgress, [0.05, 0.25], [0, 1]);
  const ctaMarqueeY = useTransform(ctaProgress, [0.05, 0.25], [30, 0]);

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
        {/* ═══════════════ HERO (scroll-driven) ═══════════════ */}
        <div ref={heroRef} className="relative z-10" style={{ height: "300vh" }}>
          <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-oxford-deep">
            {/* Animated atmospheric orbs */}
            <motion.div
              animate={{ x: [0, 120, -80, 60, 0], y: [0, -90, 70, -40, 0], scale: [1, 1.25, 0.85, 1.15, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] -left-20 w-[600px] h-[600px] rounded-full bg-skyblue/[0.15] blur-[140px]"
            />
            <motion.div
              animate={{ x: [0, -100, 60, -120, 0], y: [0, 80, -60, 40, 0], scale: [1, 0.9, 1.2, 0.95, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[15%] -right-20 w-[500px] h-[500px] rounded-full bg-orange/[0.12] blur-[140px]"
            />

            {/* Geometric SVGs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
              <circle cx="15%" cy="20%" r="120" stroke="white" fill="none" strokeWidth="0.5"/>
              <circle cx="85%" cy="80%" r="80" stroke="white" fill="none" strokeWidth="0.3"/>
              <line x1="70%" y1="0" x2="70%" y2="100%" stroke="white" strokeWidth="0.3"/>
              <line x1="0" y1="85%" x2="100%" y2="85%" stroke="white" strokeWidth="0.3"/>
            </svg>

            {/* Noise overlay */}
            <div
              className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />

            <motion.div
              style={{ y: heroTextY, opacity: heroOpacity }}
              className="relative z-10 w-full"
            >
              <Container className="text-center py-20">
                {/* Badge */}
                <motion.div style={{ y: heroBadgeY, opacity: heroBadgeEnterO }}>
                  <div className="inline-flex items-center gap-2 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-full px-6 py-2.5 mb-8">
                    <motion.span
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                      Sponsored Tech Training
                    </p>
                  </div>
                </motion.div>

                {/* Heading line 1 */}
                <motion.div style={{ y: heroH1aEnterY, opacity: heroH1aEnterO }}>
                  <motion.h1
                    style={{ y: heroH1aY }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-2"
                  >
                    Browse Our
                  </motion.h1>
                </motion.div>

                {/* Heading line 2 */}
                <motion.div style={{ y: heroH1bEnterY, opacity: heroH1bEnterO }}>
                  <motion.h1
                    style={{ y: heroH1bY }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-skyblue via-iceblue to-skyblue bg-clip-text text-transparent mb-8"
                  >
                    Sponsored Courses
                  </motion.h1>
                </motion.div>

                {/* Accent line */}
                <motion.div style={{ opacity: heroLineEnterO }}>
                  <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-skyblue to-transparent mx-auto mb-8" />
                </motion.div>

                {/* Paragraph */}
                <motion.div style={{ y: heroParaEnterY, opacity: heroParaEnterO }}>
                  <motion.p
                    style={{ y: heroParaY }}
                    className="text-lg md:text-xl text-iceblue/70 max-w-3xl mx-auto leading-relaxed mb-10"
                  >
                    World-class training programs to launch your tech career. All
                    courses are largely sponsored with a small commitment fee.
                    Choose a course and start your journey today!
                  </motion.p>
                </motion.div>

                {/* CTA button */}
                <motion.div style={{ y: heroBtnEnterY, opacity: heroBtnEnterO }}>
                  <motion.div style={{ y: heroBtnY }}>
                    <MagneticButton strength={20}>
                      <Button variant="primary" size="lg" onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })} rightIcon={<motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: [0.22, 0.6, 0.36, 1] }}>&#8595;</motion.span>}>
                        Explore Courses
                      </Button>
                    </MagneticButton>
                  </motion.div>
                </motion.div>
              </Container>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
              style={{ opacity: heroOpacity }}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/20">
                Scroll
              </span>
              <motion.div
                className="w-px h-14 bg-gradient-to-b from-white/20 to-transparent"
                animate={{ scaleY: [1, 0.4, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
              />
            </motion.div>
          </div>
        </div>

        {/* ═══════════════ MARQUEE DIVIDER ═══════════════ */}
        <div className="sticky top-0 z-20 bg-oxford-deep py-5 border-y border-white/[0.08] overflow-hidden">
          <MarqueeText
            text="TECH TRAINING — CAREER GROWTH — EXPERT MENTORS — SPONSORED PROGRAMS — INDUSTRY CERTIFICATES"
            speed={30}
            className="text-xl md:text-2xl font-black text-white/5 uppercase tracking-widest"
          />
        </div>

        {/* ═══════════════ COURSES SECTION (dynamic content — kept as scrollable with whileInView) ═══════════════ */}
        <section
          id="courses"
          className="relative min-h-screen flex flex-col justify-center bg-oxford-card z-30 overflow-hidden"
        >
          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, 120, -80, 60, 0], y: [0, -90, 70, -40, 0], scale: [1, 1.25, 0.85, 1.15, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -left-20 w-[600px] h-[600px] rounded-full bg-skyblue/[0.15] blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, -100, 60, -120, 0], y: [0, 80, -60, 40, 0], scale: [1, 0.9, 1.2, 0.95, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] -right-20 w-[500px] h-[500px] rounded-full bg-orange/[0.12] blur-[140px]"
          />

          {/* Geometric SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
            <circle cx="85%" cy="10%" r="100" stroke="white" fill="none" strokeWidth="0.5"/>
            <circle cx="10%" cy="85%" r="60" stroke="white" fill="none" strokeWidth="0.3"/>
            <line x1="30%" y1="0" x2="30%" y2="100%" stroke="white" strokeWidth="0.3"/>
            <line x1="0" y1="20%" x2="100%" y2="20%" stroke="white" strokeWidth="0.3"/>
          </svg>

          <Container className="relative z-10 py-20 md:py-32">
            {/* Section heading */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.22, 0.6, 0.36, 1] }}
            >
              <div className="text-center mb-16">
                <div className="w-14 h-[3px] bg-gradient-to-r from-transparent via-orange to-transparent mx-auto mb-5" />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 inline-block mb-4">
                  Our Programs
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
                  Available{" "}
                  <span className="bg-gradient-to-r from-skyblue to-orange bg-clip-text text-transparent">
                    Courses
                  </span>
                </h2>
              </div>
            </motion.div>

            {/* Category Filter */}
            <AnimatePresence>
              {categories.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 0.6, 0.36, 1] }}
                >
                  <div className="flex flex-wrap gap-3 justify-center mb-14">
                    {categories.map((category, i) => (
                      <MagneticButton key={category} strength={15}>
                        <motion.button
                          onClick={() => setFilterCategory(category)}
                          className={`relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-400 overflow-hidden ${
                            filterCategory === category
                              ? "bg-skyblue text-white shadow-lg shadow-skyblue/20"
                              : "bg-white/[0.03] text-iceblue/70 hover:bg-white/[0.06] border border-white/[0.08]"
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 0.6, 0.36, 1] }}
                  >
                    <CourseCardSkeleton />
                  </motion.div>
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
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 0.6, 0.36, 1] }}
                      >
                        <motion.div
                          whileHover={{ y: -6 }}
                          transition={springSnappy}
                        >
                          <CourseCard
                            course={course}
                            onClick={() => handleCourseClick(course)}
                          />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Course Count */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center text-iceblue/40 mt-10 text-sm font-medium tracking-wide"
                  >
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
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
        </section>

        {/* ═══════════════ MARQUEE DIVIDER ═══════════════ */}
        <div className="sticky top-0 z-40 bg-oxford-deep py-5 border-y border-white/[0.08] overflow-hidden">
          <MarqueeText
            text="LEARN — BUILD — GROW — INNOVATE — SUCCEED — TRANSFORM"
            speed={25}
            className="text-2xl md:text-3xl font-black text-white/5 uppercase tracking-[0.3em]"
            reverse
          />
        </div>

        {/* ═══════════════ WHY CHOOSE SECTION (scroll-driven) ═══════════════ */}
        <div ref={whyRef} className="relative z-50" style={{ height: "400vh" }}>
          <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-oxford-deep">
            {/* Atmospheric orbs */}
            <motion.div
              animate={{ x: [0, 120, -80, 60, 0], y: [0, -90, 70, -40, 0], scale: [1, 1.25, 0.85, 1.15, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] -left-20 w-[600px] h-[600px] rounded-full bg-skyblue/[0.15] blur-[140px] pointer-events-none"
            />
            <motion.div
              animate={{ x: [0, -100, 60, -120, 0], y: [0, 80, -60, 40, 0], scale: [1, 0.9, 1.2, 0.95, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[15%] -right-20 w-[500px] h-[500px] rounded-full bg-orange/[0.12] blur-[140px] pointer-events-none"
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: radialSpot("rgba(0,152,218,0.04)") }}
            />

            {/* Geometric SVGs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
              <circle cx="15%" cy="25%" r="100" stroke="white" fill="none" strokeWidth="0.5"/>
              <circle cx="80%" cy="70%" r="70" stroke="white" fill="none" strokeWidth="0.3"/>
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="0.3"/>
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="0.3"/>
            </svg>

            {/* Geometric vector — rotates with scroll */}
            <motion.svg
              style={{ rotate: whyVecRotate }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
              viewBox="0 0 800 800"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="400" cy="400" r="380" stroke="#0098da" strokeWidth="0.5" opacity="0.04" />
              <circle cx="400" cy="400" r="280" stroke="#0098da" strokeWidth="0.3" opacity="0.03" />
              <line x1="400" y1="0" x2="400" y2="800" stroke="#0098da" strokeWidth="0.3" opacity="0.02" />
              <line x1="0" y1="400" x2="800" y2="400" stroke="#0098da" strokeWidth="0.3" opacity="0.02" />
            </motion.svg>

            {/* Title — scroll-driven entrance + exit */}
            <motion.div
              style={{ y: whyTitleY, scale: whyTitleScale, opacity: whyTitleOpacity }}
              className="relative z-10 mb-8 md:mb-14"
            >
              <Container>
                <div className="text-center">
                  <div className="w-16 h-[3px] bg-gradient-to-r from-transparent via-orange to-transparent mx-auto mb-5" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 inline-block mb-4">
                    Why Us
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-[-0.045em] leading-[0.88] mb-4">
                    Why Choose{" "}
                    <span className="text-skyblue">GR8QM</span>{" "}
                    Training?
                  </h2>
                </div>
              </Container>
            </motion.div>

            {/* Features grid — scroll-driven per-card */}
            <div className="relative z-10">
              <Container>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      style={whyCardStyles[index]}
                    >
                      <div className="group relative bg-white/[0.03] border border-white/[0.08] hover:border-skyblue/20 rounded-2xl p-5 md:p-7 lg:p-8 text-center transition-colors duration-500 h-full overflow-hidden">
                        {/* Noise overlay on card */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-[0.02] pointer-events-none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                          }}
                        />

                        {/* Hover glow */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-skyblue/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <motion.div
                          className="text-4xl md:text-5xl mb-4 md:mb-5 relative z-10"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{
                            type: "spring" as const,
                            stiffness: 300,
                            damping: 15,
                          }}
                        >
                          {feature.icon}
                        </motion.div>

                        <h3 className="text-lg md:text-xl font-black text-white mb-2 group-hover:text-skyblue transition-colors duration-300 relative z-10">
                          {feature.title}
                        </h3>

                        <p className="text-iceblue/70 text-xs md:text-sm mb-4 md:mb-5 leading-relaxed relative z-10">
                          {feature.desc}
                        </p>

                        {/* Animated stat */}
                        <div className="pt-3 md:pt-4 border-t border-white/[0.06] relative z-10">
                          <AnimatedCounter
                            target={feature.stat}
                            suffix={feature.statSuffix}
                            className="text-2xl md:text-3xl font-black bg-gradient-to-r from-skyblue to-iceblue bg-clip-text text-transparent"
                          />
                          <p className="text-[10px] md:text-xs text-iceblue/40 font-medium mt-1 tracking-wide uppercase">
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
                    </motion.div>
                  ))}
                </div>
              </Container>
            </div>
          </div>
        </div>

        {/* ═══════════════ BOTTOM CTA MARQUEE (scroll-driven) ═══════════════ */}
        <div ref={ctaRef} className="relative z-[60]" style={{ height: "200vh" }}>
          <div className="sticky top-0 h-screen flex items-center bg-oxford-deep overflow-hidden">
            {/* Geometric SVGs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
              <circle cx="20%" cy="30%" r="80" stroke="white" fill="none" strokeWidth="0.5"/>
              <line x1="60%" y1="0" x2="60%" y2="100%" stroke="white" strokeWidth="0.3"/>
            </svg>

            {/* Atmospheric orb */}
            <motion.div
              animate={{ x: [0, 120, -80, 60, 0], y: [0, -90, 70, -40, 0], scale: [1, 1.25, 0.85, 1.15, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[30%] left-[10%] w-[400px] h-[400px] rounded-full bg-skyblue/[0.07] blur-[130px] pointer-events-none"
            />

            <Container className="relative z-10 w-full">
              <motion.div style={{ y: ctaMarqueeY, opacity: ctaMarqueeO }}>
                <MarqueeText
                  text="START YOUR TECH JOURNEY TODAY — APPLY NOW — TRANSFORM YOUR CAREER"
                  speed={20}
                  className="text-xl md:text-2xl font-black text-white/5 uppercase tracking-widest"
                />
              </motion.div>

              <motion.div
                style={{ opacity: ctaMarqueeO }}
                className="text-center mt-12"
              >
                <MagneticButton strength={20}>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    View All Courses
                  </Button>
                </MagneticButton>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/15 mt-8">
                  Rooted in faith · Driven by excellence
                </p>
              </motion.div>
            </Container>
          </div>
        </div>

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
