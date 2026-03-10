import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SpiralIcon = ({ size = 28, ...props }: IconProps) => {
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
          d="M12 12c-2-2.67-6-4-6 0s6 4 8 0-2-8-6-4"
          variants={{
            normal: { rotate: 0, scale: 1 },
            animate: { rotate: [0, 360], scale: [1, 1.1, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

export default SpiralIcon;
