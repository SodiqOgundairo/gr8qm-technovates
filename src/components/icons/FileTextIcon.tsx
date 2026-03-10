import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const FileTextIcon = ({ size = 28, ...props }: IconProps) => {
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
          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
          variants={{
            normal: { y: 0 },
            animate: { y: [0, -2, 0] },
          }}
          animate={controls}
          transition={{ duration: 0.3 }}
        />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <motion.path d="M10 9h4" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1] } }} animate={controls} transition={{ duration: 0.2, delay: 0.1 }} />
        <motion.path d="M10 13h4" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1] } }} animate={controls} transition={{ duration: 0.2, delay: 0.2 }} />
        <motion.path d="M10 17h4" variants={{ normal: { opacity: 1 }, animate: { opacity: [0, 1] } }} animate={controls} transition={{ duration: 0.2, delay: 0.3 }} />
      </svg>
    </div>
  );
};

export default FileTextIcon;
