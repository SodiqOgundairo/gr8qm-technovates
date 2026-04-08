import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   SCROLL TEXT REVEAL
   Word-by-word opacity reveal driven by scroll progress.
   Inspired by Flock Safety's scrub-word effect.
   ═══════════════════════════════════════════════════════════ */

interface ScrollTextRevealProps {
  text: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.08, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className="inline-block mr-[0.25em] last:mr-0"
    >
      {children}
    </motion.span>
  );
}

export default function ScrollTextReveal({
  text,
  containerRef,
  className = "",
}: ScrollTextRevealProps) {
  const words = text.split(" ");
  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });

  return (
    <p className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}
