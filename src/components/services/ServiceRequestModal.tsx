import React, { useState } from "react";
import Modal from "../layout/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { supabase } from "../../utils/supabase";

interface ServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  serviceType: "build" | "print";
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
    message: "",
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
      const { error: insertError } = await supabase
        .from("service_requests")
        .insert([
          {
            service_type: serviceType,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          },
        ]);

      if (insertError) throw insertError;

      // Send email notification (optional - using Supabase Edge Function)
      try {
        await supabase.functions.invoke("send-service-request-email", {
          body: {
            ...formData,
            serviceType: serviceName,
            to: "hello@gr8qm.com",
          },
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the whole request if email fails
      }

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });

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
      setFormData({ name: "", email: "", phone: "", message: "" });
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Project Details <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-md border outline-none transition-all duration-200 border-[var(--color-gray-1)] text-[var(--color-dark)] placeholder:text-[var(--color-gray-1)] focus:bg-[var(--color-iceblue)] focus:text-[var(--color-oxford)] focus:border-none focus:outline-[var(--color-dark)] px-4 py-3 h-32"
                placeholder="Tell us about your project requirements..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
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
                loading={loading}
                className="flex-1"
              >
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ServiceRequestModal;
