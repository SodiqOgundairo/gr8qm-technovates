"use client";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SparklesIcon = ({ size = 28, ...props }: IconProps) => {
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
          d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.2, 1], transition: { duration: 0.5 } },
          }}
          animate={controls}
        />
        <motion.path
          d="M20 3v4"
          variants={{
            normal: { opacity: 1 },
            animate: { opacity: [0, 1], y: [2, 0], transition: { duration: 0.3, delay: 0.2 } },
          }}
          animate={controls}
        />
        <motion.path
          d="M22 5h-4"
          variants={{
            normal: { opacity: 1 },
            animate: { opacity: [0, 1], x: [2, 0], transition: { duration: 0.3, delay: 0.2 } },
          }}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export default SparklesIcon;
