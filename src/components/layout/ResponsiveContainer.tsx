import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface ResponsiveContainerContextValue {
  width: number;
  height: number;
  breakpoint: 'sm' | 'md' | 'lg' | 'xl';
  isResponsive: boolean;
}

const ResponsiveContainerContext = createContext<ResponsiveContainerContextValue>({
  width: 0,
  height: 0,
  breakpoint: 'sm',
  isResponsive: false,
});

export const useResponsiveContainer = () => {
  const context = useContext(ResponsiveContainerContext);
  if (!context.isResponsive) {
    // Fallback to window-based breakpoints when not in responsive container
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const getBreakpoint = (width: number): 'sm' | 'md' | 'lg' | 'xl' => {
      if (width >= 1280) return 'xl';
      if (width >= 1024) return 'lg';
      if (width >= 768) return 'md';
      return 'sm';
    };
    
    return {
      width: windowWidth,
      height: window.innerHeight,
      breakpoint: getBreakpoint(windowWidth),
      isResponsive: false,
    };
  }
  return context;
};

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onContainerChange?: (width: number, height: number, breakpoint: 'sm' | 'md' | 'lg' | 'xl') => void;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '', 
  style,
  onContainerChange 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const getBreakpoint = (width: number): 'sm' | 'md' | 'lg' | 'xl' => {
    if (width >= 1280) return 'xl';
    if (width >= 1024) return 'lg';
    if (width >= 768) return 'md';
    return 'sm';
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const breakpoint = getBreakpoint(dimensions.width);

  // Call onContainerChange callback when dimensions change
  useEffect(() => {
    if (onContainerChange && dimensions.width > 0 && dimensions.height > 0) {
      onContainerChange(dimensions.width, dimensions.height, breakpoint);
    }
  }, [dimensions.width, dimensions.height, breakpoint, onContainerChange]);

  const contextValue: ResponsiveContainerContextValue = {
    width: dimensions.width,
    height: dimensions.height,
    breakpoint,
    isResponsive: true,
  };

  return (
    <ResponsiveContainerContext.Provider value={contextValue}>
      <div 
        ref={containerRef}
        className={className}
        style={style}
      >
        {children}
      </div>
    </ResponsiveContainerContext.Provider>
  );
};