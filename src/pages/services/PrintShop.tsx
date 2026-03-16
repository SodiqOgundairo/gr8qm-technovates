import React, { useState } from "react";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { ArrowRightIcon, PrinterIcon } from "../../components/icons";
import { Star } from "lucide-react";
import ServiceRequestModal from "../../components/services/ServiceRequestModal";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Scene3D from "../../components/animations/Scene3D";

const PrintShopPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const products = [
    {
      title: "Business Cards",
      description: "Premium cards that make lasting first impressions",
      icon: "💼",
      features: ["Multiple finishes", "Custom designs", "Fast turnaround"],
    },
    {
      title: "Flyers & Brochures",
      description: "Eye-catching marketing materials",
      icon: "📄",
      features: ["Full color", "Various sizes", "Bulk discounts"],
    },
    {
      title: "Banners & Posters",
      description: "Large format prints for maximum impact",
      icon: "🎯",
      features: ["Weather resistant", "Custom sizes", "Indoor/outdoor"],
    },
    {
      title: "Branded Merchandise",
      description: "T-shirts, mugs, and promotional items",
      icon: "👕",
      features: ["Quality materials", "Custom branding", "Bulk orders"],
    },
    {
      title: "Stationery",
      description: "Letterheads, envelopes, and notepads",
      icon: "📝",
      features: ["Professional finish", "Brand consistency", "Various weights"],
    },
    {
      title: "Packaging",
      description: "Custom packaging that stands out",
      icon: "📦",
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
      icon: <span className="text-3xl">⚡</span>,
      title: "Fast Turnaround",
      description:
        "Most orders ready within 24-48 hours. Rush orders available.",
    },
    {
      icon: <span className="text-3xl">🎨</span>,
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

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-linear-to-br from-skyblue/20 to-orange/20">
        <Scene3D variant="minimal" className="opacity-30" />
        <Container className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <motion.div
              className="bg-orange/20 border border-orange rounded-full px-4 py-2 w-fit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-sm text-oxford font-medium">PRINT SHOP</p>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
              <span className="text-oxford">Quality Prints,</span>{" "}
              <span className="text-orange">Every Time</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              From business cards to banners, we deliver professional printing
              services that elevate your brand. Fast turnaround, premium
              quality, and exceptional service.
            </p>
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
          </div>
          <div className="flex-1">
            <div className="overflow-hidden rounded-2xl">
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <CloudinaryImage
                  imageKey="PintShop"
                  className="rounded-2xl shadow-2xl"
                  alt="Print Shop"
                />
              </motion.div>
            </div>
          </div>
        </Container>
      </div>

      {/* Products Section */}
      <div className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
              What We Print
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional printing solutions for all your business needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={index}
                className="group bg-light border border-gray-200 rounded-xl p-6 cursor-default"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  borderColor: "var(--color-orange)",
                  boxShadow: "0 20px 40px rgba(0,152,218,0.1)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.div
                  className="text-4xl mb-4"
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  whileTap={{ rotate: -10, scale: 0.9 }}
                >
                  {product.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-oxford mb-2 group-hover:text-skyblue transition-colors duration-300">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-700"
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
            ))}
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24 bg-light">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
              Why Choose Our Print Shop?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Excellence in every print, service in every interaction
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-xl p-6 text-center shadow-md cursor-default"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,152,218,0.1)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.div
                  className="text-orange mb-4 flex justify-center"
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  whileTap={{ rotate: -10, scale: 0.9 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-oxford mb-3 group-hover:text-skyblue transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* Process Section */}
      <div className="relative overflow-hidden py-16 md:py-24 bg-oxford text-white">
        <Scene3D variant="minimal" className="opacity-30" />
        <Container className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Simple, fast, and hassle-free printing process
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Request Quote",
                desc: "Tell us what you need",
              },
              {
                step: "2",
                title: "Review & Approve",
                desc: "We send you a quote and mockup",
              },
              {
                step: "3",
                title: "We Print",
                desc: "Your order goes into production",
              },
              {
                step: "4",
                title: "Delivery",
                desc: "Pick up or we deliver to you",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group text-center cursor-default"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
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
                <p className="text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 md:py-24 bg-light">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
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
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-md border border-transparent cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,152,218,0.1)",
                  borderColor: "var(--color-orange)",
                }}
                whileTap={{ scale: 0.97 }}
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
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-bold text-oxford group-hover:text-skyblue transition-colors duration-300">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-24 bg-linear-to-r from-orange to-skyblue">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Print?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Get a free quote today and experience the Gr8QM difference.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="inverted" onClick={() => setModalOpen(true)}>
              Get a Quote
              <ArrowRightIcon size={20} />
            </Button>
            <Button
              variant="sec"
              onClick={() => navigate("/portfolio?category=print-shop")}
              className="bg-white text-oxford hover:bg-gray-100"
            >
              <div className="button-content">
                View Portfolio
                <ArrowRightIcon size={18} className="arrow" />
              </div>
            </Button>
          </div>
        </Container>
      </div>

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

export default PrintShopPage;
