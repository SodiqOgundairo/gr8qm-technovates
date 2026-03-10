import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const MailIcon = ({ size = 28, ...props }: IconProps) => {
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
          height="16"
          x="2"
          y="4"
          rx="2"
          variants={{
            normal: { scale: 1 },
            animate: { scale: [1, 1.05, 1] },
          }}
          animate={controls}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
          variants={{
            normal: { y: 0 },
            animate: { y: [0, -2, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
      </svg>
    </div>
  );
};

export default MailIcon;
