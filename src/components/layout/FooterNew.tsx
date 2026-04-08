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
  ArrowRightIcon,
} from "../icons";
import Button from "../common/Button";
import Container from "./Container";
import Input from "../common/Input";
import { motion } from "framer-motion";
import RevealOnScroll from "../animations/RevealOnScroll";
import MarqueeText from "../animations/MarqueeText";
import MagneticButton from "../animations/MagneticButton";

interface FooterLink {
  label: string;
  path: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ReactNode;
  url: string;
  label: string;
}

interface ContactInfo {
  email: string;
  phone: string;
}

interface FooterProps {
  sections?: FooterSection[];
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  tagline?: string;
  onSubscribe?: (data: {
    name: string;
    email: string;
    message?: string;
  }) => void;
}

const currentYear = new Date().getFullYear();

const defaultSections: FooterSection[] = [
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
      { label: "Our Mission", path: "/about#mission" },
      { label: "Our Work", path: "/portfolio" },
    ],
  },
];

const defaultContactInfo: ContactInfo = {
  email: "hello@gr8qm.com",
  phone: "+234 901 329 4248",
};

const defaultSocialLinks: SocialLink[] = [
  {
    icon: <LinkedinIcon size={20} />,
    url: "https://www.linkedin.com/company/gr8qm",
    label: "LinkedIn",
  },
  {
    icon: <InstagramIcon size={20} />,
    url: "https://www.instagram.com/gr8qmtechnovate",
    label: "Instagram",
  },
  {
    icon: <TwitterXIcon size={20} />,
    url: "https://www.x.com/gr8qmtechnovate",
    label: "Twitter",
  },
  {
    icon: <TiktokIcon size={20} />,
    url: "https://www.tiktok.com/@gr8qmtechnovates",
    label: "TikTok",
  },
  {
    icon: <FacebookIcon size={20} />,
    url: "https://web.facebook.com/profile.php?id=61559404115455&sk=about",
    label: "Facebook",
  },
];

const defaultTagline =
  "Design-led. Purpose-driven. We craft digital products, train tech talent, and deliver print that stands out.";

const Footer: React.FC<FooterProps> = ({
  sections = defaultSections,
  contactInfo = defaultContactInfo,
  socialLinks = defaultSocialLinks,
  tagline = defaultTagline,
  onSubscribe,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "cooldown"
  >("idle");
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
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          },
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
              replyTo: formData.email,
            }),
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
        }

        if (onSubscribe) {
          onSubscribe(formData);
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
    <footer className="relative z-[60] bg-oxford text-white overflow-hidden">
      {/* Decorative orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-skyblue/5 blur-[200px]"
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-orange/5 blur-[150px]"
        animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
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
            <RevealOnScroll direction="left">
              <div className="glass-card p-8 rounded-2xl">
                <p className="text-orange text-xs font-mono tracking-wider uppercase mb-3">
                  Let's Go
                </p>
                <h3 className="text-2xl md:text-3xl font-light text-gray-1 mb-8">
                  Got an idea?{" "}
                  <span className="text-white font-medium">
                    Let's make it real.
                  </span>
                </h3>

                {submitStatus === "success" ? (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xl font-medium text-white">
                      Request Sent!
                    </h4>
                    <p className="text-gray-300">
                      Thank you for reaching out. We'll get back to you shortly.
                    </p>
                    <Button
                      variant="inverted"
                      onClick={() => setSubmitStatus("idle")}
                      className="w-fit mt-4"
                    >
                      Send another
                    </Button>
                  </div>
                ) : submitStatus === "cooldown" ? (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xl font-medium text-white">
                      Request Received
                    </h4>
                    <p className="text-gray-300">
                      You have already submitted a request recently. Please wait a
                      moment before sending another.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <motion.textarea
                      className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/30 px-4 py-3 h-24 focus:border-skyblue focus:outline-none focus:bg-white/10 transition-all duration-300 text-sm"
                      name="message"
                      placeholder="Tell us about your project..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      whileFocus={{ scale: 1.01 }}
                    />
                    <MagneticButton strength={0.15}>
                      <Button
                        type="submit"
                        variant="inverted"
                        className="flex items-center gap-2 w-fit"
                        loading={loading}
                      >
                        Send a request <ArrowRightIcon size={16} />
                      </Button>
                    </MagneticButton>
                  </form>
                )}
              </div>
            </RevealOnScroll>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-8">
              {sections.map((section, index) => (
                <RevealOnScroll
                  key={index}
                  direction="up"
                  delay={index * 0.1}
                >
                  <div>
                    <p className="text-orange text-xs font-mono tracking-wider uppercase mb-4">
                      {section.title}
                    </p>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            to={link.path}
                            className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 text-sm"
                          >
                            <span className="w-0 group-hover:w-4 h-[1px] bg-skyblue transition-all duration-300" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            {/* Contact Info */}
            <RevealOnScroll direction="up" delay={0.3}>
              <div className="mt-10">
                <p className="text-orange text-xs font-mono tracking-wider uppercase mb-4">
                  Contact Us
                </p>
                <div className="space-y-2">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="block text-white/70 hover:text-white transition-colors text-sm hover-line w-fit"
                  >
                    {contactInfo.email}
                  </a>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="block text-white/70 hover:text-white transition-colors text-sm hover-line w-fit"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Logo & Tagline Section */}
          <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end gap-8">
            <RevealOnScroll direction="right">
              <Link to="/" aria-label="Homepage">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CloudinaryImage
                    imageKey="verticalLogoInvert"
                    className="w-24 lg:w-28"
                    alt="Gr8QM Logo"
                  />
                </motion.div>
              </Link>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <p className="text-sm italic text-white/40 lg:text-right max-w-xs">
                {tagline}
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <Container className="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
          <p className="text-xs text-white/40">
            &copy; {currentYear} Gr8QM Technovates. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {socialLinks.map((social, index) => (
              <MagneticButton key={index} strength={0.3}>
                <motion.a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white/40 hover:text-skyblue transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              </MagneticButton>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
