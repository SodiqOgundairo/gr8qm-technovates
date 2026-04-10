import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalRevenue: 0,
    pendingRequests: 0,
    unreadMessages: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        { count: applicationsCount },
        { data: transactionsData },
        { count: requestsCount },
        { count: messagesCount },
        { data: recentTx },
      ] = await Promise.all([
        supabase.from("course_applications").select("*", { count: "exact", head: true }),
        supabase.from("transactions").select("amount, status"),
        supabase.from("service_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      const revenue =
        transactionsData
          ?.filter((t) => t.status === "success")
          .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      setStats({
        totalApplications: applicationsCount || 0,
        totalRevenue: revenue,
        pendingRequests: requestsCount || 0,
        unreadMessages: messagesCount || 0,
      });
      setRecentTransactions(recentTx || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

  const statCards = [
    { label: "Applications", value: stats.totalApplications, color: "#3b82f6" },
    { label: "Revenue", value: fmt(stats.totalRevenue), color: "#22c55e" },
    { label: "Pending Requests", value: stats.pendingRequests, color: "#f59e0b" },
    { label: "Messages", value: stats.unreadMessages, color: "#8b5cf6" },
  ];

  const quickActions = [
    { name: "Courses", path: "/admin/courses" },
    { name: "Applications", path: "/admin/applications" },
    { name: "Service Requests", path: "/admin/service-requests" },
    { name: "Analytics", path: "/admin/analytics" },
    { name: "Blog", path: "/admin/blog" },
    { name: "Messages", path: "/admin/messages" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="flex flex-col gap-8">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-400 mt-1">Here's what's happening with your business.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="relative bg-white rounded-2xl p-6 overflow-hidden"
            >
              <div
                className="absolute top-6 right-6 w-2 h-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <p className="text-[11px] uppercase tracking-wider font-medium text-gray-400">
                {s.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2 leading-none">
                {loading ? (
                  <span className="inline-block w-20 h-8 bg-gray-100 rounded animate-pulse" />
                ) : (
                  s.value
                )}
              </p>
              {/* Subtle background accent */}
              <div
                className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-[0.06]"
                style={{ backgroundColor: s.color }}
              />
            </motion.div>
          ))}
        </div>

        {/* Two-column: Transactions + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-semibold text-gray-900">Recent Transactions</h3>
              <Link
                to="/admin/transactions"
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                    <th className="text-left pb-4">Reference</th>
                    <th className="text-left pb-4">Customer</th>
                    <th className="text-right pb-4">Amount</th>
                    <th className="text-right pb-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-sm text-gray-300">
                        Loading...
                      </td>
                    </tr>
                  ) : recentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-sm text-gray-300">
                        No transactions yet
                      </td>
                    </tr>
                  ) : (
                    recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-t border-gray-100 text-sm">
                        <td className="py-4 font-mono text-xs text-gray-400">
                          {tx.reference?.slice(0, 12) || "—"}
                        </td>
                        <td className="py-4 text-gray-700">
                          {tx.customer_name || tx.customer_email || "—"}
                        </td>
                        <td className="py-4 text-right font-medium text-gray-900">
                          {fmt(tx.amount)}
                        </td>
                        <td className="py-4 text-right">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              tx.status === "success"
                                ? "bg-green-50 text-green-600"
                                : tx.status === "pending"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-red-50 text-red-600"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-2xl p-6"
          >
            <h3 className="text-[15px] font-semibold text-gray-900 mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((a) => (
                <Link
                  key={a.path}
                  to={a.path}
                  className="flex items-center justify-center p-4 rounded-xl bg-[#f8f9fb] hover:bg-gray-100 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors text-center"
                >
                  {a.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
