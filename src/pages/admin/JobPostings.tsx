import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/common/Button";
import { HiPlus, HiPencil, HiTrash, HiEye, HiBriefcase } from "react-icons/hi";
import { motion } from "framer-motion";

interface JobPosting {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  status: "draft" | "published" | "closed";
  posted_date?: string;
  closing_date?: string;
  created_at: string;
  application_count?: number;
}

const JobPostings: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "draft" | "published" | "closed"
  >("all");

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch application counts for each job
      const jobsWithCounts = await Promise.all(
        (data || []).map(async (job) => {
          const { count } = await supabase
            .from("job_applications")
            .select("*", { count: "exact", head: true })
            .eq("job_posting_id", job.id);

          return { ...job, application_count: count || 0 };
        }),
      );

      setJobs(jobsWithCounts);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this job posting? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", jobId);

      if (error) throw error;

      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job posting");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-200 text-gray-800",
      published: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type?: string) => {
    if (!type) return null;

    const styles = {
      "full-time": "bg-blue-100 text-blue-800",
      "part-time": "bg-purple-100 text-purple-800",
      contract: "bg-orange-100 text-orange-800",
      internship: "bg-pink-100 text-pink-800",
      temporary: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          styles[type as keyof typeof styles] || "bg-gray-100 text-gray-800"
        }`}
      >
        {type
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-oxford flex items-center gap-3">
              <HiBriefcase className="text-skyblue" />
              Job Postings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage job openings and track applications
            </p>
          </div>
          <Button
            variant="pry"
            onClick={() => navigate("/admin/jobs/create")}
            className="flex items-center gap-2"
          >
            <HiPlus className="text-xl" />
            Post New Job
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {["all", "draft", "published", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? "bg-skyblue text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Posted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No job postings found. Create your first job posting to
                      get started!
                    </td>
                  </tr>
                ) : (
                  jobs.map((job, index) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-oxford">
                          {job.title}
                        </div>
                        {job.location && (
                          <div className="text-sm text-gray-500">
                            {job.location}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.department || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {getEmploymentTypeBadge(job.employment_type)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(job.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(`/admin/jobs/${job.id}/applications`)
                          }
                          className="text-skyblue hover:text-oxford font-medium"
                        >
                          {job.application_count || 0}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {job.posted_date
                          ? new Date(job.posted_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/jobs/${job.id}/edit`)
                            }
                            className="text-skyblue hover:text-oxford transition-colors"
                            title="Edit"
                          >
                            <HiPencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/jobs/${job.id}/applications`)
                            }
                            className="text-skyblue hover:text-oxford transition-colors"
                            title="View Applications"
                          >
                            <HiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <HiTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default JobPostings;
