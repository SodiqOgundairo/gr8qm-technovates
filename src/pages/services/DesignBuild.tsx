import React, { useState } from "react";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { HiArrowLongRight } from "react-icons/hi2";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import ServiceRequestModal from "../../components/services/ServiceRequestModal";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { SEO } from "../../components/common/SEO";
import PageTransition from "../../components/layout/PageTransition";
import ScrollReveal from "../../components/common/ScrollReveal";

const DesignBuildPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const services = [
    {
      title: "Web Development",
      description:
        "Responsive, scalable websites built with modern technologies",
      icon: "🌐",
    },
    {
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications",
      icon: "📱",
    },
    {
      title: "UI/UX Design",
      description: "User-centered design that delights and converts",
      icon: "🎨",
    },
    {
      title: "API Development",
      description: "Robust APIs and backend systems",
      icon: "⚙️",
    },
    {
      title: "E-Commerce",
      description: "Complete online store solutions",
      icon: "🛒",
    },
    {
      title: "Maintenance",
      description: "Ongoing support and updates",
      icon: "🔧",
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
        title="Design & Build"
        description="From Vision to Reality. We design and build custom digital solutions that transform your ideas into powerful, user-friendly applications."
      />
      <main className="flex flex-col">
        {/* Hero Section */}
        <div className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-linear-to-br from-skyblue/20 to-orange/20">
          <Container className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 flex flex-col gap-6">
              <ScrollReveal>
                <div className="bg-iceblue/40 border border-skyblue rounded-full px-4 py-2 w-fit">
                  <p className="text-sm text-oxford font-medium">
                    DESIGN & BUILD
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="text-oxford">From Vision to</span>{" "}
                  <span className="text-skyblue">Reality</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  We design and build custom digital solutions that transform
                  your ideas into powerful, user-friendly applications. From
                  concept to deployment, we're with you every step of the way.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.6}>
                <div className="flex gap-4 flex-wrap">
                  <Button variant="pry" onClick={() => setModalOpen(true)}>
                    Start Your Project
                    <IoIosArrowRoundForward className="text-2xl" />
                  </Button>
                  <Button
                    variant="sec"
                    onClick={() =>
                      navigate("/portfolio?category=product-design")
                    }
                  >
                    <div className="button-content">
                      View Our Work
                      <HiArrowLongRight className="arrow" />
                    </div>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
            <div className="flex-1">
              <ScrollReveal delay={0.8}>
                <CloudinaryImage
                  imageKey="ResearchDesignImage"
                  className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                  alt="Design & Build"
                />
              </ScrollReveal>
            </div>
          </Container>
        </div>

        {/* What We Do Section */}
        <div className="py-16 md:py-24 bg-white">
          <Container>
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
                  What We Build
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Comprehensive digital solutions tailored to your unique needs
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <ScrollReveal key={index} delay={index * 0.1} width="100%">
                  <motion.div
                    className="bg-light border border-gray-200 rounded-xl p-6 h-full"
                    whileHover={{
                      y: -8,
                      borderColor: "var(--color-skyblue)",
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-bold text-oxford mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">{service.description}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>

        {/* Our Process Section */}
        <div className="py-16 md:py-24 bg-light">
          <Container>
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
                  Our Process
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  A proven approach that delivers exceptional results
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <ScrollReveal key={index} delay={index * 0.2} width="100%">
                  <div className="relative h-full">
                    <motion.div
                      className="bg-white rounded-xl p-6 shadow-md h-full"
                      whileHover={{
                        y: -5,
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <div className="text-5xl font-black text-skyblue/20 mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-oxford mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </motion.div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <IoIosArrowRoundForward className="text-4xl text-skyblue" />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-16 md:py-24 bg-oxford text-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
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
                      <div key={index} className="flex items-start gap-3">
                        <FaCheck className="text-iceblue text-xl mt-1 shrink-0" />
                        <p className="text-lg text-gray-200">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
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
                        className="bg-white/10 rounded-lg p-3 text-center text-sm font-medium cursor-default"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </Container>
        </div>

        {/* CTA Section */}
        <div className="py-16 md:py-24 bg-linear-to-r from-skyblue to-iceblue">
          <Container className="text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Let's discuss your project and create a solution that exceeds
                your expectations.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="inverted" onClick={() => setModalOpen(true)}>
                  Get Started
                  <IoIosArrowRoundForward className="text-2xl" />
                </Button>
                <Button
                  variant="sec"
                  onClick={() => navigate("/portfolio?category=product-design")}
                >
                  <div className="button-content">
                    View Portfolio
                    <HiArrowLongRight className="arrow" />
                  </div>
                </Button>
              </div>
            </ScrollReveal>
          </Container>
        </div>

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
