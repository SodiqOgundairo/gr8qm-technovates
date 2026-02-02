import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { HiSave, HiX } from "react-icons/hi";

interface Form {
  id: string;
  title: string;
  status: string;
}

interface JobPostingData {
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salary_range: string;
  application_form_id: string;
  status: "draft" | "published" | "closed";
  posted_date: string;
  closing_date: string;
}

const JobPostingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<JobPostingData>({
    title: "",
    department: "",
    location: "",
    employment_type: "full-time",
    description: "",
    requirements: "",
    responsibilities: "",
    salary_range: "",
    application_form_id: "",
    status: "draft",
    posted_date: "",
    closing_date: "",
  });

  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchForms();
    if (isEditMode) {
      fetchJobPosting();
    }
  }, [id]);

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from("forms")
        .select("id, title, status")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const fetchJobPosting = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || "",
        department: data.department || "",
        location: data.location || "",
        employment_type: data.employment_type || "full-time",
        description: data.description || "",
        requirements: data.requirements || "",
        responsibilities: data.responsibilities || "",
        salary_range: data.salary_range || "",
        application_form_id: data.application_form_id || "",
        status: data.status || "draft",
        posted_date: data.posted_date
          ? new Date(data.posted_date).toISOString().split("T")[0]
          : "",
        closing_date: data.closing_date
          ? new Date(data.closing_date).toISOString().split("T")[0]
          : "",
      });
    } catch (error) {
      console.error("Error fetching job posting:", error);
      alert("Failed to load job posting");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a job title");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a job description");
      return;
    }

    if (!formData.application_form_id) {
      alert("Please select an application form");
      return;
    }

    setSaving(true);
    try {
      const dataToSave: any = {
        ...formData,
        status: publish ? "published" : formData.status,
        posted_date: formData.posted_date || null,
        closing_date: formData.closing_date || null,
      };

      // Set posted_date automatically when publishing for the first time
      if (publish && !formData.posted_date) {
        dataToSave.posted_date = new Date().toISOString();
      }

      if (isEditMode) {
        const { error } = await supabase
          .from("job_postings")
          .update(dataToSave)
          .eq("id", id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("job_postings")
          .insert([dataToSave]);

        if (error) throw error;
      }

      alert(
        publish
          ? "Job posting published successfully!"
          : "Job posting saved successfully!",
      );
      navigate("/admin/jobs");
    } catch (error) {
      console.error("Error saving job posting:", error);
      alert("Failed to save job posting");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-oxford">
            {isEditMode ? "Edit Job Posting" : "Create Job Posting"}
          </h1>
          <Button
            variant="sec"
            onClick={() => navigate("/admin/jobs")}
            className="flex items-center gap-2"
          >
            <HiX />
            Cancel
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-oxford mb-4">
              Basic Information
            </h2>

            <Input
              labelText="Job Title"
              showLabel
              requiredField
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior Frontend Developer"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                labelText="Department"
                showLabel
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Engineering"
              />

              <Input
                labelText="Location"
                showLabel
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Remote, Lagos, Nigeria"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>

              <Input
                labelText="Salary Range (Optional)"
                showLabel
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-oxford mb-4">
              Job Details
            </h2>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the role, team, and what makes this opportunity exciting..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={5}
                placeholder="List the required skills, experience, and qualifications..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows={5}
                placeholder="Outline the key responsibilities and day-to-day tasks..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue"
              />
            </div>
          </div>

          {/* Application Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-oxford mb-4">
              Application Settings
            </h2>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Application Form <span className="text-red-500">*</span>
              </label>
              <select
                name="application_form_id"
                value={formData.application_form_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue"
              >
                <option value="">Select a form</option>
                {forms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.title} ({form.status})
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select the form applicants will fill out. You can{" "}
                <button
                  type="button"
                  onClick={() => navigate("/admin/forms/create")}
                  className="text-skyblue hover:underline"
                >
                  create a new form
                </button>{" "}
                if needed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                labelText="Posted Date (Optional)"
                showLabel
                type="date"
                name="posted_date"
                value={formData.posted_date}
                onChange={handleChange}
              />

              <Input
                labelText="Closing Date (Optional)"
                showLabel
                type="date"
                name="closing_date"
                value={formData.closing_date}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button type="submit" variant="sec" disabled={saving}>
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="pry"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleSubmit(e as any, true)
              }
              disabled={saving}
              className="flex items-center gap-2"
            >
              <HiSave />
              {saving ? "Saving..." : "Publish Job"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default JobPostingForm;
