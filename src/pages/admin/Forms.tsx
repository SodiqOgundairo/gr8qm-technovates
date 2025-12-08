import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/common/Button";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiDuplicate,
  HiEye,
  HiShare,
  HiChartBar,
} from "react-icons/hi";
import ShareModal from "../../components/forms/ShareModal";
import { motion } from "framer-motion";

interface Form {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "published" | "closed";
  created_at: string;
  response_count?: number;
  short_code?: string;
  settings?: any;
}

const AdminForms: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [filter, setFilter] = useState<
    "all" | "draft" | "published" | "closed"
  >("all");

  useEffect(() => {
    fetchForms();
  }, [filter]);

  const fetchForms = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("forms")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch response counts for each form
      const formsWithCounts = await Promise.all(
        (data || []).map(async (form) => {
          const { count } = await supabase
            .from("form_responses")
            .select("*", { count: "exact", head: true })
            .eq("form_id", form.id)
            .eq("status", "completed");

          return { ...form, response_count: count || 0 };
        })
      );

      setForms(formsWithCounts);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this form? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("forms").delete().eq("id", formId);

      if (error) throw error;

      setForms(forms.filter((f) => f.id !== formId));
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("Failed to delete form");
    }
  };

  const handleDuplicate = async (formId: string) => {
    try {
      // Fetch original form
      const { data: originalForm, error: formError } = await supabase
        .from("forms")
        .select("*")
        .eq("id", formId)
        .single();

      if (formError) throw formError;

      // Create duplicate
      const { data: newForm, error: createError } = await supabase
        .from("forms")
        .insert({
          title: `${originalForm.title} (Copy)`,
          description: originalForm.description,
          settings: originalForm.settings,
          status: "draft",
        })
        .select()
        .single();

      if (createError) throw createError;

      // Fetch and duplicate fields
      const { data: fields, error: fieldsError } = await supabase
        .from("form_fields")
        .select("*")
        .eq("form_id", formId)
        .order("order_index");

      if (fieldsError) throw fieldsError;

      if (fields && fields.length > 0) {
        const duplicatedFields = fields.map((field) => ({
          ...field,
          id: undefined,
          form_id: newForm.id,
        }));

        await supabase.from("form_fields").insert(duplicatedFields);
      }

      fetchForms();
      alert("Form duplicated successfully!");
    } catch (error) {
      console.error("Error duplicating form:", error);
      alert("Failed to duplicate form");
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-oxford">Forms</h1>
            <p className="text-gray-600 mt-1">Create and manage custom forms</p>
          </div>
          <Button
            variant="pry"
            onClick={() => navigate("/admin/forms/new")}
            className="flex items-center gap-2"
          >
            <HiPlus className="text-xl" />
            Create Form
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

        {/* Forms Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Responses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created
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
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : forms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No forms found. Create your first form to get started!
                    </td>
                  </tr>
                ) : (
                  forms.map((form, index) => (
                    <motion.tr
                      key={form.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-oxford">
                            {form.title}
                          </div>
                          {form.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {form.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(form.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {form.response_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(form.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/forms/edit/${form.id}`)
                            }
                            className="text-skyblue hover:text-oxford transition-colors"
                            title="Edit"
                          >
                            <HiPencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/forms/${form.id}/responses`)
                            }
                            className="text-skyblue hover:text-oxford transition-colors"
                            title="View Responses"
                          >
                            <HiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(form.id)}
                            className="text-skyblue hover:text-oxford transition-colors"
                            title="Duplicate"
                          >
                            <HiDuplicate className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/forms/${form.id}/analytics`)
                            }
                            className="text-skyblue hover:text-oxford transition-colors"
                            title="Analytics"
                          >
                            <HiChartBar className="h-5 w-5" />
                          </button>
                          {form.status === "published" && (
                            <button
                              onClick={() => {
                                setSelectedForm(form);
                                setShareModalOpen(true);
                              }}
                              className="text-skyblue hover:text-oxford transition-colors"
                              title="Share Form"
                            >
                              <HiShare className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(form.id)}
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

      {selectedForm && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          formId={selectedForm.id}
          formTitle={selectedForm.title}
          shareUrl={`${window.location.origin}/forms/${
            selectedForm.short_code || selectedForm.id
          }`}
        />
      )}
    </AdminLayout>
  );
};

export default AdminForms;
