import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../lib/auth";
import { ROLE_LABELS } from "../../types/permissions";
import type { AdminModule } from "../../types/permissions";
import {
  DashboardIcon,
  TrendingUpIcon,
  ClipboardCheckIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  ClipboardListIcon,
  FileTextIcon,
  BookIcon,
  MailIcon,
  SendIcon,
  TrophyIcon,
  CalendarIcon,
  BadgeIcon,
  CreditCardIcon,
  ImageIcon,
  DollarIcon,
  ShieldCheckIcon,
  XIcon,
} from "../icons";

interface AdminSidebarProps {
  onClose?: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.FC<{ size?: number }>;
  module: AdminModule;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: DashboardIcon, module: "dashboard" },
  { name: "Analytics", path: "/admin/analytics", icon: TrendingUpIcon, module: "analytics" },
  { name: "Forms", path: "/admin/forms", icon: ClipboardCheckIcon, module: "forms" },
  { name: "Job Postings", path: "/admin/jobs", icon: BriefcaseIcon, module: "jobs" },
  { name: "Courses", path: "/admin/courses", icon: GraduationCapIcon, module: "courses" },
  { name: "Applications", path: "/admin/applications", icon: ClipboardListIcon, module: "applications" },
  { name: "Service Requests", path: "/admin/service-requests", icon: FileTextIcon, module: "service_requests" },
  { name: "Events", path: "/admin/events", icon: CalendarIcon, module: "events" },
  { name: "Email Marketing", path: "/admin/email-marketing", icon: SendIcon, module: "email_marketing" },
  { name: "Certificates", path: "/admin/certificates", icon: TrophyIcon, module: "certificates" },
  { name: "Blog", path: "/admin/blog", icon: BookIcon, module: "blog" },
  { name: "Messages", path: "/admin/messages", icon: MailIcon, module: "messages" },
  { name: "Coupons", path: "/admin/coupons", icon: BadgeIcon, module: "coupons" },
  { name: "DevignFX", path: "/admin/devignfx", icon: ShieldCheckIcon, module: "devignfx" },
  { name: "Invoices", path: "/admin/invoices", icon: CreditCardIcon, module: "invoices" },
  { name: "Portfolio", path: "/admin/portfolio", icon: ImageIcon, module: "portfolio" },
  { name: "Transactions", path: "/admin/transactions", icon: DollarIcon, module: "transactions" },
  { name: "Glossary", path: "/admin/glossary", icon: BookIcon, module: "glossary" },
  { name: "Settings", path: "/admin/settings", icon: ShieldCheckIcon, module: "settings" },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const { profile, can, signOut } = useAuth();
  const navigate = useNavigate();

  const visibleItems = navItems.filter((item) => can(item.module, "read"));
  const roleInfo = profile ? ROLE_LABELS[profile.role] : null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

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

      {/* User info */}
      {profile && (
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-white text-sm font-medium truncate">{profile.display_name}</p>
          <p className="text-gray-400 text-xs truncate">{profile.email}</p>
          {roleInfo && (
            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <div className="space-y-1 px-3">
          {visibleItems.map((item, index) => (
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
      <div className="p-6 border-t border-white/10 space-y-3">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-sm">&larr; Back to Website</span>
        </NavLink>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-red-400 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
