import { useRef, useCallback } from 'react';

interface RippleOptions {
  color?: string;
  duration?: number;
}

export const useRipple = (options: RippleOptions = {}) => {
  const { color = 'rgba(0, 174, 239, 0.3)', duration = 600 } = options;
  const rippleRef = useRef<HTMLElement>(null);

  const createRipple = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      const element = rippleRef.current;
      if (!element) return;

      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const rect = element.getBoundingClientRect();
      let x: number, y: number;

      // Handle both mouse and touch events
      if ('touches' in event) {
        const touch = event.touches[0] || event.changedTouches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }

      // Create ripple element
      const ripple = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${x - radius}px`;
      ripple.style.top = `${y - radius}px`;
      ripple.style.backgroundColor = color;
      ripple.classList.add('ripple-effect');

      // Remove any existing ripples
      const existingRipple = element.querySelector('.ripple-effect');
      if (existingRipple) {
        existingRipple.remove();
      }

      // Add ripple to element
      element.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, duration);
    },
    [color, duration]
  );

  return { rippleRef, createRipple };
};
