import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "devign";
import type { DevignFXLicense, DevignFXActivationLog } from "../../types/devignfx";
import {
  subscribeLicenses,
  createLicense,
  updateLicense,
  deleteLicense,
  revokeLicense,
  suspendLicense,
  reactivateLicense,
  unbindMachine,
  getActivationLog,
} from "../../lib/devignfx-licenses";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/20 text-green-300",
  revoked: "bg-red-500/20 text-red-300",
  suspended: "bg-yellow-500/20 text-yellow-300",
  expired: "bg-gray-500/20 text-gray-400",
};

const TIER_COLORS: Record<string, string> = {
  standard: "bg-blue-500/20 text-blue-300",
  premium: "bg-purple-500/20 text-purple-300",
  enterprise: "bg-amber-500/20 text-amber-300",
};

const DevignFXAdmin: React.FC = () => {
  const [licenses, setLicenses] = useState<DevignFXLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editLicense, setEditLicense] = useState<DevignFXLicense | null>(null);
  const [showLog, setShowLog] = useState<string | null>(null);
  const [logEntries, setLogEntries] = useState<DevignFXActivationLog[]>([]);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  useEffect(() => {
    const ch = subscribeLicenses((data) => {
      setLicenses(data);
      setLoading(false);
    });
    return () => { ch.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (showLog) {
      getActivationLog(showLog).then(setLogEntries);
    }
  }, [showLog]);

  const filtered = licenses.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.license_key.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: licenses.length,
    active: licenses.filter((l) => l.status === "active").length,
    revoked: licenses.filter((l) => l.status === "revoked").length,
    revenue: licenses.reduce((sum, l) => sum + (l.amount_paid || 0), 0),
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">DevignFX <span className="text-emerald-400">Licenses</span></h1>
            <p className="text-gray-400 mt-1">Manage trading bot licenses, activations, and client access.</p>
          </div>
          <button
            onClick={() => { setEditLicense(null); setShowModal(true); }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Create License
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "Active", value: stats.active, color: "text-green-400" },
            { label: "Revoked", value: stats.revoked, color: "text-red-400" },
            { label: "Revenue", value: `₦${stats.revenue.toLocaleString()}`, color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0a1a0a] border border-emerald-500/10 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by key, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-[#0a1a0a] border border-emerald-500/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/30"
          />
          <div className="flex gap-2">
            {["all", "active", "revoked", "suspended", "expired"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === s
                    ? "bg-emerald-500 text-white"
                    : "bg-[#0a1a0a] border border-emerald-500/10 text-gray-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No licenses found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-emerald-500/10">
                  <th className="pb-3 pr-4">Key</th>
                  <th className="pb-3 pr-4">Client</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Tier</th>
                  <th className="pb-3 pr-4">Machine</th>
                  <th className="pb-3 pr-4">Expires</th>
                  <th className="pb-3 pr-4">Last Check</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-emerald-500/10/50 hover:bg-[#0a1a0a]/50">
                    <td className="py-3 pr-4">
                      <span className="font-mono text-white text-xs">{l.license_key}</span>
                      {l.build_id && (
                        <span className="block text-[10px] text-gray-600 mt-0.5">{l.build_id}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-white text-sm">{l.name || "—"}</span>
                      {l.email && (
                        <span className="block text-[10px] text-gray-500">{l.email}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[l.status]}`}>
                        {l.status}
                      </span>
                      {l.silent_kill && (
                        <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] bg-red-900/30 text-red-400">silent</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${TIER_COLORS[l.tier]}`}>
                        {l.tier}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {l.machine ? (
                        <span className="font-mono text-[10px] text-gray-500">{l.machine}</span>
                      ) : (
                        <span className="text-[10px] text-gray-600">unbound</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-500">
                      {l.expires || "never"}
                    </td>
                    <td className="py-3 pr-4 text-[10px] text-gray-600">
                      {l.last_check_at
                        ? new Date(l.last_check_at).toLocaleString()
                        : "never"}
                    </td>
                    <td className="py-3 relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === l.id ? null : l.id)}
                        className="px-2 py-1 text-gray-400 hover:text-white transition-colors text-xs"
                      >
                        ···
                      </button>
                      {actionMenu === l.id && (
                        <div className="absolute right-0 top-full mt-1 bg-[#0a1a0a] border border-emerald-500/10 rounded-lg shadow-xl z-50 min-w-[160px]">
                          <button
                            onClick={() => { setEditLicense(l); setShowModal(true); setActionMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-emerald-500/5 hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => { setShowLog(l.license_key); setActionMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-emerald-500/5 hover:text-white"
                          >
                            View Log
                          </button>
                          {l.status === "active" && (
                            <>
                              <button
                                onClick={async () => { await suspendLicense(l.id, "Suspended by admin"); setActionMenu(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-emerald-500/5"
                              >
                                Suspend
                              </button>
                              <button
                                onClick={async () => { await revokeLicense(l.id, false, "Revoked by admin"); setActionMenu(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-emerald-500/5"
                              >
                                Revoke
                              </button>
                              <button
                                onClick={async () => { await revokeLicense(l.id, true); setActionMenu(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-emerald-500/5"
                              >
                                Silent Kill
                              </button>
                            </>
                          )}
                          {(l.status === "revoked" || l.status === "suspended") && (
                            <button
                              onClick={async () => { await reactivateLicense(l.id); setActionMenu(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-emerald-500/5"
                            >
                              Reactivate
                            </button>
                          )}
                          {l.machine && (
                            <button
                              onClick={async () => {
                                if (confirm("Unbind machine? Client will need to re-activate.")) {
                                  await unbindMachine(l.id);
                                  setActionMenu(null);
                                }
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-emerald-500/5"
                            >
                              Unbind Machine
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (confirm(`Delete license ${l.license_key}? This cannot be undone.`)) {
                                await deleteLicense(l.id);
                                setActionMenu(null);
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-emerald-500/5"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <LicenseModal
            license={editLicense}
            onClose={() => { setShowModal(false); setEditLicense(null); }}
          />
        )}

        {/* Activation Log Modal */}
        <Dialog open={!!showLog} onOpenChange={(v) => { if (!v) setShowLog(null); }}>
          <DialogContent className="!bg-gradient-to-br !from-[#0f1f0f] !via-[#0a1a0a] !to-[#0f1f0f] !border-emerald-500/10 !text-white sm:!max-w-2xl !max-h-[90vh] !overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                Activation Log — <span className="font-mono text-sm text-gray-400">{showLog}</span>
              </DialogTitle>
              <DialogDescription className="text-gray-400">View activation and event history for this license.</DialogDescription>
            </DialogHeader>
            <div className="py-2">
              {logEntries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No log entries yet.</p>
              ) : (
                <div className="space-y-3">
                  {logEntries.map((entry) => (
                    <div key={entry.id} className="bg-[#0a1a0a]/50 border border-emerald-500/10/50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          entry.event === "bind_machine" ? "bg-green-500/20 text-green-300" :
                          entry.event === "device_conflict" ? "bg-red-500/20 text-red-300" :
                          entry.event === "purchase" ? "bg-purple-500/20 text-purple-300" :
                          entry.event === "download" ? "bg-blue-500/20 text-blue-300" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {entry.event}
                        </span>
                        <span className="text-[10px] text-gray-600">
                          {new Date(entry.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        {entry.machine && <p>Machine: <span className="font-mono">{entry.machine}</span></p>}
                        {entry.ip_address && <p>IP: {entry.ip_address}</p>}
                        {Object.keys(entry.details).length > 0 && (
                          <pre className="text-[10px] text-gray-600 mt-1 overflow-x-auto">
                            {JSON.stringify(entry.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

// ────────────────────────────────────────────────────────────
// Create / Edit Modal
// ────────────────────────────────────────────────────────────

interface LicenseModalProps {
  license: DevignFXLicense | null;
  onClose: () => void;
}

const LicenseModal: React.FC<LicenseModalProps> = ({ license, onClose }) => {
  const [form, setForm] = useState({
    license_key: license?.license_key || "",
    name: license?.name || "",
    email: license?.email || "",
    status: license?.status || "active",
    tier: license?.tier || "standard",
    expires: license?.expires || "",
    max_days: license?.max_days?.toString() || "",
    max_profit_pct: license?.max_profit_pct?.toString() || "",
    silent_kill: license?.silent_kill || false,
    message: license?.message || "",
    build_id: license?.build_id || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        status: form.status,
        tier: form.tier,
        expires: form.expires || null,
        max_days: form.max_days ? parseInt(form.max_days) : null,
        max_profit_pct: form.max_profit_pct ? parseFloat(form.max_profit_pct) : null,
        silent_kill: form.silent_kill,
        message: form.message,
        build_id: form.build_id || null,
      };

      if (license) {
        await updateLicense(license.id, payload as any);
      } else {
        if (form.license_key) {
          payload.license_key = form.license_key;
        }
        await createLicense(payload as any);
      }
      onClose();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <Dialog open={true} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="!bg-gradient-to-br !from-[#0f1f0f] !via-[#0a1a0a] !to-[#0f1f0f] !border-emerald-500/10 !text-white sm:!max-w-lg !max-h-[90vh] !overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {license ? "Edit License" : "Create License"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {license ? "Update the license details below." : "Fill in the details to create a new license."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!license && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">License Key (leave blank to auto-generate)</label>
              <input
                type="text"
                value={form.license_key}
                onChange={(e) => set("license_key", e.target.value.toUpperCase())}
                placeholder="DEVFX-XXXXXXXXXXXX"
                className="w-full px-3 py-2 bg-[#0a1a0a]border border-emerald-500/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-emerald-500/30"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Client Name</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full px-3 py-2 bg-[#0a1a0a]border border-emerald-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/30" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full px-3 py-2 bg-[#0a1a0a]border border-emerald-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/30" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full px-3 py-2 bg-[#0a1a0a]border border-emerald-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/30">
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="revoked">Revoked</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tier</label>
              <select value={form.tier} onChange={(e) => set("tier", e.target.value)} className="w-full px-3 py-2 bg-[#0a1a0a]border border-emerald-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/30">
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Expires (date)</label>
              <input type="date" value={form.expires} onChange={(e) => set("expires", e.target.value)} className="w-full px-3 py-2 bg-[#0a1a0a]border border-emerald-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/30" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Days</label>
              <input type="number" value={form.max_days} onChange={(e) => set("max_days", e.target.value)} placeholder="∞" className="w-full px-3 py-2 bg-[#0a1a0a]border border-emerald-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/30" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Profit Cap %</label>
              <input type="number" value={form.max_profit_pct} onChange={(e) => set("max_profit_pct", e.target.value)} placeholder="∞" className="w-full px-3 py-2 bg-[#0a1a0a]border border-emerald-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/30" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Build ID</label>
            <input type="text" value={form.build_id} onChange={(e) => set("build_id", e.target.value)} placeholder="BLD-XXXXXXXX" className="w-full px-3 py-2 bg-[#0a1a0a]border border-emerald-500/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-emerald-500/30" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Custom Denial Message</label>
            <input type="text" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Leave blank for default" className="w-full px-3 py-2 bg-[#0a1a0a]border border-emerald-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/30" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.silent_kill} onChange={(e) => set("silent_kill", e.target.checked)} className="w-4 h-4 accent-red-500" />
            <span className="text-sm text-gray-300">Silent Kill — show generic error instead of "revoked"</span>
          </label>

          <DialogFooter className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-emerald-500/10 text-gray-400 rounded-lg text-sm hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? "Saving..." : license ? "Update" : "Create"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DevignFXAdmin;
