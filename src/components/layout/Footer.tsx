import React, { useState, type FormEvent } from "react";
import { supabase } from "../../utils/supabase";
import { Link } from "react-router-dom";
import CloudinaryImage from "../../utils/cloudinaryImage";
import {
  LinkedinIcon,
  InstagramIcon,
  TwitterXIcon,
  TiktokIcon,
  FacebookIcon,
} from "../icons";
import Container from "./Container";
import { Input, Textarea } from "devign";
import { motion } from "framer-motion";
import { Reveal } from "../animations/DesignElements";
import MarqueeText from "../animations/MarqueeText";

const currentYear = new Date().getFullYear();

const footerSections = [
  {
    title: "SERVICES",
    links: [
      { label: "Design & Build", path: "/services/design-build" },
      { label: "Tech Training", path: "/services/tech-training" },
      { label: "Print Shop", path: "/services/print-shop" },
    ],
  },
  {
    title: "INFORMATION",
    links: [
      { label: "About Us", path: "/about" },
      { label: "Our Work", path: "/portfolio" },
      { label: "Careers", path: "/careers" },
    ],
  },
];

const socialLinks = [
  { icon: <LinkedinIcon size={20} />, url: "https://www.linkedin.com/company/gr8qm", label: "LinkedIn" },
  { icon: <InstagramIcon size={20} />, url: "https://www.instagram.com/gr8qmtechnovate", label: "Instagram" },
  { icon: <TwitterXIcon size={20} />, url: "https://www.x.com/gr8qmtechnovate", label: "Twitter" },
  { icon: <TiktokIcon size={20} />, url: "https://www.tiktok.com/@gr8qmtechnovates", label: "TikTok" },
  { icon: <FacebookIcon size={20} />, url: "https://web.facebook.com/profile.php?id=61559404115455&sk=about", label: "Facebook" },
];

const Footer: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "cooldown">("idle");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const last = localStorage.getItem("footer_last_submit");
    if (last && Date.now() - Number(last) < 30000) {
      setSubmitStatus("cooldown");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      const last = localStorage.getItem("footer_last_submit");
      if (last && Date.now() - Number(last) < 30000) {
        setSubmitStatus("cooldown");
        return;
      }
      setLoading(true);
      try {
        await supabase.from("messages").insert([
          { name: formData.name, email: formData.email, message: formData.message },
        ]);

        try {
          const { emailTemplates } = await import("../../utils/email");
          const emailTemplate = emailTemplates.contactMessage({
            name: formData.name,
            email: formData.email,
            message: formData.message,
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
              replyTo: formData.email,
            }),
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
        }

        setFormData({ name: "", email: "", message: "" });
        localStorage.setItem("footer_last_submit", String(Date.now()));
        setSubmitStatus("success");
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <footer className="relative z-[60] bg-oxford-card text-white overflow-hidden">
      {/* Decorative orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-skyblue/10 blur-[200px]"
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-orange/8 blur-[150px]"
        animate={{ x: [0, -30, 25, 0], y: [0, 20, -15, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        aria-hidden="true"
      />

      {/* CTA Marquee strip */}
      <div className="py-3 border-b border-white/5">
        <MarqueeText
          text="LET'S BUILD SOMETHING GREAT TOGETHER ✦ LET'S CREATE ✦ LET'S INNOVATE"
          className="text-white/10 text-sm font-bold tracking-widest"
          speed={35}
        />
      </div>

      {/* Main Footer Content */}
      <Container className="relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Subscribe Section */}
          <div className="lg:col-span-5">
            <Reveal direction="left">
              <div className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
                <p className="text-orange text-xs font-mono tracking-wider uppercase mb-3">
                  Let's Go
                </p>
                <h3 className="text-2xl md:text-3xl font-light text-iceblue/50 mb-8">
                  Got an idea?{" "}
                  <span className="text-white font-medium">Let's make it real.</span>
                </h3>

                {submitStatus === "success" ? (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xl font-medium text-white">Request Sent!</h4>
                    <p className="text-iceblue/60">Thank you for reaching out. We'll get back to you shortly.</p>
                    <button
                      onClick={() => setSubmitStatus("idle")}
                      className="group relative inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full overflow-hidden border border-iceblue/20 text-white hover:border-skyblue/40 transition-all duration-300 mt-4"
                    >
                      <span className="relative z-10">Send another</span>
                      <span className="relative z-10 text-skyblue transition-transform duration-300 group-hover:translate-x-1">→</span>
                      <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                    </button>
                  </div>
                ) : submitStatus === "cooldown" ? (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xl font-medium text-white">Request Received</h4>
                    <p className="text-iceblue/60">You have already submitted a request recently. Please wait a moment before sending another.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleInputChange} required className="!bg-white/[0.04] !border-white/[0.08] !text-white !placeholder-white/20 !rounded-xl focus:!border-white/[0.16]" />
                      <Input type="email" placeholder="email@example.com" name="email" value={formData.email} onChange={handleInputChange} required className="!bg-white/[0.04] !border-white/[0.08] !text-white !placeholder-white/20 !rounded-xl focus:!border-white/[0.16]" />
                    </div>
                    <Textarea
                      name="message"
                      placeholder="Tell us about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      className="!bg-white/[0.04] !border-white/[0.08] !text-white !placeholder-white/20 !rounded-xl focus:!border-white/[0.16] h-24"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full overflow-hidden border border-iceblue/20 text-white hover:border-skyblue/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10">{loading ? "Sending..." : "Send a request"}</span>
                      <span className="relative z-10 text-skyblue transition-transform duration-300 group-hover:translate-x-1">→</span>
                      <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-8">
              {footerSections.map((section, index) => (
                <Reveal key={index} direction="up" delay={index * 0.1}>
                  <div>
                    <p className="text-orange text-xs font-mono tracking-wider uppercase mb-4">{section.title}</p>
                    <ul className="space-y-3">
                      {section.links.map((link, li) => (
                        <li key={li}>
                          <Link
                            to={link.path}
                            className="group inline-flex items-center gap-2 text-iceblue/50 hover:text-white transition-colors duration-300 text-sm"
                          >
                            <span className="w-0 group-hover:w-4 h-[1px] bg-skyblue transition-all duration-300" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Contact Info */}
            <Reveal direction="up" delay={0.3}>
              <div className="mt-10">
                <p className="text-orange text-xs font-mono tracking-wider uppercase mb-4">Contact Us</p>
                <div className="space-y-2">
                  <a href="mailto:hello@gr8qm.com" className="block text-iceblue/50 hover:text-white transition-colors text-sm w-fit">
                    hello@gr8qm.com
                  </a>
                  <a href="tel:+2349013294248" className="block text-iceblue/50 hover:text-white transition-colors text-sm w-fit">
                    +234 901 329 4248
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Logo & Tagline Section */}
          <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end gap-8">
            <Reveal direction="right">
              <Link to="/" aria-label="Homepage">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ type: "spring" as const, stiffness: 200 }}
                >
                  <CloudinaryImage imageKey="verticalLogoInvert" className="w-24 lg:w-28" alt="Gr8QM Logo" />
                </motion.div>
              </Link>
            </Reveal>
            <Reveal direction="right" delay={0.2}>
              <p className="text-sm italic text-iceblue/30 lg:text-right max-w-xs">
                Design-led. Purpose-driven. We craft digital products, train tech talent, and deliver print that stands out.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <Container className="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
          <p className="text-xs text-iceblue/30">&copy; {currentYear} Gr8QM Technovates. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-iceblue/30 hover:text-skyblue transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
