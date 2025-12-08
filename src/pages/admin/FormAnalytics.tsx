import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  HiArrowLeft,
  HiChartBar,
  HiCursorClick,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import { motion } from "framer-motion";

interface AnalyticsData {
  totalResponses: number;
  completedResponses: number;
  disqualifiedResponses: number;
  completionRate: number;
  totalClicks: number;
  recentResponses: any[];
}

const FormAnalytics: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formTitle, setFormTitle] = useState("");
  const [data, setData] = useState<AnalyticsData>({
    totalResponses: 0,
    completedResponses: 0,
    disqualifiedResponses: 0,
    completionRate: 0,
    totalClicks: 0,
    recentResponses: [],
  });

  useEffect(() => {
    if (formId) {
      fetchAnalytics();
    }
  }, [formId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch form details
      const { data: form } = await supabase
        .from("forms")
        .select("title")
        .eq("id", formId)
        .single();

      if (form) setFormTitle(form.title);

      // Fetch responses stats
      const { count: total } = await supabase
        .from("form_responses")
        .select("*", { count: "exact", head: true })
        .eq("form_id", formId);

      const { count: completed } = await supabase
        .from("form_responses")
        .select("*", { count: "exact", head: true })
        .eq("form_id", formId)
        .eq("status", "completed");

      const { count: disqualified } = await supabase
        .from("form_responses")
        .select("*", { count: "exact", head: true })
        .eq("form_id", formId)
        .eq("status", "disqualified");

      // Fetch clicks from short_urls
      const { data: shortUrl } = await supabase
        .from("short_urls")
        .select("clicks")
        .eq("form_id", formId)
        .maybeSingle();

      // Fetch recent responses
      const { data: recent } = await supabase
        .from("form_responses")
        .select("*")
        .eq("form_id", formId)
        .order("submitted_at", { ascending: false })
        .limit(5);

      setData({
        totalResponses: total || 0,
        completedResponses: completed || 0,
        disqualifiedResponses: disqualified || 0,
        completionRate: total
          ? Math.round(((completed || 0) / total) * 100)
          : 0,
        totalClicks: shortUrl?.clicks || 0,
        recentResponses: recent || [],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/forms")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <HiArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-oxford">
              Analytics: {formTitle}
            </h1>
            <p className="text-gray-600">Performance overview and statistics</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading analytics...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow border-l-4 border-skyblue"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-skyblue/10 p-3 rounded-full">
                    <HiCursorClick className="h-6 w-6 text-skyblue" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Total Clicks
                  </span>
                </div>
                <div className="text-3xl font-bold text-oxford">
                  {data.totalClicks}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow border-l-4 border-oxford"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-oxford/10 p-3 rounded-full">
                    <HiChartBar className="h-6 w-6 text-oxford" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Total Responses
                  </span>
                </div>
                <div className="text-3xl font-bold text-oxford">
                  {data.totalResponses}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <HiCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Completion Rate
                  </span>
                </div>
                <div className="text-3xl font-bold text-oxford">
                  {data.completionRate}%
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {data.completedResponses} completed
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <HiXCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Disqualified
                  </span>
                </div>
                <div className="text-3xl font-bold text-oxford">
                  {data.disqualifiedResponses}
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-oxford">
                  Recent Activity
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Respondent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.recentResponses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No responses yet
                        </td>
                      </tr>
                    ) : (
                      data.recentResponses.map((response) => (
                        <tr key={response.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(response.submitted_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {response.respondent_email || "Anonymous"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                response.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {response.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FormAnalytics;
