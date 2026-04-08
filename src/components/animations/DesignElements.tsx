import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   REVEAL — scroll-triggered entrance animation
   once: true for clean UX, no blur (GPU-heavy), tight translate
   ease: Material "decelerated" curve — fast start, gentle land
   ═══════════════════════════════════════════════════════════ */
export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "down";
  duration?: number;
}> = ({ children, className = "", delay = 0, direction = "up", duration = 0.7 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" as any });

  const offsets = {
    up: { x: 0, y: 36 },
    down: { x: 0, y: -36 },
    left: { x: -44, y: 0 },
    right: { x: 44, y: 0 },
  };
  const { x, y } = offsets[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   GEOMETRIC VECTORS
   ═══════════════════════════════════════════════════════════ */
export const DotGrid: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`absolute ${className}`} width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
    {Array.from({ length: 100 }).map((_, i) => (
      <circle key={i} cx={(i % 10) * 20 + 10} cy={Math.floor(i / 10) * 20 + 10} r="1.5" fill="currentColor" opacity="0.15" />
    ))}
  </svg>
);

export const DiagonalLines: React.FC<{ className?: string; thick?: boolean }> = ({ className = "", thick = false }) => (
  <svg className={`absolute ${className}`} width="300" height="300" viewBox="0 0 300 300" fill="none" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1={i * 40} y1="0" x2={i * 40 + 100} y2="300" stroke="currentColor" strokeWidth={thick ? (i % 3 === 0 ? "2" : "0.5") : "0.5"} opacity={thick ? (i % 3 === 0 ? "0.12" : "0.06") : "0.08"} />
    ))}
  </svg>
);

export const ConcentricCircles: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`absolute ${className}`} width="400" height="400" viewBox="0 0 400 400" fill="none" aria-hidden="true">
    {[60, 100, 140, 180].map((r) => (
      <circle key={r} cx="200" cy="200" r={r} stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
    ))}
  </svg>
);

export const CrossMark: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 16 }) => (
  <svg className={`${className}`} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <line x1="0" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1" />
    <line x1="8" y1="0" x2="8" y2="16" stroke="currentColor" strokeWidth="1" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   ACCENT LINE — decorative horizontal rules
   ═══════════════════════════════════════════════════════════ */
export const AccentLine: React.FC<{
  className?: string;
  color?: "skyblue" | "orange" | "iceblue";
  thickness?: "thin" | "medium" | "thick";
  width?: string;
}> = ({ className = "", color = "skyblue", thickness = "thin", width = "w-20" }) => {
  const h = thickness === "thick" ? "h-[3px]" : thickness === "medium" ? "h-[2px]" : "h-[1px]";
  const bg = color === "orange" ? "bg-orange" : color === "iceblue" ? "bg-iceblue" : "bg-skyblue";
  const opacity = thickness === "thick" ? "opacity-25" : thickness === "medium" ? "opacity-15" : "opacity-10";
  return <span className={`block ${h} ${bg} ${opacity} ${width} ${className}`} aria-hidden="true" />;
};

/* ═══════════════════════════════════════════════════════════
   FLOATING RULE — full-width or partial SVG lines
   ═══════════════════════════════════════════════════════════ */
export const FloatingRule: React.FC<{
  className?: string;
  color?: string;
  dashed?: boolean;
  thick?: boolean;
}> = ({ className = "", color = "skyblue", dashed = false, thick = false }) => {
  const stroke = color === "orange" ? "#f58634" : color === "iceblue" ? "#c9ebfb" : "#0098da";
  return (
    <svg className={`absolute ${className} pointer-events-none`} width="100%" height="4" fill="none" aria-hidden="true" preserveAspectRatio="none">
      <line
        x1="0" y1="2" x2="100%" y2="2"
        stroke={stroke}
        strokeWidth={thick ? "2" : "0.5"}
        strokeDasharray={dashed ? "8 6" : "none"}
        opacity={thick ? "0.12" : "0.06"}
      >
        {dashed && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-28"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </line>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════
   SECTION CONNECTOR — animated dashed line with arrow
   ═══════════════════════════════════════════════════════════ */
export const SectionConnector: React.FC<{
  color?: "skyblue" | "orange";
  side?: "left" | "right" | "center";
}> = ({ color = "skyblue", side = "right" }) => {
  const strokeColor = color === "orange" ? "#f58634" : "#0098da";
  const posClass =
    side === "left" ? "left-[15%]" : side === "center" ? "left-1/2 -translate-x-1/2" : "right-[15%]";

  return (
    <div className={`absolute bottom-0 ${posClass} translate-y-1/2 z-[55] pointer-events-none hidden lg:block`} aria-hidden="true">
      <svg width="40" height="120" viewBox="0 0 40 120" fill="none" className="overflow-visible">
        <line
          x1="20" y1="0" x2="20" y2="120"
          stroke={strokeColor}
          strokeWidth="1"
          strokeDasharray="6 4"
          opacity="0.3"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line
          x1="24" y1="10" x2="24" y2="110"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeDasharray="12 20"
          opacity="0.12"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="2s" repeatCount="indefinite" />
        </line>
        <g transform="translate(20, 42)" opacity="0.5">
          <polygon points="0,-5 5,3 -5,3" fill={strokeColor}>
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
          </polygon>
        </g>
        <circle cx="20" cy="84" r="2" fill={strokeColor} opacity="0.2">
          <animate attributeName="r" values="2;3.5;2" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};
