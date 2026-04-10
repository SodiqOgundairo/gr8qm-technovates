import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import SplitText from "../components/animations/SplitText";
import MarqueeText from "../components/animations/MarqueeText";
import AnimatedCounter from "../components/animations/AnimatedCounter";
import MagneticButton from "../components/animations/MagneticButton";
import { Button } from "devign";
import ScrollTextReveal from "../components/animations/ScrollTextReveal";
import HeroVisual from "../components/animations/HeroVisual";

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
/* ─── data ─── */
const SERVICES = [
  {
    num: "01",
    Icon: CodeIcon,
    title: "Design & Build",
    desc: "Bespoke digital experiences — websites, mobile apps, and brand identities crafted with intention and precision.",
    tags: ["Web Dev", "Mobile Apps", "Brand Identity", "UI/UX"],
    href: "/services/design-build",
  },
  {
    num: "02",
    Icon: PrinterIcon,
    title: "Print Shop",
    desc: "Premium print design and production — business cards to large-format displays that make your brand tangible.",
    tags: ["Business Cards", "Brochures", "Banners", "Packaging"],
    href: "/services/print-shop",
  },
  {
    num: "03",
    Icon: GraduationCapIcon,
    title: "Tech Training",
    desc: "Industry-ready tech education — hands-on cohorts in web development, data science, and digital skills.",
    tags: ["Web Dev", "Data Science", "Digital Skills", "Mentorship"],
    href: "/services/tech-training",
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
  const navigate = useNavigate();
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
  const statsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
  // title stays visible until cards finish entering, then fades out
  const procTitleY = useTransform(processProgress, [0.68, 0.85], [0, -60]);
  const procTitleScale = useTransform(processProgress, [0.68, 0.85], [1, 0.85]);
  const procTitleOpacity = useTransform(processProgress, [0.68, 0.85], [1, 0]);
  // background vector rotates with scroll
  const procVecRotate = useTransform(processProgress, [0, 1], [0, 25]);

  // staggered per-card transforms — slide up with staggered scroll offsets
  const c0y = useTransform(processProgress, [0.08, 0.30], [120, 0]);
  const c0o = useTransform(processProgress, [0.08, 0.22], [0, 1]);

  const c1y = useTransform(processProgress, [0.16, 0.38], [120, 0]);
  const c1o = useTransform(processProgress, [0.16, 0.30], [0, 1]);

  const c2y = useTransform(processProgress, [0.24, 0.46], [120, 0]);
  const c2o = useTransform(processProgress, [0.24, 0.38], [0, 1]);

  const c3y = useTransform(processProgress, [0.32, 0.54], [120, 0]);
  const c3o = useTransform(processProgress, [0.32, 0.46], [0, 1]);

  const procCardStyles = [
    { y: c0y, opacity: c0o },
    { y: c1y, opacity: c1o },
    { y: c2y, opacity: c2o },
    { y: c3y, opacity: c3o },
  ];

  /* ── services: individual card scroll transforms (same pattern as process) ── */
  const { scrollYProgress: svcProgress } = useScroll({
    target: servicesRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  // title stays visible until cards finish entering, then fades out
  const svcTitleY = useTransform(svcProgress, [0.65, 0.82], [0, -60]);
  const svcTitleScale = useTransform(svcProgress, [0.65, 0.82], [1, 0.85]);
  const svcTitleOpacity = useTransform(svcProgress, [0.65, 0.82], [1, 0]);
  // background vector rotates with scroll
  const svcVecRotate = useTransform(svcProgress, [0, 1], [0, 20]);

  // staggered per-card transforms — slide up with staggered scroll offsets
  const s0y = useTransform(svcProgress, [0.08, 0.30], [120, 0]);
  const s0o = useTransform(svcProgress, [0.08, 0.22], [0, 1]);

  const s1y = useTransform(svcProgress, [0.18, 0.40], [120, 0]);
  const s1o = useTransform(svcProgress, [0.18, 0.32], [0, 1]);

  const s2y = useTransform(svcProgress, [0.28, 0.50], [120, 0]);
  const s2o = useTransform(svcProgress, [0.28, 0.42], [0, 1]);

  const svcCardStyles = [
    { y: s0y, opacity: s0o },
    { y: s1y, opacity: s1o },
    { y: s2y, opacity: s2o },
  ];

  /* ── stats: per-item scroll transforms ── */
  const { scrollYProgress: statsProgress } = useScroll({
    target: statsRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const statsTitleOpacity = useTransform(statsProgress, [0.0, 0.15], [0, 1]);
  const statsTitleY = useTransform(statsProgress, [0.0, 0.15], [40, 0]);

  const st0y = useTransform(statsProgress, [0.12, 0.35], [80, 0]);
  const st0o = useTransform(statsProgress, [0.12, 0.25], [0, 1]);
  const st1y = useTransform(statsProgress, [0.20, 0.43], [80, 0]);
  const st1o = useTransform(statsProgress, [0.20, 0.33], [0, 1]);
  const st2y = useTransform(statsProgress, [0.28, 0.51], [80, 0]);
  const st2o = useTransform(statsProgress, [0.28, 0.41], [0, 1]);
  const st3y = useTransform(statsProgress, [0.36, 0.59], [80, 0]);
  const st3o = useTransform(statsProgress, [0.36, 0.49], [0, 1]);

  const statCardStyles = [
    { y: st0y, opacity: st0o },
    { y: st1y, opacity: st1o },
    { y: st2y, opacity: st2o },
    { y: st3y, opacity: st3o },
  ];

  /* ── quote: staggered element scroll transforms ── */
  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const qIconScale = useTransform(quoteProgress, [0.08, 0.25], [0, 1]);
  const qIconOpacity = useTransform(quoteProgress, [0.08, 0.20], [0, 1]);
  const qTextY = useTransform(quoteProgress, [0.18, 0.42], [60, 0]);
  const qTextOpacity = useTransform(quoteProgress, [0.18, 0.32], [0, 1]);
  const qAttrOpacity = useTransform(quoteProgress, [0.35, 0.50], [0, 1]);

  /* ── CTA: staggered element scroll transforms ── */
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const ctaLabelY = useTransform(ctaProgress, [0.05, 0.22], [40, 0]);
  const ctaLabelO = useTransform(ctaProgress, [0.05, 0.18], [0, 1]);
  const ctaHeadY = useTransform(ctaProgress, [0.12, 0.32], [50, 0]);
  const ctaHeadO = useTransform(ctaProgress, [0.12, 0.25], [0, 1]);
  const ctaParaY = useTransform(ctaProgress, [0.20, 0.40], [40, 0]);
  const ctaParaO = useTransform(ctaProgress, [0.20, 0.33], [0, 1]);
  const ctaBtnY = useTransform(ctaProgress, [0.30, 0.48], [30, 0]);
  const ctaBtnO = useTransform(ctaProgress, [0.30, 0.42], [0, 1]);
  const ctaFootO = useTransform(ctaProgress, [0.45, 0.58], [0, 1]);

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
        className="sticky top-0 z-10 h-screen flex items-center overflow-hidden bg-oxford-deep"
      >
        {/* Atmospheric orbs — slowest parallax layer */}
        <motion.div
          style={{ y: heroOrbY }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            animate={{ x: [0, 120, -80, 60, 0], y: [0, -90, 70, -40, 0], scale: [1, 1.25, 0.85, 1.15, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -left-20 w-[600px] h-[600px] rounded-full bg-skyblue/[0.15] blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, -100, 80, -50, 0], y: [0, 80, -100, 60, 0], scale: [1, 1.2, 0.88, 1.1, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[5%] -right-20 w-[500px] h-[500px] rounded-full bg-orange/[0.1] blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, 70, -90, 40, 0], y: [0, -60, 50, -80, 0], scale: [1, 1.15, 0.9, 1.2, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[30%] w-[350px] h-[350px] rounded-full bg-skyblue/[0.06] blur-[100px]"
          />
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
                  <SplitText as="span" className="text-skyblue" type="words" delay={0.45} stagger={0.08}>
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

                {/* Button — action layer, arrives last in text column */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.6, ease: EASE }}
                  className="flex flex-wrap gap-4 mt-10"
                >
                  <MagneticButton>
                    <Button variant="primary" size="lg" onClick={() => navigate("/services")} rightIcon={<ArrowRightIcon size={16} />}>
                      Explore Services
                    </Button>
                  </MagneticButton>
                  <Link
                    to="/contact"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full overflow-hidden border border-iceblue/20 text-white hover:border-skyblue/40 transition-all duration-300"
                  >
                    <span className="relative z-10">Get in Touch</span>
                    <span className="relative z-10 text-skyblue transition-transform duration-300 group-hover:translate-x-1">→</span>
                    <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
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
        <section className="sticky top-0 h-screen flex items-center bg-oxford-card overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.05)") }}
          />
          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, 35, -25, 0], y: [0, -30, 20, 0], scale: [1, 1.12, 0.94, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] -right-36 w-[420px] h-[420px] rounded-full bg-skyblue/[0.08] blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{ x: [0, -20, 30, 0], y: [0, 25, -35, 0], scale: [1, 1.08, 0.95, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] -left-28 w-[350px] h-[350px] rounded-full bg-orange/[0.06] blur-[100px] pointer-events-none"
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
      <div className="sticky top-0 z-[23] bg-oxford-deep border-y border-white/[0.05] py-4">
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
          <motion.div
            animate={{ x: [0, 40, -20, 0], y: [0, -35, 25, 0], scale: [1, 1.1, 0.92, 1] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -left-32 w-[480px] h-[480px] rounded-full bg-skyblue/[0.1] blur-[130px] pointer-events-none"
          />
          <motion.div
            animate={{ x: [0, -30, 35, 0], y: [0, 30, -40, 0], scale: [1, 1.12, 0.95, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[5%] -right-36 w-[380px] h-[380px] rounded-full bg-orange/[0.07] blur-[110px] pointer-events-none"
          />

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

          <motion.div
            style={{ y: procTitleY, scale: procTitleScale, opacity: procTitleOpacity }}
            className="relative z-10 mb-8 md:mb-14"
          >
            <Container>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/40 mb-5 block">
                Our Process
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-[-0.045em] leading-[0.88]">
                How We<br />
                <span className="text-skyblue">Work.</span>
              </h2>
              <p className="text-white/40 text-base md:text-lg lg:text-xl max-w-lg mt-5 md:mt-6 leading-relaxed">
                Four phases. Zero guesswork. Every step is intentional,
                every decision backed by research and craft.
              </p>
            </Container>
          </motion.div>

          <div className="relative z-10">
            <Container>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {PROCESS.map((step, i) => (
                  <motion.div
                    key={step.num}
                    style={procCardStyles[i]}
                  >
                    <div className="group relative h-full p-5 md:p-7 lg:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-skyblue/20 transition-colors duration-500">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-skyblue/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <span className="font-mono text-[48px] md:text-[64px] lg:text-[80px] font-bold text-white/[0.04] leading-none block mb-1 relative z-10">
                        {step.num}
                      </span>
                      <step.Icon
                        size={24}
                        className="text-skyblue/60 group-hover:text-skyblue transition-colors duration-300 mb-3 md:mb-4 relative z-10"
                      />
                      <h3 className="text-lg md:text-xl lg:text-[1.7rem] font-bold text-white mb-2 md:mb-3 tracking-tight relative z-10">
                        {step.title}
                      </h3>
                      <p className="text-white/40 text-[12px] md:text-[13px] lg:text-[14px] leading-relaxed relative z-10">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Container>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 5  SERVICES
          Orchestration: label(0) → heading(0.08) → paragraph(0.14)
          → cards stagger with whileInView (0.06s apart)
          Cards use spring hover, not generic Reveal.
          ══════════════════════════════════════════════════════ */}
      <div ref={servicesRef} className="relative z-30" style={{ height: "400vh" }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-oxford-card">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.04)") }}
          />

          <motion.svg
            style={{ rotate: svcVecRotate }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
            viewBox="0 0 700 700"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="350" cy="350" r="320" stroke="#0098da" strokeWidth="0.5" opacity="0.04" />
            <circle cx="350" cy="350" r="220" stroke="#0098da" strokeWidth="0.3" opacity="0.03" />
            <line x1="0" y1="350" x2="700" y2="350" stroke="#0098da" strokeWidth="0.3" opacity="0.02" />
          </motion.svg>

          <motion.div
            animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] -right-32 w-[400px] h-[400px] rounded-full bg-skyblue/[0.08] blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{ x: [0, -20, 35, 0], y: [0, 25, -35, 0], scale: [1, 1.08, 0.93, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] -left-28 w-[350px] h-[350px] rounded-full bg-orange/[0.06] blur-[100px] pointer-events-none"
          />

          <motion.div
            style={{ y: svcTitleY, scale: svcTitleScale, opacity: svcTitleOpacity }}
            className="relative z-10 mb-8 md:mb-14"
          >
            <Container>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/45 mb-5 block">
                What We Do
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-[-0.045em] leading-[0.88]">
                Three pillars,<br />
                <span className="text-skyblue">one mission.</span>
              </h2>
              <p className="text-white/40 text-base md:text-lg lg:text-xl max-w-lg mt-5 md:mt-6 leading-relaxed">
                We don't try to do everything. We focus on what we're best
                at and deliver work that speaks for itself.
              </p>
            </Container>
          </motion.div>

          <div className="relative z-10">
            <Container>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
                {SERVICES.map((s, i) => (
                  <motion.div
                    key={s.num}
                    style={svcCardStyles[i]}
                  >
                    <Link to={s.href} className="block h-full">
                      <div className="group relative flex flex-col h-full p-6 md:p-8 lg:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-skyblue/20 transition-colors duration-500">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-skyblue/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <span className="font-mono text-[48px] md:text-[64px] lg:text-[80px] font-bold text-white/[0.04] leading-none block mb-1 relative z-10">
                          {s.num}
                        </span>
                        <s.Icon size={28} className="text-skyblue/60 group-hover:text-skyblue transition-colors duration-300 mb-3 md:mb-4 relative z-10" />
                        <h3 className="text-xl md:text-2xl lg:text-[1.8rem] font-bold text-white mb-2 md:mb-3 tracking-tight relative z-10">{s.title}</h3>
                        <p className="text-white/40 text-[12px] md:text-[13px] lg:text-[14px] leading-relaxed mb-4 md:mb-6 relative z-10 flex-1">{s.desc}</p>
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-5 md:mb-8 relative z-10">
                          {s.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-[9px] font-mono uppercase tracking-[0.1em] text-white/25 bg-white/[0.03] border border-white/[0.04]">{tag}</span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-2 text-skyblue/70 group-hover:text-skyblue text-sm font-medium relative z-10 transition-all duration-300 group-hover:gap-3">
                          Explore <ArrowRightIcon size={14} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Container>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 6  STATS
          Numbers ARE the animation — no extra entrance.
          Stagger counters from left to right (0.15s apart).
          ══════════════════════════════════════════════════════ */}
      <div ref={statsRef} className="relative z-40" style={{ height: "350vh" }}>
        <div className="sticky top-0 h-screen flex items-center bg-oxford-deep overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.03)") }}
          />

          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, 35, -25, 0], y: [0, -20, 40, 0], scale: [1, 1.12, 0.94, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[25%] -left-36 w-[450px] h-[450px] rounded-full bg-skyblue/[0.08] blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{ x: [0, -40, 20, 0], y: [0, 35, -25, 0], scale: [1, 1.08, 0.96, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] -right-28 w-[380px] h-[380px] rounded-full bg-orange/[0.06] blur-[110px] pointer-events-none"
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

          <Container className="relative z-10 w-full">
            <motion.span
              style={{ opacity: statsTitleOpacity, y: statsTitleY }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25 mb-16 md:mb-20 block text-center"
            >
              By The Numbers
            </motion.span>

            <div className="grid grid-cols-2 lg:grid-cols-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  style={statCardStyles[i]}
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
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 7  QUOTE
          Orchestration: icon(spring scale) → quote(fade up) → attr(fade)
          Each layer has its own timing, not a single Reveal.
          ══════════════════════════════════════════════════════ */}
      <div ref={quoteRef} className="relative z-[45]" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen flex items-center bg-oxford-card overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]" style={gridBg} />

          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -25, 35, 0], scale: [1, 1.1, 0.93, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[30%] left-[10%] w-[400px] h-[400px] rounded-full bg-skyblue/[0.07] blur-[130px] pointer-events-none"
          />
          <motion.div
            animate={{ x: [0, -25, 30, 0], y: [0, 20, -30, 0], scale: [1, 1.06, 0.97, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[25%] right-[15%] w-[320px] h-[320px] rounded-full bg-orange/[0.05] blur-[100px] pointer-events-none"
          />

          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
            viewBox="0 0 500 500"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="250" cy="250" r="230" stroke="#0098da" strokeWidth="0.5" opacity="0.05" />
          </svg>

          <Container className="relative z-10 w-full">
            <div className="max-w-4xl mx-auto text-center">
              {/* Icon — scroll-driven scale */}
              <motion.div
                style={{ scale: qIconScale, opacity: qIconOpacity }}
                className="mb-8"
              >
                <ShieldCheckIcon size={36} className="text-skyblue/30 mx-auto" />
              </motion.div>

              {/* Quote — scroll-driven slide up */}
              <motion.blockquote
                style={{ y: qTextY, opacity: qTextOpacity }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-[-0.03em] mb-8"
              >
                "Good design is good business.{" "}
                <span className="text-skyblue">Great design changes lives.</span>"
              </motion.blockquote>

              {/* Attribution — scroll-driven fade */}
              <motion.p
                style={{ opacity: qAttrOpacity }}
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/20"
              >
                The GR8QM philosophy
              </motion.p>
            </div>
          </Container>
        </div>
      </div>

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
      <div ref={ctaRef} className="relative z-50" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen flex items-center bg-oxford-deep overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ x: [0, 45, -30, 0], y: [0, -35, 25, 0], scale: [1, 1.15, 0.9, 1] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-skyblue/[0.1] blur-[160px]"
            />
            <motion.div
              animate={{ x: [0, -35, 25, 0], y: [0, 30, -20, 0], scale: [1, 1.1, 0.94, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-orange/[0.07] blur-[120px]"
            />
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

          <Container className="relative z-10 text-center w-full">
            <motion.span
              style={{ y: ctaLabelY, opacity: ctaLabelO }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange/40 mb-6 block"
            >
              Ready to Start?
            </motion.span>

            <motion.h2
              style={{ y: ctaHeadY, opacity: ctaHeadO }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 max-w-4xl mx-auto"
            >
              Let's build something{" "}
              <span className="text-skyblue">extraordinary.</span>
            </motion.h2>

            <motion.p
              style={{ y: ctaParaY, opacity: ctaParaO }}
              className="text-lg md:text-xl text-white/35 max-w-lg mx-auto mb-12"
            >
              Whether you need a digital product, creative services, or
              tech training — we're ready when you are.
            </motion.p>

            <motion.div style={{ y: ctaBtnY, opacity: ctaBtnO }}>
              <MagneticButton>
                <Button variant="primary" size="lg" onClick={() => navigate("/contact")} rightIcon={<ArrowRightIcon size={18} />}>
                  Let's Talk
                </Button>
              </MagneticButton>
            </motion.div>

            <motion.p
              style={{ opacity: ctaFootO }}
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/15 mt-20"
            >
              Rooted in faith · Driven by excellence
            </motion.p>
          </Container>
        </div>
      </div>
    </PageTransition>
  );
};

export default HomeNew;
