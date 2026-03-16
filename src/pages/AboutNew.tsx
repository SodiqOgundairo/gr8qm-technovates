import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container";
import Button from "../components/common/Button";
import {
  SparklesIcon,
  SpiralIcon,
  HeartIcon,
  TrendingUpIcon,
  BulbIcon,
  UserIcon,
  BadgeIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  RocketIcon,
  TargetIcon,
  HandshakeIcon,
} from "../components/icons";
import { motion, useScroll, useTransform } from "framer-motion";

import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import { getPageSEO } from "../utils/seo-config";
import { generateBreadcrumbSchema } from "../utils/structured-data";

import RevealOnScroll from "../components/animations/RevealOnScroll";
import SplitText from "../components/animations/SplitText";
import MarqueeText from "../components/animations/MarqueeText";
import { ParallaxLayer } from "../components/animations/ParallaxSection";
import Scene3D from "../components/animations/Scene3D";
import AnimatedCounter from "../components/animations/AnimatedCounter";
import MagneticButton from "../components/animations/MagneticButton";
import GlowCard from "../components/animations/GlowCard";

const coreValues = [
  {
    icon: <HeartIcon size={28} className="text-skyblue" />,
    title: "Purpose First",
    desc: "We start with why. Every project begins with understanding the real problem before reaching for solutions.",
    glowColor: "rgba(0, 152, 218, 0.2)",
    number: "01",
  },
  {
    icon: <BulbIcon size={28} className="text-orange" />,
    title: "Relentless Craft",
    desc: "We obsess over the details. The spacing, the transitions, the edge cases. Because good enough isn't.",
    glowColor: "rgba(245, 134, 52, 0.2)",
    number: "02",
  },
  {
    icon: <UserIcon size={28} className="text-skyblue" />,
    title: "Inclusive Growth",
    desc: "We build systems that leave no one behind. Our training programs are designed for people from every background.",
    glowColor: "rgba(0, 152, 218, 0.2)",
    number: "03",
  },
  {
    icon: <BadgeIcon size={28} className="text-oxford" />,
    title: "Excellence as Standard",
    desc: "We don't have a 'premium tier.' The standard is premium. Every client gets our best work.",
    glowColor: "rgba(5, 35, 90, 0.2)",
    number: "04",
  },
  {
    icon: <TrendingUpIcon size={28} className="text-orange" />,
    title: "Measurable Impact",
    desc: "Pretty isn't enough. We track outcomes, iterate on feedback, and make sure our work actually moves metrics.",
    glowColor: "rgba(245, 134, 52, 0.2)",
    number: "05",
  },
  {
    icon: <ShieldCheckIcon size={28} className="text-oxford" />,
    title: "Integrity Always",
    desc: "Honest timelines, transparent pricing, and straight talk. We'd rather lose a deal than overpromise.",
    glowColor: "rgba(5, 35, 90, 0.2)",
    number: "06",
  },
];

const stats = [
  { target: 100, suffix: "+", label: "Projects Delivered" },
  { target: 50, suffix: "+", label: "Students Trained" },
  { target: 30, suffix: "+", label: "Clients Served" },
  { target: 5, suffix: "+", label: "Years of Impact" },
];

const AboutPage: React.FC = () => {
  const pageSEO = getPageSEO("about");
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.9]);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
    { name: "About", url: "https://gr8qm.com/about" },
  ]);

  return (
    <PageTransition>
      <SEO
        title={pageSEO.title}
        description={pageSEO.description}
        keywords={pageSEO.keywords}
        type={pageSEO.type}
        url="/about"
        structuredData={[breadcrumbSchema]}
      />
      <main className="flex flex-col overflow-hidden">
        {/* ==================== SECTION 01: HERO ==================== */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center bg-oxford overflow-hidden"
        >
          {/* 3D Scene Background */}
          <Scene3D variant="hero" />

          {/* Floating gradient orbs */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 rounded-full bg-skyblue/20 blur-3xl"
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-orange/15 blur-3xl"
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 40, -20, 0],
              scale: [1, 0.8, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-iceblue/10 blur-2xl"
            animate={{
              x: [0, 30, -40, 0],
              y: [0, -50, 10, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Noise overlay */}
          <div className="noise-overlay absolute inset-0 z-[1]" />

          {/* Hero Content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="relative z-10 text-center px-4 max-w-6xl mx-auto"
          >
            {/* Decorative section number */}
            <RevealOnScroll direction="scale" delay={0.1}>
              <span className="text-skyblue/30 text-[8rem] md:text-[12rem] font-black absolute -top-16 md:-top-24 left-1/2 -translate-x-1/2 select-none leading-none tracking-tighter">
                01
              </span>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.2}>
              <div className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full mb-8">
                <SparklesIcon size={16} className="text-skyblue" />
                <span className="text-sm text-iceblue tracking-wide uppercase">
                  The Gr8QM Story
                </span>
              </div>
            </RevealOnScroll>

            <div className="mb-6">
              <SplitText
                as="h1"
                type="words"
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[1.1]"
                stagger={0.08}
                delay={0.3}
              >
                We design what's next.
              </SplitText>
            </div>
            <div className="mb-10">
              <SplitText
                as="h1"
                type="words"
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.1]"
                stagger={0.08}
                delay={0.7}
              >
                We build what lasts.
              </SplitText>
            </div>

            <RevealOnScroll direction="up" delay={1.0}>
              <p className="text-iceblue/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                We're a design and technology studio that believes great work
                comes from clarity of purpose. Every product we ship, every
                student we train, every print we deliver reflects our
                commitment to craft and impact.
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={1.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <MagneticButton strength={20}>
                  <Button to="/contact" variant="pry" size="lg">
                    Start a project
                    <ArrowRightIcon size={18} className="ml-2" />
                  </Button>
                </MagneticButton>
                <MagneticButton strength={20}>
                  <Button to="/services" variant="sec" size="lg">
                    Our services
                  </Button>
                </MagneticButton>
              </div>
            </RevealOnScroll>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-iceblue/30 flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-skyblue"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </section>

        {/* ==================== MARQUEE DIVIDER ==================== */}
        <div className="bg-skyblue py-4 relative overflow-hidden">
          <MarqueeText
            text="Purpose-driven design  ·  Expert engineering  ·  Real impact  ·  Faith-led innovation"
            speed={25}
            className="text-lg md:text-xl font-bold text-white/90 tracking-wide"
          />
        </div>

        {/* ==================== SECTION 02: VISION & MISSION ==================== */}
        <section className="relative py-24 md:py-32 lg:py-44 bg-light overflow-hidden">
          {/* Floating orbs */}
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-skyblue/10 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 -left-20 w-64 h-64 rounded-full bg-orange/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container>
            {/* Section number decoration */}
            <RevealOnScroll direction="left">
              <span className="text-oxford/5 text-[6rem] md:text-[10rem] font-black leading-none tracking-tighter select-none">
                02
              </span>
            </RevealOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start -mt-12 md:-mt-20">
              {/* Vision */}
              <ParallaxLayer speed={0.2} className="relative">
                <RevealOnScroll direction="left" delay={0.1}>
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-skyblue/10 -z-10" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-skyblue/10">
                        <SpiralIcon size={28} className="text-skyblue" />
                      </div>
                      <span className="text-sm font-bold text-skyblue uppercase tracking-widest">
                        Vision
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-oxford tracking-tight mb-6 leading-[1.15]">
                      Technology that{" "}
                      <span className="gradient-text">serves people</span>
                    </h2>
                    <p className="text-dark/70 text-lg leading-relaxed">
                      A world where technology serves people, not the other way
                      around. We envision communities thriving because the tools
                      they use were built with intention, empathy, and excellence.
                    </p>
                  </div>
                </RevealOnScroll>
              </ParallaxLayer>

              {/* Mission */}
              <ParallaxLayer speed={0.35} className="relative lg:mt-20">
                <RevealOnScroll direction="right" delay={0.3}>
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-orange/10 -z-10" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-orange/10">
                        <SparklesIcon size={28} className="text-orange" />
                      </div>
                      <span className="text-sm font-bold text-orange uppercase tracking-widest">
                        Mission
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-oxford tracking-tight mb-6 leading-[1.15]">
                      Equipping with{" "}
                      <span className="gradient-text">beautiful solutions</span>
                    </h2>
                    <p className="text-dark/70 text-lg leading-relaxed">
                      To equip individuals and organizations with beautifully
                      designed, expertly engineered solutions. We train talent,
                      build products, and deliver print that makes people stop and
                      look twice.
                    </p>
                  </div>
                </RevealOnScroll>
              </ParallaxLayer>
            </div>

            {/* Quote */}
            <RevealOnScroll direction="scale" delay={0.5} className="mt-16 md:mt-24">
              <div className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-skyblue/5 to-orange/5"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <p className="text-xl md:text-2xl font-bold italic text-oxford relative z-10">
                  "Good design is good business.{" "}
                  <span className="gradient-text">Great design changes lives.</span>"
                </p>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ==================== SECTION 03: CORE VALUES ==================== */}
        <section className="relative py-24 md:py-32 lg:py-44 bg-oxford overflow-hidden">
          {/* Background orbs */}
          <motion.div
            className="absolute top-40 right-0 w-96 h-96 rounded-full bg-skyblue/5 blur-3xl"
            animate={{ x: [0, -30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-0 w-72 h-72 rounded-full bg-orange/5 blur-3xl"
            animate={{ x: [0, 40, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="noise-overlay absolute inset-0" />

          <Container className="relative z-10">
            {/* Section header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16 md:mb-20">
              <div>
                <RevealOnScroll direction="left">
                  <span className="text-skyblue/10 text-[6rem] md:text-[10rem] font-black leading-none tracking-tighter select-none block -mb-8 md:-mb-16">
                    03
                  </span>
                </RevealOnScroll>
                <RevealOnScroll direction="left" delay={0.1}>
                  <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
                    <TargetIcon size={14} className="text-skyblue" />
                    <span className="text-sm text-iceblue/80 tracking-wide uppercase">
                      What Drives Us
                    </span>
                  </div>
                </RevealOnScroll>
                <RevealOnScroll direction="left" delay={0.2}>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                    Our Core{" "}
                    <span className="gradient-text">Values</span>
                  </h2>
                </RevealOnScroll>
              </div>
              <RevealOnScroll direction="right" delay={0.3}>
                <p className="text-iceblue/60 text-lg max-w-md leading-relaxed">
                  The principles behind every pixel, every line of code, and
                  every decision we make.
                </p>
              </RevealOnScroll>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {coreValues.map((item, index) => (
                <RevealOnScroll
                  key={index}
                  direction={index % 2 === 0 ? "up" : "scale"}
                  delay={index * 0.1}
                  width="100%"
                >
                  <GlowCard
                    glowColor={item.glowColor}
                    className="group glass-card rounded-2xl p-6 md:p-8 h-full border border-white/5 hover:border-skyblue/20 transition-colors duration-500"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                        {item.icon}
                      </div>
                      <span className="text-4xl font-black text-white/5 group-hover:text-skyblue/10 transition-colors duration-500 select-none">
                        {item.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-skyblue transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-iceblue/50 leading-relaxed group-hover:text-iceblue/70 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </GlowCard>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ==================== SECTION 04: STATS ==================== */}
        <section className="relative py-24 md:py-32 bg-light overflow-hidden">
          {/* Background decorations */}
          <motion.div
            className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-skyblue/5 blur-3xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full bg-orange/8 blur-3xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container className="relative z-10">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <span className="text-oxford/5 text-[6rem] md:text-[10rem] font-black leading-none tracking-tighter select-none block -mb-6 md:-mb-14">
                  04
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-oxford tracking-tight">
                  Impact in{" "}
                  <span className="gradient-text">Numbers</span>
                </h2>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <RevealOnScroll
                  key={index}
                  direction="up"
                  delay={index * 0.15}
                  width="100%"
                >
                  <ParallaxLayer speed={0.1 + index * 0.05}>
                    <div className="glass-card rounded-2xl p-6 md:p-8 text-center border border-oxford/5 hover:border-skyblue/20 transition-colors duration-300 group">
                      <AnimatedCounter
                        target={stat.target}
                        suffix={stat.suffix}
                        className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text block mb-2"
                      />
                      <p className="text-dark/60 text-sm md:text-base font-medium tracking-wide uppercase">
                        {stat.label}
                      </p>
                    </div>
                  </ParallaxLayer>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ==================== MARQUEE DIVIDER 2 ==================== */}
        <div className="bg-oxford py-4 relative overflow-hidden">
          <MarqueeText
            text="Craft  ·  Excellence  ·  Purpose  ·  Integrity  ·  Impact  ·  Faith"
            speed={30}
            className="text-lg md:text-xl font-bold text-white/20 tracking-widest uppercase"
            reverse
          />
        </div>

        {/* ==================== SECTION 05: FAITH-BASED CTA ==================== */}
        <section className="relative py-24 md:py-32 lg:py-44 bg-oxford overflow-hidden">
          {/* Floating orbs */}
          <motion.div
            className="absolute top-1/4 left-10 w-80 h-80 rounded-full bg-skyblue/10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-10 w-72 h-72 rounded-full bg-orange/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="noise-overlay absolute inset-0" />

          <Container className="relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <RevealOnScroll direction="scale">
                <span className="text-skyblue/10 text-[6rem] md:text-[10rem] font-black leading-none tracking-tighter select-none block -mb-6 md:-mb-14">
                  05
                </span>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delay={0.1}>
                <div className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full mb-8">
                  <HandshakeIcon size={16} className="text-orange" />
                  <span className="text-sm text-iceblue/80 tracking-wide uppercase">
                    Built on Faith
                  </span>
                </div>
              </RevealOnScroll>

              <div className="mb-6">
                <SplitText
                  as="h2"
                  type="words"
                  className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]"
                  stagger={0.06}
                  delay={0.2}
                >
                  Ready to work with a team that cares as much as you do?
                </SplitText>
              </div>

              <RevealOnScroll direction="up" delay={0.6}>
                <p className="text-iceblue/60 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
                  We bring design thinking, engineering rigor, and a genuine
                  passion for craft to every project. If you're building something
                  that matters, we want to be part of it.
                </p>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delay={0.7}>
                <p className="text-iceblue/40 text-base italic max-w-xl mx-auto mb-10">
                  Our work is rooted in faith -- the belief that what we create
                  should uplift, serve, and reflect something greater than ourselves.
                </p>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delay={0.8}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <MagneticButton strength={25}>
                    <Button to="/contact" variant="pry" size="lg">
                      Let's talk
                      <ArrowRightIcon size={18} className="ml-2" />
                    </Button>
                  </MagneticButton>
                  <MagneticButton strength={25}>
                    <Button to="/services" variant="sec" size="lg">
                      Explore our work
                    </Button>
                  </MagneticButton>
                </div>
              </RevealOnScroll>

              {/* Decorative floating icons */}
              <motion.div
                className="absolute top-20 left-10 text-skyblue/10"
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <RocketIcon size={48} />
              </motion.div>
              <motion.div
                className="absolute bottom-20 right-10 text-orange/10"
                animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <SparklesIcon size={40} />
              </motion.div>
              <motion.div
                className="absolute top-1/3 right-20 text-iceblue/10"
                animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <TargetIcon size={36} />
              </motion.div>
            </div>
          </Container>
        </section>
      </main>
    </PageTransition>
  );
};

export default AboutPage;
