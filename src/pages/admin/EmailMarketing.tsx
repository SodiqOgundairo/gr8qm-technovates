import React, { useState, useEffect, useRef, useMemo } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import type {
  EmailTemplate,
  EmailCampaign,
  Contact,
  EmailSender,
  RecipientGroup,
} from "../../types/emailMarketing";
import {
  subscribeEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  starterTemplates,
} from "../../lib/emailTemplates";
import {
  subscribeEmailCampaigns,
  createDraftCampaign,
  sendCampaign,
  scheduleCampaign,
  cancelScheduledCampaign,
  deleteCampaign,
} from "../../lib/emailCampaigns";
import {
  subscribeContacts,
  createContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  bulkAddLabels,
  bulkRemoveLabels,
  bulkChangeCategory,
  parseCsvContacts,
  importContacts,
  exportContactsCsv,
} from "../../lib/contacts";
import { subscribeEmailSenders } from "../../lib/emailSenders";

type Tab = "campaigns" | "contacts" | "templates";

const EmailMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("campaigns");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [senders, setSenders] = useState<EmailSender[]>([]);

  useEffect(() => {
    const ch1 = subscribeEmailTemplates(setTemplates);
    const ch2 = subscribeEmailCampaigns(setCampaigns);
    const ch3 = subscribeContacts(setContacts);
    const ch4 = subscribeEmailSenders(setSenders);
    return () => {
      ch1.unsubscribe();
      ch2.unsubscribe();
      ch3.unsubscribe();
      ch4.unsubscribe();
    };
  }, []);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "campaigns", label: "Campaigns", count: campaigns.length },
    { id: "contacts", label: "Contacts", count: contacts.length },
    { id: "templates", label: "Templates", count: templates.length },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Email Marketing</h1>
            <p className="text-gray-400 mt-1">
              Send campaigns, manage contacts, and build templates.
            </p>
          </div>
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
              {tab.count !== undefined && (
                <span className="ml-2 text-xs opacity-70">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "campaigns" && (
          <CampaignsTab
            campaigns={campaigns}
            templates={templates}
            senders={senders}
            contacts={contacts}
          />
        )}
        {activeTab === "contacts" && <ContactsTab contacts={contacts} />}
        {activeTab === "templates" && (
          <TemplatesTab templates={templates} />
        )}
      </div>
    </AdminLayout>
  );
};

// ════════════════════════════════════════════════════════════
// CAMPAIGNS TAB
// ════════════════════════════════════════════════════════════

const CampaignsTab: React.FC<{
  campaigns: EmailCampaign[];
  templates: EmailTemplate[];
  senders: EmailSender[];
  contacts: Contact[];
}> = ({ campaigns, templates, senders, contacts }) => {
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [progress, setProgress] = useState({ sent: 0, total: 0 });

  const handleSend = async (campaign: EmailCampaign) => {
    if (!confirm("Send this campaign now? This cannot be undone.")) return;
    setSending(campaign.id);
    try {
      await sendCampaign(campaign, (sent, total) =>
        setProgress({ sent, total })
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send campaign");
    } finally {
      setSending(null);
      setProgress({ sent: 0, total: 0 });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    await deleteCampaign(id);
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this scheduled campaign?")) return;
    await cancelScheduledCampaign(id);
  };

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/20 text-gray-300",
    scheduled: "bg-yellow-500/20 text-yellow-300",
    sending: "bg-blue-500/20 text-blue-300",
    sent: "bg-green-500/20 text-green-300",
    failed: "bg-red-500/20 text-red-300",
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No campaigns yet</p>
          <p className="text-sm mt-1">
            Create your first email campaign to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="bg-oxford-card border border-oxford-border rounded-lg p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">
                    {c.subject}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}
                    >
                      {c.status}
                    </span>
                    {c.recipient_count > 0 && (
                      <span>{c.recipient_count} recipients</span>
                    )}
                    {c.sent_at && (
                      <span>
                        Sent {new Date(c.sent_at).toLocaleDateString()}
                      </span>
                    )}
                    {c.scheduled_at && c.status === "scheduled" && (
                      <span>
                        Scheduled{" "}
                        {new Date(c.scheduled_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {/* Analytics */}
                  {c.status === "sent" && c.analytics.sent > 0 && (
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <span>
                        Delivered:{" "}
                        <span className="text-green-400">
                          {c.analytics.delivered}
                        </span>
                      </span>
                      <span>
                        Opened:{" "}
                        <span className="text-blue-400">
                          {c.analytics.uniqueOpened}
                        </span>
                      </span>
                      <span>
                        Clicked:{" "}
                        <span className="text-purple-400">
                          {c.analytics.uniqueClicked}
                        </span>
                      </span>
                      <span>
                        Bounced:{" "}
                        <span className="text-red-400">
                          {c.analytics.bounced}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {sending === c.id ? (
                    <span className="text-sm text-skyblue">
                      Sending {progress.sent}/{progress.total}...
                    </span>
                  ) : (
                    <>
                      {c.status === "draft" && (
                        <button
                          onClick={() => handleSend(c)}
                          className="px-3 py-1.5 bg-skyblue hover:bg-skyblue/80 text-white rounded text-sm transition-colors"
                        >
                          Send Now
                        </button>
                      )}
                      {c.status === "scheduled" && (
                        <button
                          onClick={() => handleCancel(c.id)}
                          className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      {(c.status === "draft" || c.status === "failed") && (
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <NewCampaignModal
          templates={templates}
          senders={senders}
          contacts={contacts}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// ── New Campaign Modal ─────────────────────────────────────

const NewCampaignModal: React.FC<{
  templates: EmailTemplate[];
  senders: EmailSender[];
  contacts: Contact[];
  onClose: () => void;
}> = ({ templates, senders, contacts, onClose }) => {
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [recipientType, setRecipientType] = useState<RecipientGroup["type"]>("all");
  const [recipientCategory, setRecipientCategory] = useState("");
  const [recipientLabels, setRecipientLabels] = useState("");
  const [senderIdx, setSenderIdx] = useState(0);
  const [scheduleDate, setScheduleDate] = useState("");
  const [saving, setSaving] = useState(false);

  const defaultSender = senders.find((s) => s.is_default) || senders[0];

  const categories = useMemo(
    () => [...new Set(contacts.map((c) => c.category))],
    [contacts]
  );
  const allLabels = useMemo(
    () => [...new Set(contacts.flatMap((c) => c.labels))],
    [contacts]
  );

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const t = templates.find((t) => t.id === templateId);
    if (t) {
      setSubject(t.subject);
      setHtmlBody(t.html);
    }
  };

  const recipientCount = useMemo(() => {
    if (recipientType === "all") return contacts.length;
    if (recipientType === "category")
      return contacts.filter((c) => c.category === recipientCategory).length;
    if (recipientType === "labels") {
      const labels = recipientLabels
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);
      return contacts.filter((c) =>
        labels.some((l) => c.labels.includes(l))
      ).length;
    }
    return 0;
  }, [contacts, recipientType, recipientCategory, recipientLabels]);

  const handleSave = async (sendNow: boolean) => {
    if (!subject.trim() || !htmlBody.trim()) {
      alert("Subject and email body are required.");
      return;
    }
    setSaving(true);
    try {
      const group: RecipientGroup = { type: recipientType };
      if (recipientType === "category") group.category = recipientCategory;
      if (recipientType === "labels")
        group.labels = recipientLabels
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean);

      const sender = senders[senderIdx] || defaultSender;

      const campaign = await createDraftCampaign({
        subject,
        html_body: htmlBody,
        recipient_group: group,
        sender_name: sender?.name || null,
        sender_email: sender?.email || null,
        template_id: selectedTemplate || undefined,
        template_name:
          templates.find((t) => t.id === selectedTemplate)?.name || undefined,
      });

      if (sendNow) {
        await sendCampaign(campaign);
      } else if (scheduleDate) {
        await scheduleCampaign(campaign.id, new Date(scheduleDate).toISOString());
      }

      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create campaign");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-oxford-card border border-oxford-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-oxford-border">
          <h2 className="text-lg font-bold text-white">New Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Template selection */}
          {templates.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start from template (optional)
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Write from scratch</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line"
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* HTML Body */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Body (HTML) *
            </label>
            <textarea
              value={htmlBody}
              onChange={(e) => setHtmlBody(e.target.value)}
              rows={10}
              placeholder="Paste or write your email HTML here..."
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm font-mono"
            />
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Recipients ({recipientCount} contacts)
            </label>
            <div className="flex gap-2 flex-wrap">
              {(["all", "category", "labels"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setRecipientType(type)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    recipientType === type
                      ? "bg-skyblue text-white"
                      : "bg-oxford-elevated text-gray-400 hover:text-white"
                  }`}
                >
                  {type === "all"
                    ? "All Contacts"
                    : type === "category"
                      ? "By Category"
                      : "By Labels"}
                </button>
              ))}
            </div>

            {recipientType === "category" && (
              <select
                value={recipientCategory}
                onChange={(e) => setRecipientCategory(e.target.value)}
                className="mt-2 w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            {recipientType === "labels" && (
              <div className="mt-2">
                <input
                  type="text"
                  value={recipientLabels}
                  onChange={(e) => setRecipientLabels(e.target.value)}
                  placeholder="Enter labels separated by commas"
                  className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
                />
                {allLabels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {allLabels.map((label) => (
                      <button
                        key={label}
                        onClick={() => {
                          const current = recipientLabels
                            .split(",")
                            .map((l) => l.trim())
                            .filter(Boolean);
                          if (!current.includes(label)) {
                            setRecipientLabels(
                              [...current, label].join(", ")
                            );
                          }
                        }}
                        className="px-2 py-0.5 bg-oxford-elevated text-gray-400 hover:text-white rounded text-xs transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sender */}
          {senders.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sender
              </label>
              <select
                value={senderIdx}
                onChange={(e) => setSenderIdx(Number(e.target.value))}
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              >
                {senders.map((s, i) => (
                  <option key={s.id} value={i}>
                    {s.name} &lt;{s.email}&gt;{s.is_default ? " (default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Schedule (optional)
            </label>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-oxford-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 bg-oxford-elevated hover:bg-oxford-border text-white rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {scheduleDate ? "Schedule" : "Save as Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Sending..." : "Send Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// CONTACTS TAB
// ════════════════════════════════════════════════════════════

const ContactsTab: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [bulkAction, setBulkAction] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(
    () => [...new Set(contacts.map((c) => c.category))],
    [contacts]
  );

  const filtered = useMemo(() => {
    let result = contacts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.first_name.toLowerCase().includes(q) ||
          (c.last_name || "").toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    if (filterCategory) {
      result = result.filter((c) => c.category === filterCategory);
    }
    return result;
  }, [contacts, search, filterCategory]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c.id)));
    }
  };

  const handleBulkAction = async () => {
    const ids = [...selected];
    if (ids.length === 0) return;

    try {
      if (bulkAction === "delete") {
        if (!confirm(`Delete ${ids.length} contacts?`)) return;
        await bulkDeleteContacts(ids);
      } else if (bulkAction === "add_labels") {
        const labels = bulkValue
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean);
        if (labels.length === 0) return;
        await bulkAddLabels(ids, labels);
      } else if (bulkAction === "remove_labels") {
        const labels = bulkValue
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean);
        if (labels.length === 0) return;
        await bulkRemoveLabels(ids, labels);
      } else if (bulkAction === "change_category") {
        if (!bulkValue.trim()) return;
        await bulkChangeCategory(ids, bulkValue.trim());
      }
      setSelected(new Set());
      setBulkAction("");
      setBulkValue("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Bulk operation failed");
    }
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCsvContacts(text);
    if (parsed.length === 0) {
      alert("No valid contacts found in CSV");
      return;
    }
    if (!confirm(`Import ${parsed.length} contacts?`)) return;
    const { imported, skipped } = await importContacts(parsed);
    alert(`Imported: ${imported}, Skipped/Errors: ${skipped}`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExport = () => {
    const data =
      selected.size > 0
        ? contacts.filter((c) => selected.has(c.id))
        : contacts;
    const csv = exportContactsCsv(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gr8qm-contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    await deleteContact(id);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..."
          className="flex-1 bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          + Add Contact
        </button>
      </div>

      {/* Bulk actions + Import/Export */}
      <div className="flex flex-wrap gap-2 items-center">
        {selected.size > 0 && (
          <>
            <span className="text-sm text-gray-400">
              {selected.size} selected
            </span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="bg-oxford-elevated border border-oxford-border text-white rounded px-2 py-1 text-sm"
            >
              <option value="">Bulk action...</option>
              <option value="add_labels">Add Labels</option>
              <option value="remove_labels">Remove Labels</option>
              <option value="change_category">Change Category</option>
              <option value="delete">Delete</option>
            </select>
            {bulkAction && bulkAction !== "delete" && (
              <input
                type="text"
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                placeholder={
                  bulkAction === "change_category"
                    ? "New category"
                    : "Labels (comma separated)"
                }
                className="bg-oxford-elevated border border-oxford-border text-white rounded px-2 py-1 text-sm"
              />
            )}
            {bulkAction && (
              <button
                onClick={handleBulkAction}
                className="px-3 py-1 bg-orange hover:bg-orange/80 text-white rounded text-sm transition-colors"
              >
                Apply
              </button>
            )}
          </>
        )}
        <div className="ml-auto flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCsvImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-oxford-elevated hover:bg-oxford-border text-gray-300 rounded text-sm transition-colors"
          >
            Import CSV
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-oxford-elevated hover:bg-oxford-border text-gray-300 rounded text-sm transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Contact list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No contacts found</p>
          <p className="text-sm mt-1">
            Add contacts manually or import from CSV.
          </p>
        </div>
      ) : (
        <div className="bg-oxford-card border border-oxford-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-oxford-border text-left">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filtered.length > 0 && selected.size === filtered.length
                    }
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
                <th className="p-3 text-gray-400 font-medium">Name</th>
                <th className="p-3 text-gray-400 font-medium hidden sm:table-cell">
                  Email
                </th>
                <th className="p-3 text-gray-400 font-medium hidden md:table-cell">
                  Category
                </th>
                <th className="p-3 text-gray-400 font-medium hidden lg:table-cell">
                  Labels
                </th>
                <th className="p-3 text-gray-400 font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-oxford-border/50 hover:bg-white/5"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-3 text-white">
                    {c.first_name} {c.last_name || ""}
                    <div className="text-xs text-gray-500 sm:hidden">
                      {c.email}
                    </div>
                  </td>
                  <td className="p-3 text-gray-300 hidden sm:table-cell">
                    {c.email}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className="px-2 py-0.5 bg-oxford-elevated text-gray-300 rounded text-xs">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(c.labels || []).map((l) => (
                        <span
                          key={l}
                          className="px-1.5 py-0.5 bg-skyblue/10 text-skyblue rounded text-xs"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditContact(c)}
                        className="text-gray-400 hover:text-skyblue text-xs transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-gray-400 hover:text-red-400 text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAddModal || editContact) && (
        <ContactFormModal
          contact={editContact}
          onClose={() => {
            setShowAddModal(false);
            setEditContact(null);
          }}
        />
      )}
    </div>
  );
};

// ── Contact Form Modal ─────────────────────────────────────

const ContactFormModal: React.FC<{
  contact: Contact | null;
  onClose: () => void;
}> = ({ contact, onClose }) => {
  const [firstName, setFirstName] = useState(contact?.first_name || "");
  const [lastName, setLastName] = useState(contact?.last_name || "");
  const [email, setEmail] = useState(contact?.email || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const [category, setCategory] = useState(contact?.category || "general");
  const [labels, setLabels] = useState(
    (contact?.labels || []).join(", ")
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !email.trim()) {
      alert("First name and email are required.");
      return;
    }
    setSaving(true);
    try {
      const data = {
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        category: category.trim(),
        labels: labels
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        source: contact ? contact.source : "manual",
      };

      if (contact) {
        await updateContact(contact.id, data);
      } else {
        await createContact(data);
      }
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save contact");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-oxford-card border border-oxford-border rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-oxford-border">
          <h2 className="text-lg font-bold text-white">
            {contact ? "Edit Contact" : "Add Contact"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Labels (comma separated)
            </label>
            <input
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="e.g. training, vip, cohort4"
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-oxford-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : contact ? "Update" : "Add Contact"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// TEMPLATES TAB
// ════════════════════════════════════════════════════════════

const TemplatesTab: React.FC<{ templates: EmailTemplate[] }> = ({
  templates,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null);

  const handleCreateStarter = async (
    starter: (typeof starterTemplates)[number]
  ) => {
    try {
      await createEmailTemplate(starter);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create template");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await deleteEmailTemplate(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditTemplate(null);
            setShowEditor(true);
          }}
          className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + New Template
        </button>
      </div>

      {/* Starter templates */}
      {templates.length === 0 && (
        <div className="bg-oxford-card border border-oxford-border rounded-lg p-5">
          <h3 className="text-white font-semibold mb-3">
            Get started with a template
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {starterTemplates.map((starter, i) => (
              <button
                key={i}
                onClick={() => handleCreateStarter(starter)}
                className="p-4 bg-oxford-elevated hover:bg-oxford-border rounded-lg text-left transition-colors"
              >
                <span className="text-white font-medium text-sm">
                  {starter.name}
                </span>
                <span className="block text-gray-500 text-xs mt-1">
                  {starter.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Template list */}
      {templates.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-oxford-card border border-oxford-border rounded-lg p-5"
            >
              <h3 className="text-white font-semibold truncate">{t.name}</h3>
              <p className="text-gray-400 text-sm mt-1 truncate">
                {t.subject}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-oxford-elevated text-gray-400 rounded text-xs">
                {t.category}
              </span>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditTemplate(t);
                    setShowEditor(true);
                  }}
                  className="text-skyblue hover:text-skyblue/80 text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <TemplateEditorModal
          template={editTemplate}
          onClose={() => {
            setShowEditor(false);
            setEditTemplate(null);
          }}
        />
      )}
    </div>
  );
};

// ── Template Editor Modal ──────────────────────────────────

const TemplateEditorModal: React.FC<{
  template: EmailTemplate | null;
  onClose: () => void;
}> = ({ template, onClose }) => {
  const [name, setName] = useState(template?.name || "");
  const [subject, setSubject] = useState(template?.subject || "");
  const [previewText, setPreviewText] = useState(template?.preview_text || "");
  const [html, setHtml] = useState(template?.html || "");
  const [category, setCategory] = useState<EmailTemplate["category"]>(
    template?.category || "general"
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !subject.trim() || !html.trim()) {
      alert("Name, subject, and HTML are required.");
      return;
    }
    setSaving(true);
    try {
      if (template) {
        await updateEmailTemplate(template.id, {
          name: name.trim(),
          subject: subject.trim(),
          preview_text: previewText.trim() || null,
          html,
          category,
        });
      } else {
        await createEmailTemplate({
          name: name.trim(),
          subject: subject.trim(),
          preview_text: previewText.trim() || null,
          html,
          category,
        });
      }
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-oxford-card border border-oxford-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-oxford-border">
          <h2 className="text-lg font-bold text-white">
            {template ? "Edit Template" : "New Template"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as EmailTemplate["category"])
                }
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="general">General</option>
                <option value="training">Training</option>
                <option value="service">Service</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Preview Text
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Text shown in email client preview"
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              HTML Content *
            </label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={14}
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm font-mono"
            />
          </div>

          {/* HTML Preview */}
          {html && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Preview
              </label>
              <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-oxford-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : template ? "Update" : "Create Template"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailMarketing;
