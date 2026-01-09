import React, { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "none";
  stagger?: number;
  once?: boolean;
}

const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  stagger = 0.05,
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
      rotateX: direction === "none" ? 0 : 90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const words = children.split(" ");

  return (
    <motion.div
      ref={ref}
      style={{ display: "inline-block", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {words.map((word, index) => (
        <span
          key={index}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`${index}-${charIndex}`}
              variants={child}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
          <span style={{ display: "inline-block" }}>&nbsp;</span>
        </span>
      ))}
    </motion.div>
  );
};

export default TextReveal;
