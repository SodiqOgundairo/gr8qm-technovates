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
import SplitText from "../components/animations/SplitText";
import MarqueeText from "../components/animations/MarqueeText";
import MagneticButton from "../components/animations/MagneticButton";
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

/* ── data ─────────────────────────────────────────────── */

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
    accentClass: "text-skyblue",
    dotBg: "bg-skyblue",
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
    accentClass: "text-orange",
    dotBg: "bg-orange",
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
    accentClass: "text-iceblue",
    dotBg: "bg-iceblue",
  },
];

const whyChoose = [
  {
    icon: TargetIcon,
    title: "Obsessed with Craft",
    desc: "We sweat the details other agencies skip. Every interaction, every transition, every line of code gets our full attention.",
    accent: "text-iceblue",
  },
  {
    icon: ZapIcon,
    title: "Ship Fast, Ship Right",
    desc: "Speed without sacrificing quality. We move quickly because our process is tight, not because we cut corners.",
    accent: "text-orange",
  },
  {
    icon: HandshakeIcon,
    title: "Long-term Partners",
    desc: "We don't disappear after launch. Ongoing support, iteration, and growth are baked into how we work.",
    accent: "text-iceblue",
  },
];

/* ── ease helpers ──────────────────────────────────────── */

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT_QUART: [number, number, number, number] = [0.22, 0.6, 0.36, 1];
const SPRING_SNAPPY = { type: "spring" as const, stiffness: 300, damping: 24 };

/* ── page ──────────────────────────────────────────────── */

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
          className="sticky top-0 z-10 relative min-h-screen flex items-center justify-center bg-oxford-deep overflow-hidden"
        >
          <OrbitalBackground variant="hero" />

          {/* Noise overlay */}
          <div className="noise-overlay absolute inset-0 z-[1]" />

          {/* Geometric decorations */}
          <DotGrid className="top-12 left-8 text-iceblue/30" />
          <DiagonalLines className="bottom-0 right-0 text-skyblue/20" />
          <CrossMark className="absolute top-24 right-16 text-orange/30" size={20} />
          <CrossMark className="absolute bottom-32 left-20 text-iceblue/20" size={14} />

          {/* Hero content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 text-center px-4"
          >
            <Reveal direction="down" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-oxford-border bg-white/5 backdrop-blur-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                <p className="text-sm text-iceblue/70 font-medium tracking-widest uppercase">
                  What We Do
                </p>
              </div>
            </Reveal>

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

            <Reveal direction="up" delay={1.2}>
              <p className="text-lg md:text-xl text-iceblue/70 max-w-3xl mx-auto leading-relaxed mb-10">
                Three services. One team. Whether you need a digital product, a
                stack of business cards, or a career in tech, we've got you.
              </p>
            </Reveal>

            <Reveal direction="up" delay={1.5}>
              <MagneticButton strength={25} className="inline-block">
                <Button to="/contact" variant="pry" size="lg">
                  Start a Conversation
                </Button>
              </MagneticButton>
            </Reveal>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: EASE_OUT_QUART }}
          >
            <span className="text-iceblue/40 text-xs tracking-widest uppercase">
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-iceblue/40 to-transparent" />
          </motion.div>

          <SectionConnector color="skyblue" side="right" />
        </section>

        {/* ═══════════════ MARQUEE DIVIDER ═══════════════ */}
        <section className="sticky top-0 z-20 relative bg-oxford-deep py-5 border-y border-oxford-border">
          <MarqueeText
            text="DESIGN & BUILD  ///  PRINT SHOP  ///  TECH TRAINING  ///  PREMIUM QUALITY"
            speed={25}
            className="text-2xl md:text-3xl font-black tracking-tight text-white/10"
          />
        </section>

        {/* ═══════════════ SERVICES SHOWCASE ═══════════════ */}
        <section className="sticky top-0 z-30 relative py-24 md:py-36 lg:py-44 bg-oxford-deep overflow-hidden">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="top-20 right-12 text-skyblue/20" />
          <DiagonalLines className="top-0 left-0 text-orange/15" thick />
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />
          <FloatingRule className="bottom-0 left-0 w-full" color="orange" />

          <Container className="relative z-10">
            {/* Section header */}
            <div className="text-center mb-20 md:mb-28">
              <Reveal direction="up">
                <AccentLine color="skyblue" thickness="medium" width="w-16" className="mx-auto mb-6" />
                <p className="text-sm font-semibold tracking-widest uppercase text-skyblue mb-4">
                  Our Services
                </p>
              </Reveal>
              <Reveal direction="up" delay={0.15}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
                  Everything you need,
                  <br />
                  <span className="gradient-text">under one roof.</span>
                </h2>
              </Reveal>
            </div>

            {/* Service cards */}
            <div className="flex flex-col gap-24 md:gap-32">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isEven = index % 2 === 0;

                return (
                  <div key={index}>
                    <div
                      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                        isEven ? "" : "lg:direction-rtl"
                      }`}
                    >
                      {/* Info side */}
                      <div className={isEven ? "" : "lg:order-2"}>
                        <Reveal
                          direction={isEven ? "left" : "right"}
                          delay={0.1}
                        >
                          <span className="text-8xl md:text-9xl font-black text-white/[0.03] leading-none select-none">
                            {service.number}
                          </span>
                        </Reveal>
                        <Reveal
                          direction={isEven ? "left" : "right"}
                          delay={0.2}
                        >
                          <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white -mt-8 md:-mt-12 mb-5">
                            {service.title}
                            <span className={service.accentClass}>.</span>
                          </h3>
                        </Reveal>
                        <Reveal
                          direction={isEven ? "left" : "right"}
                          delay={0.3}
                        >
                          <p className="text-lg text-iceblue/70 leading-relaxed mb-8 max-w-lg">
                            {service.description}
                          </p>
                        </Reveal>
                        <Reveal
                          direction={isEven ? "left" : "right"}
                          delay={0.4}
                        >
                          <MagneticButton strength={20} className="inline-block">
                            <Link
                              to={service.link}
                              className="group inline-flex items-center gap-3 text-white font-bold text-lg hover-line"
                            >
                              Explore {service.title}
                              <motion.span
                                className="inline-block"
                                whileHover={{ x: 5 }}
                                transition={SPRING_SNAPPY}
                              >
                                <ArrowRightIcon size={20} />
                              </motion.span>
                            </Link>
                          </MagneticButton>
                        </Reveal>
                      </div>

                      {/* Card side */}
                      <div className={isEven ? "" : "lg:order-1"}>
                        <Reveal direction="up" delay={0.2}>
                          <div className="group rounded-3xl border border-oxford-border bg-white/5 backdrop-blur-sm p-8 md:p-10">
                            {/* Card icon */}
                            <motion.div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/5 border border-oxford-border"
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              transition={SPRING_SNAPPY}
                            >
                              <Icon size={32} className={service.accentClass} />
                            </motion.div>

                            {/* Features list */}
                            <ul className="space-y-4">
                              {service.features.map((feature, fIndex) => (
                                <motion.li
                                  key={fIndex}
                                  className="flex items-center gap-3 text-iceblue/70"
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    delay: 0.3 + fIndex * 0.08,
                                    duration: 0.4,
                                    ease: EASE_OUT_QUART,
                                  }}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${service.dotBg}`}
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
                              transition={{ delay: 0.6, duration: 0.8, ease: EASE_OUT_EXPO }}
                            />
                          </div>
                        </Reveal>
                      </div>
                    </div>

                    {/* Connector between services */}
                    {index < services.length - 1 && (
                      <div className="relative h-16 md:h-24">
                        <SectionConnector
                          color={index % 2 === 0 ? "orange" : "skyblue"}
                          side={isEven ? "right" : "left"}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ═══════════════ MARQUEE DIVIDER 2 ═══════════════ */}
        <section className="sticky top-0 z-40 relative bg-oxford-deep py-5 border-y border-oxford-border">
          <MarqueeText
            text="CRAFT  ///  SPEED  ///  PARTNERSHIP  ///  QUALITY  ///  INNOVATION"
            speed={30}
            className="text-2xl md:text-3xl font-black tracking-tight text-white/8"
            reverse
          />
        </section>

        {/* ═══════════════ WHY CHOOSE GR8QM ═══════════════ */}
        <section className="sticky top-0 z-50 relative py-24 md:py-36 lg:py-44 bg-oxford-deep overflow-hidden">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="bottom-16 right-8 text-orange/20" />
          <DiagonalLines className="top-0 right-0 text-iceblue/15" />
          <CrossMark className="absolute top-20 left-16 text-skyblue/25" size={18} />
          <FloatingRule className="top-0 left-0 w-full" color="iceblue" dashed />

          <Container className="relative z-10">
            {/* Section header */}
            <div className="text-center mb-20">
              <Reveal direction="up">
                <AccentLine color="orange" thickness="medium" width="w-16" className="mx-auto mb-6" />
                <p className="text-sm font-semibold tracking-widest uppercase text-orange mb-4">
                  Why Us
                </p>
              </Reveal>
              <Reveal direction="up" delay={0.15}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
                  Why <span className="text-iceblue">GR8QM</span>?
                </h2>
              </Reveal>
              <Reveal direction="up" delay={0.3}>
                <p className="text-iceblue/70 text-lg md:text-xl max-w-2xl mx-auto">
                  We're not just vendors. We're the team you wish you'd hired
                  sooner.
                </p>
              </Reveal>
            </div>

            {/* Values grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyChoose.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal
                    key={index}
                    direction="up"
                    delay={index * 0.15}
                  >
                    <div className="group h-full relative rounded-3xl border border-oxford-border bg-white/5 backdrop-blur-sm p-8 md:p-10 text-center">
                      {/* Number decoration */}
                      <span className="absolute top-4 right-6 text-6xl font-black text-white/[0.03] select-none">
                        0{index + 1}
                      </span>

                      {/* Icon */}
                      <motion.div
                        className="flex justify-center mb-6"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={SPRING_SNAPPY}
                      >
                        <Icon size={44} className={item.accent} />
                      </motion.div>

                      {/* Content */}
                      <h3
                        className={`text-xl md:text-2xl font-bold mb-4 ${item.accent}`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-iceblue/70 leading-relaxed">
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
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.6, ease: EASE_OUT_EXPO }}
                      />
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Container>

          <SectionConnector color="orange" side="center" />
        </section>

        {/* ═══════════════ CTA SECTION ═══════════════ */}
        <section className="relative py-24 md:py-36 bg-oxford-deep overflow-hidden">
          <OrbitalBackground variant="cta" />
          <div className="noise-overlay absolute inset-0 z-[1]" />

          {/* Geometric decorations */}
          <DotGrid className="top-8 right-16 text-skyblue/20" />
          <DiagonalLines className="bottom-0 left-0 text-orange/15" thick />
          <CrossMark className="absolute bottom-20 right-24 text-iceblue/25" size={16} />
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

          <Container className="relative z-10 text-center">
            <Reveal direction="up">
              <SplitText
                as="h2"
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white"
                type="words"
                stagger={0.06}
              >
                Got a project in mind?
              </SplitText>
            </Reveal>

            <Reveal direction="up" delay={0.4}>
              <p className="text-iceblue/70 text-lg md:text-xl max-w-2xl mx-auto mt-6 mb-10 leading-relaxed">
                Tell us what you're building. We'll tell you how we can help.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.6}>
              <MagneticButton strength={30} className="inline-block">
                <Button to="/contact" variant="pry" size="lg">
                  Start a Conversation
                </Button>
              </MagneticButton>
            </Reveal>

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
