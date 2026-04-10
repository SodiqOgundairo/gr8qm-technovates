import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { CertificateWithAlumni } from "../types/certificates";
import { verifyCertificate } from "../lib/certificates";
import { generateCertificatePdf } from "../lib/certificatePdf";
import { SEO } from "../components/common/SEO";

const CertificateVerify: React.FC = () => {
  const { certNumber } = useParams<{ certNumber?: string }>();
  const [input, setInput] = useState(certNumber || "");
  const [result, setResult] = useState<CertificateWithAlumni | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Auto-verify if certNumber is in URL
  useEffect(() => {
    if (certNumber) {
      handleVerify(certNumber);
    }
  }, [certNumber]);

  const handleVerify = async (number?: string) => {
    const query = (number || input).trim();
    if (!query) return;
    setLoading(true);
    setSearched(false);
    try {
      const data = await verifyCertificate(query);
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    setGenerating(true);
    try {
      const url = await generateCertificatePdf(result, result.alumni, result.template);
      window.open(url, "_blank");
    } catch {
      alert("Failed to generate certificate PDF");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <SEO
        title="Verify Certificate | GR8QM Technovates"
        description="Verify the authenticity of a certificate issued by GR8QM Technovates."
      />

      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-black text-white">
              Verify <span className="text-skyblue">Certificate</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Enter a certificate number to verify its authenticity.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-oxford-card border border-oxford-border rounded-xl p-6"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="e.g. GR8QM-2026-0001"
                className="flex-1 bg-oxford-elevated border border-oxford-border text-white rounded-lg px-4 py-3 text-sm font-mono placeholder:text-gray-600 focus:border-skyblue focus:outline-none transition-colors"
              />
              <button
                onClick={() => handleVerify()}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Verify"}
              </button>
            </div>
          </motion.div>

          {/* Result */}
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              {result ? (
                <div className="bg-oxford-card border border-green-500/30 rounded-xl overflow-hidden">
                  {/* Valid header */}
                  <div className="bg-green-500/10 border-b border-green-500/20 px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-green-400 font-bold">Valid Certificate</h2>
                      <p className="text-green-400/60 text-xs">
                        This certificate is authentic and active.
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    <DetailRow label="Certificate Number" value={result.certificate_number} mono />
                    <DetailRow
                      label="Issued To"
                      value={`${result.alumni.first_name} ${result.alumni.last_name}`}
                    />
                    <DetailRow label="Course" value={result.course_name} />
                    <DetailRow
                      label="Issue Date"
                      value={new Date(result.issue_date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    />
                    {result.expiry_date && (
                      <DetailRow
                        label="Expiry Date"
                        value={new Date(result.expiry_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      />
                    )}

                    <button
                      onClick={handleDownload}
                      disabled={generating}
                      className="w-full mt-4 px-4 py-3 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {generating ? "Generating PDF..." : "Download Certificate PDF"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-oxford-card border border-red-500/30 rounded-xl overflow-hidden">
                  <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-red-400 font-bold">Not Found</h2>
                      <p className="text-red-400/60 text-xs">
                        No active certificate matches this number.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 text-gray-400 text-sm">
                    <p>
                      Double-check the certificate number and try again. If you believe this is
                      an error, contact{" "}
                      <a href="mailto:hello@gr8qm.com" className="text-skyblue hover:underline">
                        hello@gr8qm.com
                      </a>
                      .
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Back link */}
          <div className="text-center mt-8">
            <Link to="/alumni" className="text-gray-500 hover:text-skyblue text-sm transition-colors">
              &larr; View all alumni
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const DetailRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div className="flex justify-between items-center py-2 border-b border-oxford-border/30 last:border-0">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className={`text-white text-sm font-medium ${mono ? "font-mono" : ""}`}>
      {value}
    </span>
  </div>
);

export default CertificateVerify;
