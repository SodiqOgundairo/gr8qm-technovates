import { motion } from "framer-motion";

interface MarqueeTextProps {
  text: string;
  speed?: number;
  className?: string;
  separator?: string;
  reverse?: boolean;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  speed = 20,
  className = "",
  separator = " — ",
  reverse = false,
}) => {
  const content = `${text}${separator}`.repeat(6);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <span className="inline-block pr-4">{content}</span>
        <span className="inline-block pr-4">{content}</span>
      </motion.div>
    </div>
  );
};

export default MarqueeText;
