import React, { useState } from "react";
import Button from "../common/Button";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdOutlineDesignServices } from "react-icons/md";
import { FaPrint, FaGraduationCap } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: "design" | "print" | "training";
  features: string[];
  onContactClick?: () => void;
  portfolioCategory?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  features,
  onContactClick,
  portfolioCategory,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (icon) {
      case "design":
        return <MdOutlineDesignServices className="text-6xl text-skyblue" />;
      case "print":
        return <FaPrint className="text-6xl text-orange" />;
      case "training":
        return <FaGraduationCap className="text-6xl text-iceblue" />;
    }
  };

  const handlePortfolioClick = () => {
    if (portfolioCategory) {
      navigate(`/portfolio?category=${portfolioCategory}`);
    } else {
      navigate("/portfolio");
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 ${
        isHovered
          ? "border-skyblue shadow-2xl transform -translate-y-2"
          : "border-gray-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div className="mb-6 flex justify-center">{getIcon()}</div>

      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-bold text-oxford mb-4 text-center">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 text-center leading-relaxed">
        {description}
      </p>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <IoIosArrowRoundForward className="text-skyblue text-2xl flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="pry"
          onClick={onContactClick}
          className="w-full justify-center"
        >
          Learn More
          <IoIosArrowRoundForward className="text-2xl" />
        </Button>
        <Button
          variant="sec"
          onClick={handlePortfolioClick}
          className="w-full justify-center"
        >
          View Portfolio
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
