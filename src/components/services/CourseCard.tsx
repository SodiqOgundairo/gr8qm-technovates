import React from "react";
import { Clock, Calendar } from "lucide-react";
import { DollarIcon, GraduationCapIcon } from "../icons";

interface Course {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  commitment_fee: number;
  category?: string;
  start_date?: string;
  applications_open: boolean;
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full flex flex-col border border-transparent hover:border-skyblue/30"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-skyblue/10 to-oxford/10 group-hover:scale-105 transition-transform duration-500">
          {course.icon ? (
            <span className="text-6xl">{course.icon}</span>
          ) : (
            <GraduationCapIcon size={64} className="text-skyblue/50" />
          )}
        </div>

        {course.category && (
          <div className="absolute top-4 right-4 z-20">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-oxford uppercase tracking-wider shadow-sm">
              {course.category}
            </span>
          </div>
        )}

        {course.applications_open && (
          <div className="absolute bottom-4 left-4 z-20">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Open for Applications
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-oxford group-hover:text-skyblue transition-colors line-clamp-2 mb-2">
          {course.name}
        </h3>

        <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1">
          {course.description}
        </p>

        <div className="space-y-3 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="text-skyblue w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarIcon size={16} className="text-skyblue" />
              <span className="font-bold text-oxford">
                ₦{course.commitment_fee.toLocaleString()}
              </span>
            </div>
          </div>

          {course.start_date && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar className="text-skyblue w-4 h-4" />
              <span>
                Starts {new Date(course.start_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
