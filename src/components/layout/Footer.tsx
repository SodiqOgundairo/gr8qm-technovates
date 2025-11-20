import React, { useState } from "react";
import type { FormEvent } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import CloudinaryImage from "../../utils/cloudinaryImage";
import shape1 from "../../assets/img/shape.png";
import shape2 from "../../assets/img/shape2.png";
import arrow from "../../assets/img/arrow_corner.svg";
import { LiaFacebookF, LiaInstagram, LiaLinkedin } from "react-icons/lia";
import { RiTwitterXFill } from "react-icons/ri";
import Button from "../common/Button";
import Container from "./Container";
import Input from "../common/Input";

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
  onSubscribe?: (data: { name: string; email: string }) => void;
}

const currentYear = new Date().getFullYear();

const defaultSections: FooterSection[] = [
  {
    title: "SERVICES",
    links: [
      { label: "Service Design", path: "/" },
      { label: "Tech Training", path: "/" },
      { label: "Print Shop", path: "/" },
    ],
  },
  {
    title: "INFORMATION",
    links: [
      { label: "About Us", path: "/" },
      { label: "Our Mission", path: "/" },
      { label: "Our Work", path: "/" },
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
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      if (onSubscribe) {
        onSubscribe(formData);
      }
      setFormData({ name: "", email: "" });
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
            <Button
              type="submit"
              variant="inverted"
              className=" flex justify-center items-center w-fit"
            >
              {" "}
              Send a request <IoIosArrowRoundForward />
            </Button>
          </form>
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
                    <li key={linkIndex}>
                      <Link
                        to={link.path}
                        className="font-light hover:text-iceblue transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
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
              imageKey="verticalLogo"
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
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="hover:text-iceblue transition-colors"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
