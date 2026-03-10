import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DashboardIcon,
  ClipboardCheckIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  ClipboardListIcon,
  FileTextIcon,
  BookIcon,
  MailIcon,
  CreditCardIcon,
  ImageIcon,
  DollarIcon,
  XIcon,
} from "../icons";

interface AdminSidebarProps {
  onClose?: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.FC<{ size?: number }>;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: DashboardIcon },
  { name: "Forms", path: "/admin/forms", icon: ClipboardCheckIcon },
  { name: "Job Postings", path: "/admin/jobs", icon: BriefcaseIcon },
  { name: "Courses", path: "/admin/courses", icon: GraduationCapIcon },
  { name: "Applications", path: "/admin/applications", icon: ClipboardListIcon },
  {
    name: "Service Requests",
    path: "/admin/service-requests",
    icon: FileTextIcon,
  },
  { name: "Blog", path: "/admin/blog", icon: BookIcon },
  { name: "Messages", path: "/admin/messages", icon: MailIcon },
  { name: "Invoices", path: "/admin/invoices", icon: CreditCardIcon },
  { name: "Portfolio", path: "/admin/portfolio", icon: ImageIcon },
  { name: "Transactions", path: "/admin/transactions", icon: DollarIcon },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  return (
    <div className="h-full bg-oxford flex flex-col">
      {/* Logo/Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black text-white">
            GR8QM <span className="text-skyblue">Admin</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:text-skyblue"
          >
            <XIcon size={24} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <div className="space-y-1 px-3">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-skyblue text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {() => (
                <motion.div
                  className="flex items-center gap-3 w-full"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/10">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-sm">&larr; Back to Website</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
