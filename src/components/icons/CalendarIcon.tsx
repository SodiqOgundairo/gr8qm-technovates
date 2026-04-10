import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CalendarIcon = ({ size = 28, ...props }: IconProps) => {
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
          y="4"
          rx="2"
          ry="2"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.05, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3 }}
        />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <motion.path
          d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
          variants={{
            normal: { opacity: 1 },
            animate: { opacity: [1, 0.5, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
      </svg>
    </div>
  );
};

export default CalendarIcon;
