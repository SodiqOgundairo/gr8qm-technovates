import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { AlumniWithCerts } from "../types/certificates";
import { getAlumniWithCertificates } from "../lib/certificates";
import { generateCertificatePdf } from "../lib/certificatePdf";
import { supabase } from "../utils/supabase";
import type { CertificateTemplate } from "../types/certificates";
import { SEO } from "../components/common/SEO";

const AlumniPage: React.FC = () => {
  const [alumni, setAlumni] = useState<AlumniWithCerts[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCohort, setFilterCohort] = useState("");

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
    () => [...new Set(alumni.map((a) => a.cohort).filter(Boolean))] as string[],
    [alumni]
  );

  const filtered = useMemo(() => {
    let result = alumni;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
          a.certificates.some((c) => c.course_name.toLowerCase().includes(q))
      );
    }
    if (filterCohort) {
      result = result.filter((a) => a.cohort === filterCohort);
    }
    return result;
  }, [alumni, search, filterCohort]);

  // Group alumni by certificate count tiers
  const tiers = useMemo(() => {
    const multi = filtered.filter((a) => a.certificate_count > 1);
    const single = filtered.filter((a) => a.certificate_count === 1);
    const none = filtered.filter((a) => a.certificate_count === 0);
    return { multi, single, none };
  }, [filtered]);

  return (
    <>
      <SEO
        title="Alumni | GR8QM Technovates"
        description="Meet our graduates and verify certificates from GR8QM Technovates training programmes."
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white"
          >
            Our <span className="text-skyblue">Alumni</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto"
          >
            Graduates who've completed training programmes at GR8QM Technovates.
            Sorted by achievements.
          </motion.p>

          {/* Verify link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-oxford-card border border-oxford-border hover:border-skyblue text-gray-300 hover:text-skyblue rounded-lg text-sm transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Verify a Certificate
            </Link>
          </motion.div>
        </section>

        {/* Filters */}
        <section className="max-w-6xl mx-auto px-4 pb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alumni or courses..."
              className="flex-1 bg-oxford-card border border-oxford-border text-white rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-500"
            />
            {cohorts.length > 0 && (
              <select
                value={filterCohort}
                onChange={(e) => setFilterCohort(e.target.value)}
                className="bg-oxford-card border border-oxford-border text-white rounded-lg px-4 py-2.5 text-sm"
              >
                <option value="">All cohorts</option>
                {cohorts.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-skyblue border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-500 mt-4">Loading alumni...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No alumni found</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Multi-certificate achievers */}
              {tiers.multi.length > 0 && (
                <TierSection
                  title="Top Achievers"
                  subtitle="Multiple certifications completed"
                  alumni={tiers.multi}
                  templates={templates}
                  highlight
                />
              )}

              {/* Single certificate */}
              {tiers.single.length > 0 && (
                <TierSection
                  title="Certified Graduates"
                  subtitle="Completed a certification programme"
                  alumni={tiers.single}
                  templates={templates}
                />
              )}

              {/* No certificates yet */}
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
        </section>
      </div>
    </>
  );
};

// ── Tier Section ───────────────────────────────────────────

const TierSection: React.FC<{
  title: string;
  subtitle: string;
  alumni: AlumniWithCerts[];
  templates: CertificateTemplate[];
  highlight?: boolean;
}> = ({ title, subtitle, alumni, templates, highlight }) => (
  <div>
    <div className="mb-6">
      <h2 className={`text-xl font-bold ${highlight ? "text-skyblue" : "text-white"}`}>
        {title}
        <span className="ml-2 text-sm font-normal text-gray-500">({alumni.length})</span>
      </h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {alumni.map((a, i) => (
        <AlumniCard key={a.id} alumni={a} templates={templates} index={i} highlight={highlight} />
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

  const handleViewCertificate = async (cert: AlumniWithCerts["certificates"][number]) => {
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-oxford-card border rounded-xl p-5 transition-all hover:border-skyblue/50 ${
        highlight ? "border-skyblue/30" : "border-oxford-border"
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
          <h3 className="text-white font-semibold">
            {a.first_name} {a.last_name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {a.cohort && (
              <span className="text-gray-500 text-xs">{a.cohort}</span>
            )}
            {a.certificate_count > 0 && (
              <span className="px-2 py-0.5 bg-skyblue/10 text-skyblue rounded-full text-xs font-medium">
                {a.certificate_count} cert{a.certificate_count !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {a.linkedin_url && (
          <a
            href={a.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-skyblue transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        )}
      </div>

      {/* Bio */}
      {a.bio && (
        <p className="text-gray-500 text-xs mt-3 line-clamp-2">{a.bio}</p>
      )}

      {/* Certificates */}
      {a.certificates.length > 0 && (
        <div className="mt-4 pt-3 border-t border-oxford-border/50 space-y-2">
          {a.certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="text-gray-300 text-xs truncate">{cert.course_name}</p>
                <p className="text-gray-600 text-[10px] font-mono">{cert.certificate_number}</p>
              </div>
              <button
                onClick={() => handleViewCertificate(cert)}
                disabled={generating}
                className="text-skyblue hover:text-skyblue/80 text-xs whitespace-nowrap transition-colors disabled:opacity-50"
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
