import { useRef, useEffect, useState, useCallback } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/* ease-out cubic for smooth deceleration */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  const animate = useCallback(() => {
    const totalMs = duration * 1000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalMs, 1);
      const eased = easeOutCubic(progress);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [target, duration]);

  useEffect(() => {
    if (isInView) animate();
  }, [isInView, animate]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
