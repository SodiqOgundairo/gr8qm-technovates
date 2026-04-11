import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, X } from "lucide-react";
import type { AlumniWithCerts, CertificateWithAlumni } from "../types/certificates";
import { getAlumniWithCertificates, verifyCertificate } from "../lib/certificates";
import { generateCertificatePdf } from "../lib/certificatePdf";
import { supabase } from "../utils/supabase";
import type { CertificateTemplate } from "../types/certificates";
import { SEO } from "../components/common/SEO";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "devign";

/* ─── constants ─── */
const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];
const EASE_DECEL: [number, number, number, number] = [0.16, 1, 0.3, 1];

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

const AlumniPage: React.FC = () => {
  const [alumni, setAlumni] = useState<AlumniWithCerts[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCohort, setFilterCohort] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);

  /* Certificate verification modal */
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [certInput, setCertInput] = useState("");
  const [certResult, setCertResult] = useState<CertificateWithAlumni | null>(null);
  const [certSearched, setCertSearched] = useState(false);
  const [certLoading, setCertLoading] = useState(false);
  const [certGenerating, setCertGenerating] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 80]);

  useEffect(() => {
    Promise.all([
      getAlumniWithCertificates(),
      supabase.from("certificate_templates").select("*"),
    ]).then(([alumniData, { data: tData }]) => {
      setAlumni(alumniData);
      setTemplates((tData as CertificateTemplate[]) || []);
      setLoading(false);
    });
  }, []);

  const cohorts = useMemo(
    () =>
      [...new Set(alumni.map((a) => a.cohort).filter(Boolean))] as string[],
    [alumni]
  );

  const filtered = useMemo(() => {
    let result = alumni;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
          a.certificates.some((c) =>
            c.course_name.toLowerCase().includes(q)
          )
      );
    }
    if (filterCohort) {
      result = result.filter((a) => a.cohort === filterCohort);
    }
    return result;
  }, [alumni, search, filterCohort]);

  const tiers = useMemo(() => {
    const multi = filtered.filter((a) => a.certificate_count > 1);
    const single = filtered.filter((a) => a.certificate_count === 1);
    const none = filtered.filter((a) => a.certificate_count === 0);
    return { multi, single, none };
  }, [filtered]);

  /* Certificate verification handlers */
  const handleVerify = async () => {
    const query = certInput.trim();
    if (!query) return;
    setCertLoading(true);
    setCertSearched(false);
    try {
      const data = await verifyCertificate(query);
      setCertResult(data);
    } catch {
      setCertResult(null);
    } finally {
      setCertSearched(true);
      setCertLoading(false);
    }
  };

  const handleCertDownload = async () => {
    if (!certResult) return;
    setCertGenerating(true);
    try {
      const url = await generateCertificatePdf(
        certResult,
        certResult.alumni,
        certResult.template
      );
      window.open(url, "_blank");
    } catch {
      alert("Failed to generate certificate PDF");
    } finally {
      setCertGenerating(false);
    }
  };

  return (
    <PageTransition>
      <SEO
        title="Alumni | GR8QM Technovates"
        description="Meet our graduates and verify certificates from GR8QM Technovates training programmes."
      />

      <main className="flex flex-col bg-[#0a0a0f]">
        {/* ════════════════ HERO ════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-white/[0.06]"
        >
          <div className="absolute inset-0" style={gridBg} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-skyblue/[0.04] blur-[160px] pointer-events-none" />

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 text-center px-4"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_SMOOTH }}
              className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/30 mb-6"
            >
              Our Graduates
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_DECEL }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] text-white leading-[0.95] mb-6"
            >
              Alumni
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE_SMOOTH }}
              className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-8"
            >
              Graduates who've completed training programmes at GR8QM
              Technovates. Sorted by achievements.
            </motion.p>

            {/* Verify button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE_SMOOTH }}
            >
              <button
                onClick={() => setVerifyOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-skyblue/30 text-white/40 hover:text-skyblue rounded-full text-sm transition-all duration-300 font-mono"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Verify a Certificate
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════ VERIFY CERTIFICATE MODAL ════════════════ */}
        <Dialog open={verifyOpen} onOpenChange={(v) => !v && setVerifyOpen(false)}>
          <DialogContent className="!bg-gradient-to-br !from-[#0a0a0f]/95 !via-[#0a0a0f]/90 !to-[#0a0a0f]/85 !border-white/[0.08] !text-white sm:!max-w-lg">
            <DialogHeader>
              <DialogDescription className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/30">
                Certificate Authentication
              </DialogDescription>
              <DialogTitle className="text-white">
                Verify <span className="text-skyblue">Certificate</span>
              </DialogTitle>
            </DialogHeader>

            <div>
              <p className="text-white/35 text-sm mb-4">
                Enter a certificate number to verify its authenticity.
              </p>

              <div className="flex gap-2">
                <Input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  placeholder="e.g. GR8QM-2026-0001"
                  className="flex-1 font-mono"
                />
                <Button
                  variant="primary"
                  size="default"
                  onClick={handleVerify}
                  disabled={certLoading || !certInput.trim()}
                >
                  {certLoading ? "..." : "Verify"}
                </Button>
              </div>

              {/* Result */}
              {certSearched && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE_SMOOTH }}
                  className="mt-5"
                >
                  {certResult ? (
                    <div className="border border-green-500/20 rounded-xl overflow-hidden">
                      <div className="bg-green-500/10 border-b border-green-500/15 px-5 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-green-400 font-bold text-sm">Valid Certificate</h3>
                          <p className="text-green-400/60 text-xs">Authentic and active.</p>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <DetailRow label="Certificate Number" value={certResult.certificate_number} mono />
                        <DetailRow label="Issued To" value={`${certResult.alumni.first_name} ${certResult.alumni.last_name}`} />
                        <DetailRow label="Course" value={certResult.course_name} />
                        <DetailRow
                          label="Issue Date"
                          value={new Date(certResult.issue_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        />
                        {certResult.expiry_date && (
                          <DetailRow
                            label="Expiry Date"
                            value={new Date(certResult.expiry_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                          />
                        )}
                        <Button
                          variant="primary"
                          size="default"
                          onClick={handleCertDownload}
                          disabled={certGenerating}
                          className="w-full mt-3"
                        >
                          {certGenerating ? "Generating PDF..." : "Download Certificate PDF"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-red-500/20 rounded-xl overflow-hidden">
                      <div className="bg-red-500/10 border-b border-red-500/15 px-5 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-red-400 font-bold text-sm">Not Found</h3>
                          <p className="text-red-400/60 text-xs">No active certificate matches this number.</p>
                        </div>
                      </div>
                      <div className="p-5 text-white/35 text-sm">
                        Double-check the certificate number and try again. If you believe this is an error, contact{" "}
                        <a href="mailto:hello@gr8qm.com" className="text-skyblue hover:underline">hello@gr8qm.com</a>.
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* ════════════════ FILTERS + CONTENT ════════════════ */}
        <section className="relative overflow-hidden">
          <div className="absolute top-[30%] -left-40 w-[500px] h-[500px] rounded-full bg-skyblue/[0.02] blur-[140px] pointer-events-none" />

          <Container className="py-16 md:py-24 relative z-10">
            {/* Search + Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE_SMOOTH }}
              className="space-y-6 mb-12 border-b border-white/[0.06] pb-6"
            >
              {/* Search bar */}
              <div className="relative max-w-lg">
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm transition-colors duration-300 focus-within:border-white/[0.16]">
                  <Search className="w-4 h-4 text-white/25 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search alumni or courses..."
                    className="bg-transparent w-full text-white/80 placeholder-white/20 outline-none text-sm"
                  />
                  <AnimatePresence>
                    {search && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={() => setSearch("")}
                        className="text-white/30 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Cohort pills */}
              {cohorts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterCohort("")}
                    className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.15em] transition-all duration-300 border ${
                      !filterCohort
                        ? "bg-skyblue text-white border-skyblue"
                        : "bg-transparent text-white/30 border-white/[0.08] hover:border-white/[0.2] hover:text-white/50"
                    }`}
                  >
                    All Cohorts
                  </button>
                  {cohorts.map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        setFilterCohort(filterCohort === c ? "" : c)
                      }
                      className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.15em] transition-all duration-300 border ${
                        filterCohort === c
                          ? "bg-skyblue text-white border-skyblue"
                          : "bg-transparent text-white/30 border-white/[0.08] hover:border-white/[0.2] hover:text-white/50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* States */}
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/[0.04] animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/[0.04] rounded w-2/3 animate-pulse" />
                        <div className="h-3 bg-white/[0.04] rounded w-1/3 animate-pulse" />
                      </div>
                    </div>
                    <div className="h-3 bg-white/[0.04] rounded w-full animate-pulse" />
                    <div className="pt-3 border-t border-white/[0.06] space-y-2">
                      <div className="h-3 bg-white/[0.04] rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-white/[0.04] rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-32"
              >
                <p className="text-white/25 text-lg mb-2">No alumni found</p>
                <p className="text-white/15 text-sm">
                  Try adjusting your search or filters.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-16">
                {tiers.multi.length > 0 && (
                  <TierSection
                    title="Top Achievers"
                    subtitle="Multiple certifications completed"
                    alumni={tiers.multi}
                    templates={templates}
                    highlight
                  />
                )}

                {tiers.single.length > 0 && (
                  <TierSection
                    title="Certified Graduates"
                    subtitle="Completed a certification programme"
                    alumni={tiers.single}
                    templates={templates}
                  />
                )}

                {tiers.none.length > 0 && (
                  <TierSection
                    title="Community Members"
                    subtitle="Part of the GR8QM family"
                    alumni={tiers.none}
                    templates={templates}
                  />
                )}
              </div>
            )}
          </Container>
        </section>

        {/* ════════════════ BOTTOM BORDER ════════════════ */}
        <div className="border-t border-white/[0.06]" />
      </main>
    </PageTransition>
  );
};

// ── Detail Row (for cert verification) ────────────────────
const DetailRow: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
}> = ({ label, value, mono }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/[0.06] last:border-0">
    <span className="text-white/25 text-sm">{label}</span>
    <span className={`text-white text-sm font-medium ${mono ? "font-mono" : ""}`}>
      {value}
    </span>
  </div>
);

// ── Tier Section ───────────────────────────────────────────

const TierSection: React.FC<{
  title: string;
  subtitle: string;
  alumni: AlumniWithCerts[];
  templates: CertificateTemplate[];
  highlight?: boolean;
}> = ({ title, subtitle, alumni, templates, highlight }) => (
  <div>
    <div className="flex items-center gap-4 mb-8">
      <h2
        className={`text-xl font-bold ${highlight ? "text-skyblue" : "text-white"}`}
      >
        {title}
      </h2>
      <span className="text-xs font-mono text-white/20 uppercase tracking-[0.2em]">
        ({alumni.length})
      </span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
    <p className="text-white/25 text-sm mb-6 -mt-4">{subtitle}</p>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {alumni.map((a, i) => (
        <AlumniCard
          key={a.id}
          alumni={a}
          templates={templates}
          index={i}
          highlight={highlight}
        />
      ))}
    </div>
  </div>
);

// ── Alumni Card ────────────────────────────────────────────

const AlumniCard: React.FC<{
  alumni: AlumniWithCerts;
  templates: CertificateTemplate[];
  index: number;
  highlight?: boolean;
}> = ({ alumni: a, templates, index, highlight }) => {
  const [generating, setGenerating] = useState(false);

  const handleViewCertificate = async (
    cert: AlumniWithCerts["certificates"][number]
  ) => {
    setGenerating(true);
    try {
      const t = templates.find((t) => t.id === cert.template_id) || null;
      const url = await generateCertificatePdf(cert, a, t);
      window.open(url, "_blank");
    } catch {
      alert("Failed to generate certificate");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.22, 0.6, 0.36, 1],
      }}
      className={`group bg-white/[0.02] border rounded-xl p-5 transition-all duration-300 hover:bg-white/[0.04] ${
        highlight
          ? "border-skyblue/20 hover:border-skyblue/40"
          : "border-white/[0.06] hover:border-white/[0.12]"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {a.photo_url ? (
          <img
            src={a.photo_url}
            alt={`${a.first_name} ${a.last_name}`}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-skyblue to-orange text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            {a.first_name[0]}
            {a.last_name[0]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold group-hover:text-skyblue transition-colors duration-300">
            {a.first_name} {a.last_name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {a.cohort && (
              <span className="text-white/20 text-xs font-mono">
                {a.cohort}
              </span>
            )}
            {a.certificate_count > 0 && (
              <span className="px-2 py-0.5 bg-skyblue/10 text-skyblue rounded-full text-xs font-medium">
                {a.certificate_count} cert
                {a.certificate_count !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {a.linkedin_url && (
          <a
            href={a.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/20 hover:text-skyblue transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        )}
      </div>

      {/* Bio */}
      {a.bio && (
        <p className="text-white/20 text-xs mt-3 line-clamp-2">{a.bio}</p>
      )}

      {/* Certificates */}
      {a.certificates.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
          {a.certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="text-white/40 text-xs truncate">
                  {cert.course_name}
                </p>
                <p className="text-white/15 text-[10px] font-mono">
                  {cert.certificate_number}
                </p>
              </div>
              <button
                onClick={() => handleViewCertificate(cert)}
                disabled={generating}
                className="text-skyblue hover:text-skyblue/80 text-xs whitespace-nowrap transition-colors disabled:opacity-50 font-medium"
              >
                {generating ? "..." : "View"}
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AlumniPage;
