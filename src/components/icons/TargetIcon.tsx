import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const TargetIcon = ({ size = 28, ...props }: IconProps) => {
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
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          variants={{
            normal: { scale: 1, opacity: 1 },
            animate: { scale: [1, 1.05, 1], opacity: [1, 0.8, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.5 }}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="6"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.1, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="2"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.3, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </svg>
    </div>
  );
};

export default TargetIcon;
