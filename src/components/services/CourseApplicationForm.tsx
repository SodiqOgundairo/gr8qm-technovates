import React, { useState } from "react";
import { supabase } from "../../utils/supabase";
import { initializePayment, generateReference } from "../../utils/paystack";
import Button from "../common/Button";
import Input from "../common/Input";
import { IoIosArrowRoundForward } from "react-icons/io";

interface Course {
  id: string;
  name: string;
  commitment_fee: number;
}

interface CourseApplicationFormProps {
  course: Course;
  onClose: () => void;
}

const CourseApplicationForm: React.FC<CourseApplicationFormProps> = ({
  course,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    has_experience: false,
    experience_details: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Generate payment reference
      const paymentRef = generateReference(`COURSE-${course.id}`);

      // Save application to database
      const { data: application, error: dbError } = await supabase
        .from("course_applications")
        .insert([
          {
            course_id: course.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            has_experience: formData.has_experience,
            experience_details: formData.experience_details || null,
            payment_reference: paymentRef,
            payment_status: "pending",
            status: "pending",
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // Initialize Paystack payment
      initializePayment({
        email: formData.email,
        amount: course.commitment_fee,
        reference: paymentRef,
        metadata: {
          type: "course", // For PaymentSuccess page routing
          course_id: course.id,
          course_name: course.name,
          application_id: application.id,
          applicant_name: formData.name,
          payment_type: "course_commitment_fee",
        },
        // callback_url: `/payment-success?type=course&reference=${paymentRef}`,
      });

      // Close modal after payment initialization
      onClose();
    } catch (err: any) {
      console.error("Application submission error:", err);
      setError(
        err.message || "Failed to submit application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-oxford mb-2">
        Apply for {course.name}
      </h2>
      <p className="text-gray-600 mb-6">
        Complete the form below to apply. After submission, you'll be redirected
        to pay the commitment fee of ₦{course.commitment_fee.toLocaleString()}.
        This small fee helps us identify serious learners committed to
        completing the course.
      </p>

      {/* FREE Course Notice */}
      <div className="bg-iceblue/30 border-2 border-skyblue rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-700">
          <strong>This training is Sponsored!</strong> We're committed to making
          quality tech education accessible. The commitment fee ensures you're
          serious about your learning journey and helps us maintain course
          quality.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="your.email@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="+234 XXX XXX XXXX"
          />
        </div>

        {/* Experience Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="has_experience"
            name="has_experience"
            checked={formData.has_experience}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 text-skyblue focus:ring-skyblue border-gray-300 rounded"
          />
          <label htmlFor="has_experience" className="text-sm text-gray-700">
            I have some prior experience or knowledge in this field
          </label>
        </div>

        {/* Experience Details (conditional) */}
        {formData.has_experience && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell us about your experience
            </label>
            <textarea
              name="experience_details"
              value={formData.experience_details}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-md border outline-none transition-all duration-200 text-start border-gray-1 text-gray-1 focus:bg-iceblue focus:text-oxford focus:border-none focus:outline-dark px-4 py-3"
              placeholder="Briefly describe your experience..."
            />
          </div>
        )}

        {/* Important Note */}
        <div className="bg-light rounded-lg p-4 text-sm text-gray-700">
          <p className="mb-2">
            <strong>Next Steps:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Submit this application form</li>
            <li>
              Pay the commitment fee (₦
              {course.commitment_fee.toLocaleString()})
            </li>
            <li>Receive your course confirmation via email</li>
            <li>Start learning when the cohort begins!</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="pry"
            loading={loading}
            className="flex-1"
          >
            Proceed to Payment
            <IoIosArrowRoundForward className="text-2xl" />
          </Button>
          <Button type="button" variant="sec" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseApplicationForm;
