import React from "react";
import Container from "../components/layout/Container";
import ServiceCard from "../components/services/ServiceCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TargetIcon, ZapIcon, HandshakeIcon } from "../components/icons";
import Button from "../components/common/Button";
import Scene3D from "../components/animations/Scene3D";

import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import ScrollReveal from "../components/common/ScrollReveal";

const cardSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 15,
};

const iconHover = { rotate: 15, scale: 1.2 };
const iconTap = { rotate: -10, scale: 0.9 };

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Design & Build",
      description:
        "Websites, apps, and digital products. We handle everything from UX research to final deployment, so you get a product that works as good as it looks.",
      icon: "design" as const,
      features: [
        "Custom Web & Mobile Applications",
        "UI/UX Design & Prototyping",
        "Full-Stack Development",
        "API Integration & Development",
        "Database Design & Optimization",
        "Ongoing Maintenance & Support",
      ],
      portfolioCategory: "product-design",
      onContactClick: () => navigate("/services/design-build"),
    },
    {
      title: "Print Shop",
      description:
        "Your brand, made tangible. Premium print for business cards, flyers, banners, merch, and packaging. Fast turnaround, no compromises on quality.",
      icon: "print" as const,
      features: [
        "Business Cards & Stationery",
        "Flyers & Brochures",
        "Banners & Posters",
        "Branded Merchandise",
        "Custom Packaging Design",
        "Fast Turnaround Time",
      ],
      portfolioCategory: "print-shop",
      onContactClick: () => navigate("/services/print-shop"),
    },
    {
      title: "Tech Training",
      description:
        "Zero to job-ready. Sponsored cohort programs in product design, development, and QA. Real projects, real mentors, real career outcomes.",
      icon: "training" as const,
      features: [
        "Product Design & Management",
        "Frontend & Backend Development",
        "DevOps & Cloud Computing",
        "Cybersecurity Fundamentals",
        "QA Testing & Automation",
        "Sponsored with Commitment Fee",
      ],
      portfolioCategory: "tech-training",
      onContactClick: () => navigate("/services/tech-training"),
    },
  ];

  return (
    <PageTransition>
      <SEO
        title="Our Services"
        description="Design, print, and training under one roof. We build digital products, deliver premium print, and train the next generation of tech talent."
      />
      <main className="flex flex-col">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-linear-to-br from-skyblue/10 via-iceblue/10 to-orange/10">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container className="text-center">
            <ScrollReveal>
              <motion.div
                className="bg-iceblue/40 border border-skyblue rounded-full px-6 py-2 w-fit mx-auto mb-6"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0, 152, 218, 0.1)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={cardSpring}
              >
                <p className="text-sm text-oxford font-medium">WHAT WE DO</p>
              </motion.div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                <span className="text-oxford">Design it.</span>{" "}
                <span className="text-skyblue">Build it.</span>{" "}
                <span className="text-orange">Ship it.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Three services. One team. Whether you need a digital product, a
                stack of business cards, or a career in tech, we've got you.
              </p>
            </ScrollReveal>
          </Container>
        </div>

        {/* Services Grid */}
        <div className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-light">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ScrollReveal key={index} delay={index * 0.2} width="100%">
                  <motion.div
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0, 152, 218, 0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={cardSpring}
                    className="h-full"
                  >
                    <ServiceCard
                      title={service.title}
                      description={service.description}
                      icon={service.icon}
                      features={service.features}
                      onContactClick={service.onContactClick}
                      portfolioCategory={service.portfolioCategory}
                    />
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>

        {/* Why Choose Us Section */}
        <div className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-oxford text-white">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container>
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Why <span className="text-iceblue">Gr8QM</span>?
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  We're not just vendors. We're the team you wish you'd hired
                  sooner.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <TargetIcon size={40} className="text-iceblue" />,
                  title: "Obsessed with Craft",
                  desc: "We sweat the details other agencies skip. Every interaction, every transition, every line of code gets our full attention.",
                },
                {
                  icon: <ZapIcon size={40} className="text-orange" />,
                  title: "Ship Fast, Ship Right",
                  desc: "Speed without sacrificing quality. We move quickly because our process is tight, not because we cut corners.",
                },
                {
                  icon: <HandshakeIcon size={40} className="text-iceblue" />,
                  title: "Long-term Partners",
                  desc: "We don't disappear after launch. Ongoing support, iteration, and growth are baked into how we work.",
                },
              ].map((item, index) => (
                <ScrollReveal key={index} delay={index * 0.2} width="100%">
                  <motion.div
                    className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm group"
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0, 152, 218, 0.1)",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={cardSpring}
                  >
                    <motion.div
                      className="flex justify-center mb-4"
                      whileHover={iconHover}
                      whileTap={iconTap}
                      transition={cardSpring}
                    >
                      {item.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-iceblue group-hover:text-skyblue transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-300">{item.desc}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden py-16 md:py-24 bg-linear-to-r from-skyblue to-iceblue">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container className="text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Got a project in mind?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Tell us what you're building. We'll tell you how we can help.
              </p>
              <motion.div
                className="inline-block"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0, 152, 218, 0.1)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={cardSpring}
              >
                <Button to="/contact" variant="inverted">
                  Start a Conversation
                </Button>
              </motion.div>
            </ScrollReveal>
          </Container>
        </div>
      </main>
    </PageTransition>
  );
};

export default ServicesPage;
