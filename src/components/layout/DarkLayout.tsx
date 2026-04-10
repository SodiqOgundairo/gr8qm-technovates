import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import SmoothScroll from "../animations/SmoothScroll";

interface DarkLayoutProps {
  children: React.ReactNode;
}

const DarkLayout: React.FC<DarkLayoutProps> = ({ children }) => {
  return (
    <div className="dark" style={{ colorScheme: "dark" }}>
      <SmoothScroll>
        <Header />
        {children}
        <Footer />
      </SmoothScroll>
    </div>
  );
};

export default DarkLayout;
