import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  type?: "chars" | "words" | "lines";
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

const SplitText: React.FC<SplitTextProps> = ({
  children,
  className = "",
  delay = 0,
  stagger = 0.03,
  type = "chars",
  once = true,
  as: Tag = "span",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "0px 0px -80px 0px" });

  const getElements = () => {
    if (type === "words") return children.split(" ");
    if (type === "lines") return children.split("\n");
    return children.split("");
  };

  const elements = getElements();

  return (
    <Tag ref={ref} className={`inline-block ${className}`}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 40, rotateX: -40 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, rotateX: 0 }
              : { opacity: 0, y: 40, rotateX: -40 }
          }
          transition={{
            duration: 0.5,
            delay: delay + i * stagger,
            ease: [0.22, 0.6, 0.36, 1],
          }}
          style={{ perspective: "500px" }}
        >
          {el === " " ? "\u00A0" : el}
          {type === "words" && i < elements.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
};

export default SplitText;
