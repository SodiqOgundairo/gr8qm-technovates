import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  subscribeGlossary,
  createTerm,
  updateTerm,
  deleteTerm,
  type GlossaryTerm,
} from "../../lib/glossary";

const CATEGORIES = ["general", "web", "design", "data", "ai"];

export default function AdminGlossary() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GlossaryTerm | null>(null);

  // Form state
  const [formTerm, setFormTerm] = useState("");
  const [formDef, setFormDef] = useState("");
  const [formCat, setFormCat] = useState("general");
  const [formPub, setFormPub] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const channel = subscribeGlossary(setTerms);
    return () => { channel.unsubscribe(); };
  }, []);

  const filtered = search.trim()
    ? terms.filter(
        (t) =>
          t.term.toLowerCase().includes(search.toLowerCase()) ||
          t.definition.toLowerCase().includes(search.toLowerCase())
      )
    : terms;

  const openNew = () => {
    setEditing(null);
    setFormTerm("");
    setFormDef("");
    setFormCat("general");
    setFormPub(true);
    setShowModal(true);
  };

  const openEdit = (t: GlossaryTerm) => {
    setEditing(t);
    setFormTerm(t.term);
    setFormDef(t.definition);
    setFormCat(t.category);
    setFormPub(t.published);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formTerm.trim() || !formDef.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateTerm(editing.id, {
          term: formTerm.trim(),
          definition: formDef.trim(),
          category: formCat,
          published: formPub,
        });
      } else {
        await createTerm({
          term: formTerm.trim(),
          definition: formDef.trim(),
          category: formCat,
          published: formPub,
        });
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save term:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, term: string) => {
    if (!confirm(`Delete "${term}"?`)) return;
    try {
      await deleteTerm(id);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const togglePublished = async (t: GlossaryTerm) => {
    await updateTerm(t.id, { published: !t.published });
  };

  return (
    <AdminLayout title="Glossary" subtitle={`${terms.length} terms`}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-skyblue transition-colors"
          />
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-skyblue text-white rounded-lg text-sm font-medium hover:bg-skyblue/90 transition-colors"
        >
          <Plus size={16} /> Add Term
        </button>
      </div>

      {/* Term list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            {search ? "No terms match your search." : "No glossary terms yet. Add one to get started."}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{t.term}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-500">
                      {t.category}
                    </span>
                    {!t.published && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-yellow-700">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {t.definition}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePublished(t)}
                    className="p-2 text-gray-300 hover:text-gray-600 transition-colors"
                    title={t.published ? "Unpublish" : "Publish"}
                  >
                    {t.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => openEdit(t)}
                    className="p-2 text-gray-300 hover:text-skyblue transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.term)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  {editing ? "Edit Term" : "Add Term"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term *
                  </label>
                  <input
                    type="text"
                    value={formTerm}
                    onChange={(e) => setFormTerm(e.target.value)}
                    placeholder="e.g. API"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-skyblue transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Definition *
                  </label>
                  <textarea
                    value={formDef}
                    onChange={(e) => setFormDef(e.target.value)}
                    placeholder="A clear, concise definition..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-skyblue transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formCat}
                      onChange={(e) => setFormCat(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-skyblue transition-colors"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formPub}
                        onChange={(e) => setFormPub(e.target.checked)}
                        className="w-4 h-4 text-skyblue rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Published</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formTerm.trim() || !formDef.trim()}
                  className="px-5 py-2.5 bg-skyblue text-white rounded-lg text-sm font-medium hover:bg-skyblue/90 disabled:opacity-40 transition-colors"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Add Term"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
