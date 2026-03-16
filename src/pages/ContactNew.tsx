import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "../utils/supabase";
import Container from "../components/layout/Container";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import RevealOnScroll from "../components/animations/RevealOnScroll";
import SplitText from "../components/animations/SplitText";
import Scene3D from "../components/animations/Scene3D";
import MagneticButton from "../components/animations/MagneticButton";
import MarqueeText from "../components/animations/MarqueeText";
import {
  SendIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ZapIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "../components/icons";

/* ───────── floating orb component ───────── */
const FloatingOrb = ({
  size,
  color,
  top,
  left,
  delay = 0,
}: {
  size: string;
  color: string;
  top: string;
  left: string;
  delay?: number;
}) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${size} ${color}`}
    style={{ top, left }}
    animate={{
      y: [0, -30, 0, 20, 0],
      x: [0, 15, -10, 5, 0],
      scale: [1, 1.1, 0.95, 1.05, 1],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

/* ───────── animated form field wrapper ───────── */
const AnimatedField = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{
      duration: 0.5,
      delay: 0.1 + index * 0.1,
      ease: [0.22, 0.6, 0.36, 1],
    }}
    whileHover={{ scale: 1.01 }}
  >
    {children}
  </motion.div>
);

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hp, setHp] = useState("");

  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const orbParallax = useTransform(scrollYProgress, [0, 0.5], [0, -120]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp.trim()) {
      return; // honeypot triggered
    }
    const last = localStorage.getItem("contact_last_submit");
    if (last && Date.now() - Number(last) < 30000) {
      setError("Please wait a moment before submitting again.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { error } = await supabase
        .from("messages")
        .insert([{ name, email, message }]);
      if (error) throw error;

      // Send email notification to hello@gr8qm.com
      try {
        const { emailTemplates } = await import("../utils/email");
        const emailTemplate = emailTemplates.contactMessage({
          name,
          email,
          message,
        });

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        await fetch(`${supabaseUrl}/functions/v1/send-receipt-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            to: "hello@gr8qm.com",
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            replyTo: email,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the whole submission if email fails
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      localStorage.setItem("contact_last_submit", String(Date.now()));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <SEO
        title="Contact Us"
        description="Get in touch with Gr8QM Technovates. We'd love to hear from you. Whether it's partnerships, services, or questions—send us a message."
      />
      <main className="flex flex-col overflow-hidden">
        {/* ════════════════════ HERO SECTION ════════════════════ */}
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Scene3D background */}
          <Scene3D variant="hero" />

          {/* Noise overlay */}
          <div className="noise-overlay" />

          {/* Floating gradient orbs */}
          <motion.div style={{ y: orbParallax }} className="absolute inset-0">
            <FloatingOrb
              size="w-72 h-72"
              color="bg-skyblue/20"
              top="10%"
              left="5%"
              delay={0}
            />
            <FloatingOrb
              size="w-96 h-96"
              color="bg-orange/15"
              top="40%"
              left="70%"
              delay={2}
            />
            <FloatingOrb
              size="w-64 h-64"
              color="bg-iceblue/25"
              top="60%"
              left="20%"
              delay={4}
            />
          </motion.div>

          {/* Hero content */}
          <motion.div
            style={{ y: heroParallax }}
            className="relative z-10 text-center px-4"
          >
            <RevealOnScroll direction="scale" delay={0.1}>
              <motion.div
                className="glass-card inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <SparklesIcon size={16} className="text-orange" />
                <span className="text-sm font-medium text-oxford">
                  We're ready when you are
                </span>
              </motion.div>
            </RevealOnScroll>

            <SplitText
              as="h1"
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
              type="words"
              stagger={0.08}
              delay={0.2}
            >
              Let's build
            </SplitText>

            <div className="mt-2 md:mt-4">
              <SplitText
                as="h1"
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight gradient-text"
                type="words"
                stagger={0.08}
                delay={0.5}
              >
                something great.
              </SplitText>
            </div>

            <RevealOnScroll direction="up" delay={0.8}>
              <p className="text-dark/70 text-lg md:text-xl max-w-[600px] mx-auto mt-6 md:mt-8">
                Have a project in mind? Need a quote? Just want to say hi? Drop
                us a line and we'll get back to you within 24 hours.
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={1}>
              <MagneticButton strength={20} className="inline-block mt-8">
                <motion.a
                  href="#contact-form"
                  className="inline-flex items-center gap-2 bg-oxford text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-skyblue transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SendIcon size={20} />
                  Start a Conversation
                </motion.a>
              </MagneticButton>
            </RevealOnScroll>
          </motion.div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-light to-transparent z-10" />
        </section>

        {/* ════════════════════ MARQUEE DIVIDER ════════════════════ */}
        <div className="bg-light py-6 border-y border-gray-100">
          <MarqueeText
            text="LET'S CONNECT — GET IN TOUCH — WE'D LOVE TO HEAR FROM YOU — YOUR VISION, OUR EXPERTISE"
            speed={30}
            className="text-3xl md:text-4xl font-black text-oxford/8 uppercase tracking-widest"
          />
        </div>

        {/* ════════════════════ CONTACT FORM + DETAILS ════════════════════ */}
        <section
          id="contact-form"
          className="relative py-20 md:py-32 bg-light"
        >
          {/* Background orbs */}
          <FloatingOrb
            size="w-80 h-80"
            color="bg-skyblue/10"
            top="20%"
            left="-10%"
            delay={1}
          />
          <FloatingOrb
            size="w-60 h-60"
            color="bg-orange/10"
            top="60%"
            left="85%"
            delay={3}
          />

          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
              {/* ── LEFT: Contact Form (3 cols) ── */}
              <div className="lg:col-span-3">
                <RevealOnScroll direction="left" delay={0.1}>
                  <div className="mb-2">
                    <span className="text-skyblue font-semibold text-sm uppercase tracking-widest">
                      Send a Message
                    </span>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll direction="left" delay={0.2}>
                  <h2 className="text-3xl md:text-5xl font-black text-oxford mb-3">
                    Tell us about{" "}
                    <span className="gradient-text">your project</span>
                  </h2>
                </RevealOnScroll>

                <RevealOnScroll direction="up" delay={0.3}>
                  <p className="text-dark/60 mb-8 max-w-lg">
                    Fill out the form below and our team will get back to you
                    within 24 hours. Every message matters to us.
                  </p>
                </RevealOnScroll>

                {/* Status messages */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="glass-card bg-green-50/80 border border-green-200 p-4 rounded-xl mb-6 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <ShieldCheckIcon size={18} className="text-green-600" />
                    </div>
                    <p className="text-green-700 font-medium">
                      Message sent successfully! We'll be in touch soon.
                    </p>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="glass-card bg-red-50/80 border border-red-200 p-4 rounded-xl mb-6"
                  >
                    <p className="text-red-600 font-medium">{error}</p>
                  </motion.div>
                )}

                {/* Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="glass-card rounded-2xl p-6 md:p-8 space-y-5 border border-white/40"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  {/* Honeypot */}
                  <input
                    type="text"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                    tabIndex={-1}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <AnimatedField index={0}>
                      <Input
                        showLabel
                        labelText="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        inputSize="lg"
                      />
                    </AnimatedField>

                    <AnimatedField index={1}>
                      <Input
                        showLabel
                        labelText="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                        inputSize="lg"
                      />
                    </AnimatedField>
                  </div>

                  <AnimatedField index={2}>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <motion.textarea
                        className="w-full rounded-xl border outline-none transition-all duration-300 text-start border-[var(--color-gray-1)] text-[var(--color-dark)] placeholder:text-[var(--color-gray-1)] focus:bg-[var(--color-iceblue)] focus:text-[var(--color-oxford)] focus:border-[var(--color-skyblue)] focus:shadow-[0_0_20px_rgba(0,152,218,0.15)] px-5 py-4 h-40 resize-none text-lg"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder="Tell us about your project, goals, and timeline..."
                        whileFocus={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      />
                    </div>
                  </AnimatedField>

                  <AnimatedField index={3}>
                    <MagneticButton strength={15} className="w-fit">
                      <Button
                        variant="pry"
                        type="submit"
                        loading={loading}
                        size="lg"
                        className="!px-10"
                      >
                        <SendIcon size={20} />
                        Send Message
                      </Button>
                    </MagneticButton>
                  </AnimatedField>
                </motion.form>
              </div>

              {/* ── RIGHT: Contact Details (2 cols) ── */}
              <div className="lg:col-span-2 space-y-6">
                <RevealOnScroll direction="right" delay={0.2}>
                  <div className="mb-2">
                    <span className="text-orange font-semibold text-sm uppercase tracking-widest">
                      Contact Info
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-oxford mb-6">
                    Get in touch<span className="text-skyblue">.</span>
                  </h2>
                </RevealOnScroll>

                {/* Contact cards */}
                <RevealOnScroll direction="right" delay={0.3}>
                  <motion.a
                    href="mailto:hello@gr8qm.com"
                    className="glass-card group flex items-center gap-4 p-5 rounded-2xl border border-white/40 hover:border-skyblue/30 transition-all duration-300 block"
                    whileHover={{
                      scale: 1.02,
                      y: -4,
                    }}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-skyblue/20 to-iceblue flex items-center justify-center"
                      whileHover={{ rotate: 10 }}
                    >
                      <MailIcon size={24} className="text-skyblue" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-dark/50 font-medium uppercase tracking-wider">
                        Email
                      </p>
                      <p className="text-oxford font-bold text-lg group-hover:text-skyblue transition-colors hover-line">
                        hello@gr8qm.com
                      </p>
                    </div>
                  </motion.a>
                </RevealOnScroll>

                <RevealOnScroll direction="right" delay={0.4}>
                  <motion.a
                    href="tel:+2349013294248"
                    className="glass-card group flex items-center gap-4 p-5 rounded-2xl border border-white/40 hover:border-orange/30 transition-all duration-300 block"
                    whileHover={{
                      scale: 1.02,
                      y: -4,
                    }}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange/20 to-orange/5 flex items-center justify-center"
                      whileHover={{ rotate: -10 }}
                    >
                      <PhoneIcon size={24} className="text-orange" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-dark/50 font-medium uppercase tracking-wider">
                        Phone
                      </p>
                      <p className="text-oxford font-bold text-lg group-hover:text-orange transition-colors hover-line">
                        +234 901 329 4248
                      </p>
                    </div>
                  </motion.a>
                </RevealOnScroll>

                <RevealOnScroll direction="right" delay={0.5}>
                  <motion.div
                    className="glass-card flex items-center gap-4 p-5 rounded-2xl border border-white/40"
                    whileHover={{
                      scale: 1.02,
                      y: -4,
                    }}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-oxford/15 to-oxford/5 flex items-center justify-center"
                      whileHover={{ rotate: 10 }}
                    >
                      <MapPinIcon size={24} className="text-oxford" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-dark/50 font-medium uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-oxford font-bold text-lg">
                        Lagos, Nigeria
                      </p>
                    </div>
                  </motion.div>
                </RevealOnScroll>

                {/* Trust indicators */}
                <RevealOnScroll direction="up" delay={0.6}>
                  <div className="glass-card rounded-2xl p-6 border border-white/40 mt-8 space-y-4">
                    <h3 className="text-oxford font-bold text-lg flex items-center gap-2">
                      <ZapIcon size={20} className="text-orange" />
                      Why work with us
                    </h3>
                    {[
                      "24-hour response time guaranteed",
                      "50+ projects delivered successfully",
                      "End-to-end project management",
                      "Transparent pricing, no hidden fees",
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-skyblue shrink-0" />
                        <span className="text-dark/70 text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </Container>
        </section>

        {/* ════════════════════ LOCATION SECTION ════════════════════ */}
        <section className="relative py-20 md:py-32 bg-oxford overflow-hidden">
          {/* Background elements */}
          <div className="noise-overlay" />
          <FloatingOrb
            size="w-96 h-96"
            color="bg-skyblue/10"
            top="10%"
            left="60%"
            delay={2}
          />
          <FloatingOrb
            size="w-72 h-72"
            color="bg-orange/8"
            top="50%"
            left="10%"
            delay={0}
          />

          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Location text */}
              <div>
                <RevealOnScroll direction="left" delay={0.1}>
                  <span className="text-skyblue font-semibold text-sm uppercase tracking-widest">
                    Our Base
                  </span>
                </RevealOnScroll>

                <RevealOnScroll direction="left" delay={0.2}>
                  <h2 className="text-4xl md:text-6xl font-black text-white mt-3 mb-6">
                    Based in{" "}
                    <span className="gradient-text">Lagos, Nigeria</span>
                  </h2>
                </RevealOnScroll>

                <RevealOnScroll direction="up" delay={0.3}>
                  <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
                    Operating from the heart of Africa's largest tech ecosystem.
                    We serve clients globally while staying rooted in Nigeria's
                    vibrant innovation hub.
                  </p>
                </RevealOnScroll>

                <RevealOnScroll direction="up" delay={0.4}>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Remote-Friendly",
                      "Global Clients",
                      "Lagos HQ",
                    ].map((tag, i) => (
                      <motion.span
                        key={tag}
                        className="glass-card px-4 py-2 rounded-full text-sm font-medium text-white/80 border border-white/10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ scale: 1.05, borderColor: "rgba(0,152,218,0.4)" }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </RevealOnScroll>
              </div>

              {/* Right: Stylized map visual */}
              <RevealOnScroll direction="right" delay={0.3}>
                <motion.div
                  className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {/* Decorative grid lines */}
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={`h-${i}`}
                        className="absolute w-full h-px bg-skyblue"
                        style={{ top: `${(i + 1) * 12}%` }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                      />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={`v-${i}`}
                        className="absolute h-full w-px bg-skyblue"
                        style={{ left: `${(i + 1) * 12}%` }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                      />
                    ))}
                  </div>

                  {/* Location pin */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-skyblue to-skyblue/50 flex items-center justify-center"
                      animate={{
                        y: [0, -8, 0],
                        boxShadow: [
                          "0 0 0 0 rgba(0,152,218,0.3)",
                          "0 0 0 20px rgba(0,152,218,0)",
                          "0 0 0 0 rgba(0,152,218,0.3)",
                        ],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <MapPinIcon size={36} className="text-white" />
                    </motion.div>

                    <div>
                      <h3 className="text-white text-2xl font-bold mb-1">
                        Lagos, Nigeria
                      </h3>
                      <p className="text-white/50">
                        West Africa's Tech Capital
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 w-full pt-4 border-t border-white/10">
                      {[
                        { label: "Timezone", value: "WAT (GMT+1)" },
                        { label: "Languages", value: "EN" },
                        { label: "Availability", value: "Mon-Sat" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                        >
                          <p className="text-white/40 text-xs uppercase tracking-wider">
                            {item.label}
                          </p>
                          <p className="text-white font-semibold mt-1">
                            {item.value}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* ════════════════════ BOTTOM CTA MARQUEE ════════════════════ */}
        <div className="bg-light py-8">
          <MarqueeText
            text="READY TO START? — DROP US A MESSAGE — LET'S CREATE TOGETHER — INNOVATION AWAITS"
            speed={25}
            reverse
            className="text-4xl md:text-5xl font-black text-oxford/6 uppercase tracking-widest"
          />
        </div>
      </main>
    </PageTransition>
  );
};

export default ContactPage;
