import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/common/Button";
import { motion } from "framer-motion";
import { HiArrowLeft, HiDownload, HiEye } from "react-icons/hi";

interface FormResponse {
  id: string;
  respondent_email?: string;
  status: string;
  submitted_at: string;
}

interface FieldResponse {
  field_id: string;
  value: any;
}

interface Field {
  id: string;
  label: string;
  type: string;
}

const FormResponses: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [responseDetails, setResponseDetails] = useState<FieldResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formId) {
      fetchFormAndResponses();
    }
  }, [formId]);

  const fetchFormAndResponses = async () => {
    setLoading(true);
    try {
      // Fetch form details
      const { data: formData, error: formError } = await supabase
        .from("forms")
        .select("*")
        .eq("id", formId)
        .single();

      if (formError) throw formError;
      setForm(formData);

      // Fetch form fields
      const { data: fieldsData, error: fieldsError } = await supabase
        .from("form_fields")
        .select("id, label, type")
        .eq("form_id", formId)
        .order("order_index");

      if (fieldsError) throw fieldsError;
      setFields(fieldsData || []);

      // Fetch responses
      const { data: responsesData, error: responsesError } = await supabase
        .from("form_responses")
        .select("*")
        .eq("form_id", formId)
        .order("submitted_at", { ascending: false });

      if (responsesError) throw responsesError;
      setResponses(responsesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load form responses");
    } finally {
      setLoading(false);
    }
  };

  const fetchResponseDetails = async (responseId: string) => {
    try {
      const { data, error } = await supabase
        .from("form_field_responses")
        .select("*")
        .eq("response_id", responseId);

      if (error) throw error;
      setResponseDetails(data || []);
      setSelectedResponse(responseId);
    } catch (error) {
      console.error("Error fetching response details:", error);
    }
  };

  const exportToCSV = async () => {
    if (responses.length === 0) {
      alert("No responses to export");
      return;
    }

    try {
      // Fetch all field responses for all responses
      const allFieldResponses = await Promise.all(
        responses.map(async (response) => {
          const { data } = await supabase
            .from("form_field_responses")
            .select("*")
            .eq("response_id", response.id);
          return { responseId: response.id, fieldResponses: data || [] };
        })
      );

      // Create CSV header
      const headers = [
        "Submitted At",
        "Email",
        "Status",
        ...fields.map((f) => f.label),
      ];

      // Create CSV rows
      const rows = responses.map((response) => {
        const row = [
          new Date(response.submitted_at).toLocaleString(),
          response.respondent_email || "N/A",
          response.status,
        ];

        // Add field values
        const responseData = allFieldResponses.find(
          (r) => r.responseId === response.id
        );
        fields.forEach((field) => {
          const fieldResponse = responseData?.fieldResponses.find(
            (fr) => fr.field_id === field.id
          );
          const value = fieldResponse?.value;

          // Format value
          if (value === null || value === undefined || value === "") {
            row.push("No response");
          } else if (field.type === "checkbox" && Array.isArray(value)) {
            row.push(value.join(", "));
          } else if (typeof value === "object") {
            row.push(JSON.stringify(value));
          } else {
            row.push(String(value));
          }
        });

        return row;
      });

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form?.title || "form"}_responses_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV");
    }
  };

  const getFieldValue = (fieldId: string): any => {
    const fieldResponse = responseDetails.find((r) => r.field_id === fieldId);
    return fieldResponse?.value;
  };

  const formatFieldValue = (field: Field, value: any): string => {
    if (value === null || value === undefined || value === "") {
      return "No response";
    }

    if (field.type === "checkbox" && Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading responses...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/forms")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-oxford">Form Responses</h1>
              <p className="text-gray-600 mt-1">
                {form?.title} - {responses.length} response
                {responses.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="sec"
              onClick={exportToCSV}
              className="flex items-center gap-2"
              disabled={responses.length === 0}
            >
              <HiDownload className="text-xl" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Responses List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">All Responses</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {responses.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No responses yet</p>
                    <p className="text-sm mt-2">
                      Responses will appear here when users submit the form
                    </p>
                  </div>
                ) : (
                  responses.map((response, index) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => fetchResponseDetails(response.id)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedResponse === response.id
                          ? "bg-skyblue/10 border-l-4 border-skyblue"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {response.respondent_email || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(response.submitted_at).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              response.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {response.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Response Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow min-h-[600px]">
              {selectedResponse ? (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <HiEye className="h-6 w-6 text-skyblue" />
                    <h2 className="text-xl font-bold text-oxford">
                      Response Details
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {fields.map((field) => {
                      const value = getFieldValue(field.id);
                      return (
                        <div
                          key={field.id}
                          className="border-b border-gray-200 pb-4"
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                          </label>
                          <div className="text-gray-900">
                            {formatFieldValue(field, value)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <HiEye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Select a response to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FormResponses;
