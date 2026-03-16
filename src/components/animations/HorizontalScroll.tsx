import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className = "",
  speed = 1,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${50 * speed}%`]);

  return (
    <section ref={targetRef} className={`relative h-[300vh] ${className}`}>
      <div className="sticky top-0 flex items-center overflow-hidden h-screen">
        <motion.div style={{ x }} className="flex gap-8">
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalScroll;
