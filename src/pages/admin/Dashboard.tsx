import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import {
  GraduationCap,
  ClipboardList,
  Mail,
  FileText,
  DollarSign,
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

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
    { label: "Applications", value: stats.totalApplications, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Revenue", value: fmt(stats.totalRevenue), icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending Requests", value: stats.pendingRequests, icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Messages", value: stats.unreadMessages, icon: Mail, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const quickActions = [
    { name: "Courses", desc: "Manage training courses", icon: GraduationCap, path: "/admin/courses", color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Applications", desc: "Review applications", icon: ClipboardList, path: "/admin/applications", color: "text-green-600", bg: "bg-green-50" },
    { name: "Service Requests", desc: "Design & print requests", icon: FileText, path: "/admin/service-requests", color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Analytics", desc: "Traffic & business data", icon: TrendingUp, path: "/admin/analytics", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 max-w-7xl">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</span>
                <div className={`${s.bg} ${s.color} p-2 rounded-lg`}>
                  <s.icon size={16} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? <span className="inline-block w-16 h-7 bg-gray-100 rounded animate-pulse" /> : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((a) => (
              <Link
                key={a.path}
                to={a.path}
                className="bg-white rounded-xl border border-gray-200 p-5 group hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className={`${a.bg} ${a.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <a.icon size={18} />
                </div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{a.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            <Link to="/admin/transactions" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-medium">Reference</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-right px-5 py-3 font-medium">Amount</th>
                  <th className="text-right px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">Loading...</td></tr>
                ) : recentTransactions.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No transactions yet</td></tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">{tx.reference?.slice(0, 12) || "—"}</td>
                      <td className="px-5 py-3 text-gray-900">{tx.customer_name || tx.customer_email || "—"}</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">{fmt(tx.amount)}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          tx.status === "success" ? "bg-green-50 text-green-700" :
                          tx.status === "pending" ? "bg-amber-50 text-amber-700" :
                          "bg-red-50 text-red-700"
                        }`}>
                          {tx.status}
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
    </AdminLayout>
  );
};

export default AdminDashboard;
