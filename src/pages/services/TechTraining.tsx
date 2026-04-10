import React from "react";
import Container from "../../components/layout/Container";
import { Button } from "devign";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { ArrowRightIcon, GraduationCapIcon } from "../../components/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import PageTransition from "../../components/layout/PageTransition";
import { SEO } from "../../components/common/SEO";
import { getPageSEO } from "../../utils/seo-config";
import {
  generateFAQSchema,
  generateEducationalOrganizationSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";

import MagneticButton from "../../components/animations/MagneticButton";

const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];

const TechTrainingNewPage: React.FC = () => {
  const navigate = useNavigate();
  const pageSEO = getPageSEO("techTraining");

  const courses = [
    {
      title: "Product Design",
      description:
        "Master UI/UX design principles and create stunning interfaces",
      icon: "🎨",
      duration: "12 weeks",
    },
    {
      title: "Product Management",
      description: "Learn to build and manage successful digital products",
      icon: "📊",
      duration: "10 weeks",
    },
    {
      title: "Frontend Development",
      description:
        "Build modern, responsive web applications with React & Next.js",
      icon: "💻",
      duration: "16 weeks",
    },
    {
      title: "Backend Development",
      description: "Create robust server-side applications and APIs",
      icon: "⚙️",
      duration: "16 weeks",
    },
    {
      title: "DevOps Engineering",
      description: "Master cloud infrastructure and deployment workflows",
      icon: "☁️",
      duration: "14 weeks",
    },
    {
      title: "Cybersecurity",
      description: "Protect systems and data from digital threats",
      icon: "🔒",
      duration: "12 weeks",
    },
  ];

  const benefits = [
    {
      icon: "🎓",
      description:
        "World-class education. You only pay a commitment fee to secure your spot.",
    },
    {
      icon: "👨‍💼",
      title: "Industry Experts",
      description:
        "Learn from professionals with years of real-world experience.",
    },
    {
      icon: "🤝",
      title: "Job Placement Support",
      description:
        "We help you land your first tech role with career guidance.",
    },
    {
      icon: "💡",
      title: "Hands-on Projects",
      description:
        "Build a portfolio of real projects that showcase your skills.",
    },
  ];

  const faqs = [
    {
      question: "Is the training sponsored?",
      answer:
        "Yes! The training is fully sponsored. The commitment fee ensures serious learners and secures your place in the cohort.",
    },
    {
      question: "What is the commitment fee for?",
      answer:
        "The commitment fee demonstrates your dedication. It allows us to prioritize applicants who are ready to complete the rigorous curriculum.",
    },
    {
      question: "What happens if I miss a class?",
      answer:
        "All sessions are recorded, so you can catch up. However, active participation is key to mastering the material.",
    },
    {
      question: "Do I need prior experience?",
      answer:
        "Most courses are beginner-friendly, though some may have prerequisites. Check individual course details for requirements.",
    },
  ];

  // Generate structured data
  const faqSchema = generateFAQSchema(faqs);
  const eduOrgSchema = generateEducationalOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
    { name: "Services", url: "https://gr8qm.com/services" },
    { name: "Tech Training", url: "https://gr8qm.com/services/tech-training" },
  ]);

  return (
    <PageTransition>
      <SEO
        title={pageSEO.title}
        description={pageSEO.description}
        keywords={pageSEO.keywords}
        type={pageSEO.type}
        url="/services/tech-training"
        structuredData={[faqSchema, eduOrgSchema, breadcrumbSchema]}
      />
      <main className="flex flex-col overflow-x-hidden">

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-oxford-deep sticky top-0 z-10">
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
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke="white" strokeWidth="0.3"/>
            <circle cx="85%" cy="75%" r="80" stroke="white" fill="none" strokeWidth="0.3"/>
          </svg>

          {/* Floating geometric shapes */}
          <motion.div
            className="absolute top-[22%] right-[10%] w-24 h-24 border border-skyblue/10 rounded-full"
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute bottom-[25%] left-[8%] w-16 h-16 border border-orange/10 rotate-45"
            animate={{ rotate: [45, 90, 45], opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />

          <Container className="relative z-10 flex flex-col md:flex-row items-center gap-12 py-16 md:py-28 lg:py-36">
            <div className="flex-1 flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
                <motion.div
                  className="bg-skyblue/10 rounded-full px-4 py-2 w-fit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                    Tech Training
                  </p>
                </motion.div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.15, ease: EASE_SMOOTH }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="text-white">Launch Your Tech Career,</span>{" "}
                  <span className="text-skyblue">Sponsored</span>
                </h1>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.3, ease: EASE_SMOOTH }}>
                <p className="text-lg md:text-xl text-white/40 leading-relaxed">
                  Master in-demand tech skills with our specialized training
                  programs. Learn from industry experts, build real projects,
                  and start your journey to a rewarding tech career. Only a
                  small commitment fee required.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.45, ease: EASE_SMOOTH }}>
                <div className="flex gap-4 flex-wrap">
                  <MagneticButton>
                    <Button variant="primary" size="lg" onClick={() => navigate("/trainings")} rightIcon={<ArrowRightIcon size={20} />}>
                      Browse Courses
                    </Button>
                  </MagneticButton>
                  <button
                    onClick={() => navigate("/portfolio?category=tech-training")}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full overflow-hidden border border-white/[0.08] text-white hover:border-skyblue/20 transition-all duration-300"
                  >
                    <span className="relative z-10">Student Success Stories</span>
                    <span className="relative z-10 text-skyblue transition-transform duration-300 group-hover:translate-x-1">→</span>
                    <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                  </button>
                </div>
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.6, ease: EASE_SMOOTH }}>
                <div className="overflow-hidden rounded-2xl">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <CloudinaryImage
                      imageKey="TrainingImage"
                      className="rounded-2xl"
                      alt="Tech Training"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ═══════════════ WHY SPONSORED SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center bg-oxford-card sticky top-0 z-20 overflow-hidden">
          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, -80, 100, -60, 0], y: [0, 60, -80, 50, 0], scale: [1, 1.15, 0.9, 1.1, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] -right-20 w-[500px] h-[500px] rounded-full bg-orange/[0.12] blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, 90, -70, 50, 0], y: [0, -70, 60, -30, 0], scale: [1, 0.85, 1.2, 0.95, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] -left-20 w-[400px] h-[400px] rounded-full bg-skyblue/[0.1] blur-[140px]"
          />

          {/* Geometric SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
            <circle cx="80%" cy="30%" r="100" stroke="white" fill="none" strokeWidth="0.5"/>
            <line x1="20%" y1="0" x2="20%" y2="100%" stroke="white" strokeWidth="0.3"/>
          </svg>

          <Container className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-4">Sponsored Training</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Launch Your Tech Career with <br />
                  <span className="text-skyblue">Sponsored Training</span>
                </h2>
                <p className="text-base text-white/40 max-w-[612px] mx-auto mt-3">
                  We believe financial barriers shouldn't stop talent. Start
                  your journey to a rewarding tech career. Only a small
                  commitment fee required.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.2, ease: EASE_SMOOTH }}>
              <motion.div
                className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 max-w-2xl mx-auto hover:border-skyblue/20"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    whileTap={{ rotate: -10, scale: 0.9 }}
                  >
                    💡
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Commitment Fee Policy
                    </h3>
                    <p className="text-white/40">
                      Pay a one-time commitment fee when you enroll. This
                      secures your spot and ensures serious participation in the
                      cohort. It's that simple.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* ═══════════════ AVAILABLE COURSES SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center bg-oxford-deep sticky top-0 z-30 overflow-hidden">
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
            <line x1="30%" y1="0" x2="30%" y2="100%" stroke="white" strokeWidth="0.3"/>
            <circle cx="75%" cy="50%" r="150" stroke="white" fill="none" strokeWidth="0.5"/>
          </svg>

          <Container className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <div className="text-center mb-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-4">Courses</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Available Courses
                </h2>
                <p className="text-white/40 text-lg max-w-2xl mx-auto">
                  Choose from our range of industry-leading tech programs
                </p>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: index * 0.08, ease: EASE_SMOOTH }}>
                  <motion.div
                    className="group bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 h-full cursor-default hover:border-skyblue/20"
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="text-5xl mb-4"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      {course.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-skyblue transition-colors duration-300">
                      {course.title}
                    </h3>
                    <p className="text-white/40 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-white/40">
                      <motion.span
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ⏱️ {course.duration}
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.4, ease: EASE_SMOOTH }}>
              <div className="text-center mt-8">
                <MagneticButton>
                  <Button variant="primary" size="lg" onClick={() => navigate("/trainings")} rightIcon={<ArrowRightIcon size={20} />}>
                    View All Courses & Apply
                  </Button>
                </MagneticButton>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* ═══════════════ BENEFITS SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center bg-oxford-card sticky top-0 z-40 overflow-hidden">
          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, -80, 100, -60, 0], y: [0, 60, -80, 50, 0], scale: [1, 1.15, 0.9, 1.1, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] -left-20 w-[550px] h-[550px] rounded-full bg-skyblue/[0.12] blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, 90, -70, 50, 0], y: [0, -70, 60, -30, 0], scale: [1, 0.85, 1.2, 0.95, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] -right-20 w-[450px] h-[450px] rounded-full bg-orange/[0.1] blur-[140px]"
          />

          {/* Geometric SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
            <circle cx="10%" cy="60%" r="100" stroke="white" fill="none" strokeWidth="0.5"/>
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="0.3"/>
            <circle cx="90%" cy="25%" r="70" stroke="white" fill="none" strokeWidth="0.3"/>
          </svg>

          <Container className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <div className="text-center mb-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-4">Benefits</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Why Choose <span className="text-iceblue">Gr8QM</span>{" "}
                  Training?
                </h2>
                <p className="text-white/40 text-lg max-w-2xl mx-auto">
                  More than just courses—a complete career transformation
                </p>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: index * 0.12, ease: EASE_SMOOTH }}>
                  <motion.div
                    className="group bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 text-center h-full cursor-default hover:border-skyblue/20"
                    whileHover={{
                      y: -6,
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="text-5xl mb-4"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      {benefit.icon}
                    </motion.div>
                    <h3 className="text-lg font-bold mb-3 text-iceblue group-hover:text-orange transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-white/40 text-sm">
                      {benefit.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════════ HOW IT WORKS SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center bg-oxford-deep sticky top-0 z-50 overflow-hidden">
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
            <circle cx="50%" cy="50%" r="180" stroke="white" fill="none" strokeWidth="0.5"/>
            <line x1="85%" y1="0" x2="85%" y2="100%" stroke="white" strokeWidth="0.3"/>
          </svg>

          <Container className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <div className="text-center mb-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-4">How It Works</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  How It Works
                </h2>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Choose a Course",
                  desc: "Browse our courses and select one that fits your goals",
                },
                {
                  step: "2",
                  title: "Apply & Pay Fee",
                  desc: "Fill the application form and pay the commitment fee",
                },
                {
                  step: "3",
                  title: "Learn & Build",
                  desc: "Attend classes, work on projects, and gain real skills",
                },
                {
                  step: "4",
                  title: "Graduate & Succeed",
                  desc: "Complete the course and land your dream job",
                },
              ].map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: index * 0.12, ease: EASE_SMOOTH }}>
                  <motion.div
                    className="group text-center relative h-full cursor-default"
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="bg-skyblue/20 border border-white/[0.08] text-skyblue text-2xl font-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-skyblue transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-white/40">{item.desc}</p>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-8 -right-4 transform z-10">
                        <ArrowRightIcon size={32} className="text-skyblue/40" />
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════════ FAQS SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center bg-oxford-card sticky top-0 z-[60] overflow-hidden">
          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, -80, 100, -60, 0], y: [0, 60, -80, 50, 0], scale: [1, 1.15, 0.9, 1.1, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] -left-20 w-[550px] h-[550px] rounded-full bg-skyblue/[0.12] blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, 90, -70, 50, 0], y: [0, -70, 60, -30, 0], scale: [1, 0.85, 1.2, 0.95, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] -right-20 w-[450px] h-[450px] rounded-full bg-orange/[0.1] blur-[140px]"
          />

          {/* Geometric SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
            <circle cx="20%" cy="40%" r="120" stroke="white" fill="none" strokeWidth="0.5"/>
            <line x1="65%" y1="0" x2="65%" y2="100%" stroke="white" strokeWidth="0.3"/>
          </svg>

          <Container className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <div className="text-center mb-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-4">FAQs</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
              </div>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: index * 0.08, ease: EASE_SMOOTH }}>
                  <motion.div
                    className="group bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 cursor-default hover:border-skyblue/20"
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2 group-hover:text-skyblue transition-colors duration-300">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        whileTap={{ rotate: -10, scale: 0.9 }}
                      >
                        <GraduationCapIcon size={18} className="text-skyblue mt-1 shrink-0" />
                      </motion.div>
                      {faq.question}
                    </h3>
                    <p className="text-white/40 pl-7">{faq.answer}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════════ CTA SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center bg-oxford-deep sticky top-0 z-[70] overflow-hidden">
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
            <circle cx="50%" cy="50%" r="200" stroke="white" fill="none" strokeWidth="0.5"/>
            <line x1="10%" y1="0" x2="10%" y2="100%" stroke="white" strokeWidth="0.3"/>
          </svg>

          <Container className="relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-6">Get Started</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-white/40 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of students who have launched successful tech
                careers through our specialized training programs.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <MagneticButton>
                  <Button variant="primary" size="lg" onClick={() => navigate("/trainings")} rightIcon={<ArrowRightIcon size={20} />}>
                    Browse Courses
                  </Button>
                </MagneticButton>
                <button
                  onClick={() => navigate("/portfolio?category=tech-training")}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full overflow-hidden border border-white/[0.08] text-white hover:border-skyblue/20 transition-all duration-300"
                >
                  <span className="relative z-10">See Student Work</span>
                  <span className="relative z-10 text-skyblue transition-transform duration-300 group-hover:translate-x-1">→</span>
                  <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                </button>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
    </PageTransition>
  );
};

export default TechTrainingNewPage;
