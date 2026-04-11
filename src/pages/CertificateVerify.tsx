import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { CertificateWithAlumni } from "../types/certificates";
import { verifyCertificate } from "../lib/certificates";
import { generateCertificatePdf } from "../lib/certificatePdf";
import { SEO } from "../components/common/SEO";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import { Button, Input } from "devign";

/* ─── constants ─── */
const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

const CertificateVerify: React.FC = () => {
  const { certNumber } = useParams<{ certNumber?: string }>();
  const [input, setInput] = useState(certNumber || "");
  const [result, setResult] = useState<CertificateWithAlumni | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

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
      const url = await generateCertificatePdf(
        result,
        result.alumni,
        result.template
      );
      window.open(url, "_blank");
    } catch {
      alert("Failed to generate certificate PDF");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PageTransition>
      <SEO
        title="Verify Certificate | GR8QM Technovates"
        description="Verify the authenticity of a certificate issued by GR8QM Technovates."
      />

      <main className="flex flex-col bg-[#0a0a0f] min-h-screen relative">
        {/* Grid bg */}
        <div className="absolute inset-0" style={gridBg} />

        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-skyblue/[0.03] blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-orange/[0.02] blur-[140px] pointer-events-none" />

        <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-20">
          <Container className="max-w-lg w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_SMOOTH }}
              className="text-center mb-8"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/30 mb-4">
                Certificate Authentication
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.03em] mb-3">
                Verify <span className="text-skyblue">Certificate</span>
              </h1>
              <p className="text-white/35 text-base">
                Enter a certificate number to verify its authenticity.
              </p>
            </motion.div>

            {/* Search card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: EASE_SMOOTH }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6"
            >
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  placeholder="e.g. GR8QM-2026-0001"
                  className="flex-1 font-mono"
                />
                <Button
                  variant="primary"
                  size="default"
                  onClick={() => handleVerify()}
                  disabled={loading || !input.trim()}
                >
                  {loading ? "..." : "Verify"}
                </Button>
              </div>
            </motion.div>

            {/* Result */}
            {searched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_SMOOTH }}
                className="mt-6"
              >
                {result ? (
                  <div className="bg-white/[0.02] border border-green-500/20 rounded-xl overflow-hidden">
                    {/* Valid header */}
                    <div className="bg-green-500/10 border-b border-green-500/15 px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-green-400 font-bold">
                          Valid Certificate
                        </h2>
                        <p className="text-green-400/60 text-xs">
                          This certificate is authentic and active.
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                      <DetailRow
                        label="Certificate Number"
                        value={result.certificate_number}
                        mono
                      />
                      <DetailRow
                        label="Issued To"
                        value={`${result.alumni.first_name} ${result.alumni.last_name}`}
                      />
                      <DetailRow label="Course" value={result.course_name} />
                      <DetailRow
                        label="Issue Date"
                        value={new Date(
                          result.issue_date
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      />
                      {result.expiry_date && (
                        <DetailRow
                          label="Expiry Date"
                          value={new Date(
                            result.expiry_date
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        />
                      )}

                      <Button
                        variant="primary"
                        size="default"
                        onClick={handleDownload}
                        disabled={generating}
                        className="w-full mt-4"
                      >
                        {generating
                          ? "Generating PDF..."
                          : "Download Certificate PDF"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-red-500/20 rounded-xl overflow-hidden">
                    <div className="bg-red-500/10 border-b border-red-500/15 px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
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
                    <div className="p-6 text-white/35 text-sm">
                      <p>
                        Double-check the certificate number and try again. If
                        you believe this is an error, contact{" "}
                        <a
                          href="mailto:hello@gr8qm.com"
                          className="text-skyblue hover:underline"
                        >
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
              <Link
                to="/alumni"
                className="inline-flex items-center gap-2 text-sm text-white/25 hover:text-skyblue transition-colors font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                View all alumni
              </Link>
            </div>
          </Container>
        </div>
      </main>
    </PageTransition>
  );
};

const DetailRow: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
}> = ({ label, value, mono }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/[0.06] last:border-0">
    <span className="text-white/25 text-sm">{label}</span>
    <span
      className={`text-white text-sm font-medium ${mono ? "font-mono" : ""}`}
    >
      {value}
    </span>
  </div>
);

export default CertificateVerify;
