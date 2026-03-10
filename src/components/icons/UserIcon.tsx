import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const UserIcon = ({ size = 28, ...props }: IconProps) => {
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
          cy="8"
          r="5"
          variants={{
            normal: { y: 0 },
            animate: { y: [0, -2, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.4 }}
        />
        <motion.path
          d="M20 21a8 8 0 0 0-16 0"
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

export default UserIcon;
