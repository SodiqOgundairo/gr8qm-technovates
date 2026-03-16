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
import Scene3D from "../components/animations/Scene3D";
import SplitText from "../components/animations/SplitText";
import RevealOnScroll from "../components/animations/RevealOnScroll";
import MarqueeText from "../components/animations/MarqueeText";
import { ParallaxLayer } from "../components/animations/ParallaxSection";
import GlowCard from "../components/animations/GlowCard";
import AnimatedCounter from "../components/animations/AnimatedCounter";
import MagneticButton from "../components/animations/MagneticButton";
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
      icon: <ShieldCheckIcon size={28} className="text-oxford" />,
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
      <main className="flex flex-col overflow-hidden">
        {/* ═══════════════ HERO ═══════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Three.js Background */}
          <Scene3D variant="hero" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-light/60 via-transparent to-light z-[1]" />

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-skyblue/10 blur-[100px]"
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-orange/10 blur-[120px]"
            animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Hero Content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="relative z-10 text-center px-4"
          >
            <Container className="flex flex-col items-center gap-6 md:gap-8">
              {/* Badge */}
              <RevealOnScroll direction="scale" delay={0.2}>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oxford/5 border border-skyblue/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, borderColor: "rgba(0,152,218,0.4)" }}
                >
                  <SparklesIcon size={14} className="text-skyblue" />
                  <span className="text-xs md:text-sm font-medium text-oxford tracking-wide">
                    Design-led. Purpose-driven.
                  </span>
                </motion.div>
              </RevealOnScroll>

              {/* Main Heading */}
              <div className="max-w-4xl">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]">
                  <SplitText
                    className="text-oxford"
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
                    className="text-oxford"
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
              <RevealOnScroll delay={1.3} className="max-w-xl">
                <p className="text-gray-2 text-base md:text-lg leading-relaxed">
                  Strategy, design, and engineering under one roof. We craft
                  digital products, train the next wave of tech talent, and
                  deliver print that turns heads.
                </p>
              </RevealOnScroll>

              {/* CTAs */}
              <RevealOnScroll delay={1.5}>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <MagneticButton strength={0.2}>
                    <Link
                      to="/portfolio"
                      className="group relative inline-flex items-center gap-2 px-8 py-4 bg-oxford text-white font-medium rounded-full overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-skyblue/20"
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
                      <span className="absolute inset-0 bg-skyblue scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                    </Link>
                  </MagneticButton>

                  <MagneticButton strength={0.2}>
                    <Link
                      to="/services/tech-training"
                      className="group inline-flex items-center gap-2 px-8 py-4 text-oxford font-medium rounded-full border border-oxford/20 hover:border-skyblue/50 transition-all duration-300 hover:bg-skyblue/5"
                    >
                      Join the Academy
                      <ArrowRightIcon
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </MagneticButton>
                </div>
              </RevealOnScroll>

              {/* Scroll indicator */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-1">
                  Scroll
                </span>
                <motion.div
                  className="w-5 h-8 rounded-full border border-gray-1/30 flex justify-center pt-1.5"
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
        </section>

        {/* ═══════════════ MARQUEE DIVIDER ═══════════════ */}
        <div className="py-6 bg-oxford overflow-hidden">
          <MarqueeText
            text="DESIGN ✦ BUILD ✦ TRAIN ✦ PRINT ✦ INNOVATE ✦ CREATE ✦ LAUNCH"
            className="text-white/20 text-xl md:text-2xl font-black tracking-widest"
            speed={25}
          />
        </div>

        {/* ═══════════════ WHAT WE DO ═══════════════ */}
        <section className="py-24 md:py-36 lg:py-48 bg-light relative noise-overlay">
          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              {/* Left - Section Header */}
              <div className="lg:sticky lg:top-32">
                <RevealOnScroll direction="left">
                  <span className="text-skyblue text-sm font-mono tracking-wider uppercase">
                    What we do
                  </span>
                </RevealOnScroll>
                <RevealOnScroll direction="left" delay={0.1}>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-oxford mt-4 tracking-tight leading-[1.1]">
                    Three things.
                    <br />
                    <span className="gradient-text">Done exceptionally</span>
                    <br />
                    well.
                  </h2>
                </RevealOnScroll>
                <RevealOnScroll direction="left" delay={0.2}>
                  <p className="text-gray-2 text-lg mt-6 max-w-md leading-relaxed">
                    We don't try to do everything. We focus on what we're best at
                    and deliver work that speaks for itself.
                  </p>
                </RevealOnScroll>

                {/* Stats */}
                <div className="flex gap-12 mt-10">
                  <RevealOnScroll direction="up" delay={0.3}>
                    <div>
                      <AnimatedCounter
                        target={50}
                        suffix="+"
                        className="text-4xl font-black text-oxford"
                      />
                      <p className="text-sm text-gray-2 mt-1">Projects</p>
                    </div>
                  </RevealOnScroll>
                  <RevealOnScroll direction="up" delay={0.4}>
                    <div>
                      <AnimatedCounter
                        target={200}
                        suffix="+"
                        className="text-4xl font-black text-oxford"
                      />
                      <p className="text-sm text-gray-2 mt-1">Students</p>
                    </div>
                  </RevealOnScroll>
                  <RevealOnScroll direction="up" delay={0.5}>
                    <div>
                      <AnimatedCounter
                        target={99}
                        suffix="%"
                        className="text-4xl font-black text-oxford"
                      />
                      <p className="text-sm text-gray-2 mt-1">Satisfaction</p>
                    </div>
                  </RevealOnScroll>
                </div>
              </div>

              {/* Right - Service Cards */}
              <div className="flex flex-col gap-8">
                {services.map((service, i) => (
                  <RevealOnScroll key={i} direction="right" delay={i * 0.15}>
                    <Link to={service.link} data-cursor="explore">
                      <GlowCard
                        className="group rounded-2xl bg-white border border-gray-100/80 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-skyblue/5 hover:border-skyblue/20 hover:-translate-y-1"
                        glowColor={
                          service.color === "orange"
                            ? "rgba(245, 134, 52, 0.1)"
                            : "rgba(0, 152, 218, 0.1)"
                        }
                      >
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
                          <motion.div
                            className="text-gray-1 group-hover:text-skyblue group-hover:translate-x-1 transition-all duration-300"
                          >
                            <ArrowRightIcon size={20} />
                          </motion.div>
                        </div>
                        <h3 className="text-xl font-bold text-oxford mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-2 leading-relaxed mb-6">
                          {service.desc}
                        </p>
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                          <span className="text-2xl font-black text-oxford">
                            {service.stats}
                          </span>
                          <span className="text-sm text-gray-1">
                            {service.statsLabel}
                          </span>
                        </div>
                      </GlowCard>
                    </Link>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ═══════════════ PILLARS / FROM CONCEPT TO LAUNCH ═══════════════ */}
        <section className="relative overflow-hidden">
          {/* Dark section header */}
          <div className="py-24 md:py-36 bg-oxford relative">
            <Scene3D variant="minimal" />
            <Container className="relative z-10 text-center">
              <RevealOnScroll direction="scale">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-iceblue mb-6">
                  What We Deliver
                </span>
              </RevealOnScroll>
              <RevealOnScroll delay={0.2}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                  From <span className="text-skyblue">Concept</span> to{" "}
                  <span className="text-orange">Launch</span>
                </h2>
              </RevealOnScroll>
              <RevealOnScroll delay={0.3}>
                <p className="text-iceblue/70 text-lg mt-4 max-w-xl mx-auto">
                  Every project gets the full treatment: strategy, design,
                  development, and ongoing support.
                </p>
              </RevealOnScroll>
            </Container>
          </div>

          {/* Service showcases */}
          <div className="py-24 md:py-36 bg-gradient-to-b from-iceblue/30 to-light">
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
                  <RevealOnScroll key={i} direction="up" delay={i * 0.15}>
                    <ParallaxLayer speed={0.1 * (i + 1)}>
                      <Link to={item.link} data-cursor="view">
                        <div className="group relative bg-white rounded-3xl p-8 h-full border border-transparent hover:border-skyblue/20 transition-all duration-500 hover:shadow-2xl hover:shadow-skyblue/5 overflow-hidden">
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
                            <h3 className="text-2xl font-bold text-oxford mt-4 mb-3">
                              {item.title}
                            </h3>
                            <p className="text-gray-2 leading-relaxed mb-8">
                              {item.desc}
                            </p>

                            <div className="flex items-center gap-2 text-oxford group-hover:text-skyblue transition-colors">
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
                    </ParallaxLayer>
                  </RevealOnScroll>
                ))}
              </div>
            </Container>
          </div>
        </section>

        {/* ═══════════════ WHY CHOOSE GR8QM ═══════════════ */}
        <section className="py-24 md:py-36 lg:py-48 bg-light relative">
          {/* Decorative floating elements */}
          <motion.div
            className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-skyblue/5 blur-[150px]"
            animate={{ scale: [1, 1.2, 1], x: [0, -40, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          <Container className="relative z-10">
            <div className="text-center mb-16 md:mb-24">
              <RevealOnScroll>
                <span className="text-skyblue text-sm font-mono tracking-wider uppercase">
                  Why teams choose us
                </span>
              </RevealOnScroll>
              <RevealOnScroll delay={0.1}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-oxford mt-4 tracking-tight">
                  We bring <span className="gradient-text">design thinking</span>,
                  <br className="hidden md:block" /> technical depth, and a bias
                  for shipping.
                </h2>
              </RevealOnScroll>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((item, index) => (
                <RevealOnScroll key={index} direction="up" delay={index * 0.15}>
                  <motion.div
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group relative bg-white rounded-2xl p-8 h-full border border-gray-100/80 transition-all duration-500 hover:shadow-xl hover:shadow-skyblue/5 hover:border-skyblue/20"
                  >
                    {/* Gradient line on top */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-skyblue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="mb-6">{item.icon}</div>
                    <h3 className="text-xl font-bold text-oxford mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-2 leading-relaxed">{item.desc}</p>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════════ FAITH CTA ═══════════════ */}
        <section className="py-24 md:py-36 bg-oxford relative overflow-hidden">
          <Scene3D variant="minimal" />

          {/* Animated gradient orbs */}
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-skyblue/10 blur-[120px]"
            animate={{ y: [0, -50, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 15, repeat: Infinity }}
          />

          <Container className="relative z-10 text-center">
            <RevealOnScroll direction="scale">
              <p className="text-orange/80 text-sm font-mono tracking-wider uppercase mb-6">
                Rooted in faith. Driven by excellence.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-[1.1]">
                Ready to work with a team that{" "}
                <span className="text-skyblue">cares</span>?
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={0.3}>
              <p className="text-iceblue/60 text-lg mt-6 max-w-xl mx-auto">
                Good design is good business. Great design changes lives. Let's
                create something extraordinary together.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.5}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <MagneticButton strength={0.2}>
                  <Link
                    to="/contact"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-oxford font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-skyblue/20"
                  >
                    <span className="relative z-10">Start a Conversation</span>
                    <motion.span
                      className="relative z-10"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                    <span className="absolute inset-0 bg-skyblue scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white flex items-center justify-center gap-2 font-medium">
                      Start a Conversation →
                    </span>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 px-8 py-4 text-white font-medium rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                  >
                    Learn More About Us
                  </Link>
                </MagneticButton>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ═══════════════ BOTTOM MARQUEE ═══════════════ */}
        <div className="py-4 bg-light border-t border-gray-100">
          <MarqueeText
            text="GR8QM TECHNOVATES ✦ DESIGN AGENCY ✦ TECH TRAINING ✦ PRINT SHOP ✦ DIGITAL PRODUCTS"
            className="text-oxford/10 text-lg font-black tracking-widest"
            speed={30}
            reverse
          />
        </div>
      </main>
    </PageTransition>
  );
};

export default Home;
