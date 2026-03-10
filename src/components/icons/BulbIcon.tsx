import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const BulbIcon = ({ size = 28, ...props }: IconProps) => {
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
          d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
          variants={{
            normal: { filter: "drop-shadow(0 0 0px currentColor)" },
            animate: {
              filter: [
                "drop-shadow(0 0 0px currentColor)",
                "drop-shadow(0 0 4px currentColor)",
                "drop-shadow(0 0 0px currentColor)",
              ],
            },
          }}
          animate={controls}
          transition={{ duration: 0.6 }}
        />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    </div>
  );
};

export default BulbIcon;
