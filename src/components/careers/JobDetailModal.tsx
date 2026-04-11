import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { Dialog, DialogContent } from "devign";
import {
  HiLocationMarker,
  HiBriefcase,
  HiClock,
  HiCurrencyDollar,
} from "react-icons/hi";

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

interface Field {
  id: string;
  type: string;
  label: string;
  description?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
  order_index: number;
}

interface JobDetailModalProps {
  job: JobPosting;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && job.application_form_id) {
      fetchFormFields();
    }
  }, [isOpen, job.application_form_id]);

  const fetchFormFields = async () => {
    try {
      const { data, error } = await supabase
        .from("form_fields")
        .select("*")
        .eq("form_id", job.application_form_id)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setFields(data || []);
    } catch (error) {
      console.error("Error fetching form fields:", error);
    }
  };

  const validateField = (field: Field, value: any): string | null => {
    if (field.validation?.required && (!value || value.length === 0)) {
      return "This field is required";
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    return null;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const error = validateField(field, responses[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      // Create form response
      const { data: formResponse, error: responseError } = await supabase
        .from("form_responses")
        .insert({
          form_id: job.application_form_id,
          respondent_email:
            responses[fields.find((f) => f.type === "email")?.id || ""],
          status: "completed",
        })
        .select()
        .single();

      if (responseError) throw responseError;

      // Create field responses
      const fieldResponses = fields.map((field) => ({
        response_id: formResponse.id,
        field_id: field.id,
        value: responses[field.id] || null,
      }));

      if (fieldResponses.length > 0) {
        const { error: fieldResponsesError } = await supabase
          .from("form_field_responses")
          .insert(fieldResponses);

        if (fieldResponsesError) throw fieldResponsesError;
      }

      // Create job application record
      const applicantName =
        responses[
          fields.find((f) => f.label.toLowerCase().includes("name"))?.id || ""
        ] || "";
      const applicantEmail =
        responses[fields.find((f) => f.type === "email")?.id || ""] || "";

      const { error: applicationError } = await supabase
        .from("job_applications")
        .insert({
          job_posting_id: job.id,
          form_response_id: formResponse.id,
          applicant_name: applicantName,
          applicant_email: applicantEmail,
          status: "pending",
        });

      if (applicationError) throw applicationError;

      setSubmitted(true);
      setResponses({});
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: Field) => {
    const value = responses[field.id] || "";
    const error = errors[field.id];

    return (
      <div key={field.id} className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          {field.label}
          {field.validation?.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
        {field.description && (
          <p className="text-sm text-gray-600">{field.description}</p>
        )}

        {field.type === "text" ||
        field.type === "email" ||
        field.type === "phone" ? (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        ) : field.type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        ) : field.type === "radio" ? (
          <div className="space-y-2">
            {(field.options || []).map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-4 h-4 text-skyblue focus:ring-skyblue"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        ) : field.type === "checkbox" ? (
          <div className="space-y-2">
            {(field.options || []).map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={(value || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleInputChange(field.id, newValues);
                  }}
                  className="w-4 h-4 text-skyblue rounded focus:ring-skyblue"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        ) : field.type === "dropdown" ? (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select an option</option>
            {(field.options || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === "date" ? (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        ) : null}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:!max-w-4xl !max-h-[90vh] !overflow-y-auto !p-0">
        {submitted ? (
          /* Success Message */
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-oxford mb-4">
              Application Submitted!
            </h2>
            <p className="text-gray-600 mb-8">
              Thank you for applying to {job.title}. We'll review your
              application and get back to you soon.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-skyblue text-white rounded-lg font-medium hover:bg-oxford transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Job Details */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-4xl font-bold text-oxford mb-4">
                {job.title}
              </h2>

              <div className="flex flex-wrap gap-4 mb-6">
                {job.department && (
                  <span className="px-4 py-2 bg-skyblue/10 text-skyblue rounded-lg font-medium">
                    {job.department}
                  </span>
                )}
                {job.employment_type && (
                  <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium">
                    {job.employment_type
                      .split("-")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                {job.location && (
                  <div className="flex items-center gap-2">
                    <HiLocationMarker className="text-skyblue text-xl" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.salary_range && (
                  <div className="flex items-center gap-2">
                    <HiCurrencyDollar className="text-skyblue text-xl" />
                    <span>{job.salary_range}</span>
                  </div>
                )}
                {job.posted_date && (
                  <div className="flex items-center gap-2">
                    <HiClock className="text-skyblue text-xl" />
                    <span>
                      Posted{" "}
                      {new Date(job.posted_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {job.closing_date && (
                  <div className="flex items-center gap-2">
                    <HiBriefcase className="text-skyblue text-xl" />
                    <span>
                      Closes{" "}
                      {new Date(job.closing_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {!showForm ? (
              <div className="p-8 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-2xl font-bold text-oxford mb-3">
                    About the Role
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                {/* Requirements */}
                {job.requirements && (
                  <div>
                    <h3 className="text-2xl font-bold text-oxford mb-3">
                      Requirements
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {job.requirements}
                    </p>
                  </div>
                )}

                {/* Responsibilities */}
                {job.responsibilities && (
                  <div>
                    <h3 className="text-2xl font-bold text-oxford mb-3">
                      Responsibilities
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {job.responsibilities}
                    </p>
                  </div>
                )}

                {/* Apply Button */}
                <div className="pt-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-4 bg-gradient-to-r from-skyblue to-oxford text-white text-lg font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                  >
                    Apply for this Position
                  </button>
                </div>
              </div>
            ) : (
              /* Application Form */
              <div className="p-8">
                <div className="mb-6">
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-skyblue hover:text-oxford font-medium"
                  >
                    ← Back to Job Details
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-oxford mb-6">
                  Application Form
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {fields.map((field) => renderField(field))}

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-skyblue to-oxford text-white text-lg font-bold rounded-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {submitting
                        ? "Submitting..."
                        : "Submit Application"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailModal;
