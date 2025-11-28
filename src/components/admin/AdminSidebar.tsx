import React from "react";
import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiAcademicCap,
  HiClipboardList,
  HiMail,
  HiDocumentText,
  HiCreditCard,
  HiPhotograph,
  HiCurrencyDollar,
  HiX,
} from "react-icons/hi";

interface AdminSidebarProps {
  onClose?: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: HiHome },
  { name: "Courses", path: "/admin/courses", icon: HiAcademicCap },
  { name: "Applications", path: "/admin/applications", icon: HiClipboardList },
  {
    name: "Service Requests",
    path: "/admin/service-requests",
    icon: HiDocumentText,
  },
  { name: "Messages", path: "/admin/messages", icon: HiMail },
  { name: "Invoices", path: "/admin/invoices", icon: HiCreditCard },
  { name: "Portfolio", path: "/admin/portfolio", icon: HiPhotograph },
  { name: "Transactions", path: "/admin/transactions", icon: HiCurrencyDollar },
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
            <HiX className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <div className="space-y-1 px-3">
          {navItems.map((item) => (
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
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="font-medium">{item.name}</span>
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
          <span className="text-sm">← Back to Website</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
