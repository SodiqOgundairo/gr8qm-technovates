import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CodeIcon = ({ size = 28, ...props }: IconProps) => {
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
        <motion.polyline
          points="16 18 22 12 16 6"
          variants={{
            normal: { x: 0 },
            animate: { x: [0, 3, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.4 }}
        />
        <motion.polyline
          points="8 6 2 12 8 18"
          variants={{
            normal: { x: 0 },
            animate: { x: [0, -3, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.4 }}
        />
      </svg>
    </div>
  );
};

export default CodeIcon;
