import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const ClipboardListIcon = ({ size = 28, ...props }: IconProps) => {
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
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <motion.path
          d="M12 11h4"
          variants={{
            normal: { x: 0, opacity: 1 },
            animate: { x: [10, 0], opacity: [0, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d="M12 16h4"
          variants={{
            normal: { x: 0, opacity: 1 },
            animate: { x: [10, 0], opacity: [0, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        <motion.path
          d="M8 11h.01"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [0, 1.3, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.15 }}
        />
        <motion.path
          d="M8 16h.01"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [0, 1.3, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.25 }}
        />
      </svg>
    </div>
  );
};

export default ClipboardListIcon;
