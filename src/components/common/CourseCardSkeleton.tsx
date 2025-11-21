import React from "react";
import Skeleton from "./Skeleton";

const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Icon and Status Badge */}
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton width={60} height={24} className="rounded-full" />
      </div>

      {/* Title */}
      <Skeleton width="70%" height={24} className="mb-2" />

      {/* Description */}
      <div className="space-y-2 mb-4">
        <Skeleton width="100%" />
        <Skeleton width="90%" />
        <Skeleton width="80%" />
      </div>

      {/* Cohort Info */}
      <Skeleton width="60%" height={16} className="mb-3" />

      {/* Details (Duration and Fee) */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
        <Skeleton width={80} />
        <Skeleton width={100} />
      </div>

      {/* Button */}
      <Skeleton width="100%" height={48} className="rounded-lg" />
    </div>
  );
};

export default CourseCardSkeleton;
