import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const BrainCircuitIcon = ({ size = 28, ...props }: IconProps) => {
  const controls = useAnimation();

  return (
    <div
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.g
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.05, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.6 }}
        >
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
        </motion.g>
        <motion.path
          d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"
          variants={{
            normal: { pathLength: 1, opacity: 1 },
            animate: { pathLength: [0, 1], opacity: [0.3, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d="M17.599 6.5a3 3 0 0 0 .399-1.375"
          variants={{
            normal: { opacity: 1 },
            animate: { opacity: [0, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        <motion.path
          d="M6.003 5.125A3 3 0 0 0 6.401 6.5"
          variants={{
            normal: { opacity: 1 },
            animate: { opacity: [0, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
        <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
        <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
        <path d="M6 18a4 4 0 0 1-1.967-.516" />
        <path d="M19.967 17.484A4 4 0 0 1 18 18" />
      </svg>
    </div>
  );
};

export default BrainCircuitIcon;
