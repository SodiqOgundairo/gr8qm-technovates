import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest(
        "a, button, [data-cursor], input, textarea, select"
      );
      if (interactiveEl) {
        setIsHovering(true);
        const text = interactiveEl.getAttribute("data-cursor");
        if (text) setCursorText(text);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest(
        "a, button, [data-cursor], input, textarea, select"
      );
      if (interactiveEl) {
        setIsHovering(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

  // Hide on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white flex items-center justify-center"
          animate={{
            width: isHovering ? (cursorText ? 80 : 48) : isClicking ? 8 : 12,
            height: isHovering ? (cursorText ? 80 : 48) : isClicking ? 8 : 12,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {cursorText && isHovering && (
            <span className="text-[10px] font-bold text-black uppercase tracking-wider">
              {cursorText}
            </span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default CustomCursor;
