import React from "react";
import {
  CodeIcon,
  PrinterIcon,
  GraduationCapIcon,
  ZapIcon,
  ArrowRightIcon,
} from "../icons";
import { CheckCircle } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  features: string[];
  onContactClick: () => void;
  portfolioCategory: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  features,
  onContactClick,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "design":
        return <CodeIcon size={32} />;
      case "print":
        return <PrinterIcon size={32} />;
      case "training":
        return <GraduationCapIcon size={32} />;
      default:
        return <ZapIcon size={32} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col group border border-transparent hover:border-skyblue/30">
      <div className="mb-6 inline-block p-4 bg-iceblue/30 rounded-2xl group-hover:bg-skyblue group-hover:text-white transition-colors duration-300 w-fit text-skyblue">
        {getIcon(icon)}
      </div>

      <h3 className="text-2xl font-bold text-oxford mb-4 group-hover:text-skyblue transition-colors duration-300">
        {title}
      </h3>

      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start text-gray-600 text-sm">
            <CheckCircle className="text-skyblue mt-0.5 mr-2 flex-shrink-0 w-4 h-4" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onContactClick}
        className="w-full py-3 flex items-center justify-center gap-2 bg-gray-50 text-oxford font-semibold rounded-xl group-hover:bg-skyblue group-hover:text-white transition-all duration-300 cursor-pointer"
      >
        Learn More <ArrowRightIcon size={18} />
      </button>
    </div>
  );
};

export default ServiceCard;
