import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "pry" | "sec" | "inverted";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  to?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  onClick,
  className,
  size = "md",
  to,
}) => {
  const variants = {
    pry: "bg-skyblue text-white hover:bg-light hover:text-skyblue hover:shadow-lg transform hover:scale-95 transition-all duration-300 ease-in-out",
    sec: "btn-sec",
    inverted: "bg-oxford text-white hover:bg-iceblue hover:text-[var(--color-oxford)] hover:shadow-lg transform hover:scale-95 transition-all duration-300 ease-in-out",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const baseClassName = "rounded-md font-medium cursor-pointer";
  const variantClassName = variants[variant];
  const sizeClassName = sizes[size];

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClassName} ${variantClassName} ${sizeClassName} ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClassName} ${variantClassName} ${sizeClassName} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
