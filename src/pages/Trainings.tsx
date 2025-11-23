import React, { useState, useEffect } from "react";
import Container from "../components/layout/Container";
import CourseCard from "../components/services/CourseCard";
import CourseModal from "../components/services/CourseModal";
import CourseApplicationForm from "../components/services/CourseApplicationForm";
import Modal from "../components/layout/Modal";
import CourseCardSkeleton from "../components/common/CourseCardSkeleton";
import { supabase } from "../utils/supabase";

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
  created_at?: string;
}

import { SEO } from "../components/common/SEO";

const TrainingsPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Fetch courses from Supabase
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setCourses(data || []);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setCourseModalOpen(true);
  };

  const handleApplyClick = () => {
    setCourseModalOpen(false);
    setApplicationModalOpen(true);
  };

  const handleCloseModals = () => {
    setCourseModalOpen(false);
    setApplicationModalOpen(false);
    setSelectedCourse(null);
  };

  // Filter courses by category
  const filteredCourses =
    filterCategory === "all"
      ? courses
      : courses.filter((course) => course.category === filterCategory);

  // Get unique categories
  const categories: string[] = [
    "all",
    ...(Array.from(
      new Set(courses.map((c) => c.category).filter(Boolean))
    ) as string[]),
  ];

  return (
    <>
      <SEO 
        title="Tech Training" 
        description="Browse Our FREE Courses. World-class training programs to launch your tech career. All courses are 100% FREE with a refundable commitment fee."
      />
      <main className="flex flex-col">
      {/* Hero Section */}
      <div className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-gradient-to-br from-skyblue/20 to-orange/20">
        <Container className="text-center">
          <div className="bg-iceblue/40 border border-skyblue rounded-full px-6 py-2 w-fit mx-auto mb-6">
            <p className="text-sm text-oxford font-medium">
              FREE TECH TRAINING
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            <span className="text-oxford">Browse Our</span>{" "}
            <span className="text-skyblue">FREE Courses</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            World-class training programs to launch your tech career. All
            courses are 100% FREE with a refundable commitment fee. Choose a
            course and start your journey today!
          </p>
        </Container>
      </div>

      {/* Courses Section */}
      <div className="py-16 md:py-24 bg-white">
        <Container>
          {/* Category Filter (if categories exist) */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    filterCategory === category
                      ? "bg-skyblue text-white shadow-lg"
                      : "bg-light text-oxford hover:bg-iceblue"
                  }`}
                >
                  {category === "all"
                    ? "All Courses"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
              <button
                onClick={fetchCourses}
                className="mt-3 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-2xl font-bold text-oxford mb-2">
                No courses available
              </p>
              <p className="text-gray-600">
                {filterCategory !== "all"
                  ? "No courses found in this category. Try selecting a different category."
                  : "No courses are currently available. Please check back later!"}
              </p>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && filteredCourses.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => handleCourseClick(course)}
                  />
                ))}
              </div>

              {/* Course Count */}
              <p className="text-center text-gray-600 mt-8">
                Showing {filteredCourses.length} course
                {filteredCourses.length !== 1 ? "s" : ""}
                {filterCategory !== "all" && ` in "${filterCategory}"`}
              </p>
            </>
          )}
        </Container>
      </div>

      {/* Why Choose Our Training Section */}
      <div className="py-16 md:py-24 bg-light">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
              Why Choose <span className="text-skyblue">Gr8QM</span> Training?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: "🎓",
                title: "100% FREE",
                desc: "Only a refundable commitment fee required",
              },
              {
                icon: "👨‍💼",
                title: "Expert Instructors",
                desc: "Learn from industry professionals",
              },
              {
                icon: "💼",
                title: "Job Support",
                desc: "Career guidance and placement assistance",
              },
              {
                icon: "🏆",
                title: "Certificates",
                desc: "Earn recognized certificates upon completion",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-oxford mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseModal
          open={courseModalOpen}
          onClose={handleCloseModals}
          course={selectedCourse}
          onApply={handleApplyClick}
        />
      )}

      {/* Application Form Modal */}
      {selectedCourse && (
        <Modal open={applicationModalOpen} onClose={handleCloseModals}>
          <CourseApplicationForm
            course={selectedCourse}
            onClose={handleCloseModals}
          />
        </Modal>
      )}
    </main>
    </>
  );
};

export default TrainingsPage;
