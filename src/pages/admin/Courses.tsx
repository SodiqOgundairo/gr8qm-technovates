import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/layout/Modal";
import CourseForm from "../../components/admin/CourseForm";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import { supabase } from "../../utils/supabase";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setCourses(data || []);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedCourse(null);
    setModalOpen(true);
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleSubmit = async (courseData: Omit<Course, "id">) => {
    try {
      setSubmitting(true);
      setError(null);

      if (selectedCourse) {
        // Update existing course
        const { error: updateError } = await supabase
          .from("courses")
          .update(courseData)
          .eq("id", selectedCourse.id);

        if (updateError) throw updateError;
      } else {
        // Create new course
        const { error: insertError } = await supabase
          .from("courses")
          .insert([courseData]);

        if (insertError) throw insertError;
      }

      // Refresh courses list
      await fetchCourses();
      setModalOpen(false);
      setSelectedCourse(null);
    } catch (err: any) {
      console.error("Error saving course:", err);
      setError(err.message || "Failed to save course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (deleteError) throw deleteError;

      // Refresh courses list
      await fetchCourses();
    } catch (err: any) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course: " + err.message);
    }
  };

  const handleToggleApplications = async (course: Course) => {
    try {
      const { error: updateError } = await supabase
        .from("courses")
        .update({ applications_open: !course.applications_open })
        .eq("id", course.id);

      if (updateError) throw updateError;

      // Refresh courses list
      await fetchCourses();
    } catch (err: any) {
      console.error("Error toggling applications:", err);
      alert("Failed to update course: " + err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-oxford">Courses</h1>
            <p className="text-gray-600 mt-1">Manage your training courses</p>
          </div>
          <Button variant="pry" onClick={handleCreateClick}>
            <FaPlus className="mr-2" />
            Create Course
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton variant="circular" width={64} height={64} />
                    <div className="flex-1 space-y-2">
                      <Skeleton width="30%" height={24} />
                      <Skeleton width="60%" />
                      <Skeleton width="40%" />
                    </div>
                  </div>
                  <Skeleton width={100} height={36} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-oxford mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first course
            </p>
            <Button variant="pry" onClick={handleCreateClick}>
              <FaPlus className="mr-2" />
              Create Your First Course
            </Button>
          </div>
        )}

        {/* Courses List */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Icon */}
                    <div className="text-5xl">{course.icon}</div>

                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-oxford">
                          {course.name}
                        </h3>
                        {course.applications_open ? (
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                            Open
                          </span>
                        ) : (
                          <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                            Closed
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>⏱️ {course.duration}</span>
                        <span>
                          💰 ₦{course.commitment_fee.toLocaleString()}
                        </span>
                        {course.cohort_name && (
                          <span>📚 {course.cohort_name}</span>
                        )}
                        {course.start_date && (
                          <span>
                            📅{" "}
                            {new Date(course.start_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleApplications(course)}
                      className="p-2 text-gray-600 hover:text-skyblue transition-colors"
                      title={
                        course.applications_open
                          ? "Close applications"
                          : "Open applications"
                      }
                    >
                      {course.applications_open ? (
                        <FaToggleOn className="h-6 w-6 text-green-500" />
                      ) : (
                        <FaToggleOff className="h-6 w-6" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/applications?course_id=${course.id}`)
                      }
                      className="p-2 text-gray-600 hover:text-skyblue transition-colors"
                      title="View applicants"
                    >
                      <FaUsers className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditClick(course)}
                      className="p-2 text-gray-600 hover:text-skyblue transition-colors"
                      title="Edit course"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                      title="Delete course"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Count */}
        {!loading && courses.length > 0 && (
          <p className="text-center text-gray-600">
            Total: {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCourse(null);
        }}
      >
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-oxford mb-6">
            {selectedCourse ? "Edit Course" : "Create New Course"}
          </h2>
          <CourseForm
            course={selectedCourse}
            onSubmit={handleSubmit}
            onCancel={() => {
              setModalOpen(false);
              setSelectedCourse(null);
            }}
            loading={submitting}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCourses;
