import React from "react";

const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
      {/* Icon and Status Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-white/[0.04] animate-pulse" />
        <div className="w-16 h-6 rounded-full bg-white/[0.04] animate-pulse" />
      </div>

      {/* Title */}
      <div className="h-6 bg-white/[0.04] rounded w-3/4 mb-2 animate-pulse" />

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-white/[0.04] rounded w-full animate-pulse" />
        <div className="h-3 bg-white/[0.04] rounded w-11/12 animate-pulse" />
        <div className="h-3 bg-white/[0.04] rounded w-4/5 animate-pulse" />
      </div>

      {/* Cohort Info */}
      <div className="h-4 bg-white/[0.04] rounded w-3/5 mb-3 animate-pulse" />

      {/* Details (Duration and Fee) */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-white/[0.06]">
        <div className="h-4 bg-white/[0.04] rounded w-20 animate-pulse" />
        <div className="h-4 bg-white/[0.04] rounded w-24 animate-pulse" />
      </div>

      {/* Button */}
      <div className="h-12 bg-white/[0.04] rounded-lg w-full animate-pulse" />
    </div>
  );
};

export default CourseCardSkeleton;
