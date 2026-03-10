import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CreditCardIcon = ({ size = 28, ...props }: IconProps) => {
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
          height="14"
          x="2"
          y="5"
          rx="2"
          variants={{
            normal: { rotateY: 0 },
            animate: { rotateY: [0, 15, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.5 }}
        />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    </div>
  );
};

export default CreditCardIcon;
