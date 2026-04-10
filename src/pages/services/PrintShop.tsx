import React, { useState } from "react";
import Container from "../../components/layout/Container";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { ArrowRightIcon, PrinterIcon } from "../../components/icons";
import { Button } from "devign";
import { Star } from "lucide-react";
import ServiceRequestModal from "../../components/services/ServiceRequestModal";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import MagneticButton from "../../components/animations/MagneticButton";

const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];

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
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden sticky top-0 z-10">
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

        <Container className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.1 }}>
              <motion.div
                className="bg-orange/10 rounded-full px-4 py-2 w-fit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                  Print Shop
                </p>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.2 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                <span className="text-white">Quality Prints,</span>{" "}
                <span className="text-orange">Every Time</span>
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.3 }}>
              <p className="text-lg md:text-xl text-white/40 leading-relaxed max-w-xl">
                From business cards to banners, we deliver professional printing
                services that elevate your brand. Fast turnaround, premium
                quality, and exceptional service.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.5 }}>
              <div className="flex gap-4 flex-wrap items-center">
                <Button variant="accent" size="lg" className="!rounded-full" onClick={() => navigate("/portfolio?category=print-shop")}>
                  View Samples
                  <ArrowRightIcon size={20} />
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="flex-1">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.3 }}>
              <div className="overflow-hidden rounded-2xl">
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
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ==================== PRODUCTS ==================== */}
      <section className="relative min-h-screen flex flex-col justify-center bg-oxford-card sticky top-0 z-20 overflow-hidden">
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
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-6">Our Products</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.1 }}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                What We Print
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.2 }}>
              <p className="text-white/40 text-lg max-w-2xl mx-auto">
                Professional printing solutions for all your business needs
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: index * 0.08 }}>
                <motion.div
                  className="group bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 cursor-default backdrop-blur-sm h-full hover:border-skyblue/20"
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
                    {product.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange transition-colors duration-300">
                    {product.title}
                  </h3>
                  <p className="text-white/40 mb-4">{product.description}</p>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-white/40"
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
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="relative min-h-screen flex flex-col justify-center bg-oxford-deep sticky top-0 z-30 overflow-hidden">
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
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-6">Why Us</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.1 }}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                Why Choose Our Print Shop?
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.2 }}>
              <p className="text-white/40 text-lg max-w-2xl mx-auto">
                Excellence in every print, service in every interaction
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: index * 0.1 }}>
                <motion.div
                  className="group bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 text-center cursor-default backdrop-blur-sm h-full hover:border-skyblue/20"
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
                  <p className="text-white/40 text-sm">{feature.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================== PROCESS ==================== */}
      <section className="relative min-h-screen flex flex-col justify-center bg-oxford-card sticky top-0 z-40 overflow-hidden">
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
          <circle cx="50%" cy="50%" r="180" stroke="white" fill="none" strokeWidth="0.5"/>
          <line x1="85%" y1="0" x2="85%" y2="100%" stroke="white" strokeWidth="0.3"/>
        </svg>

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-6">Process</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.1 }}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                How It Works
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.2 }}>
              <p className="text-white/40 text-lg max-w-2xl mx-auto">
                Simple, fast, and hassle-free printing process
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: index * 0.12 }}>
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
                  <p className="text-white/40">{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="relative min-h-screen flex flex-col justify-center bg-oxford-deep sticky top-0 z-50 overflow-hidden">
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
          <circle cx="15%" cy="60%" r="100" stroke="white" fill="none" strokeWidth="0.5"/>
          <line x1="60%" y1="0" x2="60%" y2="100%" stroke="white" strokeWidth="0.3"/>
        </svg>

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-6">Testimonials</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.1 }}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                What Our Clients Say
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: index * 0.1 }}>
                <motion.div
                  className="group bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 cursor-default backdrop-blur-sm h-full hover:border-skyblue/20"
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
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
                  <p className="text-white/45 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-bold text-white group-hover:text-skyblue transition-colors duration-300">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-white/40">{testimonial.role}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative min-h-screen flex flex-col justify-center bg-oxford-card sticky top-0 z-[60] overflow-hidden">
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
          <circle cx="50%" cy="50%" r="200" stroke="white" fill="none" strokeWidth="0.5"/>
          <line x1="10%" y1="0" x2="10%" y2="100%" stroke="white" strokeWidth="0.3"/>
        </svg>

        <Container className="relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50 mb-8">Get Started</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.1 }}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to Print?
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.2 }}>
            <p className="text-white/40 text-lg mb-10 max-w-2xl mx-auto">
              Get a free quote today and experience the Gr8QM difference.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.3 }}>
            <div className="flex gap-4 justify-center flex-wrap">
              <MagneticButton>
                <Button variant="primary" size="lg" onClick={() => setModalOpen(true)}>
                  Get a Quote <ArrowRightIcon size={18} />
                </Button>
              </MagneticButton>
              <Link
                to="/portfolio?category=print-shop"
                className="group relative inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full overflow-hidden border border-white/[0.08] text-white hover:border-skyblue/20 transition-all duration-300"
              >
                <span className="relative z-10">View Portfolio</span>
                <span className="relative z-10 text-skyblue transition-transform duration-300 group-hover:translate-x-1">→</span>
                <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
              </Link>
            </div>
          </motion.div>
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
