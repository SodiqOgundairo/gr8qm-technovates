import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Scene3D from "../components/animations/Scene3D";
import SplitText from "../components/animations/SplitText";
import RevealOnScroll from "../components/animations/RevealOnScroll";
import MagneticButton from "../components/animations/MagneticButton";

const floatingOrb = (delay: number, duration: number) => ({
  y: [0, -20, 0],
  transition: {
    duration,
    delay,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
});

const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-dark overflow-hidden flex items-center justify-center">
      {/* Scene3D particle background */}
      <Scene3D variant="minimal" />

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-[10%] left-[8%] w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-skyblue), transparent 70%)",
        }}
        animate={floatingOrb(0, 6)}
      />
      <motion.div
        className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-orange), transparent 70%)",
        }}
        animate={floatingOrb(2, 8)}
      />
      <motion.div
        className="absolute top-[40%] right-[25%] w-48 h-48 rounded-full opacity-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-skyblue), var(--color-orange), transparent 70%)",
        }}
        animate={floatingOrb(1, 7)}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Large 404 */}
        <div className="mb-6">
          <SplitText
            as="h1"
            className="text-[10rem] md:text-[14rem] font-bold leading-none gradient-text font-heading tracking-tighter"
            delay={0.2}
            stagger={0.08}
            type="chars"
          >
            404
          </SplitText>
        </div>

        {/* Subtitle */}
        <RevealOnScroll direction="up" delay={0.6}>
          <h2 className="text-2xl md:text-4xl font-semibold text-light/90 mb-4 font-heading">
            Lost in the digital void
          </h2>
        </RevealOnScroll>

        {/* Fun message */}
        <RevealOnScroll direction="up" delay={0.8}>
          <p className="text-light/50 text-lg md:text-xl max-w-lg mx-auto mb-12 leading-relaxed">
            The page you're looking for has drifted into another dimension.
            Don't worry, we'll help you find your way back.
          </p>
        </RevealOnScroll>

        {/* Animated divider */}
        <RevealOnScroll direction="scale" delay={1.0}>
          <div className="flex items-center justify-center gap-3 mb-12">
            <motion.span
              className="block h-px w-16 bg-skyblue/40"
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 1, delay: 1.2 }}
            />
            <motion.span
              className="block w-2 h-2 rounded-full bg-orange"
              animate={{ scale: [0, 1, 0.8, 1] }}
              transition={{ duration: 0.8, delay: 1.4 }}
            />
            <motion.span
              className="block h-px w-16 bg-skyblue/40"
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 1, delay: 1.2 }}
            />
          </div>
        </RevealOnScroll>

        {/* CTAs */}
        <RevealOnScroll direction="up" delay={1.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <MagneticButton strength={25}>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-skyblue text-dark font-semibold text-lg transition-all duration-300 hover:bg-skyblue/90 hover:shadow-lg hover:shadow-skyblue/25"
              >
                Go Home
              </Link>
            </MagneticButton>

            <MagneticButton strength={25}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-light/20 text-light font-semibold text-lg transition-all duration-300 hover:border-orange/60 hover:text-orange hover:shadow-lg hover:shadow-orange/15"
              >
                Contact Us
              </Link>
            </MagneticButton>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
};

export default NotFound;
