import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Clock, Trash2, ChevronDown } from "lucide-react";
import { useAuth, fetchAdminProfiles, updateAdminRole, deleteAdminProfile } from "../../lib/auth";
import type { AdminProfile } from "../../types/permissions";
import { ROLE_LABELS } from "../../types/permissions";
import type { AdminRole } from "../../types/permissions";
import AdminLayout from "../../components/admin/AdminLayout";

export default function Settings() {
  const { profile: currentProfile, can } = useAuth();
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const isSuperAdmin = currentProfile?.role === "super_admin";

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await fetchAdminProfiles();
      setProfiles(data);
    } catch (err) {
      console.error("Failed to load admin profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (profileId: string, newRole: AdminRole) => {
    try {
      await updateAdminRole(profileId, newRole);
      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, role: newRole } : p))
      );
      setEditingRole(null);
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleDelete = async (profileId: string, displayName: string) => {
    if (!confirm(`Remove "${displayName}" from admin access? This cannot be undone.`)) return;
    try {
      await deleteAdminProfile(profileId);
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    } catch (err) {
      console.error("Failed to delete profile:", err);
    }
  };

  const formatLastActive = (date: string | null) => {
    if (!date) return "Never";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <AdminLayout title="Settings" subtitle="Manage admin roles and permissions">
      {/* Role legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {(Object.entries(ROLE_LABELS) as [AdminRole, typeof ROLE_LABELS[AdminRole]][]).map(
          ([role, info]) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-gray-400" />
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${info.color}`}>
                  {info.label}
                </span>
              </div>
              <p className="text-sm text-gray-500">{info.description}</p>
            </motion.div>
          )
        )}
      </div>

      {/* Admin list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users size={18} className="text-gray-400" />
          <h2 className="font-semibold text-gray-900">Admin Users</h2>
          <span className="text-xs text-gray-400 ml-auto">{profiles.length} users</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-skyblue mx-auto mb-3" />
            Loading...
          </div>
        ) : profiles.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No admin profiles found.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {profiles.map((p) => {
              const roleInfo = ROLE_LABELS[p.role];
              const isCurrentUser = p.id === currentProfile?.id;
              const canEdit = isSuperAdmin && !isCurrentUser;

              return (
                <div key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">
                    {p.display_name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{p.display_name}</p>
                      {isCurrentUser && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-skyblue/10 text-skyblue rounded font-medium">You</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{p.email}</p>
                  </div>

                  {/* Role badge / selector */}
                  <div className="relative">
                    {canEdit && editingRole === p.id ? (
                      <div className="flex gap-1">
                        {(["super_admin", "admin", "viewer"] as AdminRole[]).map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(p.id, role)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                              p.role === role
                                ? ROLE_LABELS[role].color + " ring-2 ring-skyblue"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {ROLE_LABELS[role].label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => canEdit && setEditingRole(p.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${roleInfo.color} ${canEdit ? "cursor-pointer hover:ring-2 hover:ring-skyblue/30" : ""}`}
                        disabled={!canEdit}
                      >
                        {roleInfo.label}
                        {canEdit && <ChevronDown size={12} />}
                      </button>
                    )}
                  </div>

                  {/* Last active */}
                  <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 w-24 justify-end">
                    <Clock size={12} />
                    {formatLastActive(p.last_active_at)}
                  </div>

                  {/* Delete */}
                  {canEdit && (
                    <button
                      onClick={() => handleDelete(p.id, p.display_name)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      title="Remove admin access"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!can("settings", "update") && (
        <p className="text-sm text-gray-400 mt-4 text-center">
          Only super admins can modify roles and permissions.
        </p>
      )}
    </AdminLayout>
  );
}
