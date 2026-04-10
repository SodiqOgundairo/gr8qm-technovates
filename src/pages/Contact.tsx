import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "../utils/supabase";
import Container from "../components/layout/Container";
import { Button } from "devign";
import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import MarqueeText from "../components/animations/MarqueeText";
import MagneticButton from "../components/animations/MagneticButton";
import {
  SendIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
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
      className="w-full rounded-xl border bg-white/[0.03] border-white/[0.08] text-white placeholder:text-iceblue/30 focus:border-skyblue focus:shadow-[0_0_20px_rgba(0,152,218,0.15)] outline-none transition-all duration-300 px-5 py-4 text-lg"
      whileFocus={{ scale: 1.01 }}
      transition={SPRING_SNAPPY}
    />
  </div>
);

/* ───────── style helpers ───────── */
const radialSpot = (color: string, y = "50%") =>
  `radial-gradient(ellipse 60% 50% at 50% ${y}, ${color}, transparent)`;

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hp, setHp] = useState("");

  /* ── refs for scroll-driven sections ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  /* ── hero parallax ── */
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const heroBadgeY = useTransform(heroProgress, [0.05, 0.25], [60, 0]);
  const heroBadgeO = useTransform(heroProgress, [0.05, 0.20], [0, 1]);
  const heroH1aY = useTransform(heroProgress, [0.10, 0.30], [80, 0]);
  const heroH1aO = useTransform(heroProgress, [0.10, 0.25], [0, 1]);
  const heroH1bY = useTransform(heroProgress, [0.18, 0.38], [80, 0]);
  const heroH1bO = useTransform(heroProgress, [0.18, 0.33], [0, 1]);
  const heroParaY = useTransform(heroProgress, [0.25, 0.45], [60, 0]);
  const heroParaO = useTransform(heroProgress, [0.25, 0.40], [0, 1]);
  const heroLineO = useTransform(heroProgress, [0.35, 0.48], [0, 1]);
  const heroBtnY = useTransform(heroProgress, [0.40, 0.55], [40, 0]);
  const heroBtnO = useTransform(heroProgress, [0.40, 0.52], [0, 1]);
  // fade out hero as user scrolls past
  const heroFadeO = useTransform(heroProgress, [0.70, 0.90], [1, 0]);

  /* ── form section: scroll-driven entrance for headings + contact cards ── */
  const { scrollYProgress: formProgress } = useScroll({
    target: formRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  // Left column headings
  const formLabelY = useTransform(formProgress, [0.02, 0.12], [50, 0]);
  const formLabelO = useTransform(formProgress, [0.02, 0.10], [0, 1]);
  const formTitleY = useTransform(formProgress, [0.05, 0.16], [60, 0]);
  const formTitleO = useTransform(formProgress, [0.05, 0.14], [0, 1]);
  const formDescY = useTransform(formProgress, [0.08, 0.20], [50, 0]);
  const formDescO = useTransform(formProgress, [0.08, 0.18], [0, 1]);
  const formBodyY = useTransform(formProgress, [0.12, 0.26], [60, 0]);
  const formBodyO = useTransform(formProgress, [0.12, 0.24], [0, 1]);

  // Right column: contact info heading + cards
  const infoTitleY = useTransform(formProgress, [0.06, 0.18], [60, 0]);
  const infoTitleO = useTransform(formProgress, [0.06, 0.16], [0, 1]);
  const card0Y = useTransform(formProgress, [0.10, 0.24], [80, 0]);
  const card0O = useTransform(formProgress, [0.10, 0.20], [0, 1]);
  const card1Y = useTransform(formProgress, [0.14, 0.28], [80, 0]);
  const card1O = useTransform(formProgress, [0.14, 0.24], [0, 1]);
  const card2Y = useTransform(formProgress, [0.18, 0.32], [80, 0]);
  const card2O = useTransform(formProgress, [0.18, 0.28], [0, 1]);
  const card3Y = useTransform(formProgress, [0.22, 0.36], [80, 0]);
  const card3O = useTransform(formProgress, [0.22, 0.32], [0, 1]);
  const trustY = useTransform(formProgress, [0.26, 0.40], [80, 0]);
  const trustO = useTransform(formProgress, [0.26, 0.36], [0, 1]);

  const contactCardStyles = [
    { y: card0Y, opacity: card0O },
    { y: card1Y, opacity: card1O },
    { y: card2Y, opacity: card2O },
  ];

  /* ── location section: scroll-driven transforms ── */
  const { scrollYProgress: locProgress } = useScroll({
    target: locationRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });
  const locLabelY = useTransform(locProgress, [0.05, 0.22], [50, 0]);
  const locLabelO = useTransform(locProgress, [0.05, 0.18], [0, 1]);
  const locTitleY = useTransform(locProgress, [0.10, 0.28], [70, 0]);
  const locTitleO = useTransform(locProgress, [0.10, 0.24], [0, 1]);
  const locParaY = useTransform(locProgress, [0.16, 0.34], [60, 0]);
  const locParaO = useTransform(locProgress, [0.16, 0.30], [0, 1]);
  const locTagsY = useTransform(locProgress, [0.22, 0.40], [50, 0]);
  const locTagsO = useTransform(locProgress, [0.22, 0.36], [0, 1]);
  const locMapY = useTransform(locProgress, [0.14, 0.34], [100, 0]);
  const locMapO = useTransform(locProgress, [0.14, 0.28], [0, 1]);

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
            text: emailTemplate.text,
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
        <div ref={heroRef} className="relative z-[10]" style={{ height: "300vh" }}>
          <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-oxford-deep">
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
              <circle cx="80%" cy="75%" r="90" stroke="white" fill="none" strokeWidth="0.3"/>
              <line x1="70%" y1="0" x2="70%" y2="100%" stroke="white" strokeWidth="0.3"/>
              <line x1="0" y1="33%" x2="100%" y2="33%" stroke="white" strokeWidth="0.3"/>
            </svg>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: radialSpot("rgba(0,152,218,0.04)") }}
            />

            {/* Hero content */}
            <motion.div
              className="relative z-10 text-center px-4 w-full"
              style={{ opacity: heroFadeO }}
            >
              <motion.div style={{ y: heroBadgeY, opacity: heroBadgeO }}>
                <motion.div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={SPRING_SNAPPY}
                >
                  <SparklesIcon size={16} className="text-orange" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                    We're ready when you are
                  </span>
                </motion.div>
              </motion.div>

              <motion.div style={{ y: heroH1aY, opacity: heroH1aO }}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white">
                  Let's build
                </h1>
              </motion.div>

              <motion.div style={{ y: heroH1bY, opacity: heroH1bO }}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight gradient-text mt-2 md:mt-4">
                  something great.
                </h1>
              </motion.div>

              <motion.div style={{ y: heroParaY, opacity: heroParaO }}>
                <p className="text-iceblue/70 text-lg md:text-xl max-w-[600px] mx-auto mt-6 md:mt-8">
                  Have a project in mind? Need a quote? Just want to say hi? Drop
                  us a line and we'll get back to you within 24 hours.
                </p>
              </motion.div>

              <motion.div style={{ opacity: heroLineO }}>
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-skyblue to-transparent mx-auto mt-8 mb-8" />
              </motion.div>

              <motion.div style={{ y: heroBtnY, opacity: heroBtnO }}>
                <MagneticButton strength={20} className="inline-block">
                  <Button variant="primary" size="lg" onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })} leftIcon={<SendIcon size={20} />}>
                      Start a Conversation
                  </Button>
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-oxford-deep to-transparent z-10 pointer-events-none" />
          </div>
        </div>

        {/* ════════════════════ MARQUEE DIVIDER ════════════════════ */}
        <div className="bg-oxford-deep py-6 border-y border-white/[0.08] sticky top-0 z-[20] overflow-hidden">
          <MarqueeText
            text="LET'S CONNECT — GET IN TOUCH — WE'D LOVE TO HEAR FROM YOU — YOUR VISION, OUR EXPERTISE"
            speed={30}
            className="text-3xl md:text-4xl font-black text-iceblue/8 uppercase tracking-widest"
          />
        </div>

        {/* ════════════════════ CONTACT FORM + DETAILS ════════════════════ */}
        {/* Form section uses min-h-screen instead of h-screen to allow form content to exceed viewport */}
        <div ref={formRef} className="relative z-[30]" style={{ height: "400vh" }}>
          <div
            id="contact-form"
            className="sticky top-0 min-h-screen flex items-center overflow-visible bg-oxford-card"
          >
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
              <circle cx="85%" cy="15%" r="100" stroke="white" fill="none" strokeWidth="0.5"/>
              <circle cx="10%" cy="80%" r="70" stroke="white" fill="none" strokeWidth="0.3"/>
              <line x1="30%" y1="0" x2="30%" y2="100%" stroke="white" strokeWidth="0.3"/>
              <line x1="0" y1="70%" x2="100%" y2="70%" stroke="white" strokeWidth="0.3"/>
            </svg>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: radialSpot("rgba(0,152,218,0.03)") }}
            />

            <Container className="relative z-10 py-20 md:py-32">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                {/* ── LEFT: Contact Form (3 cols) ── */}
                <div className="lg:col-span-3">
                  <motion.div style={{ y: formLabelY, opacity: formLabelO }}>
                    <div className="mb-2">
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                        Send a Message
                      </span>
                    </div>
                  </motion.div>

                  <motion.div style={{ y: formTitleY, opacity: formTitleO }}>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-3">
                      Tell us about{" "}
                      <span className="gradient-text">your project</span>
                    </h2>
                  </motion.div>

                  <motion.div style={{ y: formDescY, opacity: formDescO }}>
                    <p className="text-iceblue/70 mb-4 max-w-lg">
                      Fill out the form below and our team will get back to you
                      within 24 hours. Every message matters to us.
                    </p>
                    <div className="w-24 h-px bg-gradient-to-r from-skyblue to-transparent mb-8" />
                  </motion.div>

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

                  {/* Form — scroll-driven entrance on the wrapper, interactive inside */}
                  <motion.div style={{ y: formBodyY, opacity: formBodyO }}>
                    <motion.form
                      onSubmit={handleSubmit}
                      className="rounded-2xl p-6 md:p-8 space-y-5 bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
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
                            className="w-full rounded-xl border bg-white/[0.03] border-white/[0.08] text-white placeholder:text-iceblue/30 focus:border-skyblue focus:shadow-[0_0_20px_rgba(0,152,218,0.15)] outline-none transition-all duration-300 px-5 py-4 h-40 resize-none text-lg"
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
                            variant="primary"
                            type="submit"
                            isLoading={loading}
                            size="lg"
                            leftIcon={<SendIcon size={20} />}
                          >
                            Send Message
                          </Button>
                        </MagneticButton>
                      </AnimatedField>
                    </motion.form>
                  </motion.div>
                </div>

                {/* ── RIGHT: Contact Details (2 cols) ── */}
                <div className="lg:col-span-2 space-y-6">
                  <motion.div style={{ y: infoTitleY, opacity: infoTitleO }}>
                    <div className="mb-2">
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                        Contact Info
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                      Get in touch<span className="text-skyblue">.</span>
                    </h2>
                  </motion.div>

                  {/* Contact cards */}
                  <motion.div style={contactCardStyles[0]}>
                    <motion.a
                      href="mailto:hello@gr8qm.com"
                      className="group flex items-center gap-4 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-skyblue/20 transition-all duration-300 block backdrop-blur-sm"
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
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                          Email
                        </p>
                        <p className="text-white font-bold text-lg group-hover:text-skyblue transition-colors">
                          hello@gr8qm.com
                        </p>
                      </div>
                    </motion.a>
                  </motion.div>

                  <motion.div style={contactCardStyles[1]}>
                    <motion.a
                      href="tel:+2349013294248"
                      className="group flex items-center gap-4 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-orange/20 transition-all duration-300 block backdrop-blur-sm"
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
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                          Phone
                        </p>
                        <p className="text-white font-bold text-lg group-hover:text-orange transition-colors">
                          +234 901 329 4248
                        </p>
                      </div>
                    </motion.a>
                  </motion.div>

                  <motion.div style={contactCardStyles[2]}>
                    <motion.div
                      className="flex items-center gap-4 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm"
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
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                          Location
                        </p>
                        <p className="text-white font-bold text-lg">
                          Lagos, Nigeria
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Book a Meeting */}
                  <motion.div style={{ y: card3Y, opacity: card3O }}>
                    <motion.a
                      href="https://calendar.app.google/CTLVpRdKZS2y37cG6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-skyblue/[0.08] to-orange/[0.05] hover:border-skyblue/30 transition-all duration-300 block backdrop-blur-sm"
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={SPRING_SOFT}
                    >
                      <motion.div
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-skyblue/20 to-orange/20 border border-skyblue/20 flex items-center justify-center"
                        whileHover={{ rotate: -10 }}
                      >
                        <CalendarIcon size={24} className="text-skyblue" />
                      </motion.div>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                          Schedule
                        </p>
                        <p className="text-white font-bold text-lg group-hover:text-skyblue transition-colors">
                          Book a Meeting
                        </p>
                        <p className="text-iceblue/40 text-xs mt-0.5">
                          Pick a time that works for you
                        </p>
                      </div>
                    </motion.a>
                  </motion.div>

                  {/* Trust indicators */}
                  <motion.div style={{ y: trustY, opacity: trustO }}>
                    <div className="rounded-2xl p-6 border border-white/[0.08] bg-white/[0.03] mt-8 space-y-4 backdrop-blur-sm">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <ZapIcon size={20} className="text-orange" />
                        Why work with us
                      </h3>
                      <div className="w-12 h-px bg-gradient-to-r from-orange to-transparent mb-2" />
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
                          transition={{ delay: 0.1 + i * 0.1, ease: EASE_SMOOTH }}
                        >
                          <div className="w-2 h-2 rounded-full bg-skyblue shrink-0" />
                          <span className="text-iceblue/70 text-sm">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </Container>
          </div>
        </div>

        {/* ════════════════════ LOCATION SECTION ════════════════════ */}
        <div ref={locationRef} className="relative z-[40]" style={{ height: "300vh" }}>
          <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-oxford-deep">
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
              <circle cx="50%" cy="50%" r="130" stroke="white" fill="none" strokeWidth="0.3"/>
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="0.3"/>
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="0.3"/>
            </svg>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: radialSpot("rgba(0,152,218,0.03)") }}
            />

            <Container className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Location text */}
                <div>
                  <motion.div style={{ y: locLabelY, opacity: locLabelO }}>
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                      Our Base
                    </span>
                  </motion.div>

                  <motion.div style={{ y: locTitleY, opacity: locTitleO }}>
                    <h2 className="text-4xl md:text-6xl font-black text-white mt-3 mb-6">
                      Based in{" "}
                      <span className="gradient-text">Lagos, Nigeria</span>
                    </h2>
                  </motion.div>

                  <motion.div style={{ y: locParaY, opacity: locParaO }}>
                    <p className="text-iceblue/70 text-lg leading-relaxed mb-4 max-w-lg">
                      Operating from the heart of Africa's largest tech ecosystem.
                      We serve clients globally while staying rooted in Nigeria's
                      vibrant innovation hub.
                    </p>
                    <div className="w-16 h-[2px] bg-gradient-to-r from-iceblue to-transparent mb-8" />
                  </motion.div>

                  <motion.div style={{ y: locTagsY, opacity: locTagsO }}>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "Remote-Friendly",
                        "Global Clients",
                        "Lagos HQ",
                      ].map((tag) => (
                        <motion.span
                          key={tag}
                          className="px-4 py-2 rounded-full text-sm font-medium text-iceblue/70 border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm"
                          whileHover={{ scale: 1.05, borderColor: "rgba(0,152,218,0.4)" }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Right: Stylized map visual */}
                <motion.div style={{ y: locMapY, opacity: locMapO }}>
                  <motion.div
                    className="rounded-3xl p-8 md:p-10 border border-white/[0.08] bg-white/[0.03] relative overflow-hidden backdrop-blur-sm"
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
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.8, ease: EASE_SMOOTH }}
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
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.8, ease: EASE_SMOOTH }}
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

                      <div className="grid grid-cols-3 gap-6 w-full pt-4 border-t border-white/[0.08]">
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
                            transition={{ delay: 0.3 + i * 0.1, ease: EASE_SMOOTH }}
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
                </motion.div>
              </div>
            </Container>
          </div>
        </div>

        {/* ════════════════════ BOTTOM CTA MARQUEE ════════════════════ */}
        <div className="bg-oxford-deep py-8 border-t border-white/[0.08] relative z-[50]">
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
