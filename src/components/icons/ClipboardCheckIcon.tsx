import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const ClipboardCheckIcon = ({ size = 28, ...props }: IconProps) => {
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
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <motion.path
          d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
          variants={{
            normal: { y: 0 },
            animate: { y: [0, -2, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d="m9 14 2 2 4-4"
          variants={{
            normal: { pathLength: 1, opacity: 1 },
            animate: { pathLength: [0, 1], opacity: [0.3, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.4, delay: 0.2 }}
        />
      </svg>
    </div>
  );
};

export default ClipboardCheckIcon;
