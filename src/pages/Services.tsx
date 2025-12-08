import React from "react";
import Container from "../components/layout/Container";
import ServiceCard from "../components/services/ServiceCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import ScrollReveal from "../components/common/ScrollReveal";

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Design & Build",
      description:
        "From concept to deployment, we design and build custom solutions tailored to your needs. Whether it's a website, mobile app, or enterprise system, we've got you covered.",
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
        "Professional printing services for all your branding needs. From business cards to banners, we deliver quality prints that make an impact.",
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
        "FREE tech training programs with a commitment fee. Learn in-demand skills from industry experts and launch your tech career.",
      icon: "training" as const,
      features: [
        "Product Design & Management",
        "Frontend & Backend Development",
        "DevOps & Cloud Computing",
        "Cybersecurity Fundamentals",
        "QA Testing & Automation",
        "100% FREE with Commitment Fee",
      ],
      portfolioCategory: "tech-training",
      onContactClick: () => navigate("/services/tech-training"),
    },
  ];

  return (
    <PageTransition>
      <SEO
        title="Our Services"
        description="Empowering Your Digital Journey. We offer comprehensive services to help you build, brand, and grow your business. From custom development to professional printing and FREE tech training."
      />
      <main className="flex flex-col">
        {/* Hero Section */}
        <div className="py-16 md:py-24 lg:py-32 bg-linear-to-br from-skyblue/10 via-iceblue/10 to-orange/10">
          <Container className="text-center">
            <ScrollReveal>
              <div className="bg-iceblue/40 border border-skyblue rounded-full px-6 py-2 w-fit mx-auto mb-6">
                <p className="text-sm text-oxford font-medium">OUR SERVICES</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                <span className="text-oxford">Empowering Your</span>{" "}
                <span className="text-skyblue">Digital Journey</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                We offer comprehensive services to help you build, brand, and
                grow your business. From custom development to professional
                printing and FREE tech training.
              </p>
            </ScrollReveal>
          </Container>
        </div>

        {/* Services Grid */}
        <div className="py-16 md:py-24 lg:py-32 bg-light">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ScrollReveal key={index} delay={index * 0.2} width="100%">
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    features={service.features}
                    onContactClick={service.onContactClick}
                    portfolioCategory={service.portfolioCategory}
                  />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-16 md:py-24 lg:py-32 bg-oxford text-white">
          <Container>
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Why Choose <span className="text-iceblue">Gr8QM</span>?
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  We're more than a service provider—we're your partner in
                  success.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "Purpose-Driven",
                  desc: "Every project is built with intention, faith, and a commitment to excellence.",
                },
                {
                  icon: "⚡",
                  title: "Fast & Reliable",
                  desc: "We deliver quality work on time, every time. Your deadlines are our priority.",
                },
                {
                  icon: "🤝",
                  title: "Ongoing Support",
                  desc: "We don't just deliver and disappear. We're here for the long haul.",
                },
              ].map((item, index) => (
                <ScrollReveal key={index} delay={index * 0.2} width="100%">
                  <motion.div
                    className="text-center p-6 bg-white/5 rounded-xl border border-white/10"
                    whileHover={{
                      y: -10,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-iceblue">
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
        <div className="py-16 md:py-24 bg-linear-to-r from-skyblue to-iceblue">
          <Container className="text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Let's bring your vision to life. Choose a service above or
                contact us to discuss your project.
              </p>
            </ScrollReveal>
          </Container>
        </div>
      </main>
    </PageTransition>
  );
};

export default ServicesPage;
