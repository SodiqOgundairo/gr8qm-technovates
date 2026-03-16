import React, { useRef } from "react";
import Container from "../components/layout/Container";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  TargetIcon,
  ZapIcon,
  HandshakeIcon,
  CodeIcon,
  PrinterIcon,
  GraduationCapIcon,
  ArrowRightIcon,
} from "../components/icons";
import Button from "../components/common/Button";
import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import RevealOnScroll from "../components/animations/RevealOnScroll";
import SplitText from "../components/animations/SplitText";
import MarqueeText from "../components/animations/MarqueeText";
import Scene3D from "../components/animations/Scene3D";
import MagneticButton from "../components/animations/MagneticButton";
import GlowCard from "../components/animations/GlowCard";
import { ParallaxLayer } from "../components/animations/ParallaxSection";

const services = [
  {
    number: "01",
    title: "Design & Build",
    description:
      "Websites, apps, and digital products. We handle everything from UX research to final deployment, so you get a product that works as good as it looks.",
    features: [
      "Custom Web & Mobile Applications",
      "UI/UX Design & Prototyping",
      "Full-Stack Development",
      "API Integration & Development",
      "Database Design & Optimization",
      "Ongoing Maintenance & Support",
    ],
    link: "/services/design-build",
    icon: CodeIcon,
    glowColor: "rgba(0, 152, 218, 0.2)",
    accentClass: "text-skyblue",
    borderClass: "border-skyblue/20",
    bgClass: "bg-skyblue/5",
  },
  {
    number: "02",
    title: "Print Shop",
    description:
      "Your brand, made tangible. Premium print for business cards, flyers, banners, merch, and packaging. Fast turnaround, no compromises on quality.",
    features: [
      "Business Cards & Stationery",
      "Flyers & Brochures",
      "Banners & Posters",
      "Branded Merchandise",
      "Custom Packaging Design",
      "Fast Turnaround Time",
    ],
    link: "/services/print-shop",
    icon: PrinterIcon,
    glowColor: "rgba(245, 134, 52, 0.2)",
    accentClass: "text-orange",
    borderClass: "border-orange/20",
    bgClass: "bg-orange/5",
  },
  {
    number: "03",
    title: "Tech Training",
    description:
      "Zero to job-ready. Sponsored cohort programs in product design, development, and QA. Real projects, real mentors, real career outcomes.",
    features: [
      "Product Design & Management",
      "Frontend & Backend Development",
      "DevOps & Cloud Computing",
      "Cybersecurity Fundamentals",
      "QA Testing & Automation",
      "Sponsored with Commitment Fee",
    ],
    link: "/services/tech-training",
    icon: GraduationCapIcon,
    glowColor: "rgba(201, 235, 251, 0.25)",
    accentClass: "text-iceblue",
    borderClass: "border-iceblue/20",
    bgClass: "bg-iceblue/5",
  },
];

const whyChoose = [
  {
    icon: TargetIcon,
    title: "Obsessed with Craft",
    desc: "We sweat the details other agencies skip. Every interaction, every transition, every line of code gets our full attention.",
    accent: "text-iceblue",
    glow: "rgba(0, 152, 218, 0.15)",
  },
  {
    icon: ZapIcon,
    title: "Ship Fast, Ship Right",
    desc: "Speed without sacrificing quality. We move quickly because our process is tight, not because we cut corners.",
    accent: "text-orange",
    glow: "rgba(245, 134, 52, 0.15)",
  },
  {
    icon: HandshakeIcon,
    title: "Long-term Partners",
    desc: "We don't disappear after launch. Ongoing support, iteration, and growth are baked into how we work.",
    accent: "text-iceblue",
    glow: "rgba(201, 235, 251, 0.2)",
  },
];

const ServicesPage: React.FC = () => {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <PageTransition>
      <SEO
        title="Our Services"
        description="Design, print, and training under one roof. We build digital products, deliver premium print, and train the next generation of tech talent."
      />
      <main className="flex flex-col overflow-x-hidden">
        {/* ═══════════════ HERO ═══════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center bg-oxford overflow-hidden"
        >
          {/* Scene3D background */}
          <Scene3D variant="hero" />

          {/* Noise overlay */}
          <div className="noise-overlay absolute inset-0 z-[1]" />

          {/* Floating gradient orbs */}
          <motion.div
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-skyblue/10 blur-[120px] pointer-events-none"
            animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-orange/10 blur-[100px] pointer-events-none"
            animate={{ y: [0, -30, 0], x: [0, -25, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-iceblue/5 blur-[150px] pointer-events-none"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Hero content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 text-center px-4"
          >
            <RevealOnScroll direction="scale" delay={0.1}>
              <div className="glass-card inline-flex items-center gap-2 px-6 py-2 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                <p className="text-sm text-white/80 font-medium tracking-widest uppercase">
                  What We Do
                </p>
              </div>
            </RevealOnScroll>

            <div className="mb-8">
              <SplitText
                as="h1"
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white"
                type="words"
                stagger={0.08}
                delay={0.3}
              >
                Design it.
              </SplitText>
              <br />
              <SplitText
                as="h1"
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight gradient-text"
                type="words"
                stagger={0.08}
                delay={0.6}
              >
                Build it.
              </SplitText>
              <br />
              <SplitText
                as="h1"
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-orange"
                type="words"
                stagger={0.08}
                delay={0.9}
              >
                Ship it.
              </SplitText>
            </div>

            <RevealOnScroll direction="up" delay={1.2}>
              <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-10">
                Three services. One team. Whether you need a digital product, a
                stack of business cards, or a career in tech, we've got you.
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={1.5}>
              <MagneticButton strength={25} className="inline-block">
                <Button to="/contact" variant="pry" size="lg">
                  Start a Conversation
                </Button>
              </MagneticButton>
            </RevealOnScroll>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white/40 text-xs tracking-widest uppercase">
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </section>

        {/* ═══════════════ MARQUEE DIVIDER ═══════════════ */}
        <div className="bg-dark py-5 border-y border-white/5">
          <MarqueeText
            text="DESIGN & BUILD  ///  PRINT SHOP  ///  TECH TRAINING  ///  PREMIUM QUALITY"
            speed={25}
            className="text-2xl md:text-3xl font-black tracking-tight text-white/10"
          />
        </div>

        {/* ═══════════════ SERVICES SHOWCASE ═══════════════ */}
        <section className="relative py-24 md:py-36 lg:py-44 bg-light overflow-hidden">
          {/* Background floating orbs */}
          <motion.div
            className="absolute top-20 right-10 w-72 h-72 rounded-full bg-skyblue/5 blur-[100px] pointer-events-none"
            animate={{ y: [0, 50, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-orange/5 blur-[80px] pointer-events-none"
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container>
            {/* Section header */}
            <div className="text-center mb-20 md:mb-28">
              <RevealOnScroll direction="up">
                <p className="text-sm font-semibold tracking-widest uppercase text-skyblue mb-4">
                  Our Services
                </p>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={0.15}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-oxford">
                  Everything you need,
                  <br />
                  <span className="gradient-text">under one roof.</span>
                </h2>
              </RevealOnScroll>
            </div>

            {/* Service cards */}
            <div className="flex flex-col gap-24 md:gap-32">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isEven = index % 2 === 0;

                return (
                  <ParallaxLayer key={index} speed={0.1 + index * 0.05}>
                    <div
                      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                        isEven ? "" : "lg:direction-rtl"
                      }`}
                    >
                      {/* Info side */}
                      <div className={isEven ? "" : "lg:order-2"}>
                        <RevealOnScroll
                          direction={isEven ? "left" : "right"}
                          delay={0.1}
                        >
                          <span className="text-8xl md:text-9xl font-black text-oxford/5 leading-none select-none">
                            {service.number}
                          </span>
                        </RevealOnScroll>
                        <RevealOnScroll
                          direction={isEven ? "left" : "right"}
                          delay={0.2}
                        >
                          <h3
                            className={`text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-oxford -mt-8 md:-mt-12 mb-5`}
                          >
                            {service.title}
                            <span className={service.accentClass}>.</span>
                          </h3>
                        </RevealOnScroll>
                        <RevealOnScroll
                          direction={isEven ? "left" : "right"}
                          delay={0.3}
                        >
                          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                            {service.description}
                          </p>
                        </RevealOnScroll>
                        <RevealOnScroll
                          direction={isEven ? "left" : "right"}
                          delay={0.4}
                        >
                          <MagneticButton strength={20} className="inline-block">
                            <Link
                              to={service.link}
                              className="group inline-flex items-center gap-3 text-oxford font-bold text-lg hover-line"
                            >
                              Explore {service.title}
                              <motion.span
                                className="inline-block"
                                whileHover={{ x: 5 }}
                              >
                                <ArrowRightIcon size={20} />
                              </motion.span>
                            </Link>
                          </MagneticButton>
                        </RevealOnScroll>
                      </div>

                      {/* Card side */}
                      <div className={isEven ? "" : "lg:order-1"}>
                        <RevealOnScroll direction="scale" delay={0.2}>
                          <GlowCard
                            glowColor={service.glowColor}
                            className={`group rounded-3xl border ${service.borderClass} ${service.bgClass} backdrop-blur-sm p-8 md:p-10`}
                          >
                            {/* Card icon */}
                            <motion.div
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${service.bgClass} border ${service.borderClass}`}
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Icon size={32} className={service.accentClass} />
                            </motion.div>

                            {/* Features list */}
                            <ul className="space-y-4">
                              {service.features.map((feature, fIndex) => (
                                <motion.li
                                  key={fIndex}
                                  className="flex items-center gap-3 text-gray-700"
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    delay: 0.3 + fIndex * 0.08,
                                    duration: 0.4,
                                    ease: [0.22, 0.6, 0.36, 1],
                                  }}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                      service.accentClass.includes("skyblue")
                                        ? "bg-skyblue"
                                        : service.accentClass.includes("orange")
                                        ? "bg-orange"
                                        : "bg-iceblue"
                                    }`}
                                  />
                                  <span className="text-sm md:text-base">
                                    {feature}
                                  </span>
                                </motion.li>
                              ))}
                            </ul>

                            {/* Decorative line */}
                            <motion.div
                              className={`mt-8 h-px w-0 ${
                                service.accentClass.includes("skyblue")
                                  ? "bg-skyblue/30"
                                  : service.accentClass.includes("orange")
                                  ? "bg-orange/30"
                                  : "bg-iceblue/30"
                              }`}
                              whileInView={{ width: "100%" }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.6, duration: 0.8 }}
                            />
                          </GlowCard>
                        </RevealOnScroll>
                      </div>
                    </div>
                  </ParallaxLayer>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ═══════════════ MARQUEE DIVIDER 2 ═══════════════ */}
        <div className="bg-oxford py-5 border-y border-white/5">
          <MarqueeText
            text="CRAFT  ///  SPEED  ///  PARTNERSHIP  ///  QUALITY  ///  INNOVATION"
            speed={30}
            className="text-2xl md:text-3xl font-black tracking-tight text-white/8"
            reverse
          />
        </div>

        {/* ═══════════════ WHY CHOOSE GR8QM ═══════════════ */}
        <section className="relative py-24 md:py-36 lg:py-44 bg-oxford overflow-hidden">
          {/* Background effects */}
          <div className="noise-overlay absolute inset-0 z-[1]" />
          <motion.div
            className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-skyblue/5 blur-[150px] pointer-events-none"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-orange/5 blur-[120px] pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container className="relative z-10">
            {/* Section header */}
            <div className="text-center mb-20">
              <RevealOnScroll direction="up">
                <p className="text-sm font-semibold tracking-widest uppercase text-orange mb-4">
                  Why Us
                </p>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={0.15}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
                  Why <span className="text-iceblue">GR8QM</span>?
                </h2>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={0.3}>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                  We're not just vendors. We're the team you wish you'd hired
                  sooner.
                </p>
              </RevealOnScroll>
            </div>

            {/* Values grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyChoose.map((item, index) => {
                const Icon = item.icon;
                return (
                  <RevealOnScroll
                    key={index}
                    direction="up"
                    delay={index * 0.15}
                    width="100%"
                  >
                    <GlowCard
                      glowColor={item.glow}
                      className="group h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-10 text-center"
                    >
                      {/* Number decoration */}
                      <span className="absolute top-4 right-6 text-6xl font-black text-white/[0.03] select-none">
                        0{index + 1}
                      </span>

                      {/* Icon */}
                      <motion.div
                        className="flex justify-center mb-6"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon size={44} className={item.accent} />
                      </motion.div>

                      {/* Content */}
                      <h3
                        className={`text-xl md:text-2xl font-bold mb-4 ${item.accent}`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>

                      {/* Bottom accent line */}
                      <motion.div
                        className={`mt-8 mx-auto h-0.5 w-0 rounded-full ${
                          item.accent.includes("orange")
                            ? "bg-orange/40"
                            : "bg-skyblue/40"
                        }`}
                        whileInView={{ width: "60%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                      />
                    </GlowCard>
                  </RevealOnScroll>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ═══════════════ CTA SECTION ═══════════════ */}
        <section className="relative py-24 md:py-36 bg-dark overflow-hidden">
          {/* Animated background */}
          <Scene3D variant="minimal" />
          <div className="noise-overlay absolute inset-0 z-[1]" />

          {/* Floating orbs */}
          <motion.div
            className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-skyblue/10 blur-[120px] pointer-events-none"
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-orange/10 blur-[100px] pointer-events-none"
            animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container className="relative z-10 text-center">
            <RevealOnScroll direction="scale">
              <SplitText
                as="h2"
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white"
                type="words"
                stagger={0.06}
              >
                Got a project in mind?
              </SplitText>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.4}>
              <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mt-6 mb-10 leading-relaxed">
                Tell us what you're building. We'll tell you how we can help.
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.6}>
              <MagneticButton strength={30} className="inline-block">
                <Button to="/contact" variant="pry" size="lg">
                  Start a Conversation
                </Button>
              </MagneticButton>
            </RevealOnScroll>

            {/* Decorative bottom marquee */}
            <div className="mt-20">
              <MarqueeText
                text="LET'S BUILD SOMETHING GREAT"
                speed={35}
                className="text-6xl md:text-8xl font-black tracking-tight text-white/[0.03]"
              />
            </div>
          </Container>
        </section>
      </main>
    </PageTransition>
  );
};

export default ServicesPage;
