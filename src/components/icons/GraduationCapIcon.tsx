import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const GraduationCapIcon = ({ size = 28, ...props }: IconProps) => {
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
          d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
          variants={{
            normal: { y: 0, rotateY: 0 },
            animate: { y: [0, -3, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.4 }}
        />
        <motion.path
          d="M22 10v6"
          variants={{
            normal: { scaleY: 1 },
            animate: { scaleY: [1, 1.2, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        <motion.path
          d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"
          variants={{
            normal: { y: 0 },
            animate: { y: [0, 2, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
      </svg>
    </div>
  );
};

export default GraduationCapIcon;
