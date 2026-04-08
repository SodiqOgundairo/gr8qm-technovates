import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import SplitText from "../components/animations/SplitText";
import MarqueeText from "../components/animations/MarqueeText";
import AnimatedCounter from "../components/animations/AnimatedCounter";
import MagneticButton from "../components/animations/MagneticButton";
import ScrollTextReveal from "../components/animations/ScrollTextReveal";
import HeroVisual from "../components/animations/HeroVisual";
import { Reveal } from "../components/animations/DesignElements";
import {
  ArrowRightIcon,
  CodeIcon,
  PrinterIcon,
  GraduationCapIcon,
  TargetIcon,
  BulbIcon,
  RocketIcon,
  ShieldCheckIcon,
} from "../components/icons";
import { SEO } from "../components/common/SEO";
import { getPageSEO } from "../utils/seo-config";
import {
  generateWebSiteSchema,
  generateBreadcrumbSchema,
} from "../utils/structured-data";

/* ─── animation constants ─── */
const EASE = [0.16, 1, 0.3, 1] as const; // Material decelerated
const EASE_SPRING = { type: "spring" as const, stiffness: 200, damping: 24 };

/* ─── data ─── */
const SERVICES = [
  {
    num: "01",
    Icon: CodeIcon,
    title: "Design & Build",
    desc: "Bespoke digital experiences — websites, mobile apps, and brand identities crafted with intention and precision.",
    tags: ["Web Dev", "Mobile Apps", "Brand Identity", "UI/UX"],
    href: "/new/services/design-build",
  },
  {
    num: "02",
    Icon: PrinterIcon,
    title: "Print Shop",
    desc: "Premium print design and production — business cards to large-format displays that make your brand tangible.",
    tags: ["Business Cards", "Brochures", "Banners", "Packaging"],
    href: "/new/services/print-shop",
  },
  {
    num: "03",
    Icon: GraduationCapIcon,
    title: "Tech Training",
    desc: "Industry-ready tech education — hands-on cohorts in web development, data science, and digital skills.",
    tags: ["Web Dev", "Data Science", "Digital Skills", "Mentorship"],
    href: "/new/services/tech-training",
  },
];

const PROCESS = [
  {
    num: "01",
    Icon: TargetIcon,
    title: "Discover",
    desc: "Deep research into your business, users, and goals. Strategy workshops and audits set the foundation before we write a single line of code.",
  },
  {
    num: "02",
    Icon: BulbIcon,
    title: "Design",
    desc: "Wireframes, prototypes, and visual design — refined through feedback loops until every interaction is intentional and every pixel purposeful.",
  },
  {
    num: "03",
    Icon: CodeIcon,
    title: "Develop",
    desc: "Clean code, scalable architecture, rigorous testing. Built with the technologies that fit your needs, not the ones that are trendy.",
  },
  {
    num: "04",
    Icon: RocketIcon,
    title: "Deploy & Grow",
    desc: "Launch day is just the beginning. Monitoring, analytics, iteration, and ongoing support to make sure your product keeps winning.",
  },
];

const STATS = [
  { value: 150, suffix: "+", label: "Projects Delivered" },
  { value: 200, suffix: "+", label: "Students Trained" },
  { value: 99, suffix: "%", label: "Client Satisfaction" },
  { value: 5, suffix: "+", label: "Years of Excellence" },
];

/* ─── style helpers ─── */
const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
  backgroundSize: "72px 72px",
};

const radialSpot = (color: string, y = "50%") =>
  `radial-gradient(ellipse 60% 50% at 50% ${y}, ${color}, transparent)`;

/* ════════════════════════════════════════════════════════════
   HOME — cinematic scroll-driven landing
   ════════════════════════════════════════════════════════════ */
const HomeNew: React.FC = () => {
  const pageSEO = getPageSEO("home");
  const websiteSchema = generateWebSiteSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
  ]);

  /* ── refs ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const textRevealRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  /* ── hero parallax ── */
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -180]);
  const heroOrbY = useTransform(heroProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(heroProgress, [0, 0.65], [1, 0]);
  // subtle vector rotation on scroll
  const heroVecRotate = useTransform(heroProgress, [0, 1], [0, 12]);

  /* ── process: individual card scroll transforms ── */
  const { scrollYProgress: processProgress } = useScroll({
    target: processRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  // title shrinks/lifts as cards arrive
  const procTitleY = useTransform(processProgress, [0, 0.35], [0, -50]);
  const procTitleScale = useTransform(processProgress, [0, 0.35], [1, 0.82]);
  const procTitleOpacity = useTransform(processProgress, [0.25, 0.4], [1, 0.35]);
  // background vector rotates with scroll
  const procVecRotate = useTransform(processProgress, [0, 1], [0, 25]);

  // staggered per-card transforms (card i enters at 0.1 + i*0.12)
  const c0x = useTransform(processProgress, [0.10, 0.38], [600, 0]);
  const c0y = useTransform(processProgress, [0.10, 0.38], [40, 0]);
  const c0o = useTransform(processProgress, [0.10, 0.22], [0, 1]);

  const c1x = useTransform(processProgress, [0.20, 0.48], [600, 0]);
  const c1y = useTransform(processProgress, [0.20, 0.48], [40, 0]);
  const c1o = useTransform(processProgress, [0.20, 0.32], [0, 1]);

  const c2x = useTransform(processProgress, [0.30, 0.58], [600, 0]);
  const c2y = useTransform(processProgress, [0.30, 0.58], [40, 0]);
  const c2o = useTransform(processProgress, [0.30, 0.42], [0, 1]);

  const c3x = useTransform(processProgress, [0.40, 0.68], [600, 0]);
  const c3y = useTransform(processProgress, [0.40, 0.68], [40, 0]);
  const c3o = useTransform(processProgress, [0.40, 0.52], [0, 1]);

  const procCardStyles = [
    { x: c0x, y: c0y, opacity: c0o },
    { x: c1x, y: c1y, opacity: c1o },
    { x: c2x, y: c2y, opacity: c2o },
    { x: c3x, y: c3y, opacity: c3o },
  ];

  /* ── services parallax ── */
  const { scrollYProgress: svcProgress } = useScroll({
    target: servicesRef as React.RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });
  const svcDecoY = useTransform(svcProgress, [0, 1], [80, -80]);

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

      {/* ══════════════════════════════════════════════════════
          § 1  HERO
          Orchestration: label(0.1) → h1-line1(0.2) → h1-line2(0.45)
          → paragraph(0.75) → buttons(0.95) → visual(0.3) → scroll(1.4)
          ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="sticky top-0 z-10 h-screen flex items-center overflow-hidden bg-black"
      >
        {/* Atmospheric orbs — slowest parallax layer */}
        <motion.div
          style={{ y: heroOrbY }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-[15%] -left-40 w-[520px] h-[520px] rounded-full bg-skyblue/[0.05] blur-[130px]" />
          <div className="absolute bottom-[10%] -right-32 w-[400px] h-[400px] rounded-full bg-orange/[0.03] blur-[110px]" />
        </motion.div>

        <div className="absolute inset-0 opacity-[0.02]" style={gridBg} />

        {/* Geometric vector — rotates subtly on scroll */}
        <motion.svg
          style={{ rotate: heroVecRotate }}
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[700px] h-[700px] pointer-events-none hidden lg:block"
          viewBox="0 0 700 700"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="350" cy="350" r="320" stroke="#0098da" strokeWidth="0.6" opacity="0.05" />
          <circle cx="350" cy="350" r="240" stroke="#0098da" strokeWidth="0.3" opacity="0.03" />
          <circle cx="350" cy="350" r="160" stroke="#c9ebfb" strokeWidth="0.3" opacity="0.02" />
        </motion.svg>

        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 w-full py-20 md:py-0"
        >
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* ── Left: text ── */}
              <div className="max-w-xl">
                {/* Monospace label — first to appear, sets context */}
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
                  className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-7 block"
                >
                  Digital Innovation Studio
                </motion.span>

                {/* Heading — hero moment, word-split for drama */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold leading-[0.9] tracking-[-0.05em]">
                  <SplitText as="span" className="text-white" type="words" delay={0.2} stagger={0.08}>
                    We Build
                  </SplitText>
                  <br />
                  <SplitText as="span" className="gradient-text" type="words" delay={0.45} stagger={0.08}>
                    What's Next.
                  </SplitText>
                </h1>

                {/* Paragraph — supporting, arrives after heading settles */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.7, ease: EASE }}
                  className="text-lg md:text-xl text-white/45 max-w-md mt-8 leading-relaxed"
                >
                  Digital products, creative services &amp; tech training
                  — from Lagos to the world.
                </motion.p>

                {/* Buttons — action layer, arrives last in text column */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.6, ease: EASE }}
                  className="flex flex-wrap gap-4 mt-10"
                >
                  <MagneticButton>
                    <Link
                      to="/new/services"
                      className="inline-flex items-center gap-2.5 px-8 py-4 bg-skyblue text-white font-semibold rounded-full shadow-[0_2px_20px_rgba(0,152,218,0.25)] hover:shadow-[0_4px_40px_rgba(0,152,218,0.4)] transition-all duration-300"
                    >
                      Explore Services
                      <ArrowRightIcon size={16} />
                    </Link>
                  </MagneticButton>
                  <Link
                    to="/new/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/80 font-medium rounded-full hover:bg-white/5 hover:border-white/30 transition-all duration-300"
                  >
                    Get in Touch
                  </Link>
                </motion.div>
              </div>

              {/* ── Right: interactive visual ── */}
              {/* Enters independently from text — scale+fade from center */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1.2, ease: EASE }}
                className="hidden lg:flex justify-center items-center"
              >
                <HeroVisual className="max-w-[520px] xl:max-w-[580px]" />
              </motion.div>
            </div>
          </Container>
        </motion.div>

        {/* Scroll indicator — utility, last to appear */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
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
      </section>

      {/* ══════════════════════════════════════════════════════
          § 2  SCROLL TEXT REVEAL
          Words reveal via scroll progress — no entrance anim needed.
          Only the label gets a subtle fade tied to scroll start.
          ══════════════════════════════════════════════════════ */}
      <div ref={textRevealRef} className="relative z-20" style={{ height: "280vh" }}>
        <section className="sticky top-0 h-screen flex items-center bg-oxford-deep overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.05)") }}
          />
          <Container className="relative z-10">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/35 mb-10 block"
            >
              Our Mission
            </motion.span>
            <ScrollTextReveal
              containerRef={textRevealRef}
              text="We build digital products that matter. We train the next generation of tech talent. We bring creative visions to life — from first spark to final pixel."
              className="text-[1.7rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.4rem] font-semibold text-white leading-[1.2] tracking-[-0.02em] max-w-5xl"
            />
          </Container>
        </section>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 3  MARQUEE — no entrance animation, always running
          ══════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-[23] bg-black border-y border-white/[0.05] py-4">
        <MarqueeText
          text="Design & Build · Print Shop · Tech Training · Innovation · Excellence · "
          speed={35}
          className="text-white/[0.12] text-xs font-mono uppercase tracking-[0.2em]"
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          § 4  PROCESS — staggered card entrance
          Title visible on arrival → scales back as cards cascade
          in one-by-one from the right with 10% scroll stagger.
          ══════════════════════════════════════════════════════ */}
      <div ref={processRef} className="relative z-[26]" style={{ height: "500vh" }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-oxford-deep">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.04)") }}
          />

          {/* Background vector — rotates with scroll for depth */}
          <motion.svg
            style={{ rotate: procVecRotate }}
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

          {/* Title — scales back and fades as cards enter */}
          <motion.div
            style={{ y: procTitleY, scale: procTitleScale, opacity: procTitleOpacity }}
            className="relative z-10 mb-10 md:mb-14"
          >
            <Container>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/40 mb-5 block">
                Our Process
              </span>
              <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-[-0.045em] leading-[0.88]">
                How We<br />
                <span className="text-skyblue">Work.</span>
              </h2>
              <p className="text-white/40 text-lg md:text-xl max-w-lg mt-6 leading-relaxed">
                Four phases. Zero guesswork. Every step is intentional,
                every decision backed by research and craft.
              </p>
            </Container>
          </motion.div>

          {/* Cards — each enters individually, staggered by scroll position */}
          <div className="relative z-10">
            <div className="flex gap-5 justify-center px-6 md:px-12">
              {PROCESS.map((step, i) => (
                <motion.div
                  key={step.num}
                  style={procCardStyles[i]}
                  className="w-[260px] md:w-[280px] lg:w-[300px] shrink-0"
                >
                  <div className="group relative h-full p-7 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-skyblue/20 transition-colors duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-skyblue/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <span className="font-mono text-[64px] md:text-[80px] font-bold text-white/[0.04] leading-none block mb-1 relative z-10">
                      {step.num}
                    </span>
                    <step.Icon
                      size={28}
                      className="text-skyblue/60 group-hover:text-skyblue transition-colors duration-300 mb-4 relative z-10"
                    />
                    <h3 className="text-2xl md:text-[1.7rem] font-bold text-white mb-3 tracking-tight relative z-10">
                      {step.title}
                    </h3>
                    <p className="text-white/40 text-[14px] leading-relaxed relative z-10">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 5  SERVICES
          Orchestration: label(0) → heading(0.08) → paragraph(0.14)
          → cards stagger with whileInView (0.06s apart)
          Cards use spring hover, not generic Reveal.
          ══════════════════════════════════════════════════════ */}
      <section
        ref={servicesRef}
        className="sticky top-0 z-30 min-h-screen flex items-center py-28 md:py-40 bg-black overflow-hidden"
      >
        <div
          className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
          style={{ background: radialSpot("rgba(0,152,218,0.04)", "0%") }}
        />

        <motion.svg
          style={{ y: svcDecoY }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] pointer-events-none"
          viewBox="0 0 500 500"
          fill="none"
          aria-hidden="true"
        >
          <line x1="0" y1="500" x2="500" y2="0" stroke="#0098da" strokeWidth="0.5" opacity="0.04" />
          <circle cx="250" cy="250" r="180" stroke="#0098da" strokeWidth="0.4" opacity="0.03" />
        </motion.svg>

        <Container className="relative z-10">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/45 mb-4 block">
              What We Do
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 max-w-3xl">
              Three pillars,{" "}
              <span className="text-skyblue">one mission.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="text-white/40 text-lg md:text-xl max-w-xl mb-16 md:mb-20">
              We don't try to do everything. We focus on what we're best
              at and deliver work that speaks for itself.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: EASE,
                }}
              >
                <Link to={s.href} className="block h-full">
                  <motion.article
                    whileHover={{ y: -8 }}
                    transition={EASE_SPRING}
                    className="group relative flex flex-col h-full p-8 lg:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-skyblue/20 transition-colors duration-500"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-skyblue/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <span className="font-mono text-[13px] text-white/15 relative z-10">
                      {s.num}
                    </span>
                    <div className="mt-5 mb-5 relative z-10">
                      <s.Icon
                        size={32}
                        className="text-skyblue/60 group-hover:text-skyblue transition-colors duration-300"
                      />
                    </div>
                    <h3 className="text-2xl lg:text-[1.8rem] font-bold text-white mb-3 tracking-tight relative z-10">
                      {s.title}
                    </h3>
                    <p className="text-white/40 leading-relaxed mb-6 relative z-10 flex-1">
                      {s.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.1em] text-white/25 bg-white/[0.03] border border-white/[0.04]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-skyblue/70 group-hover:text-skyblue text-sm font-medium relative z-10 transition-all duration-300 group-hover:gap-3">
                      Explore
                      <ArrowRightIcon size={14} />
                    </span>
                  </motion.article>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 6  STATS
          Numbers ARE the animation — no extra entrance.
          Stagger counters from left to right (0.15s apart).
          ══════════════════════════════════════════════════════ */}
      <section className="sticky top-0 z-40 h-screen flex items-center bg-oxford-deep overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: radialSpot("rgba(0,152,218,0.03)") }}
        />

        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
          viewBox="0 0 600 600"
          fill="none"
          aria-hidden="true"
        >
          <line x1="300" y1="50" x2="300" y2="550" stroke="#0098da" strokeWidth="0.5" opacity="0.04" />
          <line x1="50" y1="300" x2="550" y2="300" stroke="#0098da" strokeWidth="0.5" opacity="0.04" />
        </svg>

        <Container className="relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25 mb-16 md:mb-20 block text-center"
          >
            By The Numbers
          </motion.span>

          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                className={`py-10 md:py-14 lg:py-16 text-center ${
                  i < 3 ? "lg:border-r border-white/[0.05]" : ""
                } ${i < 2 ? "border-b lg:border-b-0 border-white/[0.05]" : ""}`}
              >
                <span className="block text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-[-0.04em]">
                  <AnimatedCounter target={stat.value} duration={2} />
                  <span className="text-skyblue">{stat.suffix}</span>
                </span>
                <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/25 mt-4 block">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 7  QUOTE
          Orchestration: icon(spring scale) → quote(fade up) → attr(fade)
          Each layer has its own timing, not a single Reveal.
          ══════════════════════════════════════════════════════ */}
      <section className="sticky top-0 z-[45] h-screen flex items-center bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={gridBg} />

        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          viewBox="0 0 500 500"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="250" cy="250" r="230" stroke="#0098da" strokeWidth="0.5" opacity="0.05" />
        </svg>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon — spring scale from 0 */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...EASE_SPRING, delay: 0 }}
              className="mb-8"
            >
              <ShieldCheckIcon size={36} className="text-skyblue/30 mx-auto" />
            </motion.div>

            {/* Quote — fades up after icon lands */}
            <motion.blockquote
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-[-0.03em] mb-8"
            >
              "Good design is good business.{" "}
              <span className="text-skyblue">Great design changes lives.</span>"
            </motion.blockquote>

            {/* Attribution — subtle fade, arrives last */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/20"
            >
              The GR8QM philosophy
            </motion.p>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 8  REVERSE MARQUEE
          ══════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-[47] bg-oxford-deep border-y border-white/[0.05] py-4">
        <MarqueeText
          text="Innovation · Excellence · Integrity · Growth · Community · Faith · "
          speed={30}
          className="text-white/[0.08] text-xs font-mono uppercase tracking-[0.2em]"
          reverse
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          § 9  CTA
          Orchestration: label(0) → heading(0.08) → paragraph(0.16)
          → button(spring, 0.28) → footer text(0.5)
          ══════════════════════════════════════════════════════ */}
      <section className="relative z-50 h-screen flex items-center bg-oxford-deep overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-skyblue/[0.04] blur-[160px]" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-orange/[0.03] blur-[120px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.015]" style={gridBg} />

        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
          viewBox="0 0 600 600"
          fill="none"
          aria-hidden="true"
        >
          <line x1="100" y1="100" x2="500" y2="500" stroke="#0098da" strokeWidth="0.4" opacity="0.03" />
          <line x1="500" y1="100" x2="100" y2="500" stroke="#0098da" strokeWidth="0.4" opacity="0.03" />
        </svg>

        <Container className="relative z-10 text-center">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange/40 mb-6 block">
              Ready to Start?
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 max-w-4xl mx-auto">
              Let's build something{" "}
              <span className="text-skyblue">extraordinary.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-lg md:text-xl text-white/35 max-w-lg mx-auto mb-12">
              Whether you need a digital product, creative services, or
              tech training — we're ready when you are.
            </p>
          </Reveal>

          {/* Button — spring entrance, not fade */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...EASE_SPRING, delay: 0.28 }}
          >
            <MagneticButton>
              <Link
                to="/new/contact"
                className="inline-flex items-center gap-3 px-10 py-5 bg-skyblue text-white font-semibold rounded-full text-lg shadow-[0_2px_20px_rgba(0,152,218,0.25)] hover:shadow-[0_4px_50px_rgba(0,152,218,0.4)] transition-all duration-300"
              >
                Let's Talk
                <ArrowRightIcon size={18} />
              </Link>
            </MagneticButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/15 mt-20"
          >
            Rooted in faith · Driven by excellence
          </motion.p>
        </Container>
      </section>
    </PageTransition>
  );
};

export default HomeNew;
