import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "devign";
import type {
  CertificateTemplate,
  Alumni,
  Certificate,
} from "../../types/certificates";
import {
  subscribeCertificateTemplates,
  deleteCertificateTemplate,
  subscribeAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
  subscribeCertificates,
  issueCertificate,
  revokeCertificate,
  deleteCertificate,
  generateCertificateNumber,
} from "../../lib/certificates";
import { generateCertificatePdf } from "../../lib/certificatePdf";
import { supabase } from "../../utils/supabase";

type Tab = "certificates" | "alumni" | "templates";

const CertificatesAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("certificates");
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const ch1 = subscribeCertificateTemplates(setTemplates);
    const ch2 = subscribeAlumni(setAlumni);
    const ch3 = subscribeCertificates(setCertificates);

    // Fetch courses for dropdown
    supabase
      .from("courses")
      .select("id, title")
      .order("title")
      .then(({ data }) => setCourses((data as { id: string; title: string }[]) || []));

    return () => {
      ch1.unsubscribe();
      ch2.unsubscribe();
      ch3.unsubscribe();
    };
  }, []);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "certificates", label: "Certificates", count: certificates.length },
    { id: "alumni", label: "Alumni", count: alumni.length },
    { id: "templates", label: "Templates", count: templates.length },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Certificates & Alumni</h1>
          <p className="text-gray-400 mt-1">
            Issue certificates, manage alumni, and design templates.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-oxford-card rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-skyblue text-white shadow"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {activeTab === "certificates" && (
          <CertificatesTab
            certificates={certificates}
            alumni={alumni}
            templates={templates}
            courses={courses}
          />
        )}
        {activeTab === "alumni" && (
          <AlumniTab alumni={alumni} certificates={certificates} />
        )}
        {activeTab === "templates" && <TemplatesTab templates={templates} />}
      </div>
    </AdminLayout>
  );
};

// ════════════════════════════════════════════════════════════
// CERTIFICATES TAB
// ════════════════════════════════════════════════════════════

const CertificatesTab: React.FC<{
  certificates: Certificate[];
  alumni: Alumni[];
  templates: CertificateTemplate[];
  courses: { id: string; title: string }[];
}> = ({ certificates, alumni, templates, courses }) => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [generating, setGenerating] = useState<string | null>(null);

  const alumniMap = useMemo(() => {
    const m = new Map<string, Alumni>();
    alumni.forEach((a) => m.set(a.id, a));
    return m;
  }, [alumni]);

  const filtered = useMemo(() => {
    if (!search) return certificates;
    const q = search.toLowerCase();
    return certificates.filter((c) => {
      const a = alumniMap.get(c.alumni_id);
      return (
        c.certificate_number.toLowerCase().includes(q) ||
        c.course_name.toLowerCase().includes(q) ||
        (a && `${a.first_name} ${a.last_name}`.toLowerCase().includes(q))
      );
    });
  }, [certificates, search, alumniMap]);

  const handlePreview = async (cert: Certificate) => {
    setGenerating(cert.id);
    try {
      const a = alumniMap.get(cert.alumni_id);
      if (!a) throw new Error("Alumni not found");
      const t = templates.find((t) => t.id === cert.template_id) || null;
      const url = await generateCertificatePdf(cert, a, t);
      window.open(url, "_blank");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setGenerating(null);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this certificate? It will no longer be publicly verifiable.")) return;
    await revokeCertificate(id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this certificate?")) return;
    await deleteCertificate(id);
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-500/20 text-green-300",
    revoked: "bg-red-500/20 text-red-300",
    expired: "bg-yellow-500/20 text-yellow-300",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, course, or certificate number..."
          className="flex-1 bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          + Issue Certificate
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No certificates issued yet</p>
          <p className="text-sm mt-1">Issue your first certificate to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const a = alumniMap.get(c.alumni_id);
            return (
              <div
                key={c.id}
                className="bg-oxford-card border border-oxford-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold font-mono text-sm">
                      {c.certificate_number}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">
                    {a ? `${a.first_name} ${a.last_name}` : "Unknown"} — {c.course_name}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Issued {new Date(c.issue_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePreview(c)}
                    disabled={generating === c.id}
                    className="px-3 py-1.5 bg-skyblue/20 hover:bg-skyblue/30 text-skyblue rounded text-sm transition-colors disabled:opacity-50"
                  >
                    {generating === c.id ? "Generating..." : "Preview PDF"}
                  </button>
                  {c.status === "active" && (
                    <button
                      onClick={() => handleRevoke(c.id)}
                      className="px-3 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded text-sm transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <IssueCertificateModal
          alumni={alumni}
          templates={templates}
          courses={courses}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// ── Issue Certificate Modal ────────────────────────────────

const IssueCertificateModal: React.FC<{
  alumni: Alumni[];
  templates: CertificateTemplate[];
  courses: { id: string; title: string }[];
  onClose: () => void;
}> = ({ alumni, templates, courses, onClose }) => {
  const [alumniId, setAlumniId] = useState("");
  const [templateId, setTemplateId] = useState(templates[0]?.id || "");
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [certNumber, setCertNumber] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedTemplate = templates.find((t) => t.id === templateId);

  const handleCourseSelect = async (id: string) => {
    setCourseId(id);
    const course = courses.find((c) => c.id === id);
    if (course) {
      setCourseName(course.title);
    }
    // Auto-generate cert number
    if (selectedTemplate) {
      const num = await generateCertificateNumber(selectedTemplate.course_prefix);
      setCertNumber(num);
    }
  };

  const handleSave = async () => {
    if (!alumniId || !courseName.trim() || !certNumber.trim()) {
      alert("Alumni, course name, and certificate number are required.");
      return;
    }
    setSaving(true);
    try {
      await issueCertificate({
        certificate_number: certNumber.toUpperCase().trim(),
        alumni_id: alumniId,
        template_id: templateId || null,
        course_name: courseName.trim(),
        course_id: courseId || null,
        issue_date: issueDate,
        expiry_date: null,
        status: "active",
        pdf_url: null,
        metadata: {},
      });
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to issue certificate");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="!bg-gradient-to-br !from-[#0f1729] !via-[#111d35] !to-[#0f1729] !border-white/[0.08] !text-white sm:!max-w-lg !max-h-[85vh] !overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Issue Certificate</DialogTitle>
          <DialogDescription className="text-gray-400">Select an alumni and course to issue a new certificate.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Alumni *</label>
            <select
              value={alumniId}
              onChange={(e) => setAlumniId(e.target.value)}
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select alumni</option>
              {alumni.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.first_name} {a.last_name} ({a.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Template</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Default template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Course *</label>
            {courses.length > 0 ? (
              <select
                value={courseId}
                onChange={(e) => handleCourseSelect(e.target.value)}
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select course or type below</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            ) : null}
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Course name"
              className="mt-2 w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Certificate # *</label>
              <input
                type="text"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="Auto-generated"
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Issuing..." : "Issue Certificate"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ════════════════════════════════════════════════════════════
// ALUMNI TAB
// ════════════════════════════════════════════════════════════

const AlumniTab: React.FC<{
  alumni: Alumni[];
  certificates: Certificate[];
}> = ({ alumni, certificates }) => {
  const [showModal, setShowModal] = useState(false);
  const [editAlumni, setEditAlumni] = useState<Alumni | null>(null);
  const [search, setSearch] = useState("");

  const certCounts = useMemo(() => {
    const counts = new Map<string, number>();
    certificates.forEach((c) => {
      if (c.status === "active") {
        counts.set(c.alumni_id, (counts.get(c.alumni_id) || 0) + 1);
      }
    });
    return counts;
  }, [certificates]);

  const filtered = useMemo(() => {
    if (!search) return alumni;
    const q = search.toLowerCase();
    return alumni.filter(
      (a) =>
        a.first_name.toLowerCase().includes(q) ||
        a.last_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.cohort || "").toLowerCase().includes(q)
    );
  }, [alumni, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this alumni? All their certificates will also be deleted.")) return;
    await deleteAlumni(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search alumni..."
          className="flex-1 bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={() => { setEditAlumni(null); setShowModal(true); }}
          className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          + Add Alumni
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No alumni yet</p>
          <p className="text-sm mt-1">Add your first graduate to start issuing certificates.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <div key={a.id} className="bg-oxford-card border border-oxford-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-skyblue/20 text-skyblue flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {a.first_name[0]}{a.last_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">
                    {a.first_name} {a.last_name}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">{a.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {a.cohort && (
                      <span className="px-2 py-0.5 bg-oxford-elevated text-gray-400 rounded text-xs">
                        {a.cohort}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-skyblue/10 text-skyblue rounded text-xs">
                      {certCounts.get(a.id) || 0} cert{(certCounts.get(a.id) || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-oxford-border/50">
                <button
                  onClick={() => { setEditAlumni(a); setShowModal(true); }}
                  className="text-skyblue hover:text-skyblue/80 text-xs transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-400 hover:text-red-300 text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AlumniFormModal
          alumni={editAlumni}
          onClose={() => { setShowModal(false); setEditAlumni(null); }}
        />
      )}
    </div>
  );
};

// ── Alumni Form Modal ──────────────────────────────────────

const AlumniFormModal: React.FC<{
  alumni: Alumni | null;
  onClose: () => void;
}> = ({ alumni: a, onClose }) => {
  const [firstName, setFirstName] = useState(a?.first_name || "");
  const [lastName, setLastName] = useState(a?.last_name || "");
  const [email, setEmail] = useState(a?.email || "");
  const [phone, setPhone] = useState(a?.phone || "");
  const [photoUrl, setPhotoUrl] = useState(a?.photo_url || "");
  const [bio, setBio] = useState(a?.bio || "");
  const [linkedinUrl, setLinkedinUrl] = useState(a?.linkedin_url || "");
  const [cohort, setCohort] = useState(a?.cohort || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert("First name, last name, and email are required.");
      return;
    }
    setSaving(true);
    try {
      const data = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        photo_url: photoUrl.trim() || null,
        bio: bio.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        cohort: cohort.trim() || null,
      };
      if (a) {
        await updateAlumni(a.id, data);
      } else {
        await createAlumni(data);
      }
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="!bg-gradient-to-br !from-[#0f1729] !via-[#111d35] !to-[#0f1729] !border-white/[0.08] !text-white sm:!max-w-lg !max-h-[90vh] !overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{a ? "Edit" : "Add"} Alumni</DialogTitle>
          <DialogDescription className="text-gray-400">
            {a ? "Update alumni details below." : "Add a new alumni to the directory."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InputField label="First Name *" value={firstName} onChange={setFirstName} />
            <InputField label="Last Name *" value={lastName} onChange={setLastName} />
          </div>
          <InputField label="Email *" value={email} onChange={setEmail} type="email" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Phone" value={phone} onChange={setPhone} type="tel" />
            <InputField label="Cohort" value={cohort} onChange={setCohort} placeholder="e.g. Cohort 4" />
          </div>
          <InputField label="Photo URL" value={photoUrl} onChange={setPhotoUrl} placeholder="https://..." />
          <InputField label="LinkedIn URL" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/in/..." />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : a ? "Update" : "Add Alumni"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ════════════════════════════════════════════════════════════
// TEMPLATES TAB
// ════════════════════════════════════════════════════════════

const TemplatesTab: React.FC<{ templates: CertificateTemplate[] }> = ({
  templates,
}) => {
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await deleteCertificateTemplate(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/admin/certificates/designer")}
          className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Design New Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No templates yet</p>
          <p className="text-sm mt-1">
            A default template is used when none is selected. Open the visual designer to create one.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div key={t.id} className="bg-oxford-card border border-oxford-border rounded-lg overflow-hidden">
              {/* Color preview */}
              <div
                className="h-20 relative cursor-pointer"
                style={{ backgroundColor: t.background_color }}
                onClick={() => navigate(`/admin/certificates/designer/${t.id}`)}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: t.accent_color }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/60 text-xs font-medium">
                    {t.orientation.toUpperCase()} &middot; {t.border_style}
                    {t.elements ? ` &middot; ${t.elements.length} elements` : ""}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold truncate">{t.name}</h3>
                <p className="text-gray-500 text-xs mt-1 truncate">{t.header_text}</p>
                <p className="text-gray-600 text-xs mt-0.5">Prefix: {t.course_prefix}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/admin/certificates/designer/${t.id}`)}
                    className="text-skyblue hover:text-skyblue/80 text-xs transition-colors"
                  >
                    Open Designer
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-400 hover:text-red-300 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// ── Shared input field ─────────────────────────────────────

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}> = ({ label, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
    />
  </div>
);

export default CertificatesAdmin;
