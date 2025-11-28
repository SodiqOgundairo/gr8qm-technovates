import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { FaPlus, FaTrash } from "react-icons/fa";

interface Course {
  id?: string;
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

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (course: Omit<Course, "id">) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  course,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Omit<Course, "id">>({
    name: "",
    description: "",
    icon: "",
    duration: "",
    commitment_fee: 0,
    cohort_name: "",
    start_date: "",
    applications_open: true,
    category: "",
    requirements: [],
    what_you_learn: [],
  });

  const [requirementInput, setRequirementInput] = useState("");
  const [learnInput, setLearnInput] = useState("");

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        description: course.description,
        icon: course.icon,
        duration: course.duration,
        commitment_fee: course.commitment_fee,
        cohort_name: course.cohort_name || "",
        start_date: course.start_date || "",
        applications_open: course.applications_open,
        category: course.category || "",
        requirements: course.requirements || [],
        what_you_learn: course.what_you_learn || [],
      });
    }
  }, [course]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...(prev.requirements || []), requirementInput.trim()],
      }));
      setRequirementInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || [],
    }));
  };

  const addLearnItem = () => {
    if (learnInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        what_you_learn: [...(prev.what_you_learn || []), learnInput.trim()],
      }));
      setLearnInput("");
    }
  };

  const removeLearnItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      what_you_learn: prev.what_you_learn?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Product Design"
          />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon (Emoji) <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            required
            placeholder="e.g., 🎨"
            maxLength={2}
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            placeholder="e.g., 12 weeks"
          />
        </div>

        {/* Commitment Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commitment Fee (₦) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            name="commitment_fee"
            value={formData.commitment_fee}
            onChange={handleChange}
            required
            min={0}
            placeholder="e.g., 50000"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category (optional)
          </label>
          <Input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., design, development"
          />
        </div>

        {/* Cohort Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cohort Name (optional)
          </label>
          <Input
            type="text"
            name="cohort_name"
            value={formData.cohort_name}
            onChange={handleChange}
            placeholder="e.g., Cohort 4"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date (optional)
          </label>
          <Input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </div>

        {/* Applications Open */}
        <div className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            id="applications_open"
            name="applications_open"
            checked={formData.applications_open}
            onChange={handleChange}
            className="h-4 w-4 text-skyblue focus:ring-skyblue border-gray-300 rounded"
          />
          <label
            htmlFor="applications_open"
            className="text-sm text-gray-700 font-medium"
          >
            Applications Open
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full rounded-md border outline-none transition-all duration-200 text-start border-gray-1 text-gray-1 focus:bg-iceblue focus:text-oxford focus:border-none focus:outline-dark px-4 py-3"
          placeholder="Brief description of the course..."
        />
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requirements (optional)
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            value={requirementInput}
            onChange={(e) => setRequirementInput(e.target.value)}
            placeholder="Add a requirement"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addRequirement())
            }
          />
          <Button type="button" variant="sec" onClick={addRequirement}>
            <FaPlus />
          </Button>
        </div>
        {formData.requirements && formData.requirements.length > 0 && (
          <ul className="space-y-2">
            {formData.requirements.map((req, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-light px-4 py-2 rounded-md"
              >
                <span className="text-sm text-gray-700">{req}</span>
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* What You'll Learn */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What You'll Learn (optional)
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            value={learnInput}
            onChange={(e) => setLearnInput(e.target.value)}
            placeholder="Add a learning outcome"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addLearnItem())
            }
          />
          <Button type="button" variant="sec" onClick={addLearnItem}>
            <FaPlus />
          </Button>
        </div>
        {formData.what_you_learn && formData.what_you_learn.length > 0 && (
          <ul className="space-y-2">
            {formData.what_you_learn.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-light px-4 py-2 rounded-md"
              >
                <span className="text-sm text-gray-700">{item}</span>
                <button
                  type="button"
                  onClick={() => removeLearnItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t">
        <Button
          type="submit"
          variant="pry"
          loading={loading}
          className="flex-1"
        >
          {course ? "Update Course" : "Create Course"}
        </Button>
        <Button type="button" variant="sec" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;
