import React, { useState } from "react";
import Container from "../../components/layout/Container";
import { Button } from "devign";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { ArrowRightIcon } from "../../components/icons";
import { CheckCircle } from "lucide-react";
import ServiceRequestModal from "../../components/services/ServiceRequestModal";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MagneticButton from "../../components/animations/MagneticButton";

import { SEO } from "../../components/common/SEO";
import PageTransition from "../../components/layout/PageTransition";
import { getPageSEO } from "../../utils/seo-config";
import {
  generateServiceSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";
const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];

const DesignBuildNewPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const pageSEO = getPageSEO("designBuild");

  // Generate structured data
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

  const services = [
    {
      title: "Web Development",
      description:
        "Responsive, scalable websites built with modern technologies",
      icon: "\u{1F310}",
    },
    {
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications",
      icon: "\u{1F4F1}",
    },
    {
      title: "UI/UX Design",
      description: "User-centered design that delights and converts",
      icon: "\u{1F3A8}",
    },
    {
      title: "API Development",
      description: "Robust APIs and backend systems",
      icon: "\u2699\uFE0F",
    },
    {
      title: "E-Commerce",
      description: "Complete online store solutions",
      icon: "\u{1F6D2}",
    },
    {
      title: "Maintenance",
      description: "Ongoing support and updates",
      icon: "\u{1F527}",
    },
  ];

  const process = [
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
      <main className="flex flex-col bg-oxford-deep">
        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden z-10 sticky top-0">
          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, 120, -80, 60, 0], y: [0, -90, 70, -40, 0], scale: [1, 1.25, 0.85, 1.15, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -left-20 w-[600px] h-[600px] rounded-full bg-skyblue/[0.15] blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, -100, 60, -120, 0], y: [0, 80, -60, 40, 0], scale: [1, 0.9, 1.2, 0.95, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] -right-20 w-[500px] h-[500px] rounded-full bg-orange/[0.12] blur-[140px]"
          />

          {/* Geometric SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
            <circle cx="15%" cy="20%" r="120" stroke="white" fill="none" strokeWidth="0.5"/>
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke="white" strokeWidth="0.3"/>
            <circle cx="85%" cy="75%" r="80" stroke="white" fill="none" strokeWidth="0.3"/>
          </svg>

          <Container className="relative z-10 flex flex-col md:flex-row items-center gap-12 py-12 md:py-28 lg:py-36">
            <div className="flex-1 flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
                <motion.div
                  className="bg-skyblue/10 rounded-full px-4 py-2 w-fit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                    Design & Build
                  </p>
                </motion.div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.2, ease: EASE_SMOOTH }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="text-white">From Vision to</span>{" "}
                  <span className="text-skyblue">Reality</span>
                </h1>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.4, ease: EASE_SMOOTH }}>
                <p className="text-lg md:text-xl text-white/40 leading-relaxed max-w-xl">
                  We design and build custom digital solutions that transform
                  your ideas into powerful, user-friendly applications. From
                  concept to deployment, we're with you every step of the way.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.6, ease: EASE_SMOOTH }}>
                <div className="flex gap-4 flex-wrap">
                  <MagneticButton>
                    <Button variant="primary" size="lg" onClick={() => setModalOpen(true)} rightIcon={<ArrowRightIcon size={20} />}>
                      Start Your Project
                    </Button>
                  </MagneticButton>
                  <button
                    onClick={() => navigate("/portfolio?category=product-design")}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full overflow-hidden border border-white/[0.08] text-white hover:border-skyblue/20 transition-all duration-300"
                  >
                    <span className="relative z-10">View Our Work</span>
                    <span className="relative z-10 text-skyblue transition-transform duration-300 group-hover:translate-x-1">→</span>
                    <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                  </button>
                </div>
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.8, ease: EASE_SMOOTH }}>
                <div className="overflow-hidden rounded-2xl">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <CloudinaryImage
                      imageKey="ResearchDesignImage"
                      className="rounded-2xl"
                      alt="Design & Build"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ═══════════════ WHAT WE BUILD SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center bg-oxford-card overflow-hidden z-20 sticky top-0">
          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, -80, 100, -60, 0], y: [0, 60, -80, 50, 0], scale: [1, 1.15, 0.9, 1.1, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] -right-20 w-[500px] h-[500px] rounded-full bg-orange/[0.12] blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, 90, -70, 50, 0], y: [0, -70, 60, -30, 0], scale: [1, 0.85, 1.2, 0.95, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] -left-20 w-[400px] h-[400px] rounded-full bg-skyblue/[0.1] blur-[140px]"
          />

          {/* Geometric SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
            <circle cx="80%" cy="30%" r="100" stroke="white" fill="none" strokeWidth="0.5"/>
            <line x1="20%" y1="0" x2="20%" y2="100%" stroke="white" strokeWidth="0.3"/>
          </svg>

          <Container className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <div className="text-center mb-16">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-6">What We Build</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  What We Build
                </h2>
                <p className="text-white/40 text-lg max-w-2xl mx-auto">
                  Comprehensive digital solutions tailored to your unique needs
                </p>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: index * 0.1, ease: EASE_SMOOTH }}>
                  <motion.div
                    className="group bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 h-full cursor-default backdrop-blur-sm hover:border-skyblue/20"
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="text-4xl mb-4"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      {service.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-skyblue transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-white/40">{service.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════════ OUR PROCESS SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center bg-oxford-deep overflow-hidden z-30 sticky top-0">
          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, 120, -80, 60, 0], y: [0, -90, 70, -40, 0], scale: [1, 1.25, 0.85, 1.15, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -left-20 w-[600px] h-[600px] rounded-full bg-skyblue/[0.15] blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, -100, 60, -120, 0], y: [0, 80, -60, 40, 0], scale: [1, 0.9, 1.2, 0.95, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] -right-20 w-[500px] h-[500px] rounded-full bg-orange/[0.12] blur-[140px]"
          />

          {/* Geometric SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
            <line x1="30%" y1="0" x2="30%" y2="100%" stroke="white" strokeWidth="0.3"/>
            <circle cx="75%" cy="50%" r="150" stroke="white" fill="none" strokeWidth="0.5"/>
          </svg>

          <Container className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <div className="text-center mb-16">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-6">Our Process</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Our Process
                </h2>
                <p className="text-white/40 text-lg max-w-2xl mx-auto">
                  A proven approach that delivers exceptional results
                </p>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: index * 0.15, ease: EASE_SMOOTH }}>
                  <div className="relative h-full">
                    <motion.div
                      className="group bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 h-full cursor-default backdrop-blur-sm hover:border-skyblue/20"
                      whileHover={{
                        y: -6,
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                    >
                      <div className="text-5xl font-black text-skyblue/15 mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-skyblue transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-white/40">{item.description}</p>
                    </motion.div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRightIcon size={32} className="text-skyblue/40" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════════ WHY CHOOSE US SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center bg-oxford-card overflow-hidden z-40 sticky top-0">
          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, -80, 100, -60, 0], y: [0, 60, -80, 50, 0], scale: [1, 1.15, 0.9, 1.1, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] -left-20 w-[550px] h-[550px] rounded-full bg-skyblue/[0.12] blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, 90, -70, 50, 0], y: [0, -70, 60, -30, 0], scale: [1, 0.85, 1.2, 0.95, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] -right-20 w-[450px] h-[450px] rounded-full bg-orange/[0.1] blur-[140px]"
          />

          {/* Geometric SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
            <circle cx="10%" cy="60%" r="100" stroke="white" fill="none" strokeWidth="0.5"/>
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="0.3"/>
            <circle cx="90%" cy="25%" r="70" stroke="white" fill="none" strokeWidth="0.3"/>
          </svg>

          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-6">Why Choose Us</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Why Choose <span className="text-iceblue">Gr8QM</span>?
                  </h2>
                  <div className="space-y-4">
                    {[
                      "Kingdom-rooted approach to technology",
                      "Experienced team of designers and developers",
                      "Agile methodology for faster delivery",
                      "Transparent communication throughout",
                      "Post-launch support and maintenance",
                      "Competitive pricing with no hidden costs",
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3"
                        whileHover={{ x: 6 }}
                        transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                      >
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.2 }}
                          whileTap={{ rotate: -10, scale: 0.9 }}
                        >
                          <CheckCircle className="text-iceblue w-5 h-5 mt-1 shrink-0" />
                        </motion.div>
                        <p className="text-lg text-white/45">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.3, ease: EASE_SMOOTH }}>
                <motion.div
                  className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-8 border border-white/[0.08]"
                  whileHover={{
                    boxShadow: "0 20px 40px rgba(0,152,218,0.1)",
                  }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-iceblue">
                    Technologies We Use
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "React & Next.js",
                      "Node.js & Python",
                      "PostgreSQL & MongoDB",
                      "AWS & Azure",
                      "React Native",
                      "Tailwind CSS",
                      "GraphQL & REST",
                      "Docker & Kubernetes",
                    ].map((tech, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-3 text-center text-sm font-medium text-white cursor-default hover:border-skyblue/20"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.06)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ═══════════════ CTA SECTION ═══════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center bg-oxford-deep overflow-hidden z-50 sticky top-0">
          {/* Animated atmospheric orbs */}
          <motion.div
            animate={{ x: [0, 120, -80, 60, 0], y: [0, -90, 70, -40, 0], scale: [1, 1.25, 0.85, 1.15, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -left-20 w-[600px] h-[600px] rounded-full bg-skyblue/[0.15] blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, -100, 60, -120, 0], y: [0, 80, -60, 40, 0], scale: [1, 0.9, 1.2, 0.95, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] -right-20 w-[500px] h-[500px] rounded-full bg-orange/[0.12] blur-[140px]"
          />

          {/* Geometric SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
            <circle cx="50%" cy="50%" r="200" stroke="white" fill="none" strokeWidth="0.5"/>
            <line x1="10%" y1="0" x2="10%" y2="100%" stroke="white" strokeWidth="0.3"/>
          </svg>

          <Container className="relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-8">Get Started</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-white/40 text-lg mb-8 max-w-2xl mx-auto">
                Let's discuss your project and create a solution that exceeds
                your expectations.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <MagneticButton>
                  <Button variant="primary" size="lg" onClick={() => setModalOpen(true)} rightIcon={<ArrowRightIcon size={20} />}>
                    Get Started
                  </Button>
                </MagneticButton>
                <button
                  onClick={() => navigate("/portfolio?category=product-design")}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full overflow-hidden border border-white/[0.08] text-white hover:border-skyblue/20 transition-all duration-300"
                >
                  <span className="relative z-10">View Portfolio</span>
                  <span className="relative z-10 text-skyblue transition-transform duration-300 group-hover:translate-x-1">→</span>
                  <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                </button>
              </div>
            </motion.div>
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

export default DesignBuildNewPage;
