import React from "react";
import Modal from "../layout/Modal";
import Button from "../common/Button";
import { IoIosArrowRoundForward } from "react-icons/io";
import {
  FaClock,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

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
  requirements?: string[];
  what_you_learn?: string[];
}

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  onApply: () => void;
}

const CourseModal: React.FC<CourseModalProps> = ({
  open,
  onClose,
  course,
  onApply,
}) => {
  if (!course) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="text-6xl">{course.icon}</div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-oxford mb-2">
              {course.name}
            </h2>
            <p className="text-gray-600">{course.description}</p>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-light rounded-lg p-4 flex items-center gap-3">
            <FaClock className="text-skyblue text-2xl" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Duration</p>
              <p className="font-semibold text-oxford">{course.duration}</p>
            </div>
          </div>

          <div className="bg-light rounded-lg p-4 flex items-center gap-3">
            <FaMoneyBillWave className="text-orange text-2xl" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Commitment Fee</p>
              <p className="font-semibold text-oxford">
                ₦{course.commitment_fee.toLocaleString()}
              </p>
            </div>
          </div>

          {course.cohort_name && (
            <div className="bg-light rounded-lg p-4 flex items-center gap-3">
              <FaCalendarAlt className="text-skyblue text-2xl" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Cohort</p>
                <p className="font-semibold text-oxford">
                  {course.cohort_name}
                </p>
              </div>
            </div>
          )}

          {course.start_date && (
            <div className="bg-light rounded-lg p-4 flex items-center gap-3">
              <FaCalendarAlt className="text-green-500 text-2xl" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Start Date</p>
                <p className="font-semibold text-oxford">
                  {new Date(course.start_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FREE Course Notice */}
        <div className="bg-iceblue/30 border-2 border-skyblue rounded-xl p-4 mb-6">
          <h3 className="font-bold text-oxford mb-2 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            This Course is 100% FREE
          </h3>
          <p className="text-gray-700 text-sm">
            The commitment fee of ₦{course.commitment_fee.toLocaleString()} is{" "}
            <strong>fully refundable</strong> upon course completion and
            maintaining at least 80% attendance. It demonstrates your dedication
            to learning and ensures serious learners.
          </p>
        </div>

        {/* What You'll Learn */}
        {course.what_you_learn && course.what_you_learn.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-oxford mb-3">
              What You'll Learn
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {course.what_you_learn.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <FaCheckCircle className="text-skyblue mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {course.requirements && course.requirements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-oxford mb-3">Requirements</h3>
            <ul className="space-y-2">
              {course.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="text-skyblue">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="pry"
            onClick={onApply}
            disabled={!course.applications_open}
            className="flex-1"
          >
            {course.applications_open ? (
              <>
                Apply Now
                <IoIosArrowRoundForward className="text-2xl" />
              </>
            ) : (
              "Applications Closed"
            )}
          </Button>
          <Button variant="sec" onClick={onClose}>
            Close
          </Button>
        </div>

        {!course.applications_open && (
          <p className="text-center text-gray-500 text-sm mt-3">
            Applications are currently closed for this course. Check back later!
          </p>
        )}
      </div>
    </Modal>
  );
};

export default CourseModal;
