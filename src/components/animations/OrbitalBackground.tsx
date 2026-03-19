import React from "react";

interface OrbitalBackgroundProps {
  variant?: "hero" | "section" | "cta";
  className?: string;
  /** Use dark overlay (for /new dark pages). Default true. */
  dark?: boolean;
}

/**
 * Animated orbital gradient blobs background.
 * Uses pure CSS animations for performance (GPU-accelerated transforms).
 */
const OrbitalBackground: React.FC<OrbitalBackgroundProps> = ({
  variant = "hero",
  className = "",
  dark = true,
}) => {
  const configs = {
    hero: {
      blobs: [
        { color: "#0098da", size: 400, opacity: 0.18, animation: "orbit1", duration: "16s", top: "5%", left: "15%" },
        { color: "#f58634", size: 320, opacity: 0.12, animation: "orbit2", duration: "14s", top: "55%", left: "65%" },
        { color: "#c9ebfb", size: 350, opacity: 0.1, animation: "orbit3", duration: "18s", top: "25%", left: "45%" },
        { color: "#0098da", size: 280, opacity: 0.08, animation: "orbit4", duration: "15s", top: "65%", left: "20%" },
        { color: "#f58634", size: 240, opacity: 0.1, animation: "orbit5", duration: "12s", top: "10%", left: "75%" },
        { color: "#c9ebfb", size: 200, opacity: 0.06, animation: "orbit1", duration: "20s", top: "80%", left: "50%" },
      ],
      blur: 130,
    },
    section: {
      blobs: [
        { color: "#0098da", size: 300, opacity: 0.1, animation: "orbit1", duration: "20s", top: "15%", left: "25%" },
        { color: "#f58634", size: 240, opacity: 0.07, animation: "orbit3", duration: "22s", top: "55%", left: "60%" },
        { color: "#c9ebfb", size: 280, opacity: 0.08, animation: "orbit5", duration: "18s", top: "35%", left: "45%" },
      ],
      blur: 110,
    },
    cta: {
      blobs: [
        { color: "#0098da", size: 350, opacity: 0.14, animation: "orbit2", duration: "14s", top: "15%", left: "20%" },
        { color: "#f58634", size: 280, opacity: 0.1, animation: "orbit4", duration: "16s", top: "50%", left: "65%" },
        { color: "#c9ebfb", size: 240, opacity: 0.08, animation: "orbit1", duration: "20s", top: "35%", left: "40%" },
        { color: "#0098da", size: 200, opacity: 0.06, animation: "orbit3", duration: "18s", top: "70%", left: "15%" },
      ],
      blur: 120,
    },
  };

  const config = configs[variant];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {config.blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            backgroundColor: blob.color,
            opacity: blob.opacity,
            filter: `blur(${config.blur}px)`,
            animation: `${blob.animation} ${blob.duration} ease-in-out infinite`,
          }}
        />
      ))}
      {/* Frosted overlay for readability */}
      <div className={`absolute inset-0 ${dark ? "bg-oxford-deep/40" : "backdrop-blur-[60px] bg-light/40 dark:bg-oxford-deep/50"}`} />
    </div>
  );
};

export default OrbitalBackground;
