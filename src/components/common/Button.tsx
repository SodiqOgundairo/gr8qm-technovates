import React from "react";
import { Link } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "pry" | "sec" | "inverted";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  to?: string;
  loading?: boolean;
}

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
  const variants = {
    pry: "bg-skyblue text-white hover:bg-light hover:text-skyblue hover:shadow-lg transform hover:scale-95 transition-all duration-300 ease-in-out",
    sec: "btn-sec",
    inverted:
      "bg-oxford text-white hover:bg-iceblue hover:text-[var(--color-oxford)] hover:shadow-lg transform hover:scale-95 transition-all duration-300 ease-in-out",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const baseClassName =
    "rounded-md font-medium cursor-pointer whitespace-nowrap flex items-center justify-center gap-2";

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

  if (to && !disabled && !loading) {
    return (
      <Link
        to={to}
        className={`${baseClassName} ${variantClassName} ${sizeClassName} ${className}`}
      >
        {wrappedChildren}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClassName} ${variantClassName} ${sizeClassName} ${className}`}
      {...props}
    >
      {loading && <CgSpinner className="animate-spin text-xl" />}
      {wrappedChildren}
    </button>
  );
};

export default Button;
