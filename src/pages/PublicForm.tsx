import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import Button from "../components/common/Button";
import { motion } from "framer-motion";

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
  conditional_logic?: {
    action: "show" | "hide";
    logic: "all" | "any";
    rules: {
      fieldId: string;
      operator:
        | "equals"
        | "not_equals"
        | "contains"
        | "greater_than"
        | "less_than";
      value: string;
    }[];
  };
  is_screener?: boolean;
  screener_logic?: {
    action: "disqualify";
    operator:
      | "equals"
      | "not_equals"
      | "contains"
      | "greater_than"
      | "less_than";
    value: string;
  };
  order_index: number;
}

interface Form {
  id: string;
  title: string;
  description?: string;
  status: string;
}

const PublicForm: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Form | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [disqualified, setDisqualified] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [shortCode]);

  const fetchForm = async () => {
    if (!shortCode) return;

    setLoading(true);
    try {
      let formData = null;

      // 1. Try to find in short_urls first (for click tracking)
      const { data: shortUrlData } = await supabase
        .from("short_urls")
        .select("*")
        .eq("short_code", shortCode)
        .maybeSingle();

      if (shortUrlData) {
        // Increment click count
        await supabase.rpc("increment_clicks", { row_id: shortUrlData.id });

        // If RPC fails or doesn't exist, we can try a direct update (less safe for concurrency but works for simple apps)
        // await supabase.from("short_urls").update({ clicks: shortUrlData.clicks + 1 }).eq("id", shortUrlData.id);
        // Actually, let's just do a direct update for now as RPC might not exist
        await supabase
          .from("short_urls")
          .update({ clicks: (shortUrlData.clicks || 0) + 1 })
          .eq("id", shortUrlData.id);

        // Fetch form by ID from short_url
        const { data: formById } = await supabase
          .from("forms")
          .select("*")
          .eq("status", "published")
          .eq("id", shortUrlData.form_id)
          .maybeSingle();

        formData = formById;
      } else {
        // 2. Fallback: Try to find form by short_code column on forms table (legacy/direct)
        const { data: formByCode } = await supabase
          .from("forms")
          .select("*")
          .eq("status", "published")
          .eq("short_code", shortCode)
          .maybeSingle();

        if (formByCode) {
          formData = formByCode;
        } else {
          // 3. Fallback: Try by ID
          const { data: formById } = await supabase
            .from("forms")
            .select("*")
            .eq("status", "published")
            .eq("id", shortCode)
            .maybeSingle();

          formData = formById;
        }
      }

      if (!formData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setForm(formData);

      // Fetch form fields
      const { data: formFields, error: fieldsError } = await supabase
        .from("form_fields")
        .select("*")
        .eq("form_id", formData.id)
        .order("order_index");

      if (fieldsError) throw fieldsError;

      setFields(formFields || []);
    } catch (error) {
      console.error("Error fetching form:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const evaluateLogic = (
    field: Field,
    currentAnswers: Record<string, any>
  ): boolean => {
    if (!field.conditional_logic || !field.conditional_logic.rules.length) {
      return true; // Show by default if no logic
    }

    const { action, logic, rules } = field.conditional_logic;

    const results = rules.map((rule) => {
      const answer = currentAnswers[rule.fieldId];
      const ruleValue = rule.value;

      if (answer === undefined || answer === null || answer === "")
        return false;

      switch (rule.operator) {
        case "equals":
          return String(answer) === ruleValue;
        case "not_equals":
          return String(answer) !== ruleValue;
        case "contains":
          return String(answer).toLowerCase().includes(ruleValue.toLowerCase());
        case "greater_than":
          return Number(answer) > Number(ruleValue);
        case "less_than":
          return Number(answer) < Number(ruleValue);
        default:
          return false;
      }
    });

    const isMatch =
      logic === "all" ? results.every((r) => r) : results.some((r) => r);

    return action === "show" ? isMatch : !isMatch;
  };

  const checkScreener = (field: Field, value: any): boolean => {
    if (!field.is_screener || !field.screener_logic) return false;

    const { operator, value: ruleValue } = field.screener_logic;

    switch (operator) {
      case "equals":
        return String(value) === ruleValue;
      case "not_equals":
        return String(value) !== ruleValue;
      case "contains":
        return String(value).toLowerCase().includes(ruleValue.toLowerCase());
      case "greater_than":
        return Number(value) > Number(ruleValue);
      case "less_than":
        return Number(value) < Number(ruleValue);
      default:
        return false;
    }
  };

  const validateField = (field: Field, value: any): string | null => {
    // Skip validation for hidden fields
    if (!evaluateLogic(field, responses)) return null;

    if (field.validation?.required && (!value || value.length === 0)) {
      return "This field is required";
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (field.type === "range") {
      const numValue = Number(value);
      if (
        field.validation?.min !== undefined &&
        numValue < field.validation.min
      ) {
        return `Value must be at least ${field.validation.min}`;
      }
      if (
        field.validation?.max !== undefined &&
        numValue > field.validation.max
      ) {
        return `Value must be at most ${field.validation.max}`;
      }
    }

    return null;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));

    // Check screener logic immediately
    const field = fields.find((f) => f.id === fieldId);
    if (field && checkScreener(field, value)) {
      setDisqualified(true);
      // Optionally submit the partial response as disqualified here
      submitDisqualifiedResponse(fieldId, value);
    }

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const submitDisqualifiedResponse = async (fieldId: string, value: any) => {
    if (!form) return;
    try {
      await supabase.from("form_responses").insert({
        form_id: form.id,
        status: "disqualified",
        respondent_metadata: { disqualified_by: fieldId, value },
      });
    } catch (err) {
      console.error("Error logging disqualification", err);
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
          form_id: form!.id,
          respondent_email:
            responses[fields.find((f) => f.type === "email")?.id || ""],
          status: "completed",
        })
        .select()
        .single();

      if (responseError) throw responseError;

      // Create field responses
      const fieldResponses = fields
        .filter((field) => evaluateLogic(field, responses)) // Only save visible fields
        .map((field) => ({
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

      // Navigate to success page
      navigate(`/forms/${shortCode}/success`);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: Field) => {
    // Check conditional logic
    if (!evaluateLogic(field, responses)) {
      return null;
    }

    const value = responses[field.id] || "";
    const error = errors[field.id];

    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: field.order_index * 0.1 }}
        className="space-y-2"
      >
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
        ) : field.type === "range" ? (
          <div>
            <input
              type="range"
              min={field.validation?.min || 0}
              max={field.validation?.max || 10}
              value={value || field.validation?.min || 0}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{field.validation?.min || 0}</span>
              <span className="font-medium text-skyblue">
                {value || field.validation?.min || 0}
              </span>
              <span>{field.validation?.max || 10}</span>
            </div>
          </div>
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
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-iceblue to-white flex items-center justify-center">
        <p className="text-gray-500">Loading form...</p>
      </div>
    );
  }

  if (notFound || !form) {
    return (
      <div className="min-h-screen bg-linear-to-br from-iceblue to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-oxford mb-4">
            Form Not Found
          </h1>
          <p className="text-gray-600">
            The form you're looking for doesn't exist or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  if (disqualified) {
    return (
      <div className="min-h-screen bg-linear-to-br from-iceblue to-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-oxford mb-4">
            Thank you for your interest
          </h2>
          <p className="text-gray-600 mb-8">
            Based on your responses, it seems this form isn't the right fit for
            you at this time. We appreciate you taking the time to check it out.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-skyblue text-white rounded-lg font-medium hover:bg-oxford transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-iceblue to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-oxford mb-3">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-gray-600 text-lg">{form.description}</p>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => renderField(field))}

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                variant="pry"
                disabled={submitting}
                className="w-full py-4 text-lg font-semibold"
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>

          {/* Branding */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Powered by{" "}
              <span className="font-bold text-skyblue">GR8QM Technovates</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicForm;
