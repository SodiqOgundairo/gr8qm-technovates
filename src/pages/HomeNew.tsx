import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container";
import {
  SparklesIcon,
  BrainCircuitIcon,
  SpiralIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  TargetIcon,
  ShieldCheckIcon,
  HandshakeIcon,
} from "../components/icons";
import PageTransition from "../components/layout/PageTransition";
import SplitText from "../components/animations/SplitText";
import MarqueeText from "../components/animations/MarqueeText";
import AnimatedCounter from "../components/animations/AnimatedCounter";
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
import { SEO } from "../components/common/SEO";
import { getPageSEO } from "../utils/seo-config";
import {
  generateWebSiteSchema,
  generateBreadcrumbSchema,
} from "../utils/structured-data";

const Home: React.FC = () => {
  const pageSEO = getPageSEO("home");
  const websiteSchema = generateWebSiteSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
  ]);

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.6], [1, 0.95]);

  const services = [
    {
      icon: <BrainCircuitIcon size={28} />,
      title: "Design & Engineering",
      desc: "Websites, apps, and digital products built to perform and designed to impress.",
      color: "skyblue",
      link: "/services/design-build",
      stats: "50+",
      statsLabel: "Projects Delivered",
    },
    {
      icon: <SpiralIcon size={28} />,
      title: "Tech Training",
      desc: "Sponsored programs that turn beginners into job-ready developers and designers.",
      color: "orange",
      link: "/services/tech-training",
      stats: "200+",
      statsLabel: "Students Trained",
    },
    {
      icon: <TrendingUpIcon size={28} />,
      title: "Print Shop",
      desc: "Business cards, banners, merch, and packaging. Premium print with fast turnaround.",
      color: "skyblue",
      link: "/services/print-shop",
      stats: "1000+",
      statsLabel: "Prints Completed",
    },
  ];

  const values = [
    {
      icon: <TargetIcon size={28} className="text-skyblue" />,
      title: "Purpose-Driven Design",
      desc: "Every pixel serves a goal. We design solutions that actually move the needle for your users and your business.",
    },
    {
      icon: <HandshakeIcon size={28} className="text-orange" />,
      title: "True Partnership",
      desc: "We don't just hand off deliverables. We embed with your team, understand your context, and build together.",
    },
    {
      icon: <ShieldCheckIcon size={28} className="text-skyblue" />,
      title: "Built to Last",
      desc: "Clean code, scalable architecture, and ongoing support. We measure what we create and make sure it endures.",
    },
  ];

  return (
    <PageTransition>
      <SEO
        title={pageSEO.title}
        description={pageSEO.description}
        keywords={pageSEO.keywords}
        type={pageSEO.type}
        url="/"
        structuredData={[websiteSchema, breadcrumbSchema]}
      />
      <main className="flex flex-col">
        {/* ================================================================
           HERO — sticky z-10
           ================================================================ */}
        <section
          ref={heroRef}
          className="sticky top-0 z-10 relative min-h-screen flex items-center justify-center overflow-hidden bg-oxford-deep"
        >
          {/* Orbital animated background */}
          <OrbitalBackground variant="hero" />

          {/* Geometric decorations */}
          <DotGrid className="top-12 left-8 text-iceblue/30" />
          <DiagonalLines className="bottom-0 right-0 text-skyblue/20" />
          <ConcentricCircles className="-bottom-32 -left-32 text-iceblue/20" />
          <CrossMark className="absolute top-24 right-[18%] text-orange/30" size={20} />
          <CrossMark className="absolute bottom-32 left-[12%] text-skyblue/30" size={14} />

          {/* Hero Content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="relative z-10 text-center px-4"
          >
            <Container className="flex flex-col items-center gap-6 md:gap-8">
              {/* Badge */}
              <Reveal direction="up" delay={0.2}>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-oxford-border backdrop-blur-sm"
                  whileHover={{ scale: 1.05, borderColor: "rgba(0,152,218,0.4)" }}
                >
                  <SparklesIcon size={14} className="text-skyblue" />
                  <span className="text-xs md:text-sm font-medium text-iceblue tracking-wide">
                    Design-led. Purpose-driven.
                  </span>
                </motion.div>
              </Reveal>

              {/* Main Heading */}
              <div className="max-w-4xl">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]">
                  <SplitText
                    className="text-white"
                    delay={0.3}
                    stagger={0.04}
                    type="words"
                    as="span"
                  >
                    We design
                  </SplitText>
                  <br />
                  <SplitText
                    className="gradient-text"
                    delay={0.6}
                    stagger={0.04}
                    type="words"
                    as="span"
                  >
                    what's next.
                  </SplitText>
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  <SplitText
                    className="text-white"
                    delay={0.9}
                    stagger={0.04}
                    type="words"
                    as="span"
                  >
                    We build
                  </SplitText>{" "}
                  <SplitText
                    className="text-orange"
                    delay={1.1}
                    stagger={0.04}
                    type="words"
                    as="span"
                  >
                    what matters.
                  </SplitText>
                </h1>
              </div>

              {/* Subtext */}
              <Reveal delay={1.3} className="max-w-xl">
                <p className="text-iceblue/70 text-base md:text-lg leading-relaxed">
                  Strategy, design, and engineering under one roof. We craft
                  digital products, train the next wave of tech talent, and
                  deliver print that turns heads.
                </p>
              </Reveal>

              {/* CTAs */}
              <Reveal delay={1.5}>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    to="/portfolio"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 bg-skyblue text-white font-medium rounded-full overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-skyblue/20"
                    data-cursor="view"
                  >
                    <span className="relative z-10">See Our Work</span>
                    <motion.span
                      className="relative z-10"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRightIcon size={18} />
                    </motion.span>
                    <span className="absolute inset-0 bg-oxford scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                  </Link>

                  <Link
                    to="/services/tech-training"
                    className="group inline-flex items-center gap-2 px-8 py-4 text-white font-medium rounded-full border border-white/20 hover:border-skyblue/50 transition-all duration-300 hover:bg-white/5"
                  >
                    Join the Academy
                    <ArrowRightIcon
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </Reveal>

              {/* Scroll indicator */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-iceblue/40">
                  Scroll
                </span>
                <motion.div
                  className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="w-1 h-1.5 bg-skyblue rounded-full"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            </Container>
          </motion.div>

          {/* Marquee absorbed inside hero at bottom */}
          <div className="absolute bottom-0 left-0 right-0 py-6 bg-oxford-deep/80 backdrop-blur-sm border-t border-oxford-border z-20">
            <MarqueeText
              text="DESIGN ✦ BUILD ✦ TRAIN ✦ PRINT ✦ INNOVATE ✦ CREATE ✦ LAUNCH"
              className="text-white/10 text-xl md:text-2xl font-black tracking-widest"
              speed={25}
            />
          </div>

          {/* Floating rule at bottom edge */}
          <FloatingRule className="bottom-0 left-0 right-0" color="skyblue" dashed />

          {/* Section connector */}
          <SectionConnector side="right" color="skyblue" />
        </section>

        {/* ================================================================
           WHAT WE DO — sticky z-20
           ================================================================ */}
        <section className="sticky top-0 z-20 py-24 md:py-36 lg:py-48 bg-oxford-deep relative overflow-hidden">
          {/* Geometric decorations */}
          <DotGrid className="top-16 right-12 text-skyblue/20" />
          <DiagonalLines thick className="-bottom-20 -left-20 text-iceblue/15" />
          <ConcentricCircles className="top-1/4 -right-48 text-orange/10" />
          <CrossMark className="absolute top-32 left-[8%] text-orange/25" size={16} />

          {/* Floating rules */}
          <FloatingRule className="top-0 left-0 right-0" color="skyblue" />
          <FloatingRule className="bottom-0 left-0 right-0" color="orange" dashed />

          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              {/* Left - Section Header */}
              <div className="lg:sticky lg:top-32">
                <Reveal direction="left">
                  <AccentLine color="skyblue" thickness="medium" width="w-16" className="mb-4" />
                  <span className="text-skyblue text-sm font-mono tracking-wider uppercase">
                    What we do
                  </span>
                </Reveal>
                <Reveal direction="left" delay={0.1}>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-4 tracking-tight leading-[1.1]">
                    Three things.
                    <br />
                    <span className="gradient-text">Done exceptionally</span>
                    <br />
                    well.
                  </h2>
                </Reveal>
                <Reveal direction="left" delay={0.2}>
                  <p className="text-iceblue/70 text-lg mt-6 max-w-md leading-relaxed">
                    We don't try to do everything. We focus on what we're best at
                    and deliver work that speaks for itself.
                  </p>
                </Reveal>

                {/* Stats */}
                <div className="flex gap-12 mt-10">
                  <Reveal direction="up" delay={0.3}>
                    <div>
                      <AnimatedCounter
                        target={50}
                        suffix="+"
                        className="text-4xl font-black text-white"
                      />
                      <p className="text-sm text-iceblue/70 mt-1">Projects</p>
                    </div>
                  </Reveal>
                  <Reveal direction="up" delay={0.4}>
                    <div>
                      <AnimatedCounter
                        target={200}
                        suffix="+"
                        className="text-4xl font-black text-white"
                      />
                      <p className="text-sm text-iceblue/70 mt-1">Students</p>
                    </div>
                  </Reveal>
                  <Reveal direction="up" delay={0.5}>
                    <div>
                      <AnimatedCounter
                        target={99}
                        suffix="%"
                        className="text-4xl font-black text-white"
                      />
                      <p className="text-sm text-iceblue/70 mt-1">Satisfaction</p>
                    </div>
                  </Reveal>
                </div>
              </div>

              {/* Right - Service Cards */}
              <div className="flex flex-col gap-8">
                {services.map((service, i) => (
                  <Reveal key={i} direction="right" delay={i * 0.15}>
                    <Link to={service.link} data-cursor="explore">
                      <div className="group rounded-2xl bg-white/5 backdrop-blur-sm border border-oxford-border p-8 transition-all duration-500 hover:bg-white/[0.08] hover:border-skyblue/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-skyblue/5">
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className={`p-3 rounded-xl ${
                              service.color === "orange"
                                ? "bg-orange/10 text-orange"
                                : "bg-skyblue/10 text-skyblue"
                            }`}
                          >
                            {service.icon}
                          </div>
                          <motion.div className="text-iceblue/40 group-hover:text-skyblue group-hover:translate-x-1 transition-all duration-300">
                            <ArrowRightIcon size={20} />
                          </motion.div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {service.title}
                        </h3>
                        <p className="text-iceblue/70 leading-relaxed mb-6">
                          {service.desc}
                        </p>
                        <div className="flex items-center gap-2 pt-4 border-t border-oxford-border">
                          <span className="text-2xl font-black text-white">
                            {service.stats}
                          </span>
                          <span className="text-sm text-iceblue/50">
                            {service.statsLabel}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>

          {/* Section connector */}
          <SectionConnector side="left" color="orange" />
        </section>

        {/* ================================================================
           FROM CONCEPT TO LAUNCH — sticky z-30
           ================================================================ */}
        <section className="sticky top-0 z-30 relative overflow-hidden bg-oxford-deep">
          {/* Dark section header */}
          <div className="py-24 md:py-36 relative">
            <OrbitalBackground variant="section" />

            {/* Geometric decorations */}
            <DiagonalLines className="top-0 left-0 text-skyblue/15" />
            <CrossMark className="absolute top-16 right-[20%] text-skyblue/30" size={18} />
            <DotGrid className="bottom-8 right-8 text-orange/15" />

            <FloatingRule className="top-0 left-0 right-0" color="orange" />

            <Container className="relative z-10 text-center">
              <Reveal direction="up">
                <AccentLine color="orange" thickness="medium" width="w-12" className="mb-4 mx-auto" />
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-oxford-border text-sm text-iceblue mb-6">
                  What We Deliver
                </span>
              </Reveal>
              <Reveal delay={0.2}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                  From <span className="text-skyblue">Concept</span> to{" "}
                  <span className="text-orange">Launch</span>
                </h2>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-iceblue/70 text-lg mt-4 max-w-xl mx-auto">
                  Every project gets the full treatment: strategy, design,
                  development, and ongoing support.
                </p>
              </Reveal>
            </Container>
          </div>

          {/* Service showcases */}
          <div className="py-24 md:py-36 relative">
            <FloatingRule className="top-0 left-0 right-0" color="skyblue" dashed />
            <ConcentricCircles className="-top-32 left-1/2 -translate-x-1/2 text-skyblue/10" />

            <Container>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Design & Build",
                    desc: "We don't just make things pretty. We architect digital products that solve real problems, from first wireframe to final deploy.",
                    link: "/services/design-build",
                    number: "01",
                    accent: "skyblue",
                  },
                  {
                    title: "Tech Training",
                    desc: "Zero to hired. Our sponsored cohorts teach product design, development, and QA with real projects and mentorship from working professionals.",
                    link: "/services/tech-training",
                    number: "02",
                    accent: "orange",
                  },
                  {
                    title: "Print Shop",
                    desc: "Your brand, tangible. Business cards, flyers, banners, branded merch, and custom packaging. Quality print, fast delivery.",
                    link: "/services/print-shop",
                    number: "03",
                    accent: "skyblue",
                  },
                ].map((item, i) => (
                  <Reveal key={i} direction="up" delay={i * 0.15}>
                    <Link to={item.link} data-cursor="view">
                      <div className="group relative bg-white/5 backdrop-blur-sm border border-oxford-border rounded-3xl p-8 h-full transition-all duration-500 hover:bg-white/[0.08] hover:border-skyblue/30 hover:shadow-2xl hover:shadow-skyblue/5 overflow-hidden">
                        {/* Large number background */}
                        <span
                          className={`absolute -top-6 -right-2 text-[140px] font-black leading-none ${
                            item.accent === "orange"
                              ? "text-orange/5"
                              : "text-skyblue/5"
                          } group-hover:text-skyblue/10 transition-colors duration-500 select-none`}
                        >
                          {item.number}
                        </span>

                        <div className="relative z-10">
                          <span
                            className={`text-sm font-mono ${
                              item.accent === "orange"
                                ? "text-orange"
                                : "text-skyblue"
                            }`}
                          >
                            {item.number}
                          </span>
                          <h3 className="text-2xl font-bold text-white mt-4 mb-3">
                            {item.title}
                          </h3>
                          <p className="text-iceblue/70 leading-relaxed mb-8">
                            {item.desc}
                          </p>

                          <div className="flex items-center gap-2 text-iceblue/50 group-hover:text-skyblue transition-colors">
                            <span className="text-sm font-medium">
                              Explore
                            </span>
                            <ArrowRightIcon
                              size={16}
                              className="group-hover:translate-x-2 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </Container>
          </div>

          <FloatingRule className="bottom-0 left-0 right-0" color="orange" thick />

          {/* Section connector */}
          <SectionConnector side="right" color="skyblue" />
        </section>

        {/* ================================================================
           WHY CHOOSE GR8QM — sticky z-40
           ================================================================ */}
        <section className="sticky top-0 z-40 py-24 md:py-36 lg:py-48 bg-oxford-deep relative overflow-hidden">
          {/* Geometric decorations */}
          <DiagonalLines thick className="top-0 right-0 text-orange/10" />
          <DotGrid className="bottom-20 left-10 text-iceblue/15" />
          <ConcentricCircles className="top-1/3 -left-48 text-skyblue/10" />
          <CrossMark className="absolute bottom-24 right-[15%] text-orange/25" size={18} />
          <CrossMark className="absolute top-20 left-[25%] text-skyblue/20" size={12} />

          <FloatingRule className="top-0 left-0 right-0" color="skyblue" />

          <Container className="relative z-10">
            <div className="text-center mb-16 md:mb-24">
              <Reveal>
                <AccentLine color="skyblue" thickness="medium" width="w-16" className="mb-4 mx-auto" />
                <span className="text-skyblue text-sm font-mono tracking-wider uppercase">
                  Why teams choose us
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-4 tracking-tight">
                  We bring <span className="gradient-text">design thinking</span>,
                  <br className="hidden md:block" /> technical depth, and a bias
                  for shipping.
                </h2>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((item, index) => (
                <Reveal key={index} direction="up" delay={index * 0.15}>
                  <motion.div
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group relative bg-white/5 backdrop-blur-sm border border-oxford-border rounded-2xl p-8 h-full transition-all duration-500 hover:bg-white/[0.08] hover:border-skyblue/30 hover:shadow-xl hover:shadow-skyblue/5"
                  >
                    {/* Gradient line on top */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-skyblue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="mb-6">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-iceblue/70 leading-relaxed">{item.desc}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </Container>

          <FloatingRule className="bottom-0 left-0 right-0" color="orange" dashed />

          {/* Section connector */}
          <SectionConnector side="left" color="orange" />
        </section>

        {/* ================================================================
           FAITH CTA — relative (last section, no sticky)
           ================================================================ */}
        <section className="relative z-50 py-24 md:py-36 bg-oxford-deep overflow-hidden">
          <OrbitalBackground variant="cta" />

          {/* Geometric decorations */}
          <DotGrid className="top-12 left-8 text-orange/20" />
          <DiagonalLines className="bottom-0 right-0 text-skyblue/15" />
          <ConcentricCircles className="-bottom-32 -right-32 text-iceblue/10" />
          <CrossMark className="absolute top-20 right-[12%] text-skyblue/30" size={16} />
          <CrossMark className="absolute bottom-16 left-[18%] text-orange/25" size={14} />

          <FloatingRule className="top-0 left-0 right-0" color="skyblue" thick />

          <Container className="relative z-10 text-center">
            <Reveal direction="up">
              <AccentLine color="orange" thickness="medium" width="w-12" className="mb-6 mx-auto" />
              <p className="text-orange/80 text-sm font-mono tracking-wider uppercase mb-6">
                Rooted in faith. Driven by excellence.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-[1.1]">
                Ready to work with a team that{" "}
                <span className="text-skyblue">cares</span>?
              </h2>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-iceblue/60 text-lg mt-6 max-w-xl mx-auto">
                Good design is good business. Great design changes lives. Let's
                create something extraordinary together.
              </p>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Link
                  to="/contact"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-skyblue text-white font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-skyblue/20"
                >
                  <span className="relative z-10">Start a Conversation</span>
                  <motion.span
                    className="relative z-10"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRightIcon size={18} />
                  </motion.span>
                  <span className="absolute inset-0 bg-oxford scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 text-white font-medium rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  Learn More About Us
                </Link>
              </div>
            </Reveal>
          </Container>

          {/* Bottom marquee absorbed inside CTA section */}
          <div className="absolute bottom-0 left-0 right-0 py-4 border-t border-oxford-border">
            <MarqueeText
              text="GR8QM TECHNOVATES ✦ DESIGN AGENCY ✦ TECH TRAINING ✦ PRINT SHOP ✦ DIGITAL PRODUCTS"
              className="text-white/5 text-lg font-black tracking-widest"
              speed={30}
              reverse
            />
          </div>
        </section>
      </main>
    </PageTransition>
  );
};

export default Home;
