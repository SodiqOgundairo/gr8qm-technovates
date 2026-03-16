import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";

import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import { SEO } from "../../components/common/SEO";
import PageTransition from "../../components/layout/PageTransition";
import { getPageSEO } from "../../utils/seo-config";
import {
  generateServiceSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";

import RevealOnScroll from "../../components/animations/RevealOnScroll";
import SplitText from "../../components/animations/SplitText";
import Scene3D from "../../components/animations/Scene3D";
import MarqueeText from "../../components/animations/MarqueeText";
import MagneticButton from "../../components/animations/MagneticButton";
import GlowCard from "../../components/animations/GlowCard";
import { ParallaxLayer } from "../../components/animations/ParallaxSection";

import {
  ArrowRightIcon,
  PrinterIcon,
  ZapIcon,
  PaintIcon,
  TrophyIcon,
  SparklesIcon,
} from "../../components/icons";
import ServiceRequestModal from "../../components/services/ServiceRequestModal";

/* ─────────────────────── DATA ─────────────────────── */

const products = [
  {
    title: "Business Cards",
    description: "Premium cards that make lasting first impressions",
    features: ["Multiple finishes", "Custom designs", "Fast turnaround"],
    accent: "from-skyblue to-oxford",
  },
  {
    title: "Flyers & Brochures",
    description: "Eye-catching marketing materials",
    features: ["Full color", "Various sizes", "Bulk discounts"],
    accent: "from-orange to-skyblue",
  },
  {
    title: "Banners & Posters",
    description: "Large format prints for maximum impact",
    features: ["Weather resistant", "Custom sizes", "Indoor/outdoor"],
    accent: "from-oxford to-orange",
  },
  {
    title: "Branded Merchandise",
    description: "T-shirts, mugs, and promotional items",
    features: ["Quality materials", "Custom branding", "Bulk orders"],
    accent: "from-skyblue to-orange",
  },
  {
    title: "Stationery",
    description: "Letterheads, envelopes, and notepads",
    features: ["Professional finish", "Brand consistency", "Various weights"],
    accent: "from-orange to-oxford",
  },
  {
    title: "Packaging",
    description: "Custom packaging that stands out",
    features: ["Custom shapes", "Brand colors", "Eco-friendly options"],
    accent: "from-oxford to-skyblue",
  },
];

const whyFeatures = [
  {
    icon: <PrinterIcon size={32} />,
    title: "High-Quality Printing",
    description:
      "State-of-the-art equipment ensures crisp, vibrant prints every time.",
    glow: "rgba(0, 152, 218, 0.2)",
  },
  {
    icon: <ZapIcon size={32} />,
    title: "Fast Turnaround",
    description:
      "Most orders ready within 24-48 hours. Rush orders available.",
    glow: "rgba(245, 134, 52, 0.2)",
  },
  {
    icon: <PaintIcon size={32} />,
    title: "Design Assistance",
    description:
      "Our designers can help bring your vision to life at no extra cost.",
    glow: "rgba(0, 152, 218, 0.2)",
  },
  {
    icon: <TrophyIcon size={32} />,
    title: "Premium Materials",
    description:
      "We use only the finest papers, inks, and materials for lasting quality.",
    glow: "rgba(245, 134, 52, 0.2)",
  },
];

const steps = [
  { num: "01", title: "Request Quote", desc: "Tell us what you need" },
  {
    num: "02",
    title: "Review & Approve",
    desc: "We send you a quote and mockup",
  },
  { num: "03", title: "We Print", desc: "Your order goes into production" },
  { num: "04", title: "Delivery", desc: "Pick up or we deliver to you" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Owner",
    text: "The quality of prints exceeded my expectations. Fast service and great prices!",
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    text: "Gr8QM Print Shop is our go-to for all marketing materials. Consistently excellent.",
  },
  {
    name: "Amina Bello",
    role: "Event Planner",
    text: "They handled our rush order perfectly. Professional and reliable!",
  },
];

/* ─────────────────── FLOATING ORBS ─────────────────── */

const FloatingOrb: React.FC<{
  size: string;
  color: string;
  top: string;
  left: string;
  delay?: number;
}> = ({ size, color, top, left, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${size} ${color}`}
    style={{ top, left }}
    animate={{
      y: [0, -30, 0, 30, 0],
      x: [0, 20, 0, -20, 0],
      scale: [1, 1.1, 1, 0.9, 1],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

/* ─────────────────── COMPONENT ─────────────────── */

const PrintShopPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const pageSEO = getPageSEO("printShop");

  const serviceSchema = generateServiceSchema({
    name: "Print Shop & Branding Services",
    description:
      "Premium print shop services in Lagos. Business cards, banners, brochures, branded merchandise, custom packaging, and large format printing.",
    serviceType: "Print Shop",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
    { name: "Services", url: "https://gr8qm.com/services" },
    { name: "Print Shop", url: "https://gr8qm.com/services/print-shop" },
  ]);

  /* Parallax for CTA section */
  const ctaRef = useRef(null);
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  });
  const ctaY = useTransform(ctaProgress, [0, 1], [80, -80]);

  return (
    <PageTransition>
      <SEO
        {...pageSEO}
        structuredData={[serviceSchema, breadcrumbSchema]}
      />

      <main className="flex flex-col overflow-x-hidden bg-dark">
        {/* ═══════════ SECTION 01 — HERO ═══════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Scene3D background */}
          <Scene3D variant="hero" />

          {/* Noise overlay */}
          <div className="noise-overlay absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" />

          {/* Floating orbs */}
          <FloatingOrb size="w-96 h-96" color="bg-skyblue" top="10%" left="-10%" delay={0} />
          <FloatingOrb size="w-72 h-72" color="bg-orange" top="60%" left="70%" delay={3} />
          <FloatingOrb size="w-56 h-56" color="bg-iceblue" top="30%" left="80%" delay={6} />

          <Container className="relative z-10 flex flex-col items-center text-center gap-8 py-32 md:py-40 lg:py-48">
            {/* Badge */}
            <RevealOnScroll direction="scale" delay={0.1}>
              <span className="inline-flex items-center gap-2 border border-orange/40 bg-orange/10 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-medium text-orange tracking-widest uppercase">
                <SparklesIcon size={16} />
                Print Shop
              </span>
            </RevealOnScroll>

            {/* Headline */}
            <div className="max-w-5xl">
              <SplitText
                as="h1"
                type="words"
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]"
                delay={0.2}
                stagger={0.06}
              >
                Quality Prints, Every Time
              </SplitText>
            </div>

            {/* Subheadline */}
            <RevealOnScroll direction="up" delay={0.6}>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl leading-relaxed">
                From business cards to banners, we deliver professional printing
                services that elevate your brand. Fast turnaround, premium
                quality, and exceptional service.
              </p>
            </RevealOnScroll>

            {/* CTA buttons */}
            <RevealOnScroll direction="up" delay={0.8}>
              <div className="flex gap-5 flex-wrap justify-center mt-4">
                <MagneticButton strength={25} onClick={() => setModalOpen(true)}>
                  <Button variant="pry" className="text-lg px-8 py-4">
                    Request a Quote
                    <ArrowRightIcon size={20} />
                  </Button>
                </MagneticButton>
                <MagneticButton
                  strength={25}
                  onClick={() => navigate("/portfolio?category=print-shop")}
                >
                  <Button variant="sec" className="text-lg px-8 py-4">
                    <span className="button-content">
                      View Samples
                      <ArrowRightIcon size={18} className="arrow" />
                    </span>
                  </Button>
                </MagneticButton>
              </div>
            </RevealOnScroll>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-orange"
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </Container>
        </section>

        {/* ═══════════ MARQUEE DIVIDER ═══════════ */}
        <MarqueeText
          text="BUSINESS CARDS / FLYERS / BANNERS / MERCH / STATIONERY / PACKAGING"
          speed={25}
          className="py-5 bg-orange text-oxford font-black text-xl md:text-2xl tracking-wide"
        />

        {/* ═══════════ SECTION 02 — WHAT WE PRINT ═══════════ */}
        <section className="relative py-24 md:py-36 bg-dark overflow-hidden">
          <FloatingOrb size="w-80 h-80" color="bg-skyblue" top="20%" left="-5%" delay={2} />
          <FloatingOrb size="w-64 h-64" color="bg-orange" top="70%" left="85%" delay={5} />

          <Container className="relative z-10">
            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-16">
              <RevealOnScroll direction="left">
                <span className="text-orange font-mono text-sm tracking-widest">02</span>
              </RevealOnScroll>
              <div>
                <SplitText
                  as="h2"
                  type="words"
                  className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-light"
                  stagger={0.05}
                >
                  What We Print
                </SplitText>
                <RevealOnScroll direction="up" delay={0.3}>
                  <p className="text-gray-500 text-lg mt-3 max-w-xl">
                    Professional printing solutions for all your business needs
                  </p>
                </RevealOnScroll>
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <RevealOnScroll
                  key={product.title}
                  direction="up"
                  delay={i * 0.1}
                >
                  <GlowCard
                    className="group glass-card rounded-2xl p-8 h-full border border-white/5 hover:border-orange/30 transition-colors duration-500"
                    glowColor={
                      i % 2 === 0
                        ? "rgba(0, 152, 218, 0.12)"
                        : "rgba(245, 134, 52, 0.12)"
                    }
                  >
                    {/* Gradient number */}
                    <span
                      className={`text-6xl font-black bg-gradient-to-br ${product.accent} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3 className="text-xl font-bold text-light mt-2 mb-2 group-hover:text-orange transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-500 mb-5 text-sm leading-relaxed">
                      {product.description}
                    </p>

                    <ul className="space-y-2">
                      {product.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors"
                        >
                          <ArrowRightIcon
                            size={14}
                            className="text-orange shrink-0"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Hover line */}
                    <div className="mt-6 h-px w-0 group-hover:w-full bg-gradient-to-r from-orange to-skyblue transition-all duration-700" />
                  </GlowCard>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════ SECTION 03 — WHY CHOOSE US ═══════════ */}
        <section className="relative py-24 md:py-36 bg-oxford overflow-hidden">
          <div className="noise-overlay absolute inset-0 z-[1] opacity-[0.04] pointer-events-none" />
          <FloatingOrb size="w-72 h-72" color="bg-iceblue" top="10%" left="75%" delay={1} />

          <Container className="relative z-10">
            <div className="text-center mb-16">
              <RevealOnScroll direction="scale">
                <span className="text-orange font-mono text-sm tracking-widest">03</span>
              </RevealOnScroll>
              <SplitText
                as="h2"
                type="words"
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-light mt-4"
                stagger={0.05}
              >
                Why Choose Our Print Shop?
              </SplitText>
              <RevealOnScroll direction="up" delay={0.3}>
                <p className="text-iceblue/60 text-lg mt-4 max-w-2xl mx-auto">
                  Excellence in every print, service in every interaction
                </p>
              </RevealOnScroll>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyFeatures.map((feature, i) => (
                <RevealOnScroll key={feature.title} direction="up" delay={i * 0.12}>
                  <GlowCard
                    className="group glass-card rounded-2xl p-8 text-center border border-white/5 hover:border-skyblue/30 transition-colors duration-500 h-full"
                    glowColor={feature.glow}
                  >
                    <div className="text-orange mb-5 flex justify-center">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.15 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {feature.icon}
                      </motion.div>
                    </div>
                    <h3 className="text-lg font-bold text-light mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    {/* Hover line */}
                    <div className="mt-5 mx-auto h-px w-0 group-hover:w-12 bg-orange transition-all duration-500" />
                  </GlowCard>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════ MARQUEE DIVIDER ═══════════ */}
        <MarqueeText
          text="QUALITY / SPEED / DESIGN / PREMIUM MATERIALS / RELIABILITY"
          speed={30}
          className="py-4 bg-dark text-white/10 font-black text-3xl md:text-5xl tracking-wider border-y border-white/5"
          reverse
        />

        {/* ═══════════ SECTION 04 — HOW IT WORKS ═══════════ */}
        <section className="relative py-24 md:py-36 bg-dark overflow-hidden">
          <FloatingOrb size="w-96 h-96" color="bg-orange" top="5%" left="60%" delay={4} />
          <FloatingOrb size="w-56 h-56" color="bg-skyblue" top="60%" left="-5%" delay={1} />

          <Container className="relative z-10">
            <div className="text-center mb-20">
              <RevealOnScroll direction="scale">
                <span className="text-orange font-mono text-sm tracking-widest">04</span>
              </RevealOnScroll>
              <SplitText
                as="h2"
                type="words"
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-light mt-4"
                stagger={0.05}
              >
                How It Works
              </SplitText>
              <RevealOnScroll direction="up" delay={0.3}>
                <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
                  Simple, fast, and hassle-free printing process
                </p>
              </RevealOnScroll>
            </div>

            {/* Steps — horizontal timeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-orange via-skyblue to-orange opacity-30" />

              {steps.map((step, i) => (
                <RevealOnScroll key={step.num} direction="up" delay={i * 0.15}>
                  <div className="flex flex-col items-center text-center group">
                    {/* Number circle */}
                    <motion.div
                      className="relative w-24 h-24 rounded-full border-2 border-orange/40 flex items-center justify-center mb-6 bg-dark group-hover:border-orange transition-colors duration-500"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-3xl font-black bg-gradient-to-br from-orange to-skyblue bg-clip-text text-transparent">
                        {step.num}
                      </span>
                      {/* Pulse ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-orange/20"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      />
                    </motion.div>

                    <h3 className="text-xl font-bold text-iceblue mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{step.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════ SECTION 05 — TESTIMONIALS ═══════════ */}
        <section className="relative py-24 md:py-36 bg-oxford overflow-hidden">
          <div className="noise-overlay absolute inset-0 z-[1] opacity-[0.04] pointer-events-none" />
          <FloatingOrb size="w-80 h-80" color="bg-skyblue" top="15%" left="80%" delay={2} />

          <Container className="relative z-10">
            <div className="text-center mb-16">
              <RevealOnScroll direction="scale">
                <span className="text-orange font-mono text-sm tracking-widest">05</span>
              </RevealOnScroll>
              <SplitText
                as="h2"
                type="words"
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-light mt-4"
                stagger={0.05}
              >
                What Our Clients Say
              </SplitText>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <RevealOnScroll key={t.name} direction="up" delay={i * 0.12}>
                  <GlowCard
                    className="group glass-card rounded-2xl p-8 border border-white/5 hover:border-orange/30 transition-colors duration-500 h-full flex flex-col"
                    glowColor="rgba(245, 134, 52, 0.1)"
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-5 text-orange">
                      {[...Array(5)].map((_, s) => (
                        <motion.div
                          key={s}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + s * 0.08 }}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-gray-400 mb-6 italic leading-relaxed flex-1">
                      "{t.text}"
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-white/5 mb-4" />

                    <div>
                      <p className="font-bold text-light">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </GlowCard>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════ SECTION 06 — CTA ═══════════ */}
        <section
          ref={ctaRef}
          className="relative py-28 md:py-40 overflow-hidden"
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-orange via-skyblue to-oxford"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />

          <div className="noise-overlay absolute inset-0 z-[1] opacity-[0.05] pointer-events-none" />

          {/* Floating orbs inside CTA */}
          <FloatingOrb size="w-64 h-64" color="bg-white" top="-20%" left="10%" delay={0} />
          <FloatingOrb size="w-48 h-48" color="bg-white" top="50%" left="80%" delay={3} />

          <Container className="relative z-10 text-center">
            <motion.div style={{ y: ctaY }}>
              <ParallaxLayer speed={0.2} className="mb-4">
                <RevealOnScroll direction="scale">
                  <span className="text-white/60 font-mono text-sm tracking-widest">06</span>
                </RevealOnScroll>
              </ParallaxLayer>

              <SplitText
                as="h2"
                type="words"
                className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white"
                stagger={0.06}
              >
                Ready to Print?
              </SplitText>

              <RevealOnScroll direction="up" delay={0.3}>
                <p className="text-white/80 text-lg md:text-xl mt-6 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Get a free quote today and experience the Gr8QM difference.
                </p>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delay={0.5}>
                <div className="flex gap-5 justify-center flex-wrap">
                  <MagneticButton strength={30} onClick={() => setModalOpen(true)}>
                    <Button variant="inverted" className="text-lg px-8 py-4">
                      Get a Quote
                      <ArrowRightIcon size={20} />
                    </Button>
                  </MagneticButton>
                  <MagneticButton
                    strength={30}
                    onClick={() => navigate("/portfolio?category=print-shop")}
                  >
                    <Button
                      variant="sec"
                      className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    >
                      <span className="button-content">
                        View Portfolio
                        <ArrowRightIcon size={18} className="arrow" />
                      </span>
                    </Button>
                  </MagneticButton>
                </div>
              </RevealOnScroll>
            </motion.div>
          </Container>
        </section>

        {/* ═══════════ BOTTOM MARQUEE ═══════════ */}
        <MarqueeText
          text="LET'S CREATE SOMETHING AMAZING TOGETHER"
          speed={20}
          className="py-3 bg-dark text-white/5 font-black text-4xl md:text-6xl tracking-widest border-t border-white/5"
        />

        {/* Service Request Modal */}
        <ServiceRequestModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          serviceType="print-shop"
          serviceName="Print Shop"
        />
      </main>
    </PageTransition>
  );
};

export default PrintShopPage;
