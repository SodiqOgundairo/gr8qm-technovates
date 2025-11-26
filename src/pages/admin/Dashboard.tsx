import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import {
  HiAcademicCap,
  HiClipboardList,
  HiMail,
  HiDocumentText,
  HiCurrencyDollar,
  HiUserGroup,
} from "react-icons/hi";

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

      // Fetch stats in parallel
      const [
        { count: applicationsCount },
        { data: transactionsData },
        { count: requestsCount },
        { count: messagesCount },
        { data: recentTx },
      ] = await Promise.all([
        supabase
          .from("course_applications")
          .select("*", { count: "exact", head: true }),
        supabase.from("transactions").select("amount, status"),
        supabase
          .from("service_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("contact_messages")
          .select("*", { count: "exact", head: true })
          .eq("read", false),
        supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      // Calculate total revenue from successful transactions
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const quickActions = [
    {
      name: "Manage Courses",
      description: "Create, edit, and manage training courses",
      icon: HiAcademicCap,
      path: "/admin/courses",
      color: "bg-skyblue",
    },
    {
      name: "View Applications",
      description: "Review course applications and payments",
      icon: HiClipboardList,
      path: "/admin/applications",
      color: "bg-orange",
    },
    {
      name: "Service Requests",
      description: "Manage design & print service requests",
      icon: HiDocumentText,
      path: "/admin/service-requests",
      color: "bg-iceblue",
    },
    {
      name: "Messages",
      description: "View contact form submissions",
      icon: HiMail,
      path: "/admin/messages",
      color: "bg-oxford",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-oxford mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome to the GR8QM Admin Dashboard
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-skyblue">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-skyblue/10 p-3 rounded-full">
                <HiUserGroup className="h-6 w-6 text-skyblue" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Total Applications
              </span>
            </div>
            <div className="text-2xl font-bold text-oxford">
              {loading ? "..." : stats.totalApplications}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <HiCurrencyDollar className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Total Revenue
              </span>
            </div>
            <div className="text-2xl font-bold text-oxford">
              {loading ? "..." : formatCurrency(stats.totalRevenue)}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange/10 p-3 rounded-full">
                <HiDocumentText className="h-6 w-6 text-orange" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Pending Requests
              </span>
            </div>
            <div className="text-2xl font-bold text-oxford">
              {loading ? "..." : stats.pendingRequests}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-oxford">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-oxford/10 p-3 rounded-full">
                <HiMail className="h-6 w-6 text-oxford" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Unread Messages
              </span>
            </div>
            <div className="text-2xl font-bold text-oxford">
              {loading ? "..." : stats.unreadMessages}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-xl font-semibold text-oxford mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="bg-white rounded-lg p-6 shadow hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-oxford mb-2 group-hover:text-skyblue transition-colors">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Transactions & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-oxford">
                Recent Transactions
              </h3>
              <Link
                to="/admin/transactions"
                className="text-sm text-skyblue hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : recentTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-gray-500"
                      >
                        No recent transactions
                      </td>
                    </tr>
                  ) : (
                    recentTransactions.map((tx) => (
                      <tr key={tx.id} className="text-sm">
                        <td className="py-3 font-mono text-gray-600">
                          {tx.reference.substring(0, 8)}...
                        </td>
                        <td className="py-3 text-gray-800">
                          {tx.customer_name || tx.customer_email}
                        </td>
                        <td className="py-3 font-medium text-oxford">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              tx.status === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
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
          </div>

          {/* Info Card */}
          <div className="bg-linear-to-br from-skyblue/20 to-iceblue/20 rounded-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-oxford mb-4">
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Database</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment Gateway</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Email Service</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active
                </span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-xs text-gray-500">
                Need help? Contact support at <br />
                <a
                  href="mailto:support@gr8qm.com"
                  className="text-skyblue hover:underline"
                >
                  support@gr8qm.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
