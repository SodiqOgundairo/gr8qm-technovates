import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const TrendingUpIcon = ({ size = 28, ...props }: IconProps) => {
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
        <motion.polyline
          points="22 7 13.5 15.5 8.5 10.5 2 17"
          variants={{
            normal: { pathLength: 1 },
            animate: { pathLength: [0, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.6 }}
        />
        <motion.polyline
          points="16 7 22 7 22 13"
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

export default TrendingUpIcon;
