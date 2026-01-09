import React from "react";
import { motion } from "framer-motion";

interface FloatingShapesProps {
  variant?: "soft" | "vibrant" | "dark";
  density?: "low" | "medium" | "high";
  className?: string;
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({
  variant = "soft",
  className = "",
  // density prop removed for now as it wasn't used, but kept in interface for future
}) => {
  const isVibrant = variant === "vibrant";
  const isDark = variant === "dark";

  const colors = isDark
    ? ["bg-white/5", "bg-skyblue/10", "bg-iceblue/5"]
    : isVibrant
    ? ["bg-skyblue/30", "bg-orange/30", "bg-oxford/10"]
    : ["bg-skyblue/15", "bg-orange/15", "bg-oxford/5"]; // Increased opacity for "pronounced" feel

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
    >
      {/* Circle 1 - Large drifting orb */}
      <motion.div
        className={`absolute top-[-10%] left-[-5%] w-160 h-160 ${colors[0]} rounded-full blur-[80px]`}
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Circle 2 - Secondary orb */}
      <motion.div
        className={`absolute top-[20%] right-[-10%] w-140 h-140 ${colors[1]} rounded-full blur-[90px]`}
        animate={{
          y: [0, -60, 0],
          x: [0, -40, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Circle 3 - Bottom anchor */}
      <motion.div
        className={`absolute bottom-[-20%] left-[20%] w-180 h-180 ${colors[2]} rounded-full blur-[100px]`}
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Floating Accent Shapes */}
      {/* Triangle 1 */}
      <motion.div
        className={`absolute top-[15%] left-[15%] w-16 h-16 ${
          isDark ? "bg-skyblue/20" : "bg-skyblue/40"
        }`}
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        animate={{
          y: [0, -40, 0],
          rotate: [0, 360],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Square/Diamond */}
      <motion.div
        className={`absolute top-[60%] right-[15%] w-12 h-12 ${
          isDark ? "bg-orange/20" : "bg-orange/40"
        }`}
        animate={{
          y: [0, 60, 0],
          rotate: [45, 135, 45],
          opacity: [0.3, 0.6, 0.3],
          borderRadius: ["20%", "50%", "20%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Hexagon-ish blob */}
      <motion.div
        className={`absolute bottom-[15%] right-[35%] w-24 h-24 ${
          isDark ? "bg-white/10" : "bg-oxford/10"
        }`}
        style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, -10, 0],
          borderRadius: [
            "30% 70% 70% 30% / 30% 30% 70% 70%",
            "50% 50% 33% 67% / 55% 27% 73% 45%",
            "30% 70% 70% 30% / 30% 30% 70% 70%",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </div>
  );
};

export default FloatingShapes;
