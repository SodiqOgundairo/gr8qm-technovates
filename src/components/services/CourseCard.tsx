import React from "react";
import { FaClock, FaMoneyBillWave } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";

interface Course {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  commitment_fee: number;
  cohort_name?: string;
  start_date?: string;
  applications_open: boolean;
  category?: string;
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-skyblue hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="flex flex-col h-full">
        {/* Icon and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-5xl">{course.icon}</div>
          {!course.applications_open && (
            <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
              Closed
            </span>
          )}
          {course.applications_open && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              Open
            </span>
          )}
        </div>

        {/* Course Title */}
        <h3 className="text-xl font-bold text-oxford mb-2 group-hover:text-skyblue transition-colors">
          {course.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {course.description}
        </p>

        {/* Cohort Info (if available) */}
        {course.cohort_name && (
          <div className="mb-3 text-sm">
            <span className="text-oxford font-semibold">
              {course.cohort_name}
            </span>
            {course.start_date && (
              <span className="text-gray-500">
                {" "}
                • Starts{" "}
                {new Date(course.start_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        )}

        {/* Course Details */}
        <div className="flex items-center justify-between text-sm mb-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <FaClock className="text-skyblue" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-skyblue font-semibold">
            <FaMoneyBillWave />
            <span>₦{course.commitment_fee.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClick}
          disabled={!course.applications_open}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
            course.applications_open
              ? "bg-skyblue text-white hover:bg-oxford group-hover:shadow-lg"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {course.applications_open ? "View Details" : "Applications Closed"}
          {course.applications_open && (
            <IoIosArrowRoundForward className="text-2xl group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
