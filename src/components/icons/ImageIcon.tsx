import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const ImageIcon = ({ size = 28, ...props }: IconProps) => {
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
        <motion.rect
          width="18"
          height="18"
          x="3"
          y="3"
          rx="2"
          ry="2"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.05, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3 }}
        />
        <motion.circle
          cx="9"
          cy="9"
          r="2"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.3, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        <motion.path
          d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
          variants={{
            normal: { pathLength: 1 },
            animate: { pathLength: [0, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </svg>
    </div>
  );
};

export default ImageIcon;
