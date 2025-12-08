import React, { useState } from "react";
import Modal from "../layout/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { supabase } from "../../utils/supabase";
import { emailTemplates } from "../../utils/email";

interface ServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  serviceType: "design-build" | "print-shop" | "other";
  serviceName: string;
}

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  open,
  onClose,
  serviceType,
  serviceName,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    budget_range: "",
    timeline: "",
    project_description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Insert service request
      const requestData = {
        service_type: serviceType,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        budget_range: formData.budget_range || null,
        timeline: formData.timeline || null,
        project_description: formData.project_description,
        status: "pending",
      };

      const { error: insertError } = await supabase
        .from("service_requests")
        .insert([requestData]);

      if (insertError) throw insertError;

      // Send email notification to admin (hello@gr8qm.com)
      try {
        const emailTemplate = emailTemplates.serviceRequestNotification({
          ...requestData,
          service_type: serviceName,
        });

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        await fetch(`${supabaseUrl}/functions/v1/send-receipt-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            to: "hello@gr8qm.com",
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          }),
        });

        console.log("✅ Service request notification sent to hello@gr8qm.com");
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the whole request if email fails
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        budget_range: "",
        timeline: "",
        project_description: "",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        budget_range: "",
        timeline: "",
        project_description: "",
      });
      setSuccess(false);
      setError(null);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} width="max-w-2xl">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-oxford mb-2">
            Request {serviceName} Service
          </h2>
          <p className="text-gray-600">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Request Submitted!
            </h3>
            <p className="text-green-700">
              We've received your request and will contact you shortly at{" "}
              <strong>{formData.email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            <Input
              showLabel
              labelText="Full Name"
              requiredField
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <Input
              showLabel
              labelText="Email Address"
              requiredField
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <Input
              showLabel
              labelText="Phone Number"
              requiredField
              type="tel"
              placeholder="+234 XXX XXX XXXX"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />

            <Input
              showLabel
              labelText="Budget Range (Optional)"
              placeholder="e.g., ₦500,000 - ₦1,000,000"
              value={formData.budget_range}
              onChange={(e) =>
                setFormData({ ...formData, budget_range: e.target.value })
              }
            />

            <Input
              showLabel
              labelText="Timeline (Optional)"
              placeholder="e.g., 2-3 months"
              value={formData.timeline}
              onChange={(e) =>
                setFormData({ ...formData, timeline: e.target.value })
              }
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Project Details <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-md border outline-none transition-all duration-200 border-gray-1 text-dark placeholder:text-gray-1 focus:bg-iceblue focus:text-oxford focus:border-none focus:outline-dark px-4 py-3 h-32"
                placeholder="Tell us about your project requirements..."
                value={formData.project_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    project_description: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                type="button"
                variant="sec"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="pry"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ServiceRequestModal;
