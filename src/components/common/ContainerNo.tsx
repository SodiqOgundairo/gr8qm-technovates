import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  padding?: string;
  margin?: string;
  fontSize?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  maxWidth = "2xl",
  padding = "p-4",
  margin = "mx-auto",
  fontSize = "text-base",
}) => {
  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  const maxWidthClassName = maxWidths[maxWidth];

  return (
    <div
      className={`${maxWidthClassName} ${padding} ${margin} ${fontSize} ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;