import React, { useState, type FormEvent } from "react";
import { supabase } from "../../utils/supabase";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import CloudinaryImage from "../../utils/cloudinaryImage";
import shape1 from "../../assets/img/shape.png";
import shape2 from "../../assets/img/shape2.png";
import arrow from "../../assets/img/arrow_corner.svg";
import { LiaFacebookF, LiaInstagram, LiaLinkedin } from "react-icons/lia";
import { RiTwitterXFill, RiTiktokFill } from "react-icons/ri";
import Button from "../common/Button";
import Container from "./Container";
import Input from "../common/Input";
import { motion } from "framer-motion";

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
    icon: <LiaLinkedin />,
    url: "https://www.linkedin.com/company/gr8qm",
    label: "LinkedIn",
  },
  {
    icon: <LiaInstagram />,
    url: "https://www.instagram.com/gr8qmtechnovate",
    label: "Instagram",
  },
  {
    icon: <RiTwitterXFill />,
    url: "https://www.x.com/gr8qmtechnovate",
    label: "Twitter",
  },
  {
    icon: <RiTiktokFill />,
    url: "https://www.tiktok.com/@gr8qmtechnovates",
    label: "TikTok",
  },
  {
    icon: <LiaFacebookF />,
    url: "https://web.facebook.com/profile.php?id=61559404115455&sk=about",
    label: "Facebook",
  },
];

const defaultTagline =
  "Innovating with faith, designing with purpose, and transforming lives through kingdom-rooted technology.";

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

        // Send email notification to hello@gr8qm.com
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
          // Don't fail the whole submission if email fails
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
    <footer className="relative bg-oxford text-white py-12 md:py-24 lg:py-36 xl:py-40 2xl:py-48 flex flex-col gap-24 items-start">
      <Container className="flex flex-col md:flex-row justify-between gap-6 w-full">
        {/* Subscribe Section */}
        <div
          id="subscribe"
          className="bg-skyblue/20 border border-skyblue rounded-lg flex p-6 flex-col justify-between items-start md:w-[35%] gap-12 z-20"
        >
          <div className="flex flex-col gap-4">
            <p className="text-orange text-xs md:text-sm">LET'S GO</p>
            <h2 className="text-2xl md:text-3xl text-gray-1 font-light">
              Seeking personalized support?
              <span className="text-light font-medium">
                {" "}
                Request a call from our team
              </span>
            </h2>
          </div>

          {submitStatus === "success" ? (
            <div className="flex flex-col gap-4 h-full justify-center">
              <h3 className="text-xl font-medium text-white">Request Sent!</h3>
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
            <div className="flex flex-col gap-4 h-full justify-center">
              <h3 className="text-xl font-medium text-white">
                Request Received
              </h3>
              <p className="text-gray-300">
                You have already submitted a request recently. Please wait a
                moment before sending another.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-start gap-4 md:gap-2 w-full"
            >
              <div className="flex flex-col lg:flex-row justify-start gap-4 md:gap-2">
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
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-gray-300">
                  Message
                </label>
                <motion.textarea
                  className="w-full rounded-md border outline-none transition-all duration-200 text-start border-gray-1 text-gray-1 focus:bg-iceblue focus:text-oxford focus:border-none focus:outline-dark px-4 py-3 h-24"
                  name="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <Button
                type="submit"
                variant="inverted"
                className=" flex justify-center items-center w-fit"
                loading={loading}
              >
                {" "}
                Send a request <IoIosArrowRoundForward />
              </Button>
            </form>
          )}
        </div>

        {/* Links Section */}
        <div
          id="links"
          className="flex flex-col justify-between items-start md:w-[40%] my-8 md:my-0 z-20"
        >
          <div className="flex justify-between flex-row w-full">
            {sections.map((section, index) => (
              <div key={index} className="flex flex-col gap-4">
                <p className="text-orange text-sm">{section.title}</p>
                <ul className="list-none text-light space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={linkIndex}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        to={link.path}
                        className="font-light hover:text-iceblue transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4 mt-14 md:my-0">
            <p className="text-orange text-sm">CONTACT US</p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="font-light hover:text-iceblue transition-colors"
            >
              {contactInfo.email}
            </a>
            <a
              href={`tel:${contactInfo.phone}`}
              className="font-light hover:text-iceblue transition-colors"
            >
              {contactInfo.phone}
            </a>
          </div>
        </div>

        {/* Logo Section */}
        <div
          id="logo"
          className="flex flex-col justify-between md:items-end md:w-[15%] z-20 gap-8"
        >
          <Link to="/" aria-label="Homepage">
            <CloudinaryImage
              imageKey="verticalLogoInvert"
              className="hover:scale-105 transition-transform ease-in-out hover:-rotate-2 w-2/5 md:w-full"
              alt="Gr8QM Logo"
            />
          </Link>
          <p className="text-sm italic text-light">{tagline}</p>
        </div>

        {/* Background Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <img src={shape1} alt="" className="absolute top-[50%] left-2.5" />
          <img src={shape2} alt="" className="absolute right-0 bottom-0" />
        </div>
      </Container>

      {/* Bottom Bar */}
      <Container className="flex flex-col md:flex-row justify-between items-center w-full gap-6 z-20 py-5 bg-dark/20 rounded-b-md">
        <div className="flex items-center gap-2">
          <img src={arrow} alt="" className="" />
          <p className="text-sm">
            &copy; {currentYear} - Copyright -{" "}
            <span className="text-iceblue">Gr8QM</span>
          </p>
        </div>

        <div className="flex justify-between gap-8 text-white text-2xl">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="hover:text-iceblue transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
