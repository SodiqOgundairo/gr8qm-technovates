import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import OrbitalBackground from "../components/animations/OrbitalBackground";
import Container from "../components/layout/Container";
import { DotGrid, DiagonalLines, CrossMark } from "../components/animations/DesignElements";

const glitchKeyframes = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 0.6, 0.36, 1] },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const NotFoundNew: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-oxford-deep overflow-hidden flex items-center justify-center">
      {/* Orbital glow background */}
      <OrbitalBackground variant="hero" />

      {/* Geometric decorations */}
      <DotGrid className="top-8 left-8 text-skyblue/20" />
      <DiagonalLines className="bottom-0 right-0 text-orange/10" thick />
      <CrossMark className="absolute top-[15%] right-[20%] text-skyblue/15" size={20} />
      <CrossMark className="absolute bottom-[20%] left-[15%] text-orange/15" size={14} />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-[25%] right-[12%] w-20 h-20 border border-skyblue/10 rounded-full"
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-[30%] left-[10%] w-16 h-16 border border-orange/10 rotate-45"
        animate={{ rotate: [45, 90, 45], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Main content */}
      <Container className="relative z-10 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* 404 number */}
          <motion.div variants={glitchKeyframes} className="relative mb-6">
            <span className="text-[10rem] sm:text-[14rem] md:text-[18rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-skyblue/20 to-transparent select-none">
              404
            </span>
            {/* Glitch overlay layers */}
            <motion.span
              className="absolute inset-0 text-[10rem] sm:text-[14rem] md:text-[18rem] font-black leading-none tracking-tighter text-skyblue/8 select-none"
              animate={{ x: [-2, 2, -1, 0], opacity: [0.08, 0.12, 0.06, 0.08] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              404
            </motion.span>
            <motion.span
              className="absolute inset-0 text-[10rem] sm:text-[14rem] md:text-[18rem] font-black leading-none tracking-tighter text-orange/5 select-none"
              animate={{ x: [1, -2, 1, 0], opacity: [0.05, 0.1, 0.04, 0.05] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              aria-hidden="true"
            >
              404
            </motion.span>
          </motion.div>

          {/* Accent line */}
          <motion.span
            variants={glitchKeyframes}
            className="block w-16 h-[2px] bg-gradient-to-r from-transparent via-skyblue to-transparent opacity-30 mb-8"
            aria-hidden="true"
          />

          {/* Message */}
          <motion.h1
            variants={glitchKeyframes}
            className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight"
          >
            Page not found
          </motion.h1>
          <motion.p
            variants={glitchKeyframes}
            className="text-iceblue/50 text-base md:text-lg max-w-md mx-auto mb-10"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={glitchKeyframes}>
            <Link
              to="/new"
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 text-sm font-medium rounded-full overflow-hidden border border-iceblue/20 text-white hover:border-skyblue/40 transition-all duration-300"
            >
              <motion.span
                className="relative z-10 text-skyblue"
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                &larr;
              </motion.span>
              <span className="relative z-10">Back to Home</span>
              <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
            </Link>
          </motion.div>

          {/* Subtle footer text */}
          <motion.p
            variants={glitchKeyframes}
            className="mt-16 text-xs text-iceblue/20 tracking-widest uppercase"
          >
            Gr8QM Technovates
          </motion.p>
        </motion.div>
      </Container>
    </div>
  );
};

export default NotFoundNew;
