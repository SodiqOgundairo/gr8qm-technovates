import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import PageTransition from "../../components/layout/PageTransition";
import { SEO } from "../../components/common/SEO";
import { getPageSEO } from "../../utils/seo-config";
import {
  generateFAQSchema,
  generateEducationalOrganizationSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";

import RevealOnScroll from "../../components/animations/RevealOnScroll";
import SplitText from "../../components/animations/SplitText";
import Scene3D from "../../components/animations/Scene3D";
import MarqueeText from "../../components/animations/MarqueeText";
import MagneticButton from "../../components/animations/MagneticButton";
import GlowCard from "../../components/animations/GlowCard";
import { ParallaxLayer } from "../../components/animations/ParallaxSection";
import AnimatedCounter from "../../components/animations/AnimatedCounter";

import {
  ArrowRightIcon,
  GraduationCapIcon,
  CodeIcon,
  ShieldCheckIcon,
  RocketIcon,
  TargetIcon,
  BulbIcon,
  BriefcaseIcon,
  HandshakeIcon,
  ZapIcon,
} from "../../components/icons";

const courses = [
  {
    title: "Product Design",
    description:
      "Master UI/UX design principles and create stunning interfaces",
    icon: <TargetIcon size={28} />,
    duration: "12 weeks",
    color: "rgba(245, 134, 52, 0.15)",
  },
  {
    title: "Product Management",
    description: "Learn to build and manage successful digital products",
    icon: <BriefcaseIcon size={28} />,
    duration: "10 weeks",
    color: "rgba(0, 152, 218, 0.15)",
  },
  {
    title: "Frontend Development",
    description:
      "Build modern, responsive web applications with React & Next.js",
    icon: <CodeIcon size={28} />,
    duration: "16 weeks",
    color: "rgba(245, 134, 52, 0.15)",
  },
  {
    title: "Backend Development",
    description: "Create robust server-side applications and APIs",
    icon: <ZapIcon size={28} />,
    duration: "16 weeks",
    color: "rgba(0, 152, 218, 0.15)",
  },
  {
    title: "DevOps Engineering",
    description: "Master cloud infrastructure and deployment workflows",
    icon: <RocketIcon size={28} />,
    duration: "14 weeks",
    color: "rgba(245, 134, 52, 0.15)",
  },
  {
    title: "Cybersecurity",
    description: "Protect systems and data from digital threats",
    icon: <ShieldCheckIcon size={28} />,
    duration: "12 weeks",
    color: "rgba(0, 152, 218, 0.15)",
  },
];

const benefits = [
  {
    icon: <GraduationCapIcon size={32} />,
    title: "Sponsored Education",
    description:
      "World-class education. You only pay a commitment fee to secure your spot.",
  },
  {
    icon: <BriefcaseIcon size={32} />,
    title: "Industry Experts",
    description:
      "Learn from professionals with years of real-world experience.",
  },
  {
    icon: <HandshakeIcon size={32} />,
    title: "Job Placement Support",
    description:
      "We help you land your first tech role with career guidance.",
  },
  {
    icon: <BulbIcon size={32} />,
    title: "Hands-on Projects",
    description:
      "Build a portfolio of real projects that showcase your skills.",
  },
];

const steps = [
  {
    step: "01",
    title: "Choose a Course",
    desc: "Browse our courses and select one that fits your goals",
  },
  {
    step: "02",
    title: "Apply & Pay Fee",
    desc: "Fill the application form and pay the commitment fee",
  },
  {
    step: "03",
    title: "Learn & Build",
    desc: "Attend classes, work on projects, and gain real skills",
  },
  {
    step: "04",
    title: "Graduate & Succeed",
    desc: "Complete the course and land your dream job",
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

const TechTrainingPage: React.FC = () => {
  const pageSEO = getPageSEO("techTraining");
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

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
        {/* ════════════════════════════════════════════
            01 — HERO: FULL-HEIGHT, SCENE3D, LARGE TYPE
        ════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center bg-dark overflow-hidden"
        >
          {/* 3-D particle field */}
          <Scene3D variant="hero" />

          {/* Noise overlay */}
          <div
            className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
            }}
          />

          {/* Floating orbs */}
          <motion.div
            className="absolute top-[15%] left-[8%] w-72 h-72 rounded-full bg-skyblue/10 blur-[100px] z-[1]"
            animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-orange/10 blur-[120px] z-[1]"
            animate={{ y: [0, 30, 0], x: [0, -25, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[60%] left-[50%] w-48 h-48 rounded-full bg-iceblue/8 blur-[80px] z-[1]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Hero content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          >
            <RevealOnScroll direction="scale" delay={0.1}>
              <span className="inline-block border border-skyblue/40 bg-skyblue/10 backdrop-blur-md rounded-full px-5 py-2 text-sm font-medium tracking-widest text-skyblue uppercase mb-8">
                Tech Training
              </span>
            </RevealOnScroll>

            <SplitText
              as="h1"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-6"
              type="words"
              delay={0.2}
              stagger={0.08}
            >
              Launch Your Tech Career, Sponsored
            </SplitText>

            <RevealOnScroll direction="up" delay={0.6}>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10">
                Master in-demand tech skills with our specialized training
                programs. Learn from industry experts, build real projects, and
                start your journey to a rewarding tech career. Only a small
                commitment fee required.
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.8}>
              <div className="flex gap-5 justify-center flex-wrap">
                <MagneticButton strength={25}>
                  <Link to="/trainings">
                    <Button variant="pry">
                      Browse Courses
                      <ArrowRightIcon size={20} />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={25}>
                  <Link to="/portfolio?category=tech-training">
                    <Button variant="sec">
                      Student Success Stories
                      <ArrowRightIcon size={18} />
                    </Button>
                  </Link>
                </MagneticButton>
              </div>
            </RevealOnScroll>

            {/* Stats row */}
            <RevealOnScroll direction="up" delay={1}>
              <div className="flex justify-center gap-12 mt-16 flex-wrap">
                <div className="text-center">
                  <AnimatedCounter
                    target={6}
                    suffix="+"
                    className="text-4xl font-black bg-gradient-to-r from-skyblue to-iceblue bg-clip-text text-transparent"
                  />
                  <p className="text-white/40 text-sm mt-1 uppercase tracking-wider">
                    Courses
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={16}
                    suffix=" wks"
                    className="text-4xl font-black bg-gradient-to-r from-orange to-skyblue bg-clip-text text-transparent"
                  />
                  <p className="text-white/40 text-sm mt-1 uppercase tracking-wider">
                    Longest Track
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={100}
                    suffix="%"
                    className="text-4xl font-black bg-gradient-to-r from-iceblue to-skyblue bg-clip-text text-transparent"
                  />
                  <p className="text-white/40 text-sm mt-1 uppercase tracking-wider">
                    Sponsored
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-skyblue"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════
            MARQUEE DIVIDER
        ════════════════════════════════════════════ */}
        <div className="bg-oxford py-4 border-y border-white/5">
          <MarqueeText
            text="SPONSORED TRAINING  /  PRODUCT DESIGN  /  FRONTEND DEV  /  BACKEND DEV  /  DEVOPS  /  CYBERSECURITY  /  PRODUCT MANAGEMENT"
            speed={30}
            className="text-white/20 text-sm font-bold tracking-[0.3em] uppercase"
          />
        </div>

        {/* ════════════════════════════════════════════
            02 — COMMITMENT FEE POLICY
        ════════════════════════════════════════════ */}
        <section className="relative py-24 md:py-36 bg-light overflow-hidden">
          {/* Floating orb */}
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-skyblue/5 blur-[100px] pointer-events-none"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 7, repeat: Infinity }}
          />

          <Container>
            <div className="max-w-4xl mx-auto">
              <RevealOnScroll direction="up">
                <span className="text-[10rem] md:text-[14rem] font-black text-oxford/[0.03] leading-none absolute -top-8 left-0 select-none pointer-events-none">
                  02
                </span>
                <p className="text-skyblue font-bold tracking-widest uppercase text-sm mb-4">
                  Why Sponsored?
                </p>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delay={0.1}>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-oxford leading-tight mb-6">
                  Launch Your Tech Career with{" "}
                  <span className="bg-gradient-to-r from-skyblue to-iceblue bg-clip-text text-transparent">
                    Sponsored Training
                  </span>
                </h2>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delay={0.2}>
                <p className="text-lg text-gray-600 max-w-2xl mb-12">
                  We believe financial barriers shouldn't stop talent. Start
                  your journey to a rewarding tech career. Only a small
                  commitment fee required.
                </p>
              </RevealOnScroll>

              <RevealOnScroll direction="scale" delay={0.3}>
                <GlowCard
                  className="rounded-2xl p-8 md:p-10 bg-white/80 backdrop-blur-xl border border-skyblue/20"
                  glowColor="rgba(0, 152, 218, 0.12)"
                >
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-skyblue to-oxford flex items-center justify-center">
                      <BulbIcon size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-oxford mb-3">
                        Commitment Fee Policy
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        Pay a one-time commitment fee when you enroll. This
                        secures your spot and ensures serious participation in
                        the cohort. It's that simple.
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* ════════════════════════════════════════════
            03 — AVAILABLE COURSES
        ════════════════════════════════════════════ */}
        <section className="relative py-24 md:py-36 bg-white overflow-hidden">
          {/* Floating orbs */}
          <motion.div
            className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-orange/5 blur-[80px] pointer-events-none"
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 9, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-skyblue/5 blur-[80px] pointer-events-none"
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
          />

          <Container>
            <div className="relative">
              <span className="text-[10rem] md:text-[14rem] font-black text-oxford/[0.03] leading-none absolute -top-20 right-0 select-none pointer-events-none">
                03
              </span>
            </div>

            <RevealOnScroll direction="up">
              <p className="text-skyblue font-bold tracking-widest uppercase text-sm mb-4">
                Programs
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-oxford leading-tight mb-4">
                Available Courses
              </h2>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.2}>
              <p className="text-gray-500 text-lg max-w-2xl mb-14">
                Choose from our range of industry-leading tech programs
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <RevealOnScroll
                  key={course.title}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.1}
                  width="100%"
                >
                  <GlowCard
                    className="group relative rounded-2xl p-7 h-full bg-white border border-gray-100 hover:border-skyblue/30 transition-colors duration-300"
                    glowColor={course.color}
                  >
                    {/* Noise overlay */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-[0.015] pointer-events-none"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                      }}
                    />

                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-skyblue/10 to-oxford/10 flex items-center justify-center text-skyblue mb-5 group-hover:scale-110 transition-transform duration-300">
                        {course.icon}
                      </div>
                      <h3 className="text-xl font-black text-oxford mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 mb-5 leading-relaxed">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-oxford/50 tracking-wide uppercase">
                          {course.duration}
                        </span>
                        <span className="w-8 h-8 rounded-full border border-skyblue/20 flex items-center justify-center text-skyblue group-hover:bg-skyblue group-hover:text-white transition-all duration-300">
                          <ArrowRightIcon size={14} />
                        </span>
                      </div>
                    </div>

                    {/* Hover line at bottom */}
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-skyblue to-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
                  </GlowCard>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll direction="up" delay={0.5}>
              <div className="text-center mt-12">
                <MagneticButton strength={20}>
                  <Link to="/trainings">
                    <Button variant="pry">
                      View All Courses & Apply
                      <ArrowRightIcon size={20} />
                    </Button>
                  </Link>
                </MagneticButton>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ════════════════════════════════════════════
            04 — BENEFITS
        ════════════════════════════════════════════ */}
        <section className="relative py-24 md:py-36 bg-oxford overflow-hidden">
          {/* Floating orbs */}
          <motion.div
            className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-skyblue/5 blur-[120px] pointer-events-none"
            animate={{ y: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full bg-orange/5 blur-[100px] pointer-events-none"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          {/* Noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
            }}
          />

          <Container className="relative z-10">
            <span className="text-[10rem] md:text-[14rem] font-black text-white/[0.02] leading-none absolute -top-20 left-0 select-none pointer-events-none">
              04
            </span>

            <RevealOnScroll direction="up">
              <p className="text-iceblue font-bold tracking-widest uppercase text-sm mb-4">
                Advantages
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-iceblue to-skyblue bg-clip-text text-transparent">
                  Gr8QM
                </span>{" "}
                Training?
              </h2>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.2}>
              <p className="text-white/40 text-lg max-w-2xl mb-14">
                More than just courses — a complete career transformation
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <RevealOnScroll
                  key={benefit.title}
                  direction="up"
                  delay={index * 0.15}
                  width="100%"
                >
                  <GlowCard
                    className="group relative rounded-2xl p-7 h-full bg-white/[0.05] backdrop-blur-md border border-white/[0.08] hover:border-skyblue/30 transition-colors duration-300"
                    glowColor="rgba(0, 152, 218, 0.08)"
                  >
                    <div className="text-skyblue mb-5 group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                    <h3 className="text-lg font-black text-iceblue mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                    {/* Hover line */}
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-skyblue to-iceblue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
                  </GlowCard>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ════════════════════════════════════════════
            MARQUEE DIVIDER 2
        ════════════════════════════════════════════ */}
        <div className="bg-dark py-4 border-y border-white/5">
          <MarqueeText
            text="CHOOSE  /  APPLY  /  LEARN  /  BUILD  /  GRADUATE  /  SUCCEED"
            speed={25}
            className="text-white/15 text-sm font-bold tracking-[0.3em] uppercase"
            reverse
          />
        </div>

        {/* ════════════════════════════════════════════
            05 — HOW IT WORKS
        ════════════════════════════════════════════ */}
        <section className="relative py-24 md:py-36 bg-light overflow-hidden">
          <motion.div
            className="absolute top-1/3 right-[10%] w-60 h-60 rounded-full bg-orange/5 blur-[80px] pointer-events-none"
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <Container>
            <div className="relative">
              <span className="text-[10rem] md:text-[14rem] font-black text-oxford/[0.03] leading-none absolute -top-20 right-0 select-none pointer-events-none">
                05
              </span>
            </div>

            <RevealOnScroll direction="up">
              <p className="text-skyblue font-bold tracking-widest uppercase text-sm mb-4">
                Process
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-oxford leading-tight mb-16">
                How It Works
              </h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((item, index) => (
                <RevealOnScroll
                  key={item.step}
                  direction="up"
                  delay={index * 0.15}
                  width="100%"
                >
                  <ParallaxLayer speed={0.1 + index * 0.05}>
                    <div className="group relative text-center">
                      {/* Step number */}
                      <div className="relative mx-auto mb-6 w-20 h-20">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-skyblue to-oxford opacity-10 group-hover:opacity-20 transition-opacity"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.5,
                          }}
                        />
                        <div className="relative w-20 h-20 rounded-full bg-white border-2 border-skyblue/20 flex items-center justify-center group-hover:border-skyblue transition-colors duration-300">
                          <span className="text-2xl font-black bg-gradient-to-br from-skyblue to-oxford bg-clip-text text-transparent">
                            {item.step}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-oxford mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 leading-relaxed">
                        {item.desc}
                      </p>

                      {/* Connector arrow (hidden on mobile & last item) */}
                      {index < 3 && (
                        <div className="hidden lg:block absolute top-10 -right-4 z-10">
                          <motion.div
                            animate={{ x: [0, 6, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: index * 0.3,
                            }}
                          >
                            <ArrowRightIcon
                              size={28}
                              className="text-skyblue/40"
                            />
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </ParallaxLayer>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ════════════════════════════════════════════
            06 — FAQs
        ════════════════════════════════════════════ */}
        <section className="relative py-24 md:py-36 bg-white overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-iceblue/10 blur-[100px] pointer-events-none"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <Container>
            <div className="relative">
              <span className="text-[10rem] md:text-[14rem] font-black text-oxford/[0.03] leading-none absolute -top-20 left-0 select-none pointer-events-none">
                06
              </span>
            </div>

            <RevealOnScroll direction="up">
              <p className="text-skyblue font-bold tracking-widest uppercase text-sm mb-4">
                Questions
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.1}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-oxford leading-tight mb-16">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-skyblue to-orange bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
            </RevealOnScroll>

            <div className="max-w-3xl mx-auto space-y-5">
              {faqs.map((faq, index) => (
                <RevealOnScroll
                  key={index}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.1}
                  width="100%"
                >
                  <GlowCard
                    className="group rounded-2xl p-7 bg-light/50 backdrop-blur-sm border border-gray-100 hover:border-skyblue/20 transition-colors duration-300"
                    glowColor="rgba(0, 152, 218, 0.08)"
                  >
                    <h3 className="text-lg font-black text-oxford mb-3 flex items-start gap-3">
                      <span className="shrink-0 w-8 h-8 rounded-lg bg-skyblue/10 flex items-center justify-center">
                        <GraduationCapIcon
                          size={16}
                          className="text-skyblue"
                        />
                      </span>
                      {faq.question}
                    </h3>
                    <p className="text-gray-500 pl-11 leading-relaxed">
                      {faq.answer}
                    </p>
                    {/* Hover line */}
                    <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-skyblue to-iceblue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
                  </GlowCard>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ════════════════════════════════════════════
            07 — CTA
        ════════════════════════════════════════════ */}
        <section className="relative py-24 md:py-36 bg-dark overflow-hidden">
          <Scene3D variant="minimal" />

          {/* Floating orbs */}
          <motion.div
            className="absolute top-1/4 left-[15%] w-72 h-72 rounded-full bg-skyblue/8 blur-[100px] pointer-events-none"
            animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 7, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-[15%] w-60 h-60 rounded-full bg-orange/8 blur-[80px] pointer-events-none"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          {/* Noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
            }}
          />

          <Container className="relative z-10 text-center">
            <RevealOnScroll direction="scale">
              <SplitText
                as="h2"
                className="text-3xl md:text-5xl lg:text-7xl font-black leading-tight mb-6"
                type="words"
                stagger={0.06}
              >
                Ready to Transform Your Career?
              </SplitText>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.3}>
              <p className="text-white/50 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Join hundreds of students who have launched successful tech
                careers through our specialized training programs.
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.5}>
              <div className="flex gap-5 justify-center flex-wrap">
                <MagneticButton strength={30}>
                  <Link to="/trainings">
                    <Button variant="pry">
                      Browse Courses
                      <ArrowRightIcon size={20} />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={30}>
                  <Link to="/portfolio?category=tech-training">
                    <Button variant="sec">
                      See Student Work
                      <ArrowRightIcon size={18} />
                    </Button>
                  </Link>
                </MagneticButton>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      </main>
    </PageTransition>
  );
};

export default TechTrainingPage;
