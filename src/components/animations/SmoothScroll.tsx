import { useEffect, useRef } from "react";
import Lenis from "lenis";

export let lenisInstance: Lenis | null = null;

const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
