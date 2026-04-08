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
  const pageSEO = getPageSEO("about");
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
    { name: "About", url: "https://gr8qm.com/about" },
  ]);

  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -160]);
  const heroOrbY = useTransform(heroProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

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
        className="sticky top-0 z-10 h-screen flex flex-col justify-center overflow-hidden bg-black"
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
                    <Link
                      to="/new/contact"
                      className="inline-flex items-center gap-2.5 px-8 py-4 bg-skyblue text-white font-semibold rounded-full shadow-[0_2px_20px_rgba(0,152,218,0.25)] hover:shadow-[0_4px_40px_rgba(0,152,218,0.4)] transition-all duration-400"
                    >
                      Start a Project <ArrowRightIcon size={16} />
                    </Link>
                  </MagneticButton>
                  <Link
                    to="/new/services"
                    className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/80 font-medium rounded-full hover:bg-white/5 transition-all duration-300"
                  >
                    Our Services
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
        <section className="sticky top-0 h-screen flex items-center bg-oxford-deep overflow-hidden">
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
      <div className="sticky top-0 z-[25] bg-black border-y border-white/[0.05] py-4">
        <MarqueeText
          text="Purpose · Craft · Excellence · Integrity · Impact · Faith · "
          speed={30}
          className="text-white/[0.1] text-xs font-mono uppercase tracking-[0.2em]"
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          § 4  CORE VALUES — editorial grid
          ══════════════════════════════════════════════════════ */}
      <section className="sticky top-0 z-30 min-h-screen flex items-center py-28 md:py-40 bg-oxford-deep overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none"
          style={{ background: radialSpot("rgba(0,152,218,0.04)", "0%") }}
        />

        {/* Bold geometric vector */}
        <svg className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] pointer-events-none" viewBox="0 0 600 600" fill="none" aria-hidden="true">
          <circle cx="300" cy="300" r="280" stroke="#0098da" strokeWidth="0.5" opacity="0.04" />
          <circle cx="300" cy="300" r="200" stroke="#0098da" strokeWidth="0.3" opacity="0.03" />
        </svg>

        <Container className="relative z-10">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/45 mb-4 block">
              What Drives Us
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 max-w-3xl">
              Our core <span className="text-skyblue">values.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-white/40 text-lg max-w-xl mb-16 md:mb-20">
              The principles behind every pixel, every line of code,
              and every decision we make.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {VALUES.map((v, i) => (
              <Reveal key={v.num} delay={i * 0.08}>
                <div className="group relative flex flex-col h-full p-8 lg:p-9 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-skyblue/20 transition-colors duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-skyblue/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <v.Icon size={24} className="text-skyblue/50 group-hover:text-skyblue transition-colors duration-300" />
                    <span className="font-mono text-[12px] text-white/10">{v.num}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 relative z-10">{v.title}</h3>
                  <p className="text-white/40 leading-relaxed text-[15px] relative z-10">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 5  STATS
          ══════════════════════════════════════════════════════ */}
      <section className="sticky top-0 z-40 h-screen flex items-center bg-black overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: radialSpot("rgba(0,152,218,0.03)") }}
        />

        <Container className="relative z-10">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25 mb-16 md:mb-20 block text-center">
              Impact in Numbers
            </span>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className={`py-10 md:py-14 lg:py-16 text-center ${
                  i < 3 ? "lg:border-r border-white/[0.05]" : ""
                } ${i < 2 ? "border-b lg:border-b-0 border-white/[0.05]" : ""}`}>
                  <span className="block text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-[-0.04em]">
                    <AnimatedCounter target={stat.value} duration={2} />
                    <span className="text-skyblue">{stat.suffix}</span>
                  </span>
                  <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/25 mt-4 block">
                    {stat.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 6  CTA
          ══════════════════════════════════════════════════════ */}
      <section className="relative z-50 h-screen flex items-center bg-oxford-deep overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-skyblue/[0.04] blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-orange/[0.03] blur-[100px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.015]" style={gridBg} />

        <Container className="relative z-10 text-center">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange/40 mb-6 block">
              Built on Faith
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 max-w-4xl mx-auto">
              Ready to work with a team that{" "}
              <span className="text-skyblue">cares?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-white/35 max-w-lg mx-auto mb-4">
              Good design is good business. Great design changes lives.
              Let's create something extraordinary together.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-sm text-white/20 italic max-w-md mx-auto mb-12">
              Our work is rooted in faith — the belief that what we create
              should uplift, serve, and reflect something greater than ourselves.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <MagneticButton>
              <Link
                to="/new/contact"
                className="inline-flex items-center gap-3 px-10 py-5 bg-skyblue text-white font-semibold rounded-full text-lg shadow-[0_2px_20px_rgba(0,152,218,0.25)] hover:shadow-[0_4px_50px_rgba(0,152,218,0.4)] transition-all duration-400"
              >
                Let's Talk <ArrowRightIcon size={18} />
              </Link>
            </MagneticButton>
          </Reveal>
        </Container>
      </section>
    </PageTransition>
  );
};

export default AboutNew;
