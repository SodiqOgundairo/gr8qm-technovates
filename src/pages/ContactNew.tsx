import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../utils/supabase";
import Container from "../components/layout/Container";
import Button from "../components/common/Button";
import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import MarqueeText from "../components/animations/MarqueeText";
import MagneticButton from "../components/animations/MagneticButton";
import OrbitalBackground from "../components/animations/OrbitalBackground";
import {
  Reveal,
  DotGrid,
  DiagonalLines,
  CrossMark,
  AccentLine,
  FloatingRule,
  SectionConnector,
  ConcentricCircles,
} from "../components/animations/DesignElements";
import {
  SendIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ZapIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "../components/icons";

/* ───────── spring + ease constants ───────── */
const SPRING_SNAPPY = { type: "spring" as const, stiffness: 300, damping: 22 };
const SPRING_SOFT = { type: "spring" as const, stiffness: 200, damping: 24 };
const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];

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
      ease: EASE_SMOOTH,
    }}
    whileHover={{ scale: 1.01 }}
  >
    {children}
  </motion.div>
);

/* ───────── dark input component ───────── */
const DarkInput: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}> = ({ label, type = "text", value, onChange, placeholder, required }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-medium text-iceblue/70">{label}</label>
    <motion.input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-xl border bg-oxford-card border-oxford-border text-white placeholder:text-iceblue/30 focus:border-skyblue focus:shadow-[0_0_20px_rgba(0,152,218,0.15)] outline-none transition-all duration-300 px-5 py-4 text-lg"
      whileFocus={{ scale: 1.01 }}
      transition={SPRING_SNAPPY}
    />
  </div>
);

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hp, setHp] = useState("");

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
      <main className="flex flex-col">
        {/* ════════════════════ HERO SECTION ════════════════════ */}
        <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center bg-oxford-deep sticky top-0 z-[10] overflow-hidden">
          <OrbitalBackground variant="hero" />

          {/* Geometric decorations */}
          <DotGrid className="top-12 left-8 text-iceblue/20 w-40 h-40" />
          <DiagonalLines className="bottom-16 right-0 text-skyblue/10 w-72 h-72" />
          <CrossMark className="absolute top-[18%] right-[12%] text-orange/20" size={14} />
          <CrossMark className="absolute bottom-[22%] left-[8%] text-skyblue/20" size={10} />
          <FloatingRule className="top-1/3 left-0 w-full" color="skyblue" dashed />

          {/* Hero content */}
          <div className="relative z-10 text-center px-4">
            <Reveal direction="down" delay={0.1}>
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 bg-oxford-card/60 border border-oxford-border backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={SPRING_SNAPPY}
              >
                <SparklesIcon size={16} className="text-orange" />
                <span className="text-sm font-medium text-iceblue/70">
                  We're ready when you are
                </span>
              </motion.div>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white">
                Let's build
              </h1>
            </Reveal>

            <Reveal delay={0.35}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight gradient-text mt-2 md:mt-4">
                something great.
              </h1>
            </Reveal>

            <Reveal delay={0.5}>
              <p className="text-iceblue/70 text-lg md:text-xl max-w-[600px] mx-auto mt-6 md:mt-8">
                Have a project in mind? Need a quote? Just want to say hi? Drop
                us a line and we'll get back to you within 24 hours.
              </p>
            </Reveal>

            <Reveal delay={0.65}>
              <AccentLine color="skyblue" thickness="medium" width="w-16" className="mx-auto mt-8 mb-8" />
            </Reveal>

            <Reveal delay={0.7}>
              <MagneticButton strength={20} className="inline-block">
                <motion.a
                  href="#contact-form"
                  className="inline-flex items-center gap-2 bg-skyblue text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-skyblue/90 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={SPRING_SNAPPY}
                >
                  <SendIcon size={20} />
                  Start a Conversation
                </motion.a>
              </MagneticButton>
            </Reveal>
          </div>

          {/* Section connector */}
          <SectionConnector color="skyblue" side="center" />

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-oxford-deep to-transparent z-10 pointer-events-none" />
        </section>

        {/* ════════════════════ MARQUEE DIVIDER ════════════════════ */}
        <section className="bg-oxford-deep py-6 border-y border-oxford-border sticky top-0 z-[20] overflow-hidden">
          <MarqueeText
            text="LET'S CONNECT — GET IN TOUCH — WE'D LOVE TO HEAR FROM YOU — YOUR VISION, OUR EXPERTISE"
            speed={30}
            className="text-3xl md:text-4xl font-black text-iceblue/8 uppercase tracking-widest"
          />
        </section>

        {/* ════════════════════ CONTACT FORM + DETAILS ════════════════════ */}
        <section
          id="contact-form"
          className="relative py-20 md:py-32 bg-oxford-deep sticky top-0 z-[30] overflow-hidden"
        >
          {/* Geometric decorations */}
          <DotGrid className="top-20 right-12 text-iceblue/10 w-48 h-48" />
          <DiagonalLines className="bottom-0 left-0 text-orange/6 w-64 h-64" thick />
          <CrossMark className="absolute top-[10%] left-[5%] text-skyblue/15" size={12} />
          <CrossMark className="absolute bottom-[15%] right-[8%] text-orange/15" size={16} />
          <FloatingRule className="top-0 left-0 w-full" color="orange" dashed />

          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
              {/* ── LEFT: Contact Form (3 cols) ── */}
              <div className="lg:col-span-3">
                <Reveal direction="left" delay={0.1}>
                  <div className="mb-2">
                    <span className="text-skyblue font-semibold text-sm uppercase tracking-widest">
                      Send a Message
                    </span>
                  </div>
                </Reveal>

                <Reveal direction="left" delay={0.2}>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-3">
                    Tell us about{" "}
                    <span className="gradient-text">your project</span>
                  </h2>
                </Reveal>

                <Reveal direction="up" delay={0.3}>
                  <p className="text-iceblue/70 mb-4 max-w-lg">
                    Fill out the form below and our team will get back to you
                    within 24 hours. Every message matters to us.
                  </p>
                  <AccentLine color="skyblue" thickness="thin" width="w-24" className="mb-8" />
                </Reveal>

                {/* Status messages */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ ease: EASE_SMOOTH, duration: 0.5 }}
                    className="bg-green-900/30 border border-green-500/30 p-4 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <ShieldCheckIcon size={18} className="text-green-400" />
                    </div>
                    <p className="text-green-300 font-medium">
                      Message sent successfully! We'll be in touch soon.
                    </p>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ ease: EASE_SMOOTH, duration: 0.5 }}
                    className="bg-red-900/30 border border-red-500/30 p-4 rounded-xl mb-6 backdrop-blur-sm"
                  >
                    <p className="text-red-300 font-medium">{error}</p>
                  </motion.div>
                )}

                {/* Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="rounded-2xl p-6 md:p-8 space-y-5 bg-oxford-card/50 border border-oxford-border backdrop-blur-sm"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3, ease: EASE_SMOOTH }}
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
                      <DarkInput
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                      />
                    </AnimatedField>

                    <AnimatedField index={1}>
                      <DarkInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                      />
                    </AnimatedField>
                  </div>

                  <AnimatedField index={2}>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-sm font-medium text-iceblue/70">
                        Message
                      </label>
                      <motion.textarea
                        className="w-full rounded-xl border bg-oxford-card border-oxford-border text-white placeholder:text-iceblue/30 focus:border-skyblue focus:shadow-[0_0_20px_rgba(0,152,218,0.15)] outline-none transition-all duration-300 px-5 py-4 h-40 resize-none text-lg"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder="Tell us about your project, goals, and timeline..."
                        whileFocus={{ scale: 1.01 }}
                        transition={SPRING_SNAPPY}
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
                <Reveal direction="right" delay={0.2}>
                  <div className="mb-2">
                    <span className="text-orange font-semibold text-sm uppercase tracking-widest">
                      Contact Info
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                    Get in touch<span className="text-skyblue">.</span>
                  </h2>
                </Reveal>

                {/* Contact cards */}
                <Reveal direction="right" delay={0.3}>
                  <motion.a
                    href="mailto:hello@gr8qm.com"
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-oxford-border bg-oxford-card/40 hover:border-skyblue/30 transition-all duration-300 block backdrop-blur-sm"
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={SPRING_SOFT}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-skyblue/10 border border-skyblue/20 flex items-center justify-center"
                      whileHover={{ rotate: 10 }}
                    >
                      <MailIcon size={24} className="text-skyblue" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-iceblue/40 font-medium uppercase tracking-wider">
                        Email
                      </p>
                      <p className="text-white font-bold text-lg group-hover:text-skyblue transition-colors">
                        hello@gr8qm.com
                      </p>
                    </div>
                  </motion.a>
                </Reveal>

                <Reveal direction="right" delay={0.4}>
                  <motion.a
                    href="tel:+2349013294248"
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-oxford-border bg-oxford-card/40 hover:border-orange/30 transition-all duration-300 block backdrop-blur-sm"
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={SPRING_SOFT}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center"
                      whileHover={{ rotate: -10 }}
                    >
                      <PhoneIcon size={24} className="text-orange" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-iceblue/40 font-medium uppercase tracking-wider">
                        Phone
                      </p>
                      <p className="text-white font-bold text-lg group-hover:text-orange transition-colors">
                        +234 901 329 4248
                      </p>
                    </div>
                  </motion.a>
                </Reveal>

                <Reveal direction="right" delay={0.5}>
                  <motion.div
                    className="flex items-center gap-4 p-5 rounded-2xl border border-oxford-border bg-oxford-card/40 backdrop-blur-sm"
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={SPRING_SOFT}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-iceblue/10 border border-iceblue/15 flex items-center justify-center"
                      whileHover={{ rotate: 10 }}
                    >
                      <MapPinIcon size={24} className="text-iceblue" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-iceblue/40 font-medium uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-white font-bold text-lg">
                        Lagos, Nigeria
                      </p>
                    </div>
                  </motion.div>
                </Reveal>

                {/* Trust indicators */}
                <Reveal direction="up" delay={0.6}>
                  <div className="rounded-2xl p-6 border border-oxford-border bg-oxford-card/40 mt-8 space-y-4 backdrop-blur-sm">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <ZapIcon size={20} className="text-orange" />
                      Why work with us
                    </h3>
                    <AccentLine color="orange" thickness="thin" width="w-12" className="mb-2" />
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
                        transition={{ delay: 0.7 + i * 0.1, ease: EASE_SMOOTH }}
                      >
                        <div className="w-2 h-2 rounded-full bg-skyblue shrink-0" />
                        <span className="text-iceblue/70 text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>

          {/* Section connector */}
          <SectionConnector color="orange" side="right" />
        </section>

        {/* ════════════════════ LOCATION SECTION (last — relative) ════════════════════ */}
        <section className="relative py-20 md:py-32 bg-oxford-deep overflow-hidden">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="bottom-16 left-8 text-iceblue/10 w-44 h-44" />
          <DiagonalLines className="top-8 right-4 text-skyblue/8 w-60 h-60" />
          <CrossMark className="absolute top-[12%] left-[15%] text-orange/15" size={14} />
          <CrossMark className="absolute bottom-[10%] right-[12%] text-skyblue/15" size={10} />
          <FloatingRule className="bottom-1/4 left-0 w-full" color="iceblue" dashed />
          <ConcentricCircles className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-skyblue/10" />

          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Location text */}
              <div>
                <Reveal direction="left" delay={0.1}>
                  <span className="text-skyblue font-semibold text-sm uppercase tracking-widest">
                    Our Base
                  </span>
                </Reveal>

                <Reveal direction="left" delay={0.2}>
                  <h2 className="text-4xl md:text-6xl font-black text-white mt-3 mb-6">
                    Based in{" "}
                    <span className="gradient-text">Lagos, Nigeria</span>
                  </h2>
                </Reveal>

                <Reveal direction="up" delay={0.3}>
                  <p className="text-iceblue/70 text-lg leading-relaxed mb-4 max-w-lg">
                    Operating from the heart of Africa's largest tech ecosystem.
                    We serve clients globally while staying rooted in Nigeria's
                    vibrant innovation hub.
                  </p>
                  <AccentLine color="iceblue" thickness="medium" width="w-16" className="mb-8" />
                </Reveal>

                <Reveal direction="up" delay={0.4}>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Remote-Friendly",
                      "Global Clients",
                      "Lagos HQ",
                    ].map((tag, i) => (
                      <motion.span
                        key={tag}
                        className="px-4 py-2 rounded-full text-sm font-medium text-iceblue/70 border border-oxford-border bg-oxford-card/40 backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1, ease: EASE_SMOOTH }}
                        whileHover={{ scale: 1.05, borderColor: "rgba(0,152,218,0.4)" }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </Reveal>
              </div>

              {/* Right: Stylized map visual */}
              <Reveal direction="right" delay={0.3}>
                <motion.div
                  className="rounded-3xl p-8 md:p-10 border border-oxford-border bg-oxford-card/40 relative overflow-hidden backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={SPRING_SOFT}
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
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.8, ease: EASE_SMOOTH }}
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
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.8, ease: EASE_SMOOTH }}
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
                        ease: [0.45, 0.05, 0.55, 0.95],
                      }}
                    >
                      <MapPinIcon size={36} className="text-white" />
                    </motion.div>

                    <div>
                      <h3 className="text-white text-2xl font-bold mb-1">
                        Lagos, Nigeria
                      </h3>
                      <p className="text-iceblue/40">
                        West Africa's Tech Capital
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 w-full pt-4 border-t border-oxford-border">
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
                          transition={{ delay: 0.8 + i * 0.1, ease: EASE_SMOOTH }}
                        >
                          <p className="text-iceblue/30 text-xs uppercase tracking-wider">
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
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ════════════════════ BOTTOM CTA MARQUEE ════════════════════ */}
        <div className="bg-oxford-deep py-8 border-t border-oxford-border">
          <MarqueeText
            text="READY TO START? — DROP US A MESSAGE — LET'S CREATE TOGETHER — INNOVATION AWAITS"
            speed={25}
            reverse
            className="text-4xl md:text-5xl font-black text-iceblue/6 uppercase tracking-widest"
          />
        </div>
      </main>
    </PageTransition>
  );
};

export default ContactPage;
