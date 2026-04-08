import { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   HERO VISUAL — interactive geometric composition
   Mouse-responsive abstract illustration with multi-layer
   parallax. Inspired by Figma/Linear editorial visuals.
   ═══════════════════════════════════════════════════════════ */

const SP = { stiffness: 40, damping: 28 };

/* small floating dots data */
const DOTS = [
  { top: "12%", left: "38%", size: 4, color: "#0098da", opacity: 0.5, dur: 7 },
  { top: "72%", left: "78%", size: 5, color: "#0098da", opacity: 0.35, dur: 8 },
  { top: "22%", left: "82%", size: 3, color: "#f58634", opacity: 0.5, dur: 6 },
  { top: "88%", left: "28%", size: 3, color: "#0098da", opacity: 0.3, dur: 9 },
  { top: "48%", left: "92%", size: 2, color: "#fff", opacity: 0.2, dur: 7.5 },
  { top: "8%", left: "62%", size: 2, color: "#fff", opacity: 0.15, dur: 8.5 },
  { top: "62%", left: "15%", size: 3, color: "#f58634", opacity: 0.25, dur: 6.5 },
];

export default function HeroVisual({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SP);
  const sy = useSpring(my, SP);

  /* depth layers */
  const l1x = useTransform(sx, (v) => v * 0.015);
  const l1y = useTransform(sy, (v) => v * 0.015);
  const l2x = useTransform(sx, (v) => v * 0.04);
  const l2y = useTransform(sy, (v) => v * 0.04);
  const l3x = useTransform(sx, (v) => v * 0.07);
  const l3y = useTransform(sy, (v) => v * 0.07);

  /* subtle 3D tilt */
  const rotX = useTransform(sy, (v) => v * 0.012);
  const rotY = useTransform(sx, (v) => v * -0.012);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set(e.clientX - r.left - r.width / 2);
      my.set(e.clientY - r.top - r.height / 2);
    },
    [mx, my],
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 900, rotateX: rotX, rotateY: rotY }}
      className={`relative w-full aspect-square select-none ${className}`}
    >
      {/* ── Layer 1: glow blobs (deep) ── */}
      <motion.div
        style={{ x: l1x, y: l1y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] rounded-full bg-skyblue/[0.07] blur-[90px]" />
        <div className="absolute top-[28%] left-[62%] w-[28%] h-[28%] rounded-full bg-orange/[0.05] blur-[60px]" />
      </motion.div>

      {/* ── Layer 2: main geometry (mid) ── */}
      <motion.svg
        style={{ x: l2x, y: l2y }}
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full pointer-events-none"
        fill="none"
        aria-hidden="true"
      >
        {/* outer ring — slow CW */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "250px 250px" }}
        >
          <circle cx="250" cy="250" r="210" stroke="#0098da" strokeWidth="0.5" opacity="0.18" />
          {/* tick marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2;
            const r1 = 206;
            const r2 = i % 5 === 0 ? 196 : 200;
            return (
              <line
                key={i}
                x1={250 + Math.cos(a) * r1}
                y1={250 + Math.sin(a) * r1}
                x2={250 + Math.cos(a) * r2}
                y2={250 + Math.sin(a) * r2}
                stroke="#0098da"
                strokeWidth={i % 5 === 0 ? "1" : "0.3"}
                opacity={i % 5 === 0 ? "0.25" : "0.1"}
              />
            );
          })}
        </motion.g>

        {/* dashed ring — slow CCW */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "250px 250px" }}
        >
          <circle
            cx="250"
            cy="250"
            r="170"
            stroke="#0098da"
            strokeWidth="0.5"
            strokeDasharray="6 10"
            opacity="0.14"
          />
        </motion.g>

        {/* accent arc — medium CW */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "250px 250px" }}
        >
          <path
            d="M 250 70 A 180 180 0 0 1 420 210"
            stroke="#0098da"
            strokeWidth="2.5"
            opacity="0.35"
            strokeLinecap="round"
          />
          <circle cx="420" cy="210" r="4" fill="#0098da" opacity="0.6" />
        </motion.g>

        {/* second accent arc — opposite side */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "250px 250px" }}
        >
          <path
            d="M 120 380 A 160 160 0 0 1 250 420"
            stroke="#f58634"
            strokeWidth="1.5"
            opacity="0.25"
            strokeLinecap="round"
          />
          <circle cx="250" cy="420" r="3" fill="#f58634" opacity="0.5" />
        </motion.g>

        {/* cross-hair reference lines */}
        <line x1="250" y1="30" x2="250" y2="470" stroke="#0098da" strokeWidth="0.3" opacity="0.06" />
        <line x1="30" y1="250" x2="470" y2="250" stroke="#0098da" strokeWidth="0.3" opacity="0.06" />

        {/* inner rings */}
        <circle cx="250" cy="250" r="100" stroke="#c9ebfb" strokeWidth="0.3" opacity="0.08" />
        <circle cx="250" cy="250" r="45" stroke="#0098da" strokeWidth="0.5" opacity="0.18" />

        {/* center glow cluster */}
        <circle cx="250" cy="250" r="18" fill="#0098da" opacity="0.04" />
        <circle cx="250" cy="250" r="8" fill="#0098da" opacity="0.1" />
        <motion.circle
          cx="250"
          cy="250"
          r="4"
          fill="#0098da"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* compass accent nodes */}
        {[0, 90, 180, 270].map((deg) => {
          const a = (deg / 180) * Math.PI;
          return (
            <circle
              key={deg}
              cx={250 + Math.cos(a) * 210}
              cy={250 + Math.sin(a) * 210}
              r="2.5"
              fill="#0098da"
              opacity="0.35"
            />
          );
        })}
      </motion.svg>

      {/* ── Layer 3: floating particles (near) ── */}
      <motion.div
        style={{ x: l3x, y: l3y }}
        className="absolute inset-0 pointer-events-none"
      >
        {DOTS.map((d, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: d.top,
              left: d.left,
              width: d.size,
              height: d.size,
              backgroundColor: d.color,
            }}
            animate={{
              y: [0, -10, 0, 8, 0],
              opacity: [d.opacity, d.opacity * 1.6, d.opacity, d.opacity * 1.3, d.opacity],
            }}
            transition={{
              duration: d.dur,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
