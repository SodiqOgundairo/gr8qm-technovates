import React, { useRef } from "react";
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
  TargetIcon,
  HandshakeIcon,
} from "../components/icons";
import { motion, useScroll, useTransform } from "framer-motion";

import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import { getPageSEO } from "../utils/seo-config";
import { generateBreadcrumbSchema } from "../utils/structured-data";

import SplitText from "../components/animations/SplitText";
import MarqueeText from "../components/animations/MarqueeText";
import AnimatedCounter from "../components/animations/AnimatedCounter";
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

const coreValues = [
  {
    icon: <HeartIcon size={28} className="text-skyblue" />,
    title: "Purpose First",
    desc: "We start with why. Every project begins with understanding the real problem before reaching for solutions.",
    number: "01",
  },
  {
    icon: <BulbIcon size={28} className="text-orange" />,
    title: "Relentless Craft",
    desc: "We obsess over the details. The spacing, the transitions, the edge cases. Because good enough isn't.",
    number: "02",
  },
  {
    icon: <UserIcon size={28} className="text-skyblue" />,
    title: "Inclusive Growth",
    desc: "We build systems that leave no one behind. Our training programs are designed for people from every background.",
    number: "03",
  },
  {
    icon: <BadgeIcon size={28} className="text-oxford" />,
    title: "Excellence as Standard",
    desc: "We don't have a 'premium tier.' The standard is premium. Every client gets our best work.",
    number: "04",
  },
  {
    icon: <TrendingUpIcon size={28} className="text-orange" />,
    title: "Measurable Impact",
    desc: "Pretty isn't enough. We track outcomes, iterate on feedback, and make sure our work actually moves metrics.",
    number: "05",
  },
  {
    icon: <ShieldCheckIcon size={28} className="text-skyblue" />,
    title: "Integrity Always",
    desc: "Honest timelines, transparent pricing, and straight talk. We'd rather lose a deal than overpromise.",
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
      <main className="flex flex-col bg-oxford-deep">
        {/* ==================== SECTION 01: HERO ==================== */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center bg-oxford-deep overflow-hidden sticky top-0 z-10"
        >
          {/* Orbital Background */}
          <OrbitalBackground variant="hero" />

          {/* Geometric decorations */}
          <DotGrid className="top-20 left-8 text-iceblue/30" />
          <DiagonalLines className="bottom-10 right-0 text-skyblue/20" thick />
          <CrossMark className="absolute top-32 right-[20%] text-skyblue/20" size={14} />
          <CrossMark className="absolute bottom-40 left-[15%] text-orange/20" size={12} />

          {/* Noise overlay */}
          <div className="noise-overlay absolute inset-0 z-[1]" />

          {/* Hero Content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="relative z-10 text-center px-4 max-w-6xl mx-auto"
          >
            {/* Decorative section number */}
            <Reveal delay={0.1}>
              <span className="text-skyblue/10 text-[8rem] md:text-[12rem] font-black absolute -top-16 md:-top-24 left-1/2 -translate-x-1/2 select-none leading-none tracking-tighter">
                01
              </span>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-oxford-border px-5 py-2.5 rounded-full mb-8">
                <SparklesIcon size={16} className="text-skyblue" />
                <span className="text-sm text-iceblue/70 tracking-wide uppercase">
                  The Gr8QM Story
                </span>
              </div>
            </Reveal>

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

            <Reveal delay={1.0}>
              <p className="text-iceblue/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                We're a design and technology studio that believes great work
                comes from clarity of purpose. Every product we ship, every
                student we train, every print we deliver reflects our
                commitment to craft and impact.
              </p>
            </Reveal>

            <Reveal delay={1.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button to="/contact" variant="pry" size="lg">
                  Start a project
                  <ArrowRightIcon size={18} className="ml-2" />
                </Button>
                <Button to="/services" variant="sec" size="lg">
                  Our services
                </Button>
              </div>
            </Reveal>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
            }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-iceblue/30 flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-skyblue"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
                }}
              />
            </div>
          </motion.div>

          {/* Marquee absorbed into hero bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10 py-4 bg-skyblue/10 border-t border-oxford-border">
            <MarqueeText
              text="Purpose-driven design  ·  Expert engineering  ·  Real impact  ·  Faith-led innovation"
              speed={25}
              className="text-lg md:text-xl font-bold text-iceblue/40 tracking-wide"
            />
          </div>

          {/* Section connector */}
          <SectionConnector color="skyblue" side="right" />
        </section>

        <AccentLine className="mx-auto my-0" color="skyblue" thickness="medium" width="w-full" />

        {/* ==================== SECTION 02: VISION & MISSION ==================== */}
        <section className="relative py-24 md:py-32 lg:py-44 bg-oxford-deep overflow-hidden sticky top-0 z-20">
          {/* Orbital background */}
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="top-16 right-12 text-iceblue/20" />
          <DiagonalLines className="-bottom-10 -left-10 text-orange/20" />
          <CrossMark className="absolute top-24 left-[10%] text-skyblue/20" size={14} />
          <CrossMark className="absolute bottom-32 right-[25%] text-orange/15" size={10} />

          <FloatingRule className="top-0 left-0" color="skyblue" dashed />

          <Container className="relative z-10">
            {/* Section number decoration */}
            <Reveal direction="left">
              <span className="text-white/[0.03] text-[6rem] md:text-[10rem] font-black leading-none tracking-tighter select-none">
                02
              </span>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start -mt-12 md:-mt-20">
              {/* Vision */}
              <Reveal direction="left" delay={0.1}>
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-skyblue/5 -z-10" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-skyblue/10 border border-oxford-border">
                      <SpiralIcon size={28} className="text-skyblue" />
                    </div>
                    <span className="text-sm font-bold text-skyblue uppercase tracking-widest">
                      Vision
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-[1.15]">
                    Technology that{" "}
                    <span className="gradient-text">serves people</span>
                  </h2>
                  <p className="text-iceblue/70 text-lg leading-relaxed">
                    A world where technology serves people, not the other way
                    around. We envision communities thriving because the tools
                    they use were built with intention, empathy, and excellence.
                  </p>
                </div>
              </Reveal>

              {/* Mission */}
              <Reveal direction="right" delay={0.3}>
                <div className="relative lg:mt-20">
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-orange/5 -z-10" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-orange/10 border border-oxford-border">
                      <SparklesIcon size={28} className="text-orange" />
                    </div>
                    <span className="text-sm font-bold text-orange uppercase tracking-widest">
                      Mission
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-[1.15]">
                    Equipping with{" "}
                    <span className="gradient-text">beautiful solutions</span>
                  </h2>
                  <p className="text-iceblue/70 text-lg leading-relaxed">
                    To equip individuals and organizations with beautifully
                    designed, expertly engineered solutions. We train talent,
                    build products, and deliver print that makes people stop and
                    look twice.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Quote */}
            <Reveal delay={0.5} className="mt-16 md:mt-24">
              <div className="bg-white/5 backdrop-blur-sm border border-oxford-border rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-skyblue/5 to-orange/5 opacity-40" />
                <p className="text-xl md:text-2xl font-bold italic text-white relative z-10">
                  "Good design is good business.{" "}
                  <span className="gradient-text">Great design changes lives.</span>"
                </p>
              </div>
            </Reveal>
          </Container>

          {/* Section connector */}
          <SectionConnector color="orange" side="left" />
        </section>

        <FloatingRule className="relative z-[25]" color="orange" thick />

        {/* ==================== SECTION 03: CORE VALUES ==================== */}
        <section className="relative py-24 md:py-32 lg:py-44 bg-oxford-deep overflow-hidden sticky top-0 z-30">
          {/* Orbital background */}
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DiagonalLines className="top-0 right-0 text-skyblue/20" thick />
          <DotGrid className="bottom-20 left-8 text-orange/20" />
          <CrossMark className="absolute top-40 right-[12%] text-iceblue/15" size={16} />
          <CrossMark className="absolute bottom-24 left-[30%] text-skyblue/20" size={12} />
          <CrossMark className="absolute top-[60%] left-[8%] text-orange/15" size={10} />

          <div className="noise-overlay absolute inset-0" />

          <Container className="relative z-10">
            {/* Section header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16 md:mb-20">
              <div>
                <Reveal direction="left">
                  <span className="text-white/[0.03] text-[6rem] md:text-[10rem] font-black leading-none tracking-tighter select-none block -mb-8 md:-mb-16">
                    03
                  </span>
                </Reveal>
                <Reveal direction="left" delay={0.1}>
                  <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-oxford-border px-4 py-2 rounded-full mb-4">
                    <TargetIcon size={14} className="text-skyblue" />
                    <span className="text-sm text-iceblue/70 tracking-wide uppercase">
                      What Drives Us
                    </span>
                  </div>
                </Reveal>
                <Reveal direction="left" delay={0.2}>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                    Our Core{" "}
                    <span className="gradient-text">Values</span>
                  </h2>
                </Reveal>
              </div>
              <Reveal direction="right" delay={0.3}>
                <p className="text-iceblue/70 text-lg max-w-md leading-relaxed">
                  The principles behind every pixel, every line of code, and
                  every decision we make.
                </p>
              </Reveal>
            </div>

            <AccentLine className="mb-12" color="skyblue" thickness="thin" width="w-32" />

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {coreValues.map((item, index) => (
                <Reveal
                  key={index}
                  direction={index % 2 === 0 ? "up" : "left"}
                  delay={index * 0.1}
                >
                  <div className="group bg-white/5 backdrop-blur-sm border border-oxford-border rounded-2xl p-6 md:p-8 h-full hover:border-skyblue/20 transition-colors duration-500">
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
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>

          {/* Section connector */}
          <SectionConnector color="skyblue" side="center" />
        </section>

        <FloatingRule className="relative z-[35]" color="skyblue" dashed />

        {/* ==================== SECTION 04: STATS ==================== */}
        <section className="relative py-24 md:py-32 bg-oxford-deep overflow-hidden sticky top-0 z-40">
          {/* Orbital background */}
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="top-12 left-[5%] text-skyblue/20" />
          <DiagonalLines className="bottom-0 right-0 text-iceblue/15" />
          <CrossMark className="absolute top-20 right-[18%] text-orange/20" size={14} />
          <CrossMark className="absolute bottom-16 left-[40%] text-skyblue/15" size={10} />

          <Container className="relative z-10">
            <Reveal>
              <div className="text-center mb-16">
                <span className="text-white/[0.03] text-[6rem] md:text-[10rem] font-black leading-none tracking-tighter select-none block -mb-6 md:-mb-14">
                  04
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  Impact in{" "}
                  <span className="gradient-text">Numbers</span>
                </h2>
              </div>
            </Reveal>

            <AccentLine className="mx-auto mb-12" color="orange" thickness="medium" width="w-24" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <Reveal
                  key={index}
                  direction="up"
                  delay={index * 0.15}
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-oxford-border rounded-2xl p-6 md:p-8 text-center hover:border-skyblue/20 transition-colors duration-300 group">
                    <AnimatedCounter
                      target={stat.target}
                      suffix={stat.suffix}
                      className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text block mb-2"
                    />
                    <p className="text-iceblue/50 text-sm md:text-base font-medium tracking-wide uppercase">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Marquee absorbed into stats section */}
            <div className="mt-16 -mx-4 md:-mx-8 overflow-hidden border-t border-b border-oxford-border py-4">
              <MarqueeText
                text="Craft  ·  Excellence  ·  Purpose  ·  Integrity  ·  Impact  ·  Faith"
                speed={30}
                className="text-lg md:text-xl font-bold text-white/10 tracking-widest uppercase"
                reverse
              />
            </div>
          </Container>

          {/* Section connector */}
          <SectionConnector color="orange" side="right" />
        </section>

        <AccentLine className="mx-auto relative z-[45]" color="orange" thickness="thick" width="w-full" />

        {/* ==================== SECTION 05: FAITH-BASED CTA ==================== */}
        <section className="relative py-24 md:py-32 lg:py-44 bg-oxford-deep overflow-hidden">
          {/* Orbital Background (CTA variant) */}
          <OrbitalBackground variant="cta" />

          {/* Geometric decorations */}
          <DotGrid className="bottom-16 right-10 text-iceblue/20" />
          <DiagonalLines className="top-0 left-0 text-orange/15" thick />
          <CrossMark className="absolute top-28 left-[22%] text-skyblue/20" size={14} />
          <CrossMark className="absolute bottom-36 right-[15%] text-orange/15" size={12} />
          <CrossMark className="absolute top-[45%] right-[35%] text-iceblue/10" size={10} />

          <div className="noise-overlay absolute inset-0" />

          <FloatingRule className="top-0 left-0" color="orange" dashed />

          <Container className="relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <span className="text-white/[0.03] text-[6rem] md:text-[10rem] font-black leading-none tracking-tighter select-none block -mb-6 md:-mb-14">
                  05
                </span>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-oxford-border px-5 py-2.5 rounded-full mb-8">
                  <HandshakeIcon size={16} className="text-orange" />
                  <span className="text-sm text-iceblue/70 tracking-wide uppercase">
                    Built on Faith
                  </span>
                </div>
              </Reveal>

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

              <Reveal delay={0.6}>
                <p className="text-iceblue/70 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
                  We bring design thinking, engineering rigor, and a genuine
                  passion for craft to every project. If you're building something
                  that matters, we want to be part of it.
                </p>
              </Reveal>

              <Reveal delay={0.7}>
                <p className="text-iceblue/40 text-base italic max-w-xl mx-auto mb-10">
                  Our work is rooted in faith -- the belief that what we create
                  should uplift, serve, and reflect something greater than ourselves.
                </p>
              </Reveal>

              <AccentLine className="mx-auto mb-10" color="orange" thickness="medium" width="w-20" />

              <Reveal delay={0.8}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button to="/contact" variant="pry" size="lg">
                    Let's talk
                    <ArrowRightIcon size={18} className="ml-2" />
                  </Button>
                  <Button to="/services" variant="sec" size="lg">
                    Explore our work
                  </Button>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      </main>
    </PageTransition>
  );
};

export default AboutPage;
