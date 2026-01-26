import React from "react";
import { Link } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useRipple } from "../../hooks/useRipple";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant: "pry" | "sec" | "inverted";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  to?: string;
  loading?: boolean;
  disabled?: boolean;
}

const MotionLink = motion.create(Link);

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  onClick,
  className,
  size = "md",
  to,
  disabled,
  loading,
  ...props
}) => {
  // Ripple effect colors based on variant
  const rippleColors = {
    pry: "rgba(255, 255, 255, 0.4)",
    sec: "rgba(0, 174, 239, 0.3)",
    inverted: "rgba(232, 244, 248, 0.4)",
  };

  const { rippleRef, createRipple } = useRipple({
    color: rippleColors[variant],
    duration: 600,
  });
  const variants = {
    pry: "bg-skyblue text-white hover:bg-light hover:text-skyblue hover:shadow-lg",
    sec: "btn-sec",
    inverted:
      "bg-oxford text-white hover:bg-iceblue hover:text-[var(--color-oxford)] hover:shadow-lg",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const baseClassName =
    "rounded-md font-medium cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors duration-300 ripple-container";

  let variantClassName = variants[variant];
  if (disabled || loading) {
    variantClassName =
      "bg-[var(--color-gray-1)] text-[var(--color-gray-2)] cursor-not-allowed opacity-50";
    if (variant === "sec") {
      variantClassName =
        "bg-transparent border border-[var(--color-gray-1)] text-[var(--color-gray-2)] cursor-not-allowed";
    }
  }

  const sizeClassName = sizes[size];

  // Wrap children for sec variant (for animation)
  const wrappedChildren =
    variant === "sec" && !loading && !disabled ? (
      <div className="button-content">{children}</div>
    ) : (
      children
    );

  const motionProps =
    disabled || loading
      ? {}
      : {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
        };

  if (to && !disabled && !loading) {
    return (
      <MotionLink
        to={to}
        // @ts-expect-error - ref type mismatch between motion and ripple
        ref={rippleRef}
        onClick={createRipple}
        className={`${baseClassName} ${variantClassName} ${sizeClassName} ${className}`}
        {...motionProps}
      >
        {wrappedChildren}
      </MotionLink>
    );
  }

  return (
    <motion.button
      // @ts-expect-error - ref type mismatch between motion and ripple
      ref={rippleRef}
      onClick={(e) => {
        createRipple(e);
        onClick?.();
      }}
      disabled={disabled || loading}
      className={`${baseClassName} ${variantClassName} ${sizeClassName} ${className}`}
      {...props}
      {...motionProps}
    >
      {loading && <CgSpinner className="animate-spin text-xl" />}
      {wrappedChildren}
    </motion.button>
  );
};

export default Button;
