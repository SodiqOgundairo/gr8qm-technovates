import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const DashboardIcon = ({ size = 28, ...props }: IconProps) => {
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
          width="7"
          height="9"
          x="3"
          y="3"
          rx="1"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.1, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3 }}
        />
        <motion.rect
          width="7"
          height="5"
          x="14"
          y="3"
          rx="1"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.1, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        <motion.rect
          width="7"
          height="9"
          x="14"
          y="12"
          rx="1"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.1, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        <motion.rect
          width="7"
          height="5"
          x="3"
          y="16"
          rx="1"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.1, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
      </svg>
    </div>
  );
};

export default DashboardIcon;
