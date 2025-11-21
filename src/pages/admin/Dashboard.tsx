import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Link } from "react-router-dom";
import {
  HiAcademicCap,
  HiClipboardList,
  HiMail,
  HiDocumentText,
} from "react-icons/hi";

const AdminDashboard: React.FC = () => {
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
        <div>
          <h1 className="text-3xl font-bold text-oxford mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to the GR8QM Admin Dashboard</p>
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

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-skyblue/20 to-iceblue/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-oxford mb-2">
              Getting Started
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Create your first course in the Courses section</li>
              <li>• Monitor applications as students enroll</li>
              <li>• Review service requests from clients</li>
              <li>• Respond to contact messages</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange/20 to-skyblue/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-oxford mb-2">
              Important Notes
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• All course changes reflect immediately on the website</li>
              <li>• Students pay commitment fees via Paystack</li>
              <li>• Remember to open/close applications as needed</li>
              <li>• Check the Transactions page for payment tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
