import { motion } from "framer-motion";
import Button from "../components/common/Button";
import { RiTiktokFill } from "react-icons/ri";
import { LiaFacebookF, LiaInstagram, LiaLinkedin } from "react-icons/lia";
import { RiTwitterXFill } from "react-icons/ri";
import arrow from "../assets/img/arrow_corner.svg";
import CloudinaryImage from "../utils/cloudinaryImage";
import FloatingShapes from "../components/animations/FloatingShapes";
import TextReveal from "../components/animations/TextReveal";

export default function Cohort4() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
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

  return (
    <div className="min-h-screen bg-oxford text-white overflow-hidden font-sans flex flex-col relative">
      <FloatingShapes variant="dark" className="opacity-60" />
      {/* Main Grid Container */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_auto_auto_auto] md:grid-rows-3 h-full w-full p-0 relative z-10">
        {/* Zone 1: Top Left - Branding */}
        <div className="order-1 md:order-0 border border-white/20 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4 relative">
          <CloudinaryImage
            imageKey="verticalLogoInvert"
            className="w-16 md:w-20"
            alt="Gr8QM Logo"
          />
          <h1 className="text-xl md:text-2xl font-mono tracking-tighter text-white/80 hidden md:block">
            gr8qm / dsgn / lab
          </h1>
        </div>

        {/* Zone 3: Top Right - Context */}
        <div className="order-4 md:order-0 border border-white/20 p-6 md:p-8 flex flex-col justify-center gap-4 bg-oxford/95">
          <h2 className="text-sm font-mono text-skyblue tracking-widest mb-2 border-b border-skyblue/30 pb-2 w-fit">
            THE SPRINT MODEL
          </h2>
          <ul className="space-y-3 font-mono text-sm md:text-base text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-skyblue">&gt;</span> Velocity: 12 Weeks. 4
              Hours/Week.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-skyblue">&gt;</span> Method: 100% Hands-on.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-skyblue">&gt;</span> Outcome: A portfolio
              that gets you hired.
            </li>
          </ul>
        </div>

        {/* Zone 2: Center (Spans Full Width on Mobile, Left col on Desktop) - Main Hero */}
        {/* Adjusted to fit the 2 col layout: Row 2, Col 1 */}
        <div className="order-2 md:order-0 border border-white/20 p-6 md:p-12 flex flex-col justify-center relative md:row-span-2 backdrop-blur-sm bg-oxford/30">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tighter mb-6 flex flex-col items-start gap-2">
            <span className="block">
              <TextReveal delay={0.1}>WE DON'T PREDICT</TextReveal>
            </span>
            <span className="block">
              <TextReveal delay={0.3}>THE FUTURE.</TextReveal>
            </span>
            <span
              className="block text-transparent"
              style={{ WebkitTextStroke: "1px white" }}
            >
              <TextReveal delay={0.5}>WE BUILD IT.</TextReveal>
            </span>
          </h1>
          <div className="border-l-2 border-skyblue pl-6 py-1">
            <p className="font-mono text-sm md:text-base text-gray-300 max-w-md">
              Design is not about making things pretty. It’s about solving
              problems at the quantum level. Stop watching tutorials and start
              shipping real work. <br /> <br /> Join the elite design & dev
              force. 12 weeks to build a portfolio that makes you undeniable.
            </p>
          </div>
        </div>

        {/* Zone 4: Middle Right - Curriculum */}
        <div className="order-5 md:order-0 border border-white/20 p-6 md:p-8 flex flex-col justify-center bg-oxford">
          <h3 className="font-mono text-xs text-gray-500 mb-4 animate-pulse">
            // SYSTEM UPLOADING...
          </h3>
          <div className="space-y-4">
            <div className="group cursor-default">
              <div className="text-xs font-mono text-skyblue mb-1">
                01. ATOMIC SYSTEMS
              </div>
              <div className="text-lg font-bold group-hover:pl-2 transition-all">
                Master scalable design tokens.
              </div>
            </div>
            <div className="group cursor-default">
              <div className="text-xs font-mono text-skyblue mb-1">
                02. VISUAL SYNTHESIS
              </div>
              <div className="text-lg font-bold group-hover:pl-2 transition-all">
                AI-assisted workflows.
              </div>
            </div>
            <div className="group cursor-default">
              <div className="text-xs font-mono text-skyblue mb-1">
                03. UX ARCHITECTURE
              </div>
              <div className="text-lg font-bold group-hover:pl-2 transition-all">
                User flows that convert.
              </div>
            </div>
          </div>
        </div>

        {/* Zone 5: Bottom Right - Action */}
        <div className="order-3 md:order-0 border border-white/20 p-8 flex flex-col items-center justify-center gap-6 bg-skyblue/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-skyblue/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>

          <Button
            variant="inverted"
            className="relative z-10 bg-skyblue! text-oxford! border-none! text-lg! font-bold! px-8! py-4! hover:bg-white! hover:scale-105! transition-all w-full md:w-auto"
            onClick={() =>
              window.open("https://forms.gle/8TKjU22QRQpDAa4Z6", "_blank")
            }
          >
            SECURE YOUR SEAT →
          </Button>
          <p className="relative z-10 font-mono text-xs text-gray-400 hover:text-white underline decoration-dotted underline-offset-4">
            *Merit-based scholarships available*
          </p>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="border-t border-white/20 py-5 px-8 flex flex-col md:flex-row justify-between items-center bg-oxford z-20">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <img src={arrow} alt="" className="opacity-50" />
          <p className="text-xs font-mono text-gray-500">
            &copy; {currentYear} <span className="text-skyblue">Gr8QM</span>
          </p>
        </div>

        <div className="flex gap-6 text-xl">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-gray-500 hover:text-skyblue transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
