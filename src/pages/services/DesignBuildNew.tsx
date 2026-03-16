import React, { useState, useRef } from "react";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import { ArrowRightIcon } from "../../components/icons";
import ServiceRequestModal from "../../components/services/ServiceRequestModal";
import { useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

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
import AnimatedCounter from "../../components/animations/AnimatedCounter";

const services = [
  {
    title: "Web Development",
    description:
      "Responsive, scalable websites built with modern technologies",
    icon: "01",
  },
  {
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications",
    icon: "02",
  },
  {
    title: "UI/UX Design",
    description: "User-centered design that delights and converts",
    icon: "03",
  },
  {
    title: "API Development",
    description: "Robust APIs and backend systems",
    icon: "04",
  },
  {
    title: "E-Commerce",
    description: "Complete online store solutions",
    icon: "05",
  },
  {
    title: "Maintenance",
    description: "Ongoing support and updates",
    icon: "06",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start by understanding your vision, goals, and target audience through in-depth consultations.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Our designers create beautiful, intuitive interfaces that reflect your brand and engage users.",
  },
  {
    step: "03",
    title: "Development",
    description:
      "We build your solution using cutting-edge technologies, ensuring quality and performance.",
  },
  {
    step: "04",
    title: "Launch & Support",
    description:
      "We deploy your project and provide ongoing support to ensure continued success.",
  },
];

const whyChooseUs = [
  "Kingdom-rooted approach to technology",
  "Experienced team of designers and developers",
  "Agile methodology for faster delivery",
  "Transparent communication throughout",
  "Post-launch support and maintenance",
  "Competitive pricing with no hidden costs",
];

const techStack = [
  "React & Next.js",
  "Node.js & Python",
  "PostgreSQL & MongoDB",
  "AWS & Azure",
  "React Native",
  "Tailwind CSS",
  "GraphQL & REST",
  "Docker & Kubernetes",
];

const DesignBuildPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const pageSEO = getPageSEO("designBuild");

  const statsRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: statsRef,
    offset: ["start end", "end start"],
  });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);

  const serviceSchema = generateServiceSchema({
    name: "UX Design & Product Design Services",
    description:
      "Expert UX design and product design services including web development, mobile apps, UI/UX design, and enterprise systems with faith-based excellence.",
    serviceType: "Design and Development",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
    { name: "Services", url: "https://gr8qm.com/services" },
    { name: "Design & Build", url: "https://gr8qm.com/services/design-build" },
  ]);

  return (
    <PageTransition>
      <SEO
        title={pageSEO.title}
        description={pageSEO.description}
        keywords={pageSEO.keywords}
        type={pageSEO.type}
        url="/services/design-build"
        structuredData={[serviceSchema, breadcrumbSchema]}
      />
      <main className="flex flex-col overflow-hidden">
        {/* ============================================= */}
        {/* SECTION 01 — HERO (Full-Height)               */}
        {/* ============================================= */}
        <section className="relative min-h-screen flex items-center justify-center bg-oxford noise-overlay">
          {/* Scene3D background */}
          <div className="absolute inset-0 z-0 opacity-40">
            <Scene3D variant="hero" />
          </div>

          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-skyblue/20 blur-3xl"
            animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-orange/15 blur-3xl"
            animate={{ y: [0, 20, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container className="relative z-10 flex flex-col items-center text-center gap-8 py-32">
            <RevealOnScroll direction="scale" delay={0.1}>
              <div className="glass-card px-6 py-2 rounded-full border border-skyblue/30 mb-2">
                <p className="text-sm text-iceblue font-medium tracking-widest uppercase">
                  Design & Build
                </p>
              </div>
            </RevealOnScroll>

            <SplitText
              as="h1"
              type="chars"
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white"
              delay={0.3}
              stagger={0.02}
            >
              From Vision to
            </SplitText>
            <SplitText
              as="h1"
              type="chars"
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight gradient-text"
              delay={0.6}
              stagger={0.02}
            >
              Reality
            </SplitText>

            <RevealOnScroll direction="up" delay={0.9}>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                We design and build custom digital solutions that transform your
                ideas into powerful, user-friendly applications. From concept to
                deployment, we're with you every step of the way.
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={1.1}>
              <div className="flex gap-4 flex-wrap justify-center mt-4">
                <MagneticButton strength={25} onClick={() => setModalOpen(true)}>
                  <Button variant="pry" className="text-lg px-8 py-4">
                    Start Your Project
                    <ArrowRightIcon size={20} />
                  </Button>
                </MagneticButton>
                <MagneticButton
                  strength={25}
                  onClick={() =>
                    navigate("/portfolio?category=product-design")
                  }
                >
                  <Button variant="sec" className="text-lg px-8 py-4 !text-white !border-white/30">
                    View Our Work
                    <ArrowRightIcon size={18} />
                  </Button>
                </MagneticButton>
              </div>
            </RevealOnScroll>
          </Container>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-skyblue to-transparent" />
          </motion.div>
        </section>

        {/* Marquee divider */}
        <div className="bg-dark py-4 border-y border-white/5">
          <MarqueeText
            text="DESIGN  /  BUILD  /  DEPLOY  /  SCALE  /  MAINTAIN  /  INNOVATE"
            speed={25}
            className="text-2xl md:text-3xl font-black text-white/10 uppercase"
          />
        </div>

        {/* ============================================= */}
        {/* SECTION 02 — WHAT WE BUILD                    */}
        {/* ============================================= */}
        <section className="relative py-24 md:py-36 bg-dark noise-overlay">
          {/* Floating orb */}
          <motion.div
            className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-skyblue/10 blur-3xl pointer-events-none"
            animate={{ x: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container className="relative z-10">
            <div className="flex flex-col items-center text-center mb-16 md:mb-20">
              <RevealOnScroll direction="up">
                <span className="text-7xl md:text-9xl font-black text-white/5 leading-none select-none">
                  02
                </span>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={0.1}>
                <SplitText
                  as="h2"
                  type="words"
                  className="text-4xl md:text-5xl lg:text-6xl font-black text-white -mt-8 md:-mt-12"
                  delay={0.2}
                  stagger={0.08}
                >
                  What We Build
                </SplitText>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={0.3}>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-4">
                  Comprehensive digital solutions tailored to your unique needs
                </p>
              </RevealOnScroll>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <RevealOnScroll
                  key={service.title}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.1}
                  width="100%"
                >
                  <GlowCard
                    className="glass-card rounded-2xl p-8 h-full border border-white/10 group cursor-default"
                    glowColor="rgba(0, 152, 218, 0.2)"
                  >
                    <span className="text-5xl font-black gradient-text opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                      {service.icon}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-4 mb-2 hover-line inline-block">
                      {service.title}
                    </h3>
                    <p className="text-gray-400">{service.description}</p>
                  </GlowCard>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ============================================= */}
        {/* SECTION 03 — STATS BAND                       */}
        {/* ============================================= */}
        <section
          ref={statsRef}
          className="relative py-20 bg-gradient-to-r from-skyblue via-oxford to-skyblue overflow-hidden"
        >
          {/* Parallax orbs */}
          <motion.div
            className="absolute top-0 left-[20%] w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"
            style={{ y: orbY1, scale: orbScale }}
          />
          <motion.div
            className="absolute bottom-0 right-[15%] w-64 h-64 rounded-full bg-orange/20 blur-2xl pointer-events-none"
            style={{ y: orbY2 }}
          />

          <Container className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { target: 150, suffix: "+", label: "Projects Delivered" },
                { target: 50, suffix: "+", label: "Happy Clients" },
                { target: 99, suffix: "%", label: "Client Satisfaction" },
                { target: 24, suffix: "/7", label: "Support Available" },
              ].map((stat) => (
                <RevealOnScroll key={stat.label} direction="scale" delay={0.1}>
                  <div className="flex flex-col items-center">
                    <AnimatedCounter
                      target={stat.target}
                      suffix={stat.suffix}
                      className="text-4xl md:text-5xl font-black text-white"
                      duration={2.5}
                    />
                    <p className="text-iceblue text-sm mt-2 font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ============================================= */}
        {/* SECTION 04 — OUR PROCESS                      */}
        {/* ============================================= */}
        <section className="relative py-24 md:py-36 bg-light noise-overlay">
          {/* Floating orb */}
          <motion.div
            className="absolute bottom-1/3 left-0 w-96 h-96 rounded-full bg-orange/10 blur-3xl pointer-events-none"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container className="relative z-10">
            <div className="flex flex-col items-center text-center mb-16 md:mb-20">
              <RevealOnScroll direction="up">
                <span className="text-7xl md:text-9xl font-black text-oxford/5 leading-none select-none">
                  04
                </span>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={0.1}>
                <SplitText
                  as="h2"
                  type="words"
                  className="text-4xl md:text-5xl lg:text-6xl font-black text-oxford -mt-8 md:-mt-12"
                  delay={0.2}
                  stagger={0.08}
                >
                  Our Process
                </SplitText>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={0.3}>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
                  A proven approach that delivers exceptional results
                </p>
              </RevealOnScroll>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((item, index) => (
                <RevealOnScroll
                  key={item.step}
                  direction="up"
                  delay={index * 0.15}
                  width="100%"
                >
                  <div className="relative h-full group">
                    <GlowCard
                      className="bg-white rounded-2xl p-8 h-full border border-gray-200 group-hover:border-skyblue/50 transition-colors duration-300"
                      glowColor="rgba(0, 152, 218, 0.1)"
                    >
                      <motion.div
                        className="text-7xl font-black gradient-text opacity-20 group-hover:opacity-60 transition-opacity duration-500 leading-none"
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.step}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-oxford mt-4 mb-3 hover-line inline-block">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </GlowCard>

                    {/* Arrow connector (desktop) */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                        <motion.div
                          animate={{ x: [0, 6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRightIcon size={28} className="text-skyblue" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* Marquee divider */}
        <div className="bg-oxford py-4 border-y border-white/5">
          <MarqueeText
            text="KINGDOM-ROOTED  /  FAITH-DRIVEN  /  EXCELLENCE  /  INNOVATION  /  INTEGRITY"
            speed={20}
            className="text-2xl md:text-3xl font-black text-white/10 uppercase"
            reverse
          />
        </div>

        {/* ============================================= */}
        {/* SECTION 05 — WHY CHOOSE GR8QM                 */}
        {/* ============================================= */}
        <section className="relative py-24 md:py-36 bg-oxford noise-overlay overflow-hidden">
          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 right-[5%] w-72 h-72 rounded-full bg-iceblue/10 blur-3xl pointer-events-none"
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-[5%] w-64 h-64 rounded-full bg-orange/10 blur-3xl pointer-events-none"
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container className="relative z-10">
            <div className="flex flex-col items-center text-center mb-16 md:mb-20">
              <RevealOnScroll direction="up">
                <span className="text-7xl md:text-9xl font-black text-white/5 leading-none select-none">
                  05
                </span>
              </RevealOnScroll>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left — reasons */}
              <div>
                <RevealOnScroll direction="left" delay={0.1}>
                  <SplitText
                    as="h2"
                    type="words"
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
                    delay={0.2}
                    stagger={0.06}
                  >
                    Why Choose GR8QM?
                  </SplitText>
                </RevealOnScroll>

                <div className="mt-8 space-y-5">
                  {whyChooseUs.map((item, index) => (
                    <RevealOnScroll
                      key={item}
                      direction="left"
                      delay={0.3 + index * 0.1}
                    >
                      <motion.div
                        className="flex items-center gap-4 group cursor-default"
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-skyblue/20 flex items-center justify-center shrink-0 group-hover:bg-skyblue/40 transition-colors">
                          <span className="text-iceblue font-bold text-sm">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="text-lg text-gray-200 group-hover:text-white transition-colors">
                          {item}
                        </p>
                      </motion.div>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>

              {/* Right — tech stack */}
              <RevealOnScroll direction="right" delay={0.4}>
                <ParallaxLayer speed={0.15}>
                  <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/10">
                    <h3 className="text-2xl md:text-3xl font-black gradient-text mb-8">
                      Technologies We Use
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {techStack.map((tech, index) => (
                        <motion.div
                          key={tech}
                          className="glass-card rounded-xl p-4 text-center text-sm font-semibold text-white border border-white/10 cursor-default"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          whileHover={{
                            scale: 1.05,
                            borderColor: "rgba(0, 152, 218, 0.5)",
                            backgroundColor: "rgba(0, 152, 218, 0.1)",
                          }}
                        >
                          {tech}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ParallaxLayer>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* ============================================= */}
        {/* SECTION 06 — CTA                              */}
        {/* ============================================= */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-skyblue via-oxford to-dark" />

          {/* Scene3D subtle background */}
          <div className="absolute inset-0 z-0 opacity-20">
            <Scene3D variant="minimal" />
          </div>

          {/* Floating orbs */}
          <motion.div
            className="absolute top-1/4 left-[5%] w-64 h-64 rounded-full bg-orange/20 blur-3xl pointer-events-none"
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-[10%] w-80 h-80 rounded-full bg-iceblue/15 blur-3xl pointer-events-none"
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container className="relative z-10 text-center">
            <RevealOnScroll direction="scale">
              <span className="text-7xl md:text-9xl font-black text-white/5 leading-none select-none block">
                06
              </span>
            </RevealOnScroll>

            <SplitText
              as="h2"
              type="words"
              className="text-4xl md:text-5xl lg:text-7xl font-black text-white -mt-6 md:-mt-10"
              delay={0.2}
              stagger={0.08}
            >
              Ready to Build Something Amazing?
            </SplitText>

            <RevealOnScroll direction="up" delay={0.4}>
              <p className="text-white/80 text-lg md:text-xl mt-6 mb-10 max-w-2xl mx-auto leading-relaxed">
                Let's discuss your project and create a solution that exceeds
                your expectations.
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={0.6}>
              <div className="flex gap-5 justify-center flex-wrap">
                <MagneticButton strength={30} onClick={() => setModalOpen(true)}>
                  <Button variant="inverted" className="text-lg px-8 py-4">
                    Get Started
                    <ArrowRightIcon size={20} />
                  </Button>
                </MagneticButton>
                <MagneticButton
                  strength={30}
                  onClick={() =>
                    navigate("/portfolio?category=product-design")
                  }
                >
                  <Button variant="sec" className="text-lg px-8 py-4 !text-white !border-white/30">
                    View Portfolio
                    <ArrowRightIcon size={18} />
                  </Button>
                </MagneticButton>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* Service Request Modal */}
        <ServiceRequestModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          serviceType="design-build"
          serviceName="Design & Build"
        />
      </main>
    </PageTransition>
  );
};

export default DesignBuildPage;
