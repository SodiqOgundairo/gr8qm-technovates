import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Shield, Clock, CheckCircle2, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { CustomerBuildInfo } from "../types/devignfx";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://devignfx.gr8qm.com";

const DevignFXDownload = () => {
  const [licenseKey, setLicenseKey] = useState("");
  const [builds, setBuilds] = useState<CustomerBuildInfo[]>([]);
  const [licenseName, setLicenseName] = useState("");
  const [licenseTier, setLicenseTier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleLookup = async () => {
    const key = licenseKey.trim().toUpperCase();
    if (!key) return;
    setLoading(true);
    setError("");

    try {
      const resp = await fetch(`${SITE_URL}/api/devignfx/customer-builds?key=${encodeURIComponent(key)}`);
      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || "Failed to load builds");
        setLoading(false);
        return;
      }

      setBuilds(data.builds || []);
      setLicenseName(data.license?.name || "");
      setLicenseTier(data.license?.tier || "");
      setAuthenticated(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleDownload = async (build: CustomerBuildInfo) => {
    if (!build.downloadable || build.already_downloaded) return;
    setDownloading(build.build_id);
    setError("");

    try {
      const resp = await fetch(`${SITE_URL}/api/devignfx/generate-download-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: licenseKey.trim().toUpperCase(),
          buildId: build.build_id,
        }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || "Failed to generate download link");
        setDownloading(null);
        return;
      }

      // Trigger the actual download — token is consumed at this redirect
      window.location.href = data.downloadUrl;

      // Mark as downloaded in local state after a short delay
      setTimeout(() => {
        setBuilds(prev =>
          prev.map(b =>
            b.build_id === build.build_id ? { ...b, already_downloaded: true } : b
          )
        );
        setDownloading(null);
      }, 3000);
    } catch {
      setError("Download failed. Please try again.");
      setDownloading(null);
    }
  };

  const labelStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    Latest: { bg: "bg-green-500/20", text: "text-green-400", icon: <CheckCircle2 size={12} /> },
    Beta: { bg: "bg-orange-500/20", text: "text-orange-400", icon: <AlertCircle size={12} /> },
    Previous: { bg: "bg-blue-500/20", text: "text-blue-400", icon: <Clock size={12} /> },
    Archived: { bg: "bg-gray-500/20", text: "text-gray-500", icon: <Lock size={12} /> },
  };

  return (
    <div className="min-h-screen bg-[#060d06]">
      {/* Header */}
      <div className="border-b border-emerald-500/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/devignfx" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> DevignFX
          </Link>
          <h1 className="text-lg font-bold text-white">
            DevignFX <span className="text-emerald-400">Downloads</span>
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!authenticated ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-emerald-400" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Access Downloads</h2>
                <p className="text-gray-400">Enter your license key to view available builds.</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="DEVFX-XXXX-XXXX-XXXX"
                  value={licenseKey}
                  onChange={(e) => { setLicenseKey(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  className="w-full bg-[#0a1a0a] border border-emerald-500/10 text-white rounded-xl px-4 py-3 text-center font-mono text-lg tracking-wider focus:outline-none focus:border-emerald-500/40 placeholder:text-gray-600"
                />

                <button
                  onClick={handleLookup}
                  disabled={loading || !licenseKey.trim()}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "View Downloads"}
                </button>

                {error && (
                  <p className="text-red-400 text-sm text-center flex items-center justify-center gap-1">
                    <AlertCircle size={14} /> {error}
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="builds"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* License info */}
              <div className="bg-[#0a1a0a] border border-emerald-500/10 rounded-xl p-5 mb-8 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{licenseName || "Customer"}</p>
                  <p className="text-gray-500 text-sm font-mono">{licenseKey.trim().toUpperCase()}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium capitalize">
                  {licenseTier}
                </span>
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-4 flex items-center gap-1">
                  <AlertCircle size={14} /> {error}
                </p>
              )}

              {builds.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Download size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No builds available yet</p>
                  <p className="text-sm mt-1">Check back soon for new releases.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {builds.map((build) => {
                    const style = labelStyles[build.label] || labelStyles.Archived;
                    const isDownloading = downloading === build.build_id;

                    return (
                      <motion.div
                        key={build.build_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-[#0a1a0a] border rounded-xl p-5 ${
                          build.downloadable && !build.already_downloaded
                            ? "border-emerald-500/10"
                            : "border-gray-800/50 opacity-60"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-white font-bold text-lg">v{build.version}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${style.bg} ${style.text}`}>
                                {style.icon} {build.label}
                              </span>
                              <span className="text-gray-600 text-xs font-mono">{build.build_id}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{build.file_size ? `${(build.file_size / (1024 * 1024)).toFixed(1)} MB` : ""}</span>
                              <span>{build.published_at ? new Date(build.published_at).toLocaleDateString() : ""}</span>
                            </div>
                            {build.release_notes && (
                              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{build.release_notes}</p>
                            )}
                          </div>

                          <div className="shrink-0">
                            {build.already_downloaded ? (
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <CheckCircle2 size={16} /> Downloaded
                              </div>
                            ) : !build.downloadable ? (
                              <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <Lock size={16} /> Unavailable
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDownload(build)}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                <Download size={16} />
                                {isDownloading ? "Preparing..." : "Download"}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 bg-[#0a1a0a] border border-emerald-500/10 rounded-xl p-4 text-xs text-gray-500">
                <p className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  Each version can only be downloaded <strong className="text-gray-300">once</strong> per license.
                  The download link expires 1 hour after generation but is only consumed when the download actually starts.
                  Contact <a href="mailto:hello@gr8qm.com" className="text-emerald-400 hover:underline">hello@gr8qm.com</a> for help.
                </p>
              </div>

              <button
                onClick={() => { setAuthenticated(false); setBuilds([]); setLicenseKey(""); }}
                className="mt-4 text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Use a different license key
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DevignFXDownload;
