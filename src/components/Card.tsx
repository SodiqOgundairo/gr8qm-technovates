import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "iceblue";
}

const Card: React.FC<CardProps> = ({ children, className, variant = "default" }) => {
  const variants = {
    default: "bg-white shadow-[0px_8px_16px_0px_rgba(0,0,0,0.05)]",
    iceblue: "bg-[var(--color-iceblue)]",
  };

  const baseClassName = "rounded-lg p-6";
  const variantClassName = variants[variant];

  return (
    <div className={`${baseClassName} ${variantClassName} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
