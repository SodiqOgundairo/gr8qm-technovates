import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import SplitText from "../components/animations/SplitText";
import MarqueeText from "../components/animations/MarqueeText";
import MagneticButton from "../components/animations/MagneticButton";
import { Button } from "devign";
import ScrollTextReveal from "../components/animations/ScrollTextReveal";
import {
  ArrowRightIcon,
  CodeIcon,
  PrinterIcon,
  GraduationCapIcon,
  TargetIcon,
  ZapIcon,
  HandshakeIcon,
} from "../components/icons";
import { SEO } from "../components/common/SEO";

/* ─── data ─── */
const SERVICES = [
  {
    num: "01",
    Icon: CodeIcon,
    title: "Design & Build",
    desc: "Websites, apps, and digital products. We handle everything from UX research to final deployment, so you get a product that works as good as it looks.",
    features: [
      "Custom Web & Mobile Apps",
      "UI/UX Design & Prototyping",
      "Full-Stack Development",
      "API Integration",
      "Database Design",
      "Ongoing Support",
    ],
    href: "/services/design-build",
  },
  {
    num: "02",
    Icon: PrinterIcon,
    title: "Print Shop",
    desc: "Your brand, made tangible. Premium print for business cards, flyers, banners, merch, and packaging. Fast turnaround, no compromises on quality.",
    features: [
      "Business Cards & Stationery",
      "Flyers & Brochures",
      "Banners & Posters",
      "Branded Merchandise",
      "Custom Packaging",
      "Fast Turnaround",
    ],
    href: "/services/print-shop",
  },
  {
    num: "03",
    Icon: GraduationCapIcon,
    title: "Tech Training",
    desc: "Zero to job-ready. Sponsored cohort programs in product design, development, and QA. Real projects, real mentors, real career outcomes.",
    features: [
      "Product Design & Mgmt",
      "Frontend & Backend Dev",
      "DevOps & Cloud",
      "Cybersecurity Basics",
      "QA & Automation",
      "Sponsored Programs",
    ],
    href: "/services/tech-training",
  },
];

const WHY = [
  { Icon: TargetIcon, title: "Obsessed with Craft", desc: "We sweat the details other agencies skip. Every interaction, every line of code gets our full attention." },
  { Icon: ZapIcon, title: "Ship Fast, Ship Right", desc: "Speed without sacrificing quality. We move quickly because our process is tight, not because we cut corners." },
  { Icon: HandshakeIcon, title: "Long-term Partners", desc: "We don't disappear after launch. Ongoing support, iteration, and growth are baked into how we work." },
];

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
  backgroundSize: "72px 72px",
};

const radialSpot = (color: string, y = "50%") =>
  `radial-gradient(ellipse 60% 50% at 50% ${y}, ${color}, transparent)`;

/* ════════════════════════════════════════════════════════════
   SERVICES — editorial showcase
   ════════════════════════════════════════════════════════════ */
const ServicesNew: React.FC = () => {
  const navigate = useNavigate();

  /* ── refs ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  /* ── hero parallax ── */
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -160]);
  const heroOrbY = useTransform(heroProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

  /* ── cards section: scroll-driven transforms ── */
  const { scrollYProgress: cardsProgress } = useScroll({
    target: cardsRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const decoY = useTransform(cardsProgress, [0, 1], [60, -60]);
  // title stagger
  const cardsTitleY = useTransform(cardsProgress, [0.02, 0.12], [40, 0]);
  const cardsTitleO = useTransform(cardsProgress, [0.02, 0.10], [0, 1]);
  const cardsHeadY = useTransform(cardsProgress, [0.05, 0.15], [50, 0]);
  const cardsHeadO = useTransform(cardsProgress, [0.05, 0.13], [0, 1]);
  // title fades out as cards scroll through
  const cardsTitleFadeO = useTransform(cardsProgress, [0.75, 0.88], [1, 0]);
  const cardsTitleFadeY = useTransform(cardsProgress, [0.75, 0.88], [0, -50]);

  // staggered per-service-block transforms (3 blocks)
  const sb0y = useTransform(cardsProgress, [0.10, 0.30], [120, 0]);
  const sb0o = useTransform(cardsProgress, [0.10, 0.22], [0, 1]);
  const sb1y = useTransform(cardsProgress, [0.28, 0.48], [120, 0]);
  const sb1o = useTransform(cardsProgress, [0.28, 0.40], [0, 1]);
  const sb2y = useTransform(cardsProgress, [0.46, 0.66], [120, 0]);
  const sb2o = useTransform(cardsProgress, [0.46, 0.58], [0, 1]);

  const svcBlockStyles = [
    { y: sb0y, opacity: sb0o },
    { y: sb1y, opacity: sb1o },
    { y: sb2y, opacity: sb2o },
  ];

  /* ── why us: scroll-driven transforms ── */
  const { scrollYProgress: whyProgress } = useScroll({
    target: whyRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const whyLabelY = useTransform(whyProgress, [0.05, 0.20], [40, 0]);
  const whyLabelO = useTransform(whyProgress, [0.05, 0.16], [0, 1]);
  const whyHeadY = useTransform(whyProgress, [0.10, 0.25], [50, 0]);
  const whyHeadO = useTransform(whyProgress, [0.10, 0.22], [0, 1]);

  // staggered per-card transforms
  const w0y = useTransform(whyProgress, [0.18, 0.38], [100, 0]);
  const w0o = useTransform(whyProgress, [0.18, 0.30], [0, 1]);
  const w1y = useTransform(whyProgress, [0.26, 0.46], [100, 0]);
  const w1o = useTransform(whyProgress, [0.26, 0.38], [0, 1]);
  const w2y = useTransform(whyProgress, [0.34, 0.54], [100, 0]);
  const w2o = useTransform(whyProgress, [0.34, 0.46], [0, 1]);

  const whyCardStyles = [
    { y: w0y, opacity: w0o },
    { y: w1y, opacity: w1o },
    { y: w2y, opacity: w2o },
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
  const ctaParaY = useTransform(ctaProgress, [0.20, 0.40], [40, 0]);
  const ctaParaO = useTransform(ctaProgress, [0.20, 0.33], [0, 1]);
  const ctaBtnY = useTransform(ctaProgress, [0.30, 0.48], [30, 0]);
  const ctaBtnO = useTransform(ctaProgress, [0.30, 0.42], [0, 1]);

  return (
    <PageTransition>
      <SEO
        title="Our Services"
        description="Design, print, and training under one roof. We build digital products, deliver premium print, and train the next generation of tech talent."
      />

      {/* ══════════════════════════════════════════════════════
          § 1  HERO
          ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="sticky top-0 z-10 h-screen flex flex-col justify-center overflow-hidden bg-oxford-deep"
      >
        <motion.div style={{ y: heroOrbY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-1/4 w-[500px] h-[500px] rounded-full bg-skyblue/[0.06] blur-[130px]" />
          <div className="absolute bottom-[15%] right-1/4 w-[400px] h-[400px] rounded-full bg-orange/[0.04] blur-[110px]" />
        </motion.div>

        <div className="absolute inset-0 opacity-[0.025]" style={gridBg} />

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10">
          <Container>
            <div className="max-w-4xl">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-7 block"
              >
                What We Do
              </motion.span>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-bold leading-[0.88] tracking-[-0.05em] mb-8">
                <SplitText as="span" className="text-white" type="words" delay={0.25} stagger={0.06}>
                  Design it.
                </SplitText>
                <br />
                <SplitText as="span" className="gradient-text" type="words" delay={0.5} stagger={0.06}>
                  Build it.
                </SplitText>
                <br />
                <SplitText as="span" className="text-orange" type="words" delay={0.75} stagger={0.06}>
                  Ship it.
                </SplitText>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.7 }}
                className="text-lg md:text-xl text-white/40 max-w-lg leading-relaxed"
              >
                Three services, one team. Whether you need a digital product,
                a stack of business cards, or a career in tech — we've got you.
              </motion.p>
            </div>
          </Container>
        </motion.div>

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
          § 2  SCROLL TEXT — philosophy
          ══════════════════════════════════════════════════════ */}
      <div ref={storyRef} className="relative z-20" style={{ height: "250vh" }}>
        <section className="sticky top-0 h-screen flex items-center bg-oxford-card overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.05)") }}
          />
          <Container className="relative z-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/35 mb-10 block">
              Our Approach
            </span>
            <ScrollTextReveal
              containerRef={storyRef}
              text="We don't try to do everything. We focus on three things and do them exceptionally well — so every project gets our full attention, craft, and care."
              className="text-[1.65rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.2rem] font-semibold text-white leading-[1.2] tracking-[-0.02em] max-w-5xl"
            />
          </Container>
        </section>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 3  MARQUEE
          ══════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-[25] bg-oxford-deep border-y border-white/[0.05] py-4">
        <MarqueeText
          text="Design & Build · Print Shop · Tech Training · Premium Quality · "
          speed={35}
          className="text-white/[0.12] text-xs font-mono uppercase tracking-[0.2em]"
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          § 4  SERVICES — alternating editorial cards
          Scroll-driven: title staggers in, each service block
          enters with staggered y/opacity transforms.
          ══════════════════════════════════════════════════════ */}
      <div ref={cardsRef} className="relative z-30" style={{ height: "500vh" }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-oxford-deep">
          <div
            className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.04)", "0%") }}
          />

          {/* Bold geometric vector */}
          <motion.svg style={{ y: decoY }} className="absolute -top-20 -left-20 w-[600px] h-[600px] pointer-events-none" viewBox="0 0 600 600" fill="none" aria-hidden="true">
            <circle cx="300" cy="300" r="280" stroke="#0098da" strokeWidth="0.5" opacity="0.04" />
            <line x1="0" y1="300" x2="600" y2="300" stroke="#0098da" strokeWidth="0.3" opacity="0.03" />
            <line x1="300" y1="0" x2="300" y2="600" stroke="#0098da" strokeWidth="0.3" opacity="0.03" />
          </motion.svg>

          <motion.div
            style={{ y: cardsTitleFadeY, opacity: cardsTitleFadeO }}
            className="relative z-10 mb-6 md:mb-10"
          >
            <Container>
              <motion.span
                style={{ y: cardsTitleY, opacity: cardsTitleO }}
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/45 mb-4 block"
              >
                Our Services
              </motion.span>
              <motion.h2
                style={{ y: cardsHeadY, opacity: cardsHeadO }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-[-0.04em] max-w-3xl"
              >
                Everything you need,{" "}
                <span className="text-skyblue">under one roof.</span>
              </motion.h2>
            </Container>
          </motion.div>

          {/* Service blocks — alternating layout, scroll-driven */}
          <div className="relative z-10 overflow-y-auto max-h-[60vh] scrollbar-hide">
            <Container>
              <div className="flex flex-col gap-14 md:gap-20">
                {SERVICES.map((s, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <motion.div key={s.num} style={svcBlockStyles[i]}>
                      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start ${
                        !isEven ? "lg:[direction:rtl]" : ""
                      }`}>
                        {/* Text side */}
                        <div className={`${!isEven ? "lg:[direction:ltr]" : ""}`}>
                          <span className="font-mono text-[13px] text-white/15 block mb-3">{s.num}</span>
                          <s.Icon size={32} className="text-skyblue/60 mb-5" />
                          <h3 className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold text-white tracking-[-0.02em] mb-4">
                            {s.title}<span className="text-skyblue">.</span>
                          </h3>
                          <p className="text-white/40 text-lg leading-relaxed mb-8 max-w-md">{s.desc}</p>
                          <MagneticButton>
                            <Link
                              to={s.href}
                              className="group relative inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full overflow-hidden border border-iceblue/20 text-white hover:border-skyblue/40 transition-all duration-300"
                            >
                              <span className="relative z-10">Explore {s.title}</span>
                              <span className="relative z-10 text-skyblue transition-transform duration-300 group-hover:translate-x-1">→</span>
                              <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                            </Link>
                          </MagneticButton>
                        </div>

                        {/* Features card */}
                        <div className={`${!isEven ? "lg:[direction:ltr]" : ""}`}>
                          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8 lg:p-10">
                            <ul className="space-y-4">
                              {s.features.map((feat, fi) => (
                                <li
                                  key={fi}
                                  className="flex items-center gap-3 text-white/50"
                                >
                                  <span className="w-1 h-1 rounded-full bg-skyblue/50 flex-shrink-0" />
                                  <span className="text-[15px]">{feat}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-8 h-px w-full bg-skyblue/15" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Container>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 5  WHY US — scroll-driven staggered cards
          ══════════════════════════════════════════════════════ */}
      <div ref={whyRef} className="relative z-40" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-oxford-card">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: radialSpot("rgba(0,152,218,0.03)") }}
          />

          <Container className="relative z-10">
            <motion.span
              style={{ y: whyLabelY, opacity: whyLabelO }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25 mb-4 block text-center"
            >
              Why Us
            </motion.span>
            <motion.h2
              style={{ y: whyHeadY, opacity: whyHeadO }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.04em] mb-16 md:mb-20 text-center max-w-3xl mx-auto"
            >
              Why <span className="text-skyblue">GR8QM</span>?
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
              {WHY.map((w, i) => (
                <motion.div key={i} style={whyCardStyles[i]}>
                  <div className="group relative flex flex-col h-full p-8 lg:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-skyblue/20 transition-colors duration-500 text-center">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-skyblue/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="flex justify-center mb-5 relative z-10">
                      <w.Icon size={32} className="text-skyblue/50 group-hover:text-skyblue transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 relative z-10">{w.title}</h3>
                    <p className="text-white/40 leading-relaxed text-[15px] relative z-10">{w.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          § 6  REVERSE MARQUEE
          ══════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-[45] bg-oxford-deep border-y border-white/[0.05] py-4">
        <MarqueeText
          text="Craft · Speed · Partnership · Quality · Innovation · "
          speed={30}
          className="text-white/[0.08] text-xs font-mono uppercase tracking-[0.2em]"
          reverse
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          § 7  CTA — scroll-driven staggered elements
          ══════════════════════════════════════════════════════ */}
      <div ref={ctaRef} className="relative z-50" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-oxford-deep">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-skyblue/[0.04] blur-[150px]" />
            <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-orange/[0.03] blur-[120px]" />
          </div>
          <div className="absolute inset-0 opacity-[0.015]" style={gridBg} />

          <Container className="relative z-10 text-center w-full">
            <motion.span
              style={{ y: ctaLabelY, opacity: ctaLabelO }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange/40 mb-6 block"
            >
              Let's Work Together
            </motion.span>

            <motion.h2
              style={{ y: ctaHeadY, opacity: ctaHeadO }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 max-w-3xl mx-auto"
            >
              Got a project in{" "}
              <span className="text-skyblue">mind?</span>
            </motion.h2>

            <motion.p
              style={{ y: ctaParaY, opacity: ctaParaO }}
              className="text-lg md:text-xl text-white/35 max-w-lg mx-auto mb-12"
            >
              Tell us what you're building. We'll tell you how we can help.
            </motion.p>

            <motion.div style={{ y: ctaBtnY, opacity: ctaBtnO }}>
              <MagneticButton>
                <Button variant="primary" size="lg" onClick={() => navigate("/contact")} rightIcon={<ArrowRightIcon size={18} />}>
                  Start a Conversation
                </Button>
              </MagneticButton>
            </motion.div>
          </Container>
        </div>
      </div>
    </PageTransition>
  );
};

export default ServicesNew;
