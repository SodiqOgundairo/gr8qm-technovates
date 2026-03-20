import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  width?: string;
  once?: boolean;
  threshold?: string;
  stagger?: number;
}

const getInitial = (direction: Direction) => {
  switch (direction) {
    case "up":
      return { opacity: 0, y: 60 };
    case "down":
      return { opacity: 0, y: -60 };
    case "left":
      return { opacity: 0, x: -60 };
    case "right":
      return { opacity: 0, x: 60 };
    case "scale":
      return { opacity: 0, scale: 0.8 };
    case "none":
      return { opacity: 0 };
  }
};

const getAnimate = (direction: Direction) => {
  switch (direction) {
    case "up":
    case "down":
      return { opacity: 1, y: 0 };
    case "left":
    case "right":
      return { opacity: 1, x: 0 };
    case "scale":
      return { opacity: 1, scale: 1 };
    case "none":
      return { opacity: 1 };
  }
};

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
  width,
  once = true,
  threshold = "0px 0px -60px 0px",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: threshold as any });

  const initial = getInitial(direction);
  const animate = isInView ? getAnimate(direction) : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{
        duration,
        delay,
        ease: [0.22, 0.6, 0.36, 1],
      }}
      className={className}
      style={width ? { width } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
