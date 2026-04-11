import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { ROLE_LABELS } from "../../types/permissions";
import type { AdminModule } from "../../types/permissions";
import { XIcon } from "../icons";

interface AdminSidebarProps {
  onClose?: () => void;
}

interface NavSection {
  label: string;
  items: { name: string; path: string; module: AdminModule }[];
}

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", path: "/admin/dashboard", module: "dashboard" },
      { name: "Analytics", path: "/admin/analytics", module: "analytics" },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Courses", path: "/admin/courses", module: "courses" },
      { name: "Blog", path: "/admin/blog", module: "blog" },
      { name: "Portfolio", path: "/admin/portfolio", module: "portfolio" },
      { name: "Glossary", path: "/admin/glossary", module: "glossary" },
      { name: "Certificates", path: "/admin/certificates", module: "certificates" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { name: "Email Marketing", path: "/admin/email-marketing", module: "email_marketing" },
      { name: "Coupons", path: "/admin/coupons", module: "coupons" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { name: "Applications", path: "/admin/applications", module: "applications" },
      { name: "Forms", path: "/admin/forms", module: "forms" },
      { name: "Events", path: "/admin/events", module: "events" },
      { name: "Messages", path: "/admin/messages", module: "messages" },
      { name: "Service Requests", path: "/admin/service-requests", module: "service_requests" },
    ],
  },
  {
    label: "DevignFX",
    items: [
      { name: "Licenses", path: "/admin/devignfx", module: "devignfx" },
      { name: "Transactions", path: "/admin/devignfx/transactions", module: "devignfx" },
      { name: "Coupons", path: "/admin/devignfx/coupons", module: "devignfx" },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Invoices", path: "/admin/invoices", module: "invoices" },
      { name: "Transactions", path: "/admin/transactions", module: "transactions" },
      { name: "Job Postings", path: "/admin/jobs", module: "jobs" },
      { name: "Settings", path: "/admin/settings", module: "settings" },
    ],
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const { profile, can, signOut } = useAuth();
  const navigate = useNavigate();
  const roleInfo = profile ? ROLE_LABELS[profile.role] : null;

  const canView = (module: AdminModule) => (profile ? can(module, "read") : true);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="h-full bg-[#0f1729] flex flex-col">
      {/* Header */}
      <div className="h-[64px] flex items-center justify-between px-5 border-b border-white/5">
        <span className="text-[15px] font-bold text-white tracking-tight">
          GR8QM <span className="text-[#0098da]">Admin</span>
        </span>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
            <XIcon size={18} />
          </button>
        )}
      </div>

      {/* User */}
      {profile && (
        <div className="px-5 py-3 border-b border-white/5">
          <p className="text-white/80 text-sm font-medium truncate">{profile.display_name}</p>
          <p className="text-white/30 text-[11px] truncate">{profile.email}</p>
          {roleInfo && (
            <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {sections.map((section) => {
          const visible = section.items.filter((i) => canView(i.module));
          if (visible.length === 0) return null;
          const isDevignFX = section.label === "DevignFX";
          return (
            <div key={section.label}>
              <p className={`text-[10px] uppercase tracking-[0.15em] font-semibold px-3 mb-1 ${
                isDevignFX ? "text-emerald-500/50" : "text-white/20"
              }`}>
                {section.label}
              </p>
              <div className="space-y-0.5">
                {visible.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin/devignfx"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-[13px] transition-colors ${
                        isActive
                          ? isDevignFX
                            ? "bg-emerald-500/10 text-emerald-400 font-medium"
                            : "bg-[#0098da]/10 text-[#0098da] font-medium"
                          : "text-white/50 hover:text-white/80 hover:bg-white/5"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5 space-y-2">
        <NavLink
          to="/"
          className="block text-[13px] text-white/30 hover:text-white/60 transition-colors"
        >
          Back to website
        </NavLink>
        <button
          onClick={handleSignOut}
          className="block text-[13px] text-white/20 hover:text-red-400 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
