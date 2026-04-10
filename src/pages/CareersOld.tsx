import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { motion } from "framer-motion";
import { MapPin, Clock, Search } from "lucide-react";
import { BriefcaseIcon } from "../components/icons";
import JobDetailModal from "../components/careers/JobDetailModal";
import Scene3D from "../components/animations/Scene3D";

interface JobPosting {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salary_range?: string;
  application_form_id: string;
  posted_date?: string;
  closing_date?: string;
}

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [departments, setDepartments] = useState<string[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, departmentFilter, jobs]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("status", "published")
        .order("posted_date", { ascending: false });

      if (error) throw error;

      setJobs(data || []);

      // Extract unique departments
      const uniqueDepts = Array.from(
        new Set(
          (data || [])
            .map((job) => job.department)
            .filter((dept): dept is string => !!dept),
        ),
      );
      setDepartments(uniqueDepts);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.department?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by department
    if (departmentFilter !== "all") {
      filtered = filtered.filter((job) => job.department === departmentFilter);
    }

    setFilteredJobs(filtered);
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
        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
    <div className="min-h-screen bg-gradient-to-br from-iceblue via-white to-skyblue/10">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-oxford/5 to-skyblue/5" />
        <Scene3D variant="minimal" className="opacity-30" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto text-center relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-black text-oxford mb-6">
            Join Our <span className="text-skyblue">Team</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Build the future with us. Explore exciting opportunities and grow
            your career at GR8QM Technovates.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <motion.div
              className="relative"
              animate={{
                scale: searchFocused ? 1.02 : 1,
                boxShadow: searchFocused
                  ? "0 8px 30px rgba(0,152,218,0.15)"
                  : "0 0px 0px rgba(0,0,0,0)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.2 }}
                whileTap={{ rotate: -10 }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              >
                <Search className="text-gray-400 w-5 h-5" />
              </motion.div>
              <input
                type="text"
                placeholder="Search jobs by title, department, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-skyblue focus:outline-none text-lg transition-colors duration-300"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap gap-3">
          <motion.button
            onClick={() => setDepartmentFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              departmentFilter === "all"
                ? "bg-skyblue text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Departments
          </motion.button>
          {departments.map((dept) => (
            <motion.button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                departmentFilter === dept
                  ? "bg-skyblue text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {dept}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Job Listings */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Loading opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No job openings found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedJob(job)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,152,218,0.1)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-oxford group-hover:text-skyblue transition-colors duration-300 mb-2">
                        {job.title}
                      </h3>
                      {job.department && (
                        <p className="text-gray-600 font-medium">
                          {job.department}
                        </p>
                      )}
                    </div>
                    {getEmploymentTypeBadge(job.employment_type)}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {job.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.2 }}
                          whileTap={{ rotate: -10 }}
                        >
                          <MapPin className="text-skyblue w-4 h-4" />
                        </motion.div>
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.posted_date && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.2 }}
                          whileTap={{ rotate: -10 }}
                        >
                          <Clock className="text-skyblue w-4 h-4" />
                        </motion.div>
                        <span>
                          Posted{" "}
                          {new Date(job.posted_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {job.salary_range && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.2 }}
                          whileTap={{ rotate: -10 }}
                        >
                          <BriefcaseIcon size={16} className="text-skyblue" />
                        </motion.div>
                        <span>{job.salary_range}</span>
                      </div>
                    )}
                  </div>

                  {/* Description Preview */}
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {job.description}
                  </p>

                  {/* CTA */}
                  <button className="w-full py-3 bg-gradient-to-r from-skyblue to-oxford text-white font-semibold rounded-lg hover:shadow-lg transition-all transform group-hover:scale-[1.02]">
                    View Details & Apply
                  </button>
                </div>

                {/* Decorative Element */}
                <div className="h-2 bg-gradient-to-r from-skyblue to-oxford transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default Careers;
