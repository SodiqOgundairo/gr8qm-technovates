import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import SplitText from "../components/animations/SplitText";
import MarqueeText from "../components/animations/MarqueeText";
import MagneticButton from "../components/animations/MagneticButton";
import ScrollTextReveal from "../components/animations/ScrollTextReveal";
import { Reveal } from "../components/animations/DesignElements";
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
    href: "/new/services/design-build",
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
    href: "/new/services/print-shop",
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
    href: "/new/services/tech-training",
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
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -160]);
  const heroOrbY = useTransform(heroProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

  const { scrollYProgress: cardsProgress } = useScroll({
    target: cardsRef as React.RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });
  const decoY = useTransform(cardsProgress, [0, 1], [60, -60]);

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
        className="sticky top-0 z-10 h-screen flex flex-col justify-center overflow-hidden bg-black"
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
        <section className="sticky top-0 h-screen flex items-center bg-oxford-deep overflow-hidden">
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
      <div className="sticky top-0 z-[25] bg-black border-y border-white/[0.05] py-4">
        <MarqueeText
          text="Design & Build · Print Shop · Tech Training · Premium Quality · "
          speed={35}
          className="text-white/[0.12] text-xs font-mono uppercase tracking-[0.2em]"
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          § 4  SERVICES — alternating editorial cards
          ══════════════════════════════════════════════════════ */}
      <section
        ref={cardsRef}
        className="sticky top-0 z-30 min-h-screen flex items-center py-28 md:py-40 bg-oxford-deep overflow-hidden"
      >
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

        <Container className="relative z-10">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/45 mb-4 block">
              Our Services
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-20 max-w-3xl">
              Everything you need,{" "}
              <span className="text-skyblue">under one roof.</span>
            </h2>
          </Reveal>

          {/* Service blocks — alternating layout */}
          <div className="flex flex-col gap-20 md:gap-28">
            {SERVICES.map((s, i) => {
              const isEven = i % 2 === 0;
              return (
                <Reveal key={s.num} delay={0.1}>
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
                          className="inline-flex items-center gap-2.5 text-skyblue font-medium hover:gap-4 transition-all duration-300"
                        >
                          Explore {s.title}
                          <ArrowRightIcon size={16} />
                        </Link>
                      </MagneticButton>
                    </div>

                    {/* Features card */}
                    <div className={`${!isEven ? "lg:[direction:ltr]" : ""}`}>
                      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8 lg:p-10">
                        <ul className="space-y-4">
                          {s.features.map((feat, fi) => (
                            <motion.li
                              key={fi}
                              className="flex items-center gap-3 text-white/50"
                              initial={{ opacity: 0, x: -16 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 + fi * 0.06, duration: 0.4, ease: [0.22, 0.6, 0.36, 1] }}
                            >
                              <span className="w-1 h-1 rounded-full bg-skyblue/50 flex-shrink-0" />
                              <span className="text-[15px]">{feat}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div
                          className="mt-8 h-px w-0 bg-skyblue/15"
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 5  WHY US
          ══════════════════════════════════════════════════════ */}
      <section className="sticky top-0 z-40 min-h-screen flex items-center py-28 md:py-40 bg-black overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: radialSpot("rgba(0,152,218,0.03)") }}
        />

        <Container className="relative z-10">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25 mb-4 block text-center">
              Why Us
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.04em] mb-16 md:mb-20 text-center max-w-3xl mx-auto">
              Why <span className="text-skyblue">GR8QM</span>?
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {WHY.map((w, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group relative flex flex-col h-full p-8 lg:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-skyblue/20 transition-colors duration-500 text-center">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-skyblue/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="flex justify-center mb-5 relative z-10">
                    <w.Icon size={32} className="text-skyblue/50 group-hover:text-skyblue transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 relative z-10">{w.title}</h3>
                  <p className="text-white/40 leading-relaxed text-[15px] relative z-10">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

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
          § 7  CTA
          ══════════════════════════════════════════════════════ */}
      <section className="relative z-50 h-screen flex items-center bg-oxford-deep overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-skyblue/[0.04] blur-[150px]" />
          <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-orange/[0.03] blur-[120px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.015]" style={gridBg} />

        <Container className="relative z-10 text-center">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange/40 mb-6 block">
              Let's Work Together
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 max-w-3xl mx-auto">
              Got a project in{" "}
              <span className="text-skyblue">mind?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-white/35 max-w-lg mx-auto mb-12">
              Tell us what you're building. We'll tell you how we can help.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <MagneticButton>
              <Link
                to="/new/contact"
                className="inline-flex items-center gap-3 px-10 py-5 bg-skyblue text-white font-semibold rounded-full text-lg shadow-[0_2px_20px_rgba(0,152,218,0.25)] hover:shadow-[0_4px_50px_rgba(0,152,218,0.4)] transition-all duration-400"
              >
                Start a Conversation <ArrowRightIcon size={18} />
              </Link>
            </MagneticButton>
          </Reveal>
        </Container>
      </section>
    </PageTransition>
  );
};

export default ServicesNew;
