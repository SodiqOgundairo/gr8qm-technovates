import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  const base =
    "mx-auto w-full max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-5 md:px-8 lg:px-24 xl:px-28 2xl:px-32 ";
  return <div className={`${base} ${className || ""}`}>{children}</div>;
};

export default Container;
