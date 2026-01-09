import React from "react";
import { motion } from "framer-motion";

const GeometricBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      {/* Grid Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.3,
        }}
      />

      {/* Floating Plus Signs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`plus-${i}`}
          className="absolute text-skyblue/40 font-mono text-2xl"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          +
        </motion.div>
      ))}

      {/* Resizing Circles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute border border-orange/20 rounded-full"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            width: "100px",
            height: "100px",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
};

export default GeometricBackground;
