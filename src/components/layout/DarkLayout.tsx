import React from "react";
import HeaderNew from "./HeaderNew";
import FooterNew from "./FooterNew";
import SmoothScroll from "../animations/SmoothScroll";
import CustomCursor from "../animations/CustomCursor";

interface DarkLayoutProps {
  children: React.ReactNode;
}

const DarkLayout: React.FC<DarkLayoutProps> = ({ children }) => {
  return (
    <div className="dark" style={{ colorScheme: "dark" }}>
      <SmoothScroll>
        <CustomCursor />
        <HeaderNew />
        {children}
        <FooterNew />
      </SmoothScroll>
    </div>
  );
};

export default DarkLayout;
