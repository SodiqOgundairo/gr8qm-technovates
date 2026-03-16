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

import RevealOnScroll from "../components/animations/RevealOnScroll";
import SplitText from "../components/animations/SplitText";
import Scene3D from "../components/animations/Scene3D";
import MarqueeText from "../components/animations/MarqueeText";
import MagneticButton from "../components/animations/MagneticButton";
import GlowCard from "../components/animations/GlowCard";
import AnimatedCounter from "../components/animations/AnimatedCounter";

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

const features = [
  {
    icon: "🎓",
    title: "Sponsored",
    desc: "Only a commitment fee required",
    color: "rgba(0, 152, 218, 0.15)",
    stat: 95,
    statSuffix: "%",
    statLabel: "Sponsored",
  },
  {
    icon: "👨‍💼",
    title: "Expert Instructors",
    desc: "Learn from industry professionals",
    color: "rgba(245, 134, 52, 0.15)",
    stat: 50,
    statSuffix: "+",
    statLabel: "Experts",
  },
  {
    icon: "💼",
    title: "Job Support",
    desc: "Career guidance and placement assistance",
    color: "rgba(5, 35, 90, 0.15)",
    stat: 80,
    statSuffix: "%",
    statLabel: "Placed",
  },
  {
    icon: "🏆",
    title: "Certificates",
    desc: "Earn recognized certificates upon completion",
    color: "rgba(0, 152, 218, 0.15)",
    stat: 100,
    statSuffix: "%",
    statLabel: "Certified",
  },
];

const TrainingsPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Fetch courses from Supabase
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

  // Filter courses by category
  const filteredCourses =
    filterCategory === "all"
      ? courses
      : courses.filter((course) => course.category === filterCategory);

  // Get unique categories
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
      <main className="flex flex-col overflow-hidden">
        {/* ── Hero Section ── */}
        <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-oxford via-oxford/95 to-dark">
          {/* Scene3D background */}
          <Scene3D variant="hero" />

          {/* Noise overlay */}
          <div
            className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Floating orbs */}
          <motion.div
            className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-skyblue/10 blur-3xl z-[1]"
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[20%] right-[8%] w-80 h-80 rounded-full bg-orange/10 blur-3xl z-[1]"
            animate={{
              y: [0, 25, 0],
              x: [0, -20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[55%] left-[50%] w-48 h-48 rounded-full bg-iceblue/8 blur-3xl z-[1]"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Hero content */}
          <Container className="relative z-10 text-center py-20">
            <RevealOnScroll direction="scale" delay={0.1}>
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-2.5 mb-8">
                <motion.span
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <p className="text-sm text-iceblue font-medium tracking-widest uppercase">
                  Sponsored Tech Training
                </p>
              </div>
            </RevealOnScroll>

            <div className="mb-8">
              <SplitText
                as="h1"
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white"
                type="words"
                delay={0.2}
                stagger={0.08}
              >
                Browse Our
              </SplitText>
              <br />
              <SplitText
                as="h1"
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-skyblue via-iceblue to-skyblue bg-clip-text text-transparent"
                type="words"
                delay={0.5}
                stagger={0.08}
              >
                Sponsored Courses
              </SplitText>
            </div>

            <RevealOnScroll direction="up" delay={0.8}>
              <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-10">
                World-class training programs to launch your tech career. All
                courses are largely sponsored with a small commitment fee.
                Choose a course and start your journey today!
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={1}>
              <MagneticButton strength={20}>
                <a
                  href="#courses"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-skyblue to-skyblue/80 text-white font-bold px-8 py-4 rounded-full text-lg hover:shadow-[0_0_40px_rgba(0,152,218,0.4)] transition-shadow duration-500"
                >
                  Explore Courses
                  <motion.span
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ↓
                  </motion.span>
                </a>
              </MagneticButton>
            </RevealOnScroll>
          </Container>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-[2]" />
        </section>

        {/* ── Marquee divider ── */}
        <div className="bg-white py-5 border-b border-gray-100">
          <MarqueeText
            text="TECH TRAINING — CAREER GROWTH — EXPERT MENTORS — SPONSORED PROGRAMS — INDUSTRY CERTIFICATES"
            speed={30}
            className="text-xl md:text-2xl font-black text-oxford/5 uppercase tracking-widest"
          />
        </div>

        {/* ── Courses Section ── */}
        <section id="courses" className="relative py-20 md:py-32 bg-white">
          {/* Subtle background Scene3D */}
          <Scene3D variant="minimal" className="opacity-30" />

          <Container className="relative z-10">
            {/* Section heading */}
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <span className="inline-block text-sm font-bold tracking-widest uppercase text-skyblue mb-4">
                  Our Programs
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-oxford">
                  Available{" "}
                  <span className="bg-gradient-to-r from-skyblue to-orange bg-clip-text text-transparent">
                    Courses
                  </span>
                </h2>
              </div>
            </RevealOnScroll>

            {/* Category Filter */}
            <AnimatePresence>
              {categories.length > 1 && (
                <RevealOnScroll direction="up" delay={0.15}>
                  <div className="flex flex-wrap gap-3 justify-center mb-14">
                    {categories.map((category, i) => (
                      <MagneticButton key={category} strength={15}>
                        <motion.button
                          onClick={() => setFilterCategory(category)}
                          className={`relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-400 overflow-hidden ${
                            filterCategory === category
                              ? "bg-oxford text-white shadow-lg shadow-oxford/20"
                              : "bg-light text-oxford hover:bg-iceblue/50 border border-gray-200"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          {filterCategory === category && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-skyblue to-oxford rounded-full"
                              layoutId="activeFilter"
                              transition={{
                                type: "spring",
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
                </RevealOnScroll>
              )}
            </AnimatePresence>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <RevealOnScroll
                    key={index}
                    direction="up"
                    delay={index * 0.1}
                  >
                    <CourseCardSkeleton />
                  </RevealOnScroll>
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
                  className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-2xl max-w-2xl mx-auto backdrop-blur-sm"
                >
                  <p className="font-bold text-lg mb-1">Error</p>
                  <p className="text-red-600">{error}</p>
                  <MagneticButton strength={10}>
                    <button
                      onClick={fetchCourses}
                      className="mt-4 text-sm font-semibold underline underline-offset-4 hover:no-underline text-red-500 hover:text-red-700 transition-colors"
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
                  className="text-center py-16"
                >
                  <motion.div
                    className="text-7xl mb-6"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📚
                  </motion.div>
                  <p className="text-3xl font-black text-oxford mb-3">
                    No courses available
                  </p>
                  <p className="text-gray-500 text-lg max-w-md mx-auto">
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
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course, index) => (
                      <RevealOnScroll
                        key={course.id}
                        direction="up"
                        delay={index * 0.08}
                      >
                        <motion.div
                          whileHover={{ y: -6 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <CourseCard
                            course={course}
                            onClick={() => handleCourseClick(course)}
                          />
                        </motion.div>
                      </RevealOnScroll>
                    ))}
                  </div>

                  {/* Course Count */}
                  <RevealOnScroll direction="up" delay={0.3}>
                    <p className="text-center text-gray-400 mt-10 text-sm font-medium tracking-wide">
                      Showing{" "}
                      <span className="text-oxford font-bold">
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
                  </RevealOnScroll>
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
        </section>

        {/* ── Marquee divider ── */}
        <div className="bg-oxford py-5">
          <MarqueeText
            text="LEARN — BUILD — GROW — INNOVATE — SUCCEED — TRANSFORM"
            speed={25}
            className="text-2xl md:text-3xl font-black text-white/5 uppercase tracking-[0.3em]"
            reverse
          />
        </div>

        {/* ── Why Choose GR8QM Training Section ── */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-light to-white overflow-hidden">
          {/* Background floating orbs */}
          <motion.div
            className="absolute top-[20%] right-[5%] w-72 h-72 rounded-full bg-skyblue/5 blur-3xl"
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[5%] w-56 h-56 rounded-full bg-orange/5 blur-3xl"
            animate={{ y: [0, 15, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container className="relative z-10">
            {/* Section heading */}
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <span className="inline-block text-sm font-bold tracking-widest uppercase text-orange mb-4">
                  Why Us
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-oxford mb-4">
                  Why Choose{" "}
                  <span className="bg-gradient-to-r from-skyblue to-orange bg-clip-text text-transparent">
                    GR8QM
                  </span>{" "}
                  Training?
                </h2>
              </div>
            </RevealOnScroll>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <RevealOnScroll
                  key={index}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.12}
                >
                  <GlowCard
                    glowColor={feature.color}
                    className="group h-full"
                  >
                    <div className="relative bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:border-skyblue/20 transition-all duration-500 h-full">
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
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        {feature.icon}
                      </motion.div>

                      <h3 className="text-xl font-black text-oxford mb-2 group-hover:text-skyblue transition-colors duration-300">
                        {feature.title}
                      </h3>

                      <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                        {feature.desc}
                      </p>

                      {/* Animated stat */}
                      <div className="pt-4 border-t border-gray-100">
                        <AnimatedCounter
                          target={feature.stat}
                          suffix={feature.statSuffix}
                          className="text-3xl font-black bg-gradient-to-r from-skyblue to-oxford bg-clip-text text-transparent"
                        />
                        <p className="text-xs text-gray-400 font-medium mt-1 tracking-wide uppercase">
                          {feature.statLabel}
                        </p>
                      </div>

                      {/* Hover line at bottom */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-skyblue to-orange rounded-b-2xl"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        style={{ originX: 0 }}
                      />
                    </div>
                  </GlowCard>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Bottom CTA Marquee ── */}
        <div className="bg-gradient-to-r from-skyblue to-oxford py-6">
          <MarqueeText
            text="START YOUR TECH JOURNEY TODAY — APPLY NOW — TRANSFORM YOUR CAREER"
            speed={20}
            className="text-xl md:text-2xl font-black text-white/20 uppercase tracking-widest"
          />
        </div>

        {/* Course Detail Modal */}
        {selectedCourse && (
          <CourseModal
            open={courseModalOpen}
            onClose={handleCloseModals}
            course={selectedCourse}
            onApply={handleApplyClick}
          />
        )}

        {/* Application Form Modal */}
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
