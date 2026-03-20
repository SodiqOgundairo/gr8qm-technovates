import React, { useState } from "react";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { ArrowRightIcon } from "../../components/icons";
import { CheckCircle } from "lucide-react";
import ServiceRequestModal from "../../components/services/ServiceRequestModal";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { SEO } from "../../components/common/SEO";
import PageTransition from "../../components/layout/PageTransition";
import { getPageSEO } from "../../utils/seo-config";
import {
  generateServiceSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";
import OrbitalBackground from "../../components/animations/OrbitalBackground";
import {
  Reveal,
  DotGrid,
  DiagonalLines,
  CrossMark,
  AccentLine,
  FloatingRule,
  SectionConnector,
} from "../../components/animations/DesignElements";

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
        <section className="relative min-h-[85vh] flex items-center overflow-hidden z-10 sticky top-0">
          <OrbitalBackground variant="hero" />

          {/* Geometric decorations */}
          <DotGrid className="top-8 left-8 text-skyblue/20" />
          <DiagonalLines className="bottom-0 right-0 text-orange/10" thick />
          <CrossMark className="absolute top-[12%] right-[18%] text-skyblue/15" size={20} />
          <CrossMark className="absolute bottom-[18%] left-[12%] text-orange/15" size={14} />

          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />
          <FloatingRule className="bottom-0 left-0 w-full" color="orange" />

          <Container className="relative z-10 flex flex-col md:flex-row items-center gap-12 py-12 md:py-28 lg:py-36">
            <div className="flex-1 flex flex-col gap-6">
              <Reveal delay={0}>
                <motion.div
                  className="bg-skyblue/10 border border-oxford-border rounded-full px-4 py-2 w-fit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="text-sm text-iceblue/70 font-medium tracking-widest uppercase">
                    Design & Build
                  </p>
                </motion.div>
              </Reveal>
              <Reveal delay={0.15}>
                <AccentLine color="skyblue" thickness="medium" width="w-16" className="mb-2" />
              </Reveal>
              <Reveal delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="text-white">From Vision to</span>{" "}
                  <span className="text-skyblue">Reality</span>
                </h1>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="text-lg md:text-xl text-iceblue/70 leading-relaxed max-w-xl">
                  We design and build custom digital solutions that transform
                  your ideas into powerful, user-friendly applications. From
                  concept to deployment, we're with you every step of the way.
                </p>
              </Reveal>
              <Reveal delay={0.6}>
                <div className="flex gap-4 flex-wrap">
                  <Button variant="pry" onClick={() => setModalOpen(true)}>
                    Start Your Project
                    <ArrowRightIcon size={20} />
                  </Button>
                  <Button
                    variant="sec"
                    onClick={() =>
                      navigate("/portfolio?category=product-design")
                    }
                  >
                    <div className="button-content">
                      View Our Work
                      <ArrowRightIcon size={18} className="arrow" />
                    </div>
                  </Button>
                </div>
              </Reveal>
            </div>
            <div className="flex-1">
              <Reveal delay={0.8} direction="right">
                <div className="overflow-hidden rounded-2xl border border-oxford-border">
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
              </Reveal>
            </div>
          </Container>

          <SectionConnector color="skyblue" side="right" />
        </section>

        {/* ═══════════════ WHAT WE BUILD SECTION ═══════════════ */}
        <section className="relative py-24 md:py-32 bg-oxford-deep overflow-hidden z-20 sticky top-0">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="bottom-12 right-12 text-orange/15" />
          <CrossMark className="absolute top-[10%] left-[8%] text-skyblue/10" size={18} />
          <FloatingRule className="top-0 left-0 w-full" color="iceblue" dashed />

          <Container className="relative z-10">
            <Reveal>
              <div className="text-center mb-16">
                <AccentLine color="skyblue" thickness="medium" width="w-12" className="mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  What We Build
                </h2>
                <p className="text-iceblue/70 text-lg max-w-2xl mx-auto">
                  Comprehensive digital solutions tailored to your unique needs
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <motion.div
                    className="group bg-white/5 border border-oxford-border rounded-xl p-6 h-full cursor-default backdrop-blur-sm"
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      borderColor: "rgba(0, 152, 218, 0.3)",
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
                    <p className="text-iceblue/70">{service.description}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </Container>

          <SectionConnector color="orange" side="left" />
        </section>

        {/* ═══════════════ OUR PROCESS SECTION ═══════════════ */}
        <section className="relative py-24 md:py-32 bg-oxford-deep overflow-hidden z-30 sticky top-0">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DiagonalLines className="top-0 left-0 text-skyblue/8" />
          <DotGrid className="top-16 right-16 text-iceblue/10" />
          <CrossMark className="absolute bottom-[15%] right-[10%] text-orange/12" size={16} />
          <FloatingRule className="top-0 left-0 w-full" color="orange" />

          <Container className="relative z-10">
            <Reveal>
              <div className="text-center mb-16">
                <AccentLine color="orange" thickness="medium" width="w-12" className="mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Our Process
                </h2>
                <p className="text-iceblue/70 text-lg max-w-2xl mx-auto">
                  A proven approach that delivers exceptional results
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <Reveal key={index} delay={index * 0.15}>
                  <div className="relative h-full">
                    <motion.div
                      className="group bg-white/5 border border-oxford-border rounded-xl p-6 h-full cursor-default backdrop-blur-sm"
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
                      <p className="text-iceblue/70">{item.description}</p>
                    </motion.div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRightIcon size={32} className="text-skyblue/40" />
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>

          <SectionConnector color="skyblue" side="center" />
        </section>

        {/* ═══════════════ WHY CHOOSE US SECTION ═══════════════ */}
        <section className="relative py-24 md:py-32 bg-oxford-deep overflow-hidden z-40 sticky top-0">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="top-8 left-8 text-orange/15" />
          <DiagonalLines className="bottom-0 right-0 text-skyblue/8" thick />
          <CrossMark className="absolute top-[20%] right-[15%] text-iceblue/12" size={22} />
          <CrossMark className="absolute bottom-[25%] left-[10%] text-skyblue/10" size={12} />
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <Reveal direction="left">
                <div>
                  <AccentLine color="iceblue" thickness="medium" width="w-16" className="mb-6" />
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
                        <p className="text-lg text-iceblue/70">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.3} direction="right">
                <motion.div
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-oxford-border"
                  whileHover={{
                    boxShadow: "0 20px 40px rgba(0,152,218,0.1)",
                  }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-iceblue">
                    Technologies We Use
                  </h3>
                  <FloatingRule className="relative mb-6" color="skyblue" dashed />
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
                        className="bg-white/5 border border-oxford-border rounded-lg p-3 text-center text-sm font-medium text-white cursor-default"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          borderColor: "rgba(0, 152, 218, 0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            </div>
          </Container>

          <SectionConnector color="orange" side="right" />
        </section>

        {/* ═══════════════ CTA SECTION ═══════════════ */}
        <section className="relative py-24 md:py-32 bg-oxford-deep overflow-hidden z-50 sticky top-0">
          <OrbitalBackground variant="cta" />

          {/* Geometric decorations */}
          <DotGrid className="top-12 left-12 text-skyblue/15" />
          <DiagonalLines className="bottom-0 right-0 text-orange/10" />
          <CrossMark className="absolute top-[18%] left-[22%] text-orange/12" size={16} />
          <CrossMark className="absolute bottom-[20%] right-[18%] text-skyblue/10" size={14} />
          <FloatingRule className="top-0 left-0 w-full" color="orange" dashed />

          <Container className="relative z-10 text-center">
            <Reveal>
              <AccentLine color="orange" thickness="thick" width="w-16" className="mx-auto mb-8" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-iceblue/70 text-lg mb-8 max-w-2xl mx-auto">
                Let's discuss your project and create a solution that exceeds
                your expectations.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="pry" onClick={() => setModalOpen(true)}>
                  Get Started
                  <ArrowRightIcon size={20} />
                </Button>
                <Button
                  variant="sec"
                  onClick={() => navigate("/portfolio?category=product-design")}
                >
                  <div className="button-content">
                    View Portfolio
                    <ArrowRightIcon size={18} className="arrow" />
                  </div>
                </Button>
              </div>
            </Reveal>
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
