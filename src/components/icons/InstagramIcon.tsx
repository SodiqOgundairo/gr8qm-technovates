import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const InstagramIcon = ({ size = 28, ...props }: IconProps) => {
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
          width="20"
          height="20"
          x="2"
          y="2"
          rx="5"
          ry="5"
          variants={{
            normal: { rotate: 0 },
            animate: { rotate: [0, -5, 5, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.5 }}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="4"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.2, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
        <motion.line
          x1="17.5"
          x2="17.51"
          y1="6.5"
          y2="6.5"
          variants={{
            normal: { opacity: 1 },
            animate: { opacity: [0, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
      </svg>
    </div>
  );
};

export default InstagramIcon;
