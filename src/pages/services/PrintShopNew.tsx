import React, { useState } from "react";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { ArrowRightIcon, PrinterIcon } from "../../components/icons";
import { Star } from "lucide-react";
import ServiceRequestModal from "../../components/services/ServiceRequestModal";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const products = [
  {
    title: "Business Cards",
    description: "Premium cards that make lasting first impressions",
    icon: "\u{1F4BC}",
    features: ["Multiple finishes", "Custom designs", "Fast turnaround"],
  },
  {
    title: "Flyers & Brochures",
    description: "Eye-catching marketing materials",
    icon: "\u{1F4C4}",
    features: ["Full color", "Various sizes", "Bulk discounts"],
  },
  {
    title: "Banners & Posters",
    description: "Large format prints for maximum impact",
    icon: "\u{1F3AF}",
    features: ["Weather resistant", "Custom sizes", "Indoor/outdoor"],
  },
  {
    title: "Branded Merchandise",
    description: "T-shirts, mugs, and promotional items",
    icon: "\u{1F455}",
    features: ["Quality materials", "Custom branding", "Bulk orders"],
  },
  {
    title: "Stationery",
    description: "Letterheads, envelopes, and notepads",
    icon: "\u{1F4DD}",
    features: ["Professional finish", "Brand consistency", "Various weights"],
  },
  {
    title: "Packaging",
    description: "Custom packaging that stands out",
    icon: "\u{1F4E6}",
    features: ["Custom shapes", "Brand colors", "Eco-friendly options"],
  },
];

const features = [
  {
    icon: <PrinterIcon size={28} />,
    title: "High-Quality Printing",
    description:
      "State-of-the-art equipment ensures crisp, vibrant prints every time.",
  },
  {
    icon: <span className="text-3xl">{"\u26A1"}</span>,
    title: "Fast Turnaround",
    description:
      "Most orders ready within 24-48 hours. Rush orders available.",
  },
  {
    icon: <span className="text-3xl">{"\u{1F3A8}"}</span>,
    title: "Design Assistance",
    description:
      "Our designers can help bring your vision to life at no extra cost.",
  },
  {
    icon: <Star className="w-7 h-7" />,
    title: "Premium Materials",
    description:
      "We use only the finest papers, inks, and materials for lasting quality.",
  },
];

const processSteps = [
  { step: "1", title: "Request Quote", desc: "Tell us what you need" },
  {
    step: "2",
    title: "Review & Approve",
    desc: "We send you a quote and mockup",
  },
  { step: "3", title: "We Print", desc: "Your order goes into production" },
  { step: "4", title: "Delivery", desc: "Pick up or we deliver to you" },
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

const PrintShopNewPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="flex flex-col bg-oxford-deep">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden sticky top-0 z-10">
        <OrbitalBackground variant="hero" />

        {/* Geometric decorations */}
        <DotGrid className="top-8 left-8 text-skyblue/20" />
        <DiagonalLines className="bottom-0 right-0 text-orange/10" thick />
        <CrossMark className="absolute top-[15%] right-[20%] text-skyblue/15" size={20} />
        <CrossMark className="absolute bottom-[20%] left-[12%] text-orange/15" size={14} />

        <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

        <Container className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <Reveal delay={0.1}>
              <motion.div
                className="bg-orange/10 border border-orange/30 rounded-full px-4 py-2 w-fit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-sm text-orange font-medium tracking-widest uppercase">
                  Print Shop
                </p>
              </motion.div>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                <span className="text-white">Quality Prints,</span>{" "}
                <span className="text-orange">Every Time</span>
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-lg md:text-xl text-iceblue/70 leading-relaxed max-w-xl">
                From business cards to banners, we deliver professional printing
                services that elevate your brand. Fast turnaround, premium
                quality, and exceptional service.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <AccentLine color="orange" thickness="medium" width="w-24" className="my-2" />
            </Reveal>

            <Reveal delay={0.5}>
              <div className="flex gap-4 flex-wrap">
                <Button variant="pry" onClick={() => setModalOpen(true)}>
                  Request a Quote
                  <ArrowRightIcon size={20} />
                </Button>
                <Button
                  variant="sec"
                  onClick={() => navigate("/portfolio?category=print-shop")}
                >
                  <div className="button-content">
                    View Samples
                    <ArrowRightIcon size={18} className="arrow" />
                  </div>
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="flex-1">
            <Reveal delay={0.3} direction="right">
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                >
                  <CloudinaryImage
                    imageKey="PintShop"
                    className="rounded-2xl"
                    alt="Print Shop"
                  />
                </motion.div>
              </div>
            </Reveal>
          </div>
        </Container>

        <SectionConnector color="orange" side="right" />
      </section>

      {/* ==================== PRODUCTS ==================== */}
      <section className="relative py-24 md:py-36 bg-oxford-deep sticky top-0 z-20 overflow-hidden">
        <OrbitalBackground variant="section" />

        <DotGrid className="top-12 right-12 text-iceblue/10" />
        <CrossMark className="absolute top-[10%] left-[8%] text-skyblue/15" size={16} />

        <FloatingRule className="top-0 left-0 w-full" color="orange" dashed />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <Reveal>
              <AccentLine color="skyblue" thickness="thin" width="w-16" className="mx-auto mb-6" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                What We Print
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-iceblue/70 text-lg max-w-2xl mx-auto">
                Professional printing solutions for all your business needs
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <motion.div
                  className="group bg-white/[0.03] border border-white/10 rounded-xl p-6 cursor-default backdrop-blur-sm h-full"
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    borderColor: "rgba(245, 134, 52, 0.4)",
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
                    {product.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange transition-colors duration-300">
                    {product.title}
                  </h3>
                  <p className="text-iceblue/70 mb-4">{product.description}</p>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-iceblue/60"
                      >
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.2 }}
                          whileTap={{ rotate: -10, scale: 0.9 }}
                        >
                          <ArrowRightIcon size={16} className="text-orange" />
                        </motion.div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Container>

        <SectionConnector color="skyblue" side="left" />
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="relative py-24 md:py-36 bg-oxford-deep sticky top-0 z-30 overflow-hidden">
        <OrbitalBackground variant="section" />

        <DiagonalLines className="top-0 left-0 text-skyblue/5" />
        <CrossMark className="absolute bottom-[15%] right-[10%] text-orange/15" size={18} />

        <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <Reveal>
              <AccentLine color="orange" thickness="thin" width="w-16" className="mx-auto mb-6" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                Why Choose Our Print Shop?
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-iceblue/70 text-lg max-w-2xl mx-auto">
                Excellence in every print, service in every interaction
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <motion.div
                  className="group bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center cursor-default backdrop-blur-sm h-full"
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                >
                  <motion.div
                    className="text-orange mb-4 flex justify-center"
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    whileTap={{ rotate: -10, scale: 0.9 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-skyblue transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-iceblue/60 text-sm">{feature.description}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Container>

        <SectionConnector color="orange" side="right" />
      </section>

      {/* ==================== PROCESS ==================== */}
      <section className="relative py-24 md:py-36 bg-oxford-deep sticky top-0 z-40 overflow-hidden">
        <OrbitalBackground variant="section" />

        <DotGrid className="bottom-8 left-8 text-orange/10" />
        <DiagonalLines className="top-0 right-0 text-iceblue/5" thick />
        <CrossMark className="absolute top-[12%] right-[18%] text-skyblue/15" size={14} />

        <FloatingRule className="top-0 left-0 w-full" color="orange" dashed />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <Reveal>
              <AccentLine color="skyblue" thickness="thin" width="w-16" className="mx-auto mb-6" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                How It Works
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-iceblue/70 text-lg max-w-2xl mx-auto">
                Simple, fast, and hassle-free printing process
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <Reveal key={index} delay={index * 0.12}>
                <motion.div
                  className="group text-center cursor-default"
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                >
                  <motion.div
                    className="bg-orange text-white text-2xl font-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    whileTap={{ rotate: -10, scale: 0.9 }}
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-iceblue group-hover:text-orange transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-iceblue/60">{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Container>

        <SectionConnector color="skyblue" side="center" />
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="relative py-24 md:py-36 bg-oxford-deep sticky top-0 z-50 overflow-hidden">
        <OrbitalBackground variant="section" />

        <DotGrid className="top-12 left-12 text-skyblue/10" />
        <CrossMark className="absolute bottom-[18%] right-[14%] text-orange/15" size={16} />

        <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <Reveal>
              <AccentLine color="orange" thickness="thin" width="w-16" className="mx-auto mb-6" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                What Our Clients Say
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <motion.div
                  className="group bg-white/[0.03] border border-white/10 rounded-xl p-6 cursor-default backdrop-blur-sm h-full"
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                    borderColor: "rgba(245, 134, 52, 0.4)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                >
                  <div className="flex gap-1 mb-4 text-orange">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        whileTap={{ rotate: -10, scale: 0.9 }}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-iceblue/70 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-bold text-white group-hover:text-skyblue transition-colors duration-300">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-iceblue/50">{testimonial.role}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Container>

        <SectionConnector color="orange" side="left" />
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative py-24 md:py-36 bg-oxford-deep sticky top-0 z-[60] overflow-hidden">
        <OrbitalBackground variant="cta" />

        <DiagonalLines className="top-0 left-0 text-orange/5" thick />
        <DotGrid className="bottom-8 right-8 text-skyblue/10" />
        <CrossMark className="absolute top-[20%] left-[15%] text-skyblue/15" size={18} />
        <CrossMark className="absolute bottom-[25%] right-[12%] text-orange/15" size={12} />

        <FloatingRule className="top-0 left-0 w-full" color="orange" thick />

        <Container className="relative z-10 text-center">
          <Reveal>
            <AccentLine color="skyblue" thickness="medium" width="w-20" className="mx-auto mb-8" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to Print?
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-iceblue/70 text-lg mb-10 max-w-2xl mx-auto">
              Get a free quote today and experience the Gr8QM difference.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="pry" onClick={() => setModalOpen(true)}>
                Get a Quote
                <ArrowRightIcon size={20} />
              </Button>
              <Button
                variant="sec"
                onClick={() => navigate("/portfolio?category=print-shop")}
                className="border-white/20 text-white hover:border-skyblue/40"
              >
                <div className="button-content">
                  View Portfolio
                  <ArrowRightIcon size={18} className="arrow" />
                </div>
              </Button>
            </div>
          </Reveal>

          <FloatingRule className="bottom-0 left-0 w-full" color="skyblue" dashed />
        </Container>
      </section>

      {/* Service Request Modal */}
      <ServiceRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceType="print-shop"
        serviceName="Print Shop"
      />
    </main>
  );
};

export default PrintShopNewPage;
