import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "col";
}

const Section: React.FC<SectionProps> = ({
  children,
  className,
  direction = "col",
}) => {
  const directionClassName = direction === "row" ? "flex-row" : "flex-col";

  return (
    <section className={`flex ${directionClassName} ${className}`}>
      {children}
    </section>
  );
};

export default Section;
