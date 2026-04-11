import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "devign";
import { supabase } from "../../../utils/supabase";
import { Upload, Trash2, Download, Package, HardDrive, Clock, AlertCircle, Rocket, Archive, Globe, Tag } from "lucide-react";
import type { DevignFXBuild } from "../../../types/devignfx";

const BUCKET = "devignfx-builds";
const TIERS = ["standard", "premium", "enterprise", "root"] as const;
type Tier = (typeof TIERS)[number];

const DevignFXBuilds: React.FC = () => {
  const [builds, setBuilds] = useState<DevignFXBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);

  const fetchBuilds = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("devignfx_builds")
      .select("*")
      .order("created_at", { ascending: false });
    setBuilds((data as DevignFXBuild[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBuilds(); }, [fetchBuilds]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("devignfx-builds-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "devignfx_builds" }, () => {
        fetchBuilds();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchBuilds]);

  const handlePublish = async (build: DevignFXBuild) => {
    if (!confirm(`Publish ${build.build_id} (v${build.version} ${build.channel})?\n\nThis will archive the current ${build.tier} ${build.channel} build and email all active license holders.`)) return;
    setPublishing(build.build_id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch("/api/devignfx/publish-build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ buildId: build.build_id, notify: true }),
      });
      const result = await resp.json();
      if (!resp.ok) alert(result.error || "Publish failed");
      else alert(`Published! ${result.notified} users notified.`);
    } catch (err: any) {
      alert(err.message || "Publish failed");
    }
    setPublishing(null);
    fetchBuilds();
  };

  const handleArchive = async (build: DevignFXBuild) => {
    if (!confirm(`Archive ${build.build_id}?`)) return;
    await supabase
      .from("devignfx_builds")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("build_id", build.build_id);
    fetchBuilds();
  };

  const handleDelete = async (build: DevignFXBuild) => {
    if (!confirm(`Permanently delete ${build.build_id}? This removes the file from storage.`)) return;
    await supabase.storage.from(BUCKET).remove([build.storage_path, build.storage_path + ".sig"]);
    await supabase.from("devignfx_builds").delete().eq("build_id", build.build_id);
    fetchBuilds();
  };

  const handleDownload = async (build: DevignFXBuild) => {
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(build.storage_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const tierColor = (tier: string) => {
    switch (tier) {
      case "standard": return "bg-emerald-500/20 text-emerald-300";
      case "premium": return "bg-amber-500/20 text-amber-300";
      case "enterprise": return "bg-purple-500/20 text-purple-300";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500/20 text-green-300";
      case "draft": return "bg-blue-500/20 text-blue-300";
      case "archived": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const channelColor = (channel: string) =>
    channel === "beta" ? "bg-orange-500/20 text-orange-300" : "bg-emerald-500/20 text-emerald-300";

  const published = builds.filter(b => b.status === "published");
  const drafts = builds.filter(b => b.status === "draft");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              DevignFX <span className="text-emerald-400">Builds</span>
            </h1>
            <p className="text-gray-400 mt-1">
              Upload, sign, publish builds. Customers get notified on publish.
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Upload size={16} /> Upload Build
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: builds.length, color: "text-emerald-400", icon: Package },
            { label: "Published", value: published.length, color: "text-green-400", icon: Globe },
            { label: "Drafts", value: drafts.length, color: "text-blue-400", icon: Tag },
            { label: "Archived", value: builds.filter(b => b.status === "archived").length, color: "text-gray-400", icon: Archive },
          ].map((s) => (
            <div key={s.label} className="bg-[#0a1a0a] border border-emerald-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs uppercase mb-1">
                <s.icon size={12} /> {s.label}
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Build list */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : builds.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No builds uploaded yet</p>
            <p className="text-sm mt-1">Upload a .zip file to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {builds.map((b) => (
              <div
                key={b.build_id}
                className="bg-[#0a1a0a] border border-emerald-500/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Package size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-white font-medium">{b.build_id}</span>
                    <span className="text-gray-500 text-sm">v{b.version}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${channelColor(b.channel)}`}>
                      {b.channel}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tierColor(b.tier)}`}>
                      {b.tier}
                    </span>
                    {b.signed && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">signed</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <HardDrive size={10} /> {formatSize(b.file_size)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {b.created_at ? new Date(b.created_at).toLocaleString() : "—"}
                    </span>
                    {b.published_at && (
                      <span className="text-green-400 flex items-center gap-1">
                        <Rocket size={10} /> Published {new Date(b.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {b.release_notes && (
                    <p className="text-gray-500 text-xs mt-1 truncate max-w-md">{b.release_notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {b.status === "draft" && (
                    <button
                      onClick={() => handlePublish(b)}
                      disabled={publishing === b.build_id}
                      className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <Rocket size={14} /> {publishing === b.build_id ? "..." : "Publish"}
                    </button>
                  )}
                  {b.status === "published" && (
                    <button
                      onClick={() => handleArchive(b)}
                      className="px-3 py-1.5 bg-gray-500/20 text-gray-400 rounded text-xs hover:bg-gray-500/30 transition-colors flex items-center gap-1"
                    >
                      <Archive size={14} /> Archive
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(b)}
                    className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded text-xs hover:bg-emerald-500/30 transition-colors"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(b)}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={() => { setShowUpload(false); fetchBuilds(); }}
        />
      )}
    </AdminLayout>
  );
};

// ═══════════════════════════════════════════════════════════
// UPLOAD MODAL — direct browser → Supabase Storage (no size limit)
// ═══════════════════════════════════════════════════════════

const UploadModal: React.FC<{
  onClose: () => void;
  onUploaded: () => void;
}> = ({ onClose, onUploaded }) => {
  const [tier, setTier] = useState<Tier>("standard");
  const [channel, setChannel] = useState<"stable" | "beta">("stable");
  const [version, setVersion] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    if (!file.name.endsWith(".zip")) {
      setError("Only .zip files are accepted.");
      return;
    }
    if (!version.trim()) {
      setError("Version is required (e.g. 1.0.0).");
      return;
    }

    setUploading(true);
    setError("");
    setProgress("Uploading to storage...");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError("Not authenticated. Please refresh.");
        setUploading(false);
        setProgress("");
        return;
      }

      // Step 1: Upload directly to Supabase Storage (no Vercel body limit)
      const tempName = `_temp_${Date.now()}_${file.name}`;
      const storagePath = tier === "root" ? tempName : `${tier}/${tempName}`;

      const { error: storageErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file, {
          contentType: "application/zip",
          upsert: true,
        });

      if (storageErr) {
        setError(`Storage upload failed: ${storageErr.message}`);
        setUploading(false);
        setProgress("");
        return;
      }

      setProgress("Signing & registering build...");

      // Step 2: Call lightweight API to sign + register metadata
      const resp = await fetch("/api/devignfx/register-build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          storagePath,
          tier,
          version: version.trim(),
          channel,
          releaseNotes: releaseNotes.trim(),
          fileSize: file.size,
        }),
      });

      const text = await resp.text();
      let result: any;
      try {
        result = JSON.parse(text);
      } catch {
        setError(`Server error (${resp.status}): ${text.slice(0, 200)}`);
        setUploading(false);
        setProgress("");
        return;
      }

      if (!resp.ok) {
        setError(result.error || "Registration failed");
        setUploading(false);
        setProgress("");
        return;
      }

      setProgress(
        `Done! ${result.build.build_id} v${version}` +
        (result.build.signed ? " (signed)" : " (unsigned)") +
        " — status: draft"
      );
      setTimeout(onUploaded, 1500);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setUploading(false);
      setProgress("");
    }
  };

  const inputCls = "w-full bg-[#0a1a0a] border border-emerald-500/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/30";

  return (
    <Dialog open={true} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="!bg-gradient-to-br !from-[#0f1f0f] !via-[#0a1a0a] !to-[#0f1f0f] !border-emerald-500/10 !text-white sm:!max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Upload Build</DialogTitle>
          <DialogDescription className="text-gray-400">
            Uploads directly to storage (no size limit). Build is registered as draft — publish when ready.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Version *</label>
              <input
                type="text"
                placeholder="1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Channel</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value as "stable" | "beta")} className={inputCls}>
                <option value="stable">Stable</option>
                <option value="beta">Beta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Target Tier</label>
            <select value={tier} onChange={(e) => setTier(e.target.value as Tier)} className={inputCls}>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
              <option value="root">Root (all tiers)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Release Notes</label>
            <textarea
              rows={3}
              placeholder="What's new in this build..."
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              className={inputCls + " resize-none"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bot File (.zip) *</label>
            <div className="relative">
              <input
                type="file"
                accept=".zip"
                onChange={(e) => { setFile(e.target.files?.[0] || null); setError(""); }}
                className={`${inputCls} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:text-emerald-400 file:text-xs file:font-medium file:cursor-pointer`}
              />
            </div>
            {file && (
              <p className="text-emerald-400 text-xs mt-1">
                {file.name} — {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-xs text-gray-400 space-y-1.5">
            <p className="flex items-start gap-2">
              <AlertCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              File uploads directly to Supabase Storage — <strong className="text-emerald-300">no size limit</strong>.
            </p>
            <p className="flex items-start gap-2">
              <AlertCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              Build starts as <strong className="text-emerald-300">draft</strong>. Click Publish to notify users and make it available.
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-sm flex items-center gap-1">
              <AlertCircle size={14} /> {error}
            </p>
          )}

          {progress && !error && (
            <p className="text-emerald-400 text-sm">{progress}</p>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
          <button
            onClick={handleUpload}
            disabled={uploading || !file || !version.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DevignFXBuilds;
