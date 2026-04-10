import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import MagneticButton from "../components/animations/MagneticButton";
import SplitText from "../components/animations/SplitText";
import MarqueeText from "../components/animations/MarqueeText";
import AnimatedCounter from "../components/animations/AnimatedCounter";
import ScrollTextReveal from "../components/animations/ScrollTextReveal";
import HeroVisual from "../components/animations/HeroVisual";
import { Button } from "devign";
import {
  ArrowRightIcon,
  HeartIcon,
  BulbIcon,
  UserIcon,
  BadgeIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
} from "../components/icons";
import { SEO } from "../components/common/SEO";
import { getPageSEO } from "../utils/seo-config";
import { generateBreadcrumbSchema } from "../utils/structured-data";

/* ─── data ─── */
const VALUES = [
  { Icon: HeartIcon, title: "Purpose First", desc: "We start with why. Every project begins with understanding the real problem before reaching for solutions.", num: "01" },
  { Icon: BulbIcon, title: "Relentless Craft", desc: "We obsess over the details. The spacing, the transitions, the edge cases. Because good enough isn't.", num: "02" },
  { Icon: UserIcon, title: "Inclusive Growth", desc: "We build systems that leave no one behind. Our training programs are designed for people from every background.", num: "03" },
  { Icon: BadgeIcon, title: "Excellence as Standard", desc: "We don't have a 'premium tier.' The standard is premium. Every client gets our best work.", num: "04" },
  { Icon: TrendingUpIcon, title: "Measurable Impact", desc: "Pretty isn't enough. We track outcomes, iterate on feedback, and make sure our work actually moves metrics.", num: "05" },
  { Icon: ShieldCheckIcon, title: "Integrity Always", desc: "Honest timelines, transparent pricing, and straight talk. We'd rather lose a deal than overpromise.", num: "06" },
];

const STATS = [
  { value: 100, suffix: "+", label: "Projects Delivered" },
  { value: 50, suffix: "+", label: "Students Trained" },
  { value: 30, suffix: "+", label: "Clients Served" },
  { value: 5, suffix: "+", label: "Years of Impact" },
];

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
  backgroundSize: "72px 72px",
};

const radialSpot = (color: string, y = "50%") =>
  `radial-gradient(ellipse 60% 50% at 50% ${y}, ${color}, transparent)`;

/* ════════════════════════════════════════════════════════════
   ABOUT — editorial storytelling
   ════════════════════════════════════════════════════════════ */
const AboutNew: React.FC = () => {
  const navigate = useNavigate();
  const pageSEO = getPageSEO("about");
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
    { name: "About", url: "https://gr8qm.com/about" },
  ]);

  /* ── refs ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  /* ── hero parallax (unchanged) ── */
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -160]);
  const heroOrbY = useTransform(heroProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

  /* ── values: scroll-driven transforms ── */
  const { scrollYProgress: valuesProgress } = useScroll({
    target: valuesRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  // title group stays visible then fades as cards enter
  const valTitleY = useTransform(valuesProgress, [0.65, 0.82], [0, -60]);
  const valTitleScale = useTransform(valuesProgress, [0.65, 0.82], [1, 0.85]);
  const valTitleOpacity = useTransform(valuesProgress, [0.65, 0.82], [1, 0]);

  // label
  const valLabelY = useTransform(valuesProgress, [0.02, 0.12], [40, 0]);
  const valLabelO = useTransform(valuesProgress, [0.02, 0.10], [0, 1]);
  // heading
  const valHeadY = useTransform(valuesProgress, [0.06, 0.18], [50, 0]);
  const valHeadO = useTransform(valuesProgress, [0.06, 0.14], [0, 1]);
  // paragraph
  const valParaY = useTransform(valuesProgress, [0.10, 0.22], [40, 0]);
  const valParaO = useTransform(valuesProgress, [0.10, 0.18], [0, 1]);

  // staggered per-card transforms (6 cards)
  const vc0y = useTransform(valuesProgress, [0.18, 0.38], [120, 0]);
  const vc0o = useTransform(valuesProgress, [0.18, 0.30], [0, 1]);
  const vc1y = useTransform(valuesProgress, [0.24, 0.44], [120, 0]);
  const vc1o = useTransform(valuesProgress, [0.24, 0.36], [0, 1]);
  const vc2y = useTransform(valuesProgress, [0.30, 0.50], [120, 0]);
  const vc2o = useTransform(valuesProgress, [0.30, 0.42], [0, 1]);
  const vc3y = useTransform(valuesProgress, [0.36, 0.56], [120, 0]);
  const vc3o = useTransform(valuesProgress, [0.36, 0.48], [0, 1]);
  const vc4y = useTransform(valuesProgress, [0.42, 0.62], [120, 0]);
  const vc4o = useTransform(valuesProgress, [0.42, 0.54], [0, 1]);
  const vc5y = useTransform(valuesProgress, [0.48, 0.68], [120, 0]);
  const vc5o = useTransform(valuesProgress, [0.48, 0.60], [0, 1]);

  const valCardStyles = [
    { y: vc0y, opacity: vc0o },
    { y: vc1y, opacity: vc1o },
    { y: vc2y, opacity: vc2o },
    { y: vc3y, opacity: vc3o },
    { y: vc4y, opacity: vc4o },
    { y: vc5y, opacity: vc5o },
  ];

  /* ── stats: per-item scroll transforms ── */
  const { scrollYProgress: statsProgress } = useScroll({
    target: statsRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const statsTitleY = useTransform(statsProgress, [0.0, 0.15], [40, 0]);
  const statsTitleO = useTransform(statsProgress, [0.0, 0.15], [0, 1]);

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

  /* ── CTA: staggered element scroll transforms ── */
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const ctaLabelY = useTransform(ctaProgress, [0.05, 0.22], [40, 0]);
  const ctaLabelO = useTransform(ctaProgress, [0.05, 0.18], [0, 1]);
  const ctaHeadY = useTransform(ctaProgress, [0.12, 0.32], [50, 0]);
  const ctaHeadO = useTransform(ctaProgress, [0.12, 0.25], [0, 1]);
  const ctaPara1Y = useTransform(ctaProgress, [0.20, 0.40], [40, 0]);
  const ctaPara1O = useTransform(ctaProgress, [0.20, 0.33], [0, 1]);
  const ctaPara2Y = useTransform(ctaProgress, [0.28, 0.46], [40, 0]);
  const ctaPara2O = useTransform(ctaProgress, [0.28, 0.40], [0, 1]);
  const ctaBtnY = useTransform(ctaProgress, [0.36, 0.52], [30, 0]);
  const ctaBtnO = useTransform(ctaProgress, [0.36, 0.48], [0, 1]);

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

      {/* ══════════════════════════════════════════════════════
          § 1  HERO — split layout with interactive visual
          ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="sticky top-0 z-10 h-screen flex flex-col justify-center overflow-hidden bg-oxford-deep"
      >
        <motion.div style={{ y: heroOrbY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] -right-32 w-[450px] h-[450px] rounded-full bg-skyblue/[0.06] blur-[120px]" />
          <div className="absolute bottom-[15%] -left-24 w-[380px] h-[380px] rounded-full bg-orange/[0.04] blur-[100px]" />
        </motion.div>

        <div className="absolute inset-0 opacity-[0.02]" style={gridBg} />

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Text side */}
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.7 }}
                  className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-7 block"
                >
                  The GR8QM Story
                </motion.span>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[6rem] font-bold leading-[0.9] tracking-[-0.05em]">
                  <SplitText as="span" className="text-white" type="words" delay={0.25} stagger={0.06}>
                    We design
                  </SplitText>
                  <br />
                  <SplitText as="span" className="gradient-text" type="words" delay={0.5} stagger={0.06}>
                    what's next.
                  </SplitText>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.7 }}
                  className="text-lg md:text-xl text-white/40 max-w-md mt-8 leading-relaxed"
                >
                  A design and technology studio that believes great work
                  comes from clarity of purpose. Every product we ship, every
                  student we train reflects our commitment to craft and impact.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.7 }}
                  className="flex flex-wrap gap-4 mt-10"
                >
                  <MagneticButton>
                    <Button variant="primary" size="lg" onClick={() => navigate("/contact")} rightIcon={<ArrowRightIcon size={16} />}>
                      Start a Project
                    </Button>
                  </MagneticButton>
                  <Link
                    to="/services"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full overflow-hidden border border-iceblue/20 text-white hover:border-skyblue/40 transition-all duration-300"
                  >
                    <span className="relative z-10">Our Services</span>
                    <span className="relative z-10 text-skyblue transition-transform duration-300 group-hover:translate-x-1">→</span>
                    <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                  </Link>
                </motion.div>

                {/* Stat badges inline */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.7 }}
                  className="flex gap-8 mt-14"
                >
                  {[
                    { num: "100+", label: "Projects" },
                    { num: "50+", label: "Students" },
                    { num: "5+", label: "Years" },
                  ].map((s) => (
                    <div key={s.label}>
                      <span className="block text-2xl md:text-3xl font-bold text-white tracking-tight">
                        {s.num}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Interactive visual side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.22, 0.6, 0.36, 1] }}
                className="hidden lg:block"
              >
                <HeroVisual className="max-w-[520px] mx-auto" />
              </motion.div>
            </div>
          </Container>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{ opacity: heroOpacity }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/20">Scroll</span>
          <motion.div
            className="w-px h-14 bg-gradient-to-b from-white/20 to-transparent"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 2  SCROLL TEXT — vision & mission revealed on scroll
          ══════════════════════════════════════════════════════ */}
      <div ref={storyRef} className="relative z-20" style={{ height: "300vh" }}>
        <section className="sticky top-0 h-screen flex items-center bg-oxford-card overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.05)") }}
          />
          <Container className="relative z-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/35 mb-10 block">
              Vision &amp; Mission
            </span>
            <ScrollTextReveal
              containerRef={storyRef}
              text="We envision a world where technology serves people — not the other way around. Our mission is to equip individuals and organizations with beautifully designed, expertly engineered solutions that uplift and endure."
              className="text-[1.6rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.2rem] font-semibold text-white leading-[1.2] tracking-[-0.02em] max-w-5xl"
            />
          </Container>
        </section>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 3  MARQUEE
          ══════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-[25] bg-oxford-deep border-y border-white/[0.05] py-4">
        <MarqueeText
          text="Purpose · Craft · Excellence · Integrity · Impact · Faith · "
          speed={30}
          className="text-white/[0.1] text-xs font-mono uppercase tracking-[0.2em]"
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          § 4  CORE VALUES — editorial grid (scroll-driven)
          ══════════════════════════════════════════════════════ */}
      <div ref={valuesRef} className="relative z-30" style={{ height: "500vh" }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-oxford-deep">
          <div
            className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.04)", "0%") }}
          />

          {/* Bold geometric vector */}
          <svg className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] pointer-events-none" viewBox="0 0 600 600" fill="none" aria-hidden="true">
            <circle cx="300" cy="300" r="280" stroke="#0098da" strokeWidth="0.5" opacity="0.04" />
            <circle cx="300" cy="300" r="200" stroke="#0098da" strokeWidth="0.3" opacity="0.03" />
          </svg>

          <motion.div
            style={{ y: valTitleY, scale: valTitleScale, opacity: valTitleOpacity }}
            className="relative z-10 mb-8 md:mb-14"
          >
            <Container>
              <motion.span
                style={{ y: valLabelY, opacity: valLabelO }}
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/45 mb-4 block"
              >
                What Drives Us
              </motion.span>
              <motion.h2
                style={{ y: valHeadY, opacity: valHeadO }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 max-w-3xl"
              >
                Our core <span className="text-skyblue">values.</span>
              </motion.h2>
              <motion.p
                style={{ y: valParaY, opacity: valParaO }}
                className="text-white/40 text-lg max-w-xl"
              >
                The principles behind every pixel, every line of code,
                and every decision we make.
              </motion.p>
            </Container>
          </motion.div>

          <div className="relative z-10">
            <Container>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {VALUES.map((v, i) => (
                  <motion.div key={v.num} style={valCardStyles[i]}>
                    <div className="group relative flex flex-col h-full p-8 lg:p-9 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-skyblue/20 transition-colors duration-500">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-skyblue/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="flex items-start justify-between mb-5 relative z-10">
                        <v.Icon size={24} className="text-skyblue/50 group-hover:text-skyblue transition-colors duration-300" />
                        <span className="font-mono text-[12px] text-white/10">{v.num}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 relative z-10">{v.title}</h3>
                      <p className="text-white/40 leading-relaxed text-[15px] relative z-10">{v.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Container>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 5  STATS (scroll-driven)
          ══════════════════════════════════════════════════════ */}
      <div ref={statsRef} className="relative z-40" style={{ height: "350vh" }}>
        <div className="sticky top-0 h-screen flex items-center bg-oxford-card overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.03)") }}
          />

          <Container className="relative z-10 w-full">
            <motion.span
              style={{ y: statsTitleY, opacity: statsTitleO }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25 mb-16 md:mb-20 block text-center"
            >
              Impact in Numbers
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
          § 6  CTA (scroll-driven)
          ══════════════════════════════════════════════════════ */}
      <div ref={ctaRef} className="relative z-50" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen flex items-center bg-oxford-deep overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-skyblue/[0.04] blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-orange/[0.03] blur-[100px]" />
          </div>
          <div className="absolute inset-0 opacity-[0.015]" style={gridBg} />

          <Container className="relative z-10 text-center w-full">
            <motion.span
              style={{ y: ctaLabelY, opacity: ctaLabelO }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange/40 mb-6 block"
            >
              Built on Faith
            </motion.span>

            <motion.h2
              style={{ y: ctaHeadY, opacity: ctaHeadO }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 max-w-4xl mx-auto"
            >
              Ready to work with a team that{" "}
              <span className="text-skyblue">cares?</span>
            </motion.h2>

            <motion.p
              style={{ y: ctaPara1Y, opacity: ctaPara1O }}
              className="text-lg md:text-xl text-white/35 max-w-lg mx-auto mb-4"
            >
              Good design is good business. Great design changes lives.
              Let's create something extraordinary together.
            </motion.p>

            <motion.p
              style={{ y: ctaPara2Y, opacity: ctaPara2O }}
              className="text-sm text-white/20 italic max-w-md mx-auto mb-12"
            >
              Our work is rooted in faith — the belief that what we create
              should uplift, serve, and reflect something greater than ourselves.
            </motion.p>

            <motion.div style={{ y: ctaBtnY, opacity: ctaBtnO }}>
              <MagneticButton>
                <Button variant="primary" size="lg" onClick={() => navigate("/contact")} rightIcon={<ArrowRightIcon size={18} />}>
                  Let's Talk
                </Button>
              </MagneticButton>
            </motion.div>
          </Container>
        </div>
      </div>
    </PageTransition>
  );
};

export default AboutNew;
