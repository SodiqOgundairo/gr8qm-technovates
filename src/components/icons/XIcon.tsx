import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const XIcon = ({ size = 28, ...props }: IconProps) => {
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
        <motion.path
          d="M18 6 6 18"
          variants={{
            normal: { rotate: 0 },
            animate: { rotate: [0, 90, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.4 }}
        />
        <motion.path
          d="m6 6 12 12"
          variants={{
            normal: { rotate: 0 },
            animate: { rotate: [0, -90, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.4 }}
        />
      </svg>
    </div>
  );
};

export default XIcon;
