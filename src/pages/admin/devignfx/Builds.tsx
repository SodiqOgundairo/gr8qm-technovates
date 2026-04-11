import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "devign";
import { supabase } from "../../../utils/supabase";
import { Upload, Trash2, Download, Package, HardDrive, Clock, AlertCircle } from "lucide-react";

const BUCKET = "devignfx-builds";
const TIERS = ["standard", "premium", "enterprise"] as const;
type Tier = (typeof TIERS)[number];

interface BuildFile {
  name: string;
  tier: Tier | "root";
  path: string;
  size: number;
  created_at: string;
}

const DevignFXBuilds: React.FC = () => {
  const [builds, setBuilds] = useState<BuildFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBuilds = useCallback(async () => {
    setLoading(true);
    const all: BuildFile[] = [];

    // Fetch root-level files
    const { data: rootFiles } = await supabase.storage
      .from(BUCKET)
      .list("", { sortBy: { column: "created_at", order: "desc" }, limit: 50 });

    if (rootFiles) {
      for (const f of rootFiles) {
        if (f.name.endsWith(".zip")) {
          all.push({
            name: f.name,
            tier: "root",
            path: f.name,
            size: f.metadata?.size || 0,
            created_at: f.created_at || "",
          });
        }
      }
    }

    // Fetch per-tier files
    for (const tier of TIERS) {
      const { data: files } = await supabase.storage
        .from(BUCKET)
        .list(tier, { sortBy: { column: "created_at", order: "desc" }, limit: 50 });

      if (files) {
        for (const f of files) {
          if (f.name.endsWith(".zip")) {
            all.push({
              name: f.name,
              tier,
              path: `${tier}/${f.name}`,
              size: f.metadata?.size || 0,
              created_at: f.created_at || "",
            });
          }
        }
      }
    }

    // Sort newest first
    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setBuilds(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBuilds();
  }, [fetchBuilds]);

  const handleDelete = async (build: BuildFile) => {
    if (!confirm(`Delete "${build.name}" from ${build.tier}?`)) return;
    setDeleting(build.path);
    const { error } = await supabase.storage.from(BUCKET).remove([build.path]);
    if (error) {
      alert(`Failed to delete: ${error.message}`);
    }
    setDeleting(null);
    fetchBuilds();
  };

  const handleDownload = async (build: BuildFile) => {
    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(build.path, 60);
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              DevignFX <span className="text-emerald-400">Builds</span>
            </h1>
            <p className="text-gray-400 mt-1">
              Upload and manage bot builds. The latest .zip per tier is served to customers.
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
            { label: "Total Builds", value: builds.length, color: "text-emerald-400", icon: Package },
            { label: "Standard", value: builds.filter(b => b.tier === "standard").length, color: "text-emerald-300", icon: HardDrive },
            { label: "Premium", value: builds.filter(b => b.tier === "premium").length, color: "text-amber-400", icon: HardDrive },
            { label: "Enterprise", value: builds.filter(b => b.tier === "enterprise").length, color: "text-purple-400", icon: HardDrive },
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
                key={b.path}
                className="bg-[#0a1a0a] border border-emerald-500/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Package size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-white font-medium truncate">{b.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tierColor(b.tier)}`}>
                      {b.tier}
                    </span>
                    {b.name.match(/BLD-[A-F0-9]+/) && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                        {b.name.match(/BLD-[A-F0-9]+/)?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <HardDrive size={10} /> {formatSize(b.size)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {b.created_at ? new Date(b.created_at).toLocaleString() : "—"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownload(b)}
                    className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded text-xs hover:bg-emerald-500/30 transition-colors"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(b)}
                    disabled={deleting === b.path}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50"
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
// UPLOAD MODAL
// ═══════════════════════════════════════════════════════════

const UploadModal: React.FC<{
  onClose: () => void;
  onUploaded: () => void;
}> = ({ onClose, onUploaded }) => {
  const [tier, setTier] = useState<Tier | "root">("standard");
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

    setUploading(true);
    setError("");
    setProgress("Uploading & signing...");

    try {
      // Get current session token for auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError("Not authenticated. Please refresh and try again.");
        setUploading(false);
        setProgress("");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("tier", tier);

      const resp = await fetch("/api/devignfx/upload-build", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
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
        setError(result.error || "Upload failed");
        setUploading(false);
        setProgress("");
        return;
      }

      setProgress(
        `Done! Build ID: ${result.buildId}` +
        (result.signed ? " (signed)" : " (unsigned — add DEVIGNFX_SIGNING_KEY to env)")
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
            Upload a new bot .zip file. The latest file per tier is served to customers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Target Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as Tier | "root")}
              className={inputCls}
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
              <option value="root">Root (fallback for all tiers)</option>
            </select>
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

          {/* Info */}
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-xs text-gray-400 space-y-1.5">
            <p className="flex items-start gap-2">
              <AlertCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              A unique <code className="text-emerald-300">BLD-XXXXXXXX</code> ID is auto-generated and the file is renamed to <code className="text-emerald-300">DevignFX-BLD-XXX.zip</code>.
            </p>
            <p className="flex items-start gap-2">
              <AlertCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              If <code className="text-emerald-300">DEVIGNFX_SIGNING_KEY</code> is set in Vercel env, the build is auto-signed with Ed25519 and a <code className="text-emerald-300">.sig</code> file is uploaded alongside it.
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
            disabled={uploading || !file}
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
