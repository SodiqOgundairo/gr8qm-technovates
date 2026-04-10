import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CertificateTemplate, DesignElement } from "../../types/certificates";
import {
  createCertificateTemplate,
  updateCertificateTemplate,
} from "../../lib/certificates";
import { supabase } from "../../utils/supabase";

// ════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════

const A4 = {
  landscape: { w: 297, h: 210 },
  portrait: { w: 210, h: 297 },
};
const CANVAS_WIDTH = 700;

const SAMPLE_DATA: Record<string, string> = {
  name: "John Doe",
  course: "Web Development Fundamentals",
  date: "10 April 2026",
  certNumber: "GR8QM-2026-0001",
  company: "GR8QM Technovates",
  sigName: "Faith Ogunbayo",
  sigTitle: "Founder & CEO, GR8QM Technovates",
};

const VARIABLES: { key: string; label: string }[] = [
  { key: "name", label: "Recipient Name" },
  { key: "course", label: "Course Name" },
  { key: "date", label: "Issue Date" },
  { key: "certNumber", label: "Certificate #" },
  { key: "company", label: "Company Name" },
  { key: "sigName", label: "Signature Name" },
  { key: "sigTitle", label: "Signature Title" },
];

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

let _seq = 1;
function genId() {
  return `el_${Date.now()}_${_seq++}`;
}

function resolveVars(text: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => SAMPLE_DATA[k] || `{{${k}}}`);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function getDefaultElements(accent: string): DesignElement[] {
  let z = 0;
  return [
    {
      id: genId(), type: "text", label: "Company Name",
      x: 48.5, y: 22, width: 200, height: 10,
      content: "GR8QM TECHNOVATES",
      fontSize: 14, fontWeight: "bold", color: "#ffffff",
      textAlign: "center", textTransform: "uppercase", letterSpacing: 3,
      zIndex: z++,
    },
    {
      id: genId(), type: "text", label: "Tagline",
      x: 73.5, y: 33, width: 150, height: 8,
      content: "Faith that builds. Impact that lasts.",
      fontSize: 8, fontWeight: "normal", color: accent,
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
    {
      id: genId(), type: "line", label: "Top Divider",
      x: 118.5, y: 42, width: 60, height: 0.5,
      lineColor: accent, lineThickness: 0.5,
      zIndex: z++,
    },
    {
      id: genId(), type: "text", label: "Certificate Title",
      x: 23.5, y: 48, width: 250, height: 16,
      content: "Certificate of Completion",
      fontSize: 28, fontWeight: "bold", color: accent,
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
    {
      id: genId(), type: "text", label: "Subheader",
      x: 48.5, y: 68, width: 200, height: 10,
      content: "This is to certify that",
      fontSize: 12, fontWeight: "normal", color: "#cccccc",
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
    {
      id: genId(), type: "variable", label: "Recipient Name",
      x: 23.5, y: 80, width: 250, height: 18,
      content: "{{name}}",
      fontSize: 32, fontWeight: "bold", color: "#ffffff",
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
    {
      id: genId(), type: "text", label: "Description",
      x: 48.5, y: 100, width: 200, height: 8,
      content: "has successfully completed",
      fontSize: 11, fontWeight: "normal", color: "#cccccc",
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
    {
      id: genId(), type: "variable", label: "Course Name",
      x: 23.5, y: 110, width: 250, height: 12,
      content: "{{course}}",
      fontSize: 18, fontWeight: "bold", color: accent,
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
    {
      id: genId(), type: "variable", label: "Issue Date",
      x: 73.5, y: 126, width: 150, height: 6,
      content: "Issued: {{date}}",
      fontSize: 9, fontWeight: "normal", color: "#999999",
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
    {
      id: genId(), type: "variable", label: "Certificate Number",
      x: 73.5, y: 132, width: 150, height: 6,
      content: "Certificate No: {{certNumber}}",
      fontSize: 9, fontWeight: "normal", color: "#999999",
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
    {
      id: genId(), type: "line", label: "Signature Line",
      x: 118.5, y: 148, width: 60, height: 0.3,
      lineColor: "#666666", lineThickness: 0.3,
      zIndex: z++,
    },
    {
      id: genId(), type: "variable", label: "Signature Name",
      x: 98.5, y: 152, width: 100, height: 6,
      content: "{{sigName}}",
      fontSize: 10, fontWeight: "bold", color: "#ffffff",
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
    {
      id: genId(), type: "variable", label: "Signature Title",
      x: 98.5, y: 158, width: 100, height: 6,
      content: "{{sigTitle}}",
      fontSize: 8, fontWeight: "normal", color: "#999999",
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
    {
      id: genId(), type: "qrcode", label: "QR Code",
      x: 260, y: 176, width: 22, height: 22,
      zIndex: z++,
    },
    {
      id: genId(), type: "text", label: "Footer",
      x: 23.5, y: 200, width: 250, height: 6,
      content: "GR8QM Technovates — Faith that builds. Impact that lasts.",
      fontSize: 7, fontWeight: "normal", color: "#666666",
      textAlign: "center", textTransform: "none",
      zIndex: z++,
    },
  ];
}

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

const CertificateDesigner: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  // ── Template settings ──────────────────────────
  const [templateName, setTemplateName] = useState("Untitled Template");
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const [bgColor, setBgColor] = useState("#05235a");
  const [accentColor, setAccentColor] = useState("#0098da");
  const [borderStyle, setBorderStyle] = useState<"none" | "single" | "double" | "ornate">("double");
  const [coursePrefix, setCoursePrefix] = useState("GR8QM");

  // ── Elements ───────────────────────────────────
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── UI state ───────────────────────────────────
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rightTab, setRightTab] = useState<"properties" | "settings">("properties");

  // ── Drag state ─────────────────────────────────
  const dragRef = useRef<{
    elId: string;
    startMx: number;
    startMy: number;
    startElX: number;
    startElY: number;
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ── Derived ────────────────────────────────────
  const page = A4[orientation];
  const scale = CANVAS_WIDTH / page.w;
  const canvasH = page.h * scale;

  const selectedEl = useMemo(
    () => elements.find((e) => e.id === selectedId) || null,
    [elements, selectedId]
  );

  const sortedElements = useMemo(
    () => [...elements].sort((a, b) => a.zIndex - b.zIndex),
    [elements]
  );

  // ── Load existing template ─────────────────────
  useEffect(() => {
    if (!id) {
      setElements(getDefaultElements("#0098da"));
      return;
    }
    supabase
      .from("certificate_templates")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          navigate("/admin/certificates");
          return;
        }
        const t = data as CertificateTemplate;
        setTemplateName(t.name);
        setOrientation(t.orientation);
        setBgColor(t.background_color);
        setAccentColor(t.accent_color);
        setBorderStyle(t.border_style);
        setCoursePrefix(t.course_prefix);
        if (t.elements && t.elements.length > 0) {
          setElements(t.elements);
        } else {
          setElements(getDefaultElements(t.accent_color));
        }
        setLoading(false);
      });
  }, [id, navigate]);

  // ── Save ───────────────────────────────────────
  const handleSave = async () => {
    if (!templateName.trim()) return;
    setSaving(true);
    setSaved(false);
    try {
      const payload = {
        name: templateName.trim(),
        orientation,
        background_color: bgColor,
        accent_color: accentColor,
        logo_url: null,
        border_style: borderStyle,
        header_text: elements.find((e) => e.label === "Certificate Title")?.content || "Certificate of Completion",
        subheader_text: elements.find((e) => e.label === "Subheader")?.content || null,
        footer_text: elements.find((e) => e.label === "Footer")?.content || null,
        signature_name: SAMPLE_DATA.sigName,
        signature_title: SAMPLE_DATA.sigTitle,
        signature_image_url: null,
        show_qr_code: elements.some((e) => e.type === "qrcode"),
        course_prefix: coursePrefix.trim().toUpperCase(),
        elements,
      };
      if (isEdit) {
        await updateCertificateTemplate(id!, payload);
      } else {
        const created = await createCertificateTemplate(payload as Omit<CertificateTemplate, "id" | "created_at" | "updated_at">);
        navigate(`/admin/certificates/designer/${created.id}`, { replace: true });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── Element CRUD ───────────────────────────────
  const addElement = useCallback(
    (type: DesignElement["type"], defaults?: Partial<DesignElement>) => {
      const maxZ = elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex)) + 1 : 0;
      const base: DesignElement = {
        id: genId(),
        type,
        label: defaults?.label || type.charAt(0).toUpperCase() + type.slice(1),
        x: page.w / 2 - 50,
        y: page.h / 2 - 5,
        width: 100,
        height: 10,
        fontSize: 12,
        fontWeight: "normal",
        color: "#ffffff",
        textAlign: "center",
        textTransform: "none",
        opacity: 1,
        zIndex: maxZ,
        ...defaults,
      };
      setElements((prev) => [...prev, base]);
      setSelectedId(base.id);
      setRightTab("properties");
    },
    [elements, page]
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<DesignElement>) => {
      setElements((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    },
    []
  );

  const deleteElement = useCallback(
    (id: string) => {
      setElements((prev) => prev.filter((e) => e.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [selectedId]
  );

  const duplicateElement = useCallback(
    (id: string) => {
      const el = elements.find((e) => e.id === id);
      if (!el) return;
      const maxZ = Math.max(...elements.map((e) => e.zIndex)) + 1;
      const copy: DesignElement = { ...el, id: genId(), x: el.x + 5, y: el.y + 5, zIndex: maxZ, label: el.label + " copy" };
      setElements((prev) => [...prev, copy]);
      setSelectedId(copy.id);
    },
    [elements]
  );

  const moveLayer = useCallback(
    (id: string, direction: "up" | "down") => {
      setElements((prev) => {
        const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
        const idx = sorted.findIndex((e) => e.id === id);
        if (idx < 0) return prev;
        const swapIdx = direction === "up" ? idx + 1 : idx - 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
        const newEls = [...prev];
        const el = newEls.find((e) => e.id === sorted[idx].id)!;
        const swap = newEls.find((e) => e.id === sorted[swapIdx].id)!;
        const tmpZ = el.zIndex;
        el.zIndex = swap.zIndex;
        swap.zIndex = tmpZ;
        return [...newEls];
      });
    },
    []
  );

  // ── Drag handlers ──────────────────────────────
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        setSelectedId(null);
      }
    },
    []
  );

  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, elId: string) => {
      e.stopPropagation();
      setSelectedId(elId);
      const el = elements.find((x) => x.id === elId);
      if (!el) return;
      dragRef.current = {
        elId,
        startMx: e.clientX,
        startMy: e.clientY,
        startElX: el.x,
        startElY: el.y,
      };
      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = (ev.clientX - dragRef.current.startMx) / scale;
        const dy = (ev.clientY - dragRef.current.startMy) / scale;
        const newX = clamp(dragRef.current.startElX + dx, 0, page.w - 5);
        const newY = clamp(dragRef.current.startElY + dy, 0, page.h - 5);
        setElements((prev) =>
          prev.map((el) =>
            el.id === dragRef.current!.elId ? { ...el, x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 } : el
          )
        );
      };
      const onUp = () => {
        dragRef.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [elements, scale, page]
  );

  // ── Keyboard shortcuts ─────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedId) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      const step = e.shiftKey ? 5 : 1;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteElement(selectedId);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        updateElement(selectedId, { x: Math.max(0, (selectedEl?.x || 0) - step) });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        updateElement(selectedId, { x: Math.min(page.w - 5, (selectedEl?.x || 0) + step) });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        updateElement(selectedId, { y: Math.max(0, (selectedEl?.y || 0) - step) });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        updateElement(selectedId, { y: Math.min(page.h - 5, (selectedEl?.y || 0) + step) });
      } else if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        duplicateElement(selectedId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, selectedEl, deleteElement, updateElement, duplicateElement, page]);

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-skyblue border-t-transparent rounded-full" />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="h-screen bg-[#0a0a0f] flex flex-col overflow-hidden select-none">
      {/* ── TOP BAR ─────────────────────────────────────── */}
      <div className="h-14 bg-[#111118] border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/certificates")}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            &larr; Back
          </button>
          <div className="w-px h-6 bg-white/10" />
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="bg-transparent text-white font-semibold text-sm border-b border-transparent hover:border-white/20 focus:border-skyblue focus:outline-none px-1 py-0.5 w-56"
          />
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-green-400 text-xs animate-pulse">Saved</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Template"}
          </button>
        </div>
      </div>

      {/* ── MAIN AREA ───────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - Element Palette + Layers */}
        <div className="w-56 bg-[#111118] border-r border-white/10 flex flex-col flex-shrink-0 overflow-hidden">
          {/* Add Elements */}
          <div className="p-3 border-b border-white/10">
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Add Element
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              <PaletteBtn
                label="Text"
                icon="T"
                onClick={() =>
                  addElement("text", {
                    label: "Text",
                    content: "Your text here",
                    width: 100,
                    height: 10,
                  })
                }
              />
              <PaletteBtn
                label="Line"
                icon="—"
                onClick={() =>
                  addElement("line", {
                    label: "Divider",
                    width: 60,
                    height: 0.5,
                    lineColor: accentColor,
                    lineThickness: 0.5,
                  })
                }
              />
              <PaletteBtn
                label="QR Code"
                icon="⊞"
                onClick={() =>
                  addElement("qrcode", {
                    label: "QR Code",
                    width: 22,
                    height: 22,
                    x: page.w - 35,
                    y: page.h - 35,
                  })
                }
              />
              <PaletteBtn
                label="Image"
                icon="🖼"
                onClick={() =>
                  addElement("image", {
                    label: "Image",
                    width: 30,
                    height: 30,
                    imageUrl: "",
                  })
                }
              />
            </div>

            {/* Variable shortcuts */}
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-3 mb-2">
              Variables
            </h3>
            <div className="space-y-1">
              {VARIABLES.map((v) => (
                <button
                  key={v.key}
                  onClick={() =>
                    addElement("variable", {
                      label: v.label,
                      content: `{{${v.key}}}`,
                      width: v.key === "name" ? 250 : v.key === "course" ? 200 : 150,
                      height: v.key === "name" ? 18 : 8,
                      fontSize: v.key === "name" ? 32 : v.key === "course" ? 18 : 10,
                      fontWeight: v.key === "name" || v.key === "course" ? "bold" : "normal",
                      color: v.key === "course" ? accentColor : "#ffffff",
                    })
                  }
                  className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors truncate"
                >
                  <span className="text-skyblue font-mono mr-1">{`{{${v.key}}}`}</span>
                  <span className="text-gray-600">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Layers */}
          <div className="flex-1 overflow-y-auto p-3">
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Layers ({elements.length})
            </h3>
            <div className="space-y-0.5">
              {[...sortedElements].reverse().map((el) => (
                <button
                  key={el.id}
                  onClick={() => { setSelectedId(el.id); setRightTab("properties"); }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all flex items-center gap-2 group ${
                    selectedId === el.id
                      ? "bg-skyblue/20 text-skyblue"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] opacity-50 w-4 flex-shrink-0">
                    {el.type === "text" ? "T" : el.type === "variable" ? "V" : el.type === "line" ? "—" : el.type === "qrcode" ? "⊞" : "◻"}
                  </span>
                  <span className="truncate flex-1">{el.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 flex-shrink-0"
                    onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER - Canvas */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-[#0a0a0f]">
          <div
            ref={canvasRef}
            className="relative flex-shrink-0 shadow-2xl"
            style={{
              width: `${page.w * scale}px`,
              height: `${canvasH}px`,
              backgroundColor: bgColor,
            }}
            onMouseDown={handleCanvasMouseDown}
          >
            {/* Border decoration */}
            <CanvasBorder style={borderStyle} color={accentColor} />

            {/* Top/bottom accent stripes */}
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: accentColor }} />
            <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: accentColor }} />

            {/* Elements */}
            {sortedElements.map((el) => (
              <CanvasElement
                key={el.id}
                element={el}
                scale={scale}
                isSelected={selectedId === el.id}
                onMouseDown={(e) => handleElementMouseDown(e, el.id)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL - Properties / Settings */}
        <div className="w-64 bg-[#111118] border-l border-white/10 flex flex-col flex-shrink-0 overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setRightTab("properties")}
              className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
                rightTab === "properties" ? "text-skyblue border-b-2 border-skyblue" : "text-gray-500 hover:text-white"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setRightTab("settings")}
              className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
                rightTab === "settings" ? "text-skyblue border-b-2 border-skyblue" : "text-gray-500 hover:text-white"
              }`}
            >
              Template
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {rightTab === "properties" ? (
              selectedEl ? (
                <PropertiesPanel
                  element={selectedEl}
                  onChange={(updates) => updateElement(selectedEl.id, updates)}
                  onDelete={() => deleteElement(selectedEl.id)}
                  onDuplicate={() => duplicateElement(selectedEl.id)}
                  onMoveUp={() => moveLayer(selectedEl.id, "up")}
                  onMoveDown={() => moveLayer(selectedEl.id, "down")}
                  accentColor={accentColor}
                />
              ) : (
                <div className="text-center py-12 text-gray-600 text-xs">
                  Select an element on the canvas
                </div>
              )
            ) : (
              <SettingsPanel
                orientation={orientation}
                setOrientation={setOrientation}
                bgColor={bgColor}
                setBgColor={setBgColor}
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                borderStyle={borderStyle}
                setBorderStyle={setBorderStyle}
                coursePrefix={coursePrefix}
                setCoursePrefix={setCoursePrefix}
              />
            )}
          </div>

          {/* Keyboard hints */}
          <div className="p-3 border-t border-white/10 text-[10px] text-gray-600 space-y-0.5">
            <p>Arrow keys: move 1mm (Shift: 5mm)</p>
            <p>Delete: remove element</p>
            <p>Ctrl+D: duplicate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// PALETTE BUTTON
// ════════════════════════════════════════════════════════════

const PaletteBtn: React.FC<{
  label: string;
  icon: string;
  onClick: () => void;
}> = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-[10px]"
  >
    <span className="text-base leading-none">{icon}</span>
    {label}
  </button>
);

// ════════════════════════════════════════════════════════════
// CANVAS BORDER
// ════════════════════════════════════════════════════════════

const CanvasBorder: React.FC<{ style: string; color: string }> = ({ style: s, color }) => {
  if (s === "none") return null;
  const base = "absolute pointer-events-none";
  if (s === "single") {
    return <div className={base} style={{ inset: "8px", border: `2px solid ${color}` }} />;
  }
  if (s === "double") {
    return (
      <>
        <div className={base} style={{ inset: "6px", border: `1.5px solid ${color}` }} />
        <div className={base} style={{ inset: "10px", border: `1px solid ${color}`, opacity: 0.6 }} />
      </>
    );
  }
  // ornate
  return (
    <>
      <div className={base} style={{ inset: "6px", border: `2px solid ${color}` }} />
      <div className={base} style={{ inset: "10px", border: `1px solid ${color}`, opacity: 0.5 }} />
    </>
  );
};

// ════════════════════════════════════════════════════════════
// CANVAS ELEMENT
// ════════════════════════════════════════════════════════════

const CanvasElement: React.FC<{
  element: DesignElement;
  scale: number;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}> = ({ element: el, scale, isSelected, onMouseDown }) => {
  const ptToPx = (pt: number) => pt * 0.3528 * scale;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${el.x * scale}px`,
    top: `${el.y * scale}px`,
    width: `${el.width * scale}px`,
    height: `${el.height * scale}px`,
    opacity: el.opacity ?? 1,
    zIndex: el.zIndex + 10,
    cursor: "move",
  };

  const selectionStyle: React.CSSProperties = isSelected
    ? { outline: "2px solid #0098da", outlineOffset: "1px" }
    : {};

  if (el.type === "line") {
    return (
      <div
        style={{
          ...baseStyle,
          ...selectionStyle,
          backgroundColor: el.lineColor || "#666666",
          minHeight: "2px",
        }}
        onMouseDown={onMouseDown}
      />
    );
  }

  if (el.type === "qrcode") {
    return (
      <div
        style={{
          ...baseStyle,
          ...selectionStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed rgba(255,255,255,0.3)",
        }}
        onMouseDown={onMouseDown}
      >
        <div className="text-center">
          <div className="grid grid-cols-3 gap-px mx-auto w-fit">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5"
                style={{ backgroundColor: i % 2 === 0 ? "rgba(255,255,255,0.6)" : "transparent" }}
              />
            ))}
          </div>
          <span className="text-[6px] text-white/40 mt-0.5 block">QR</span>
        </div>
      </div>
    );
  }

  if (el.type === "image") {
    return (
      <div
        style={{
          ...baseStyle,
          ...selectionStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: el.imageUrl ? "none" : "1px dashed rgba(255,255,255,0.2)",
          overflow: "hidden",
        }}
        onMouseDown={onMouseDown}
      >
        {el.imageUrl ? (
          <img src={el.imageUrl} alt="" className="w-full h-full object-contain" />
        ) : (
          <span className="text-[8px] text-white/30">Image</span>
        )}
      </div>
    );
  }

  // text or variable
  const displayText = el.type === "variable" ? resolveVars(el.content || "") : el.content || "";
  const transformed =
    el.textTransform === "uppercase"
      ? displayText.toUpperCase()
      : el.textTransform === "capitalize"
        ? displayText.replace(/\b\w/g, (c) => c.toUpperCase())
        : displayText;

  return (
    <div
      style={{
        ...baseStyle,
        ...selectionStyle,
        display: "flex",
        alignItems: "center",
        justifyContent:
          el.textAlign === "center" ? "center" : el.textAlign === "right" ? "flex-end" : "flex-start",
        fontSize: `${ptToPx(el.fontSize || 12)}px`,
        fontWeight: el.fontWeight || "normal",
        color: el.color || "#ffffff",
        letterSpacing: el.letterSpacing ? `${el.letterSpacing * scale * 0.3}px` : undefined,
        fontFamily: "Helvetica, Arial, sans-serif",
        whiteSpace: "nowrap",
        overflow: "hidden",
        lineHeight: 1.2,
      }}
      onMouseDown={onMouseDown}
    >
      <span className="truncate w-full" style={{ textAlign: el.textAlign || "center" }}>
        {transformed}
      </span>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// PROPERTIES PANEL
// ════════════════════════════════════════════════════════════

const PropertiesPanel: React.FC<{
  element: DesignElement;
  onChange: (updates: Partial<DesignElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  accentColor: string;
}> = ({ element: el, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown }) => (
  <div className="space-y-4">
    {/* Header */}
    <div>
      <PropInput label="Label" value={el.label} onChange={(v) => onChange({ label: v })} />
    </div>

    {/* Position & Size */}
    <PropSection title="Position & Size">
      <div className="grid grid-cols-2 gap-2">
        <PropNumber label="X (mm)" value={el.x} onChange={(v) => onChange({ x: v })} step={0.5} />
        <PropNumber label="Y (mm)" value={el.y} onChange={(v) => onChange({ y: v })} step={0.5} />
        <PropNumber label="W (mm)" value={el.width} onChange={(v) => onChange({ width: v })} step={0.5} min={1} />
        <PropNumber label="H (mm)" value={el.height} onChange={(v) => onChange({ height: v })} step={0.1} min={0.1} />
      </div>
    </PropSection>

    {/* Content (text / variable) */}
    {(el.type === "text" || el.type === "variable") && (
      <PropSection title="Content">
        <div>
          <label className="block text-[10px] text-gray-500 mb-1">
            {el.type === "variable" ? "Template (use {{var}})" : "Text"}
          </label>
          <textarea
            value={el.content || ""}
            onChange={(e) => onChange({ content: e.target.value })}
            rows={2}
            className="w-full bg-black/30 border border-white/10 text-white rounded px-2 py-1.5 text-xs focus:border-skyblue focus:outline-none"
          />
        </div>
      </PropSection>
    )}

    {/* Typography */}
    {(el.type === "text" || el.type === "variable") && (
      <PropSection title="Typography">
        <div className="grid grid-cols-2 gap-2">
          <PropNumber label="Size (pt)" value={el.fontSize || 12} onChange={(v) => onChange({ fontSize: v })} min={4} max={72} step={1} />
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Weight</label>
            <select
              value={el.fontWeight || "normal"}
              onChange={(e) => onChange({ fontWeight: e.target.value as "normal" | "bold" })}
              className="w-full bg-black/30 border border-white/10 text-white rounded px-2 py-1.5 text-xs"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <PropColor label="Color" value={el.color || "#ffffff"} onChange={(v) => onChange({ color: v })} />
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Align</label>
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => onChange({ textAlign: a })}
                  className={`flex-1 py-1 rounded text-[10px] transition-colors ${
                    el.textAlign === a
                      ? "bg-skyblue text-white"
                      : "bg-black/30 text-gray-500 hover:text-white"
                  }`}
                >
                  {a === "left" ? "◀" : a === "center" ? "◆" : "▶"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Transform</label>
            <select
              value={el.textTransform || "none"}
              onChange={(e) => onChange({ textTransform: e.target.value as "none" | "uppercase" | "capitalize" })}
              className="w-full bg-black/30 border border-white/10 text-white rounded px-2 py-1.5 text-xs"
            >
              <option value="none">None</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </div>
          <PropNumber label="Spacing" value={el.letterSpacing || 0} onChange={(v) => onChange({ letterSpacing: v })} step={0.5} min={0} max={20} />
        </div>
      </PropSection>
    )}

    {/* Line properties */}
    {el.type === "line" && (
      <PropSection title="Line">
        <div className="grid grid-cols-2 gap-2">
          <PropColor label="Color" value={el.lineColor || "#666666"} onChange={(v) => onChange({ lineColor: v })} />
          <PropNumber label="Thickness" value={el.lineThickness || 0.5} onChange={(v) => onChange({ lineThickness: v, height: v })} step={0.1} min={0.1} max={5} />
        </div>
      </PropSection>
    )}

    {/* Image properties */}
    {el.type === "image" && (
      <PropSection title="Image">
        <PropInput label="Image URL" value={el.imageUrl || ""} onChange={(v) => onChange({ imageUrl: v })} placeholder="https://..." />
      </PropSection>
    )}

    {/* Opacity */}
    <PropSection title="Appearance">
      <PropNumber label="Opacity" value={el.opacity ?? 1} onChange={(v) => onChange({ opacity: v })} step={0.05} min={0} max={1} />
    </PropSection>

    {/* Actions */}
    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
      <ActionBtn label="▲ Up" onClick={onMoveUp} />
      <ActionBtn label="▼ Down" onClick={onMoveDown} />
      <ActionBtn label="Duplicate" onClick={onDuplicate} />
      <ActionBtn label="Delete" onClick={onDelete} danger />
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════
// SETTINGS PANEL
// ════════════════════════════════════════════════════════════

const SettingsPanel: React.FC<{
  orientation: "landscape" | "portrait";
  setOrientation: (v: "landscape" | "portrait") => void;
  bgColor: string;
  setBgColor: (v: string) => void;
  accentColor: string;
  setAccentColor: (v: string) => void;
  borderStyle: "none" | "single" | "double" | "ornate";
  setBorderStyle: (v: "none" | "single" | "double" | "ornate") => void;
  coursePrefix: string;
  setCoursePrefix: (v: string) => void;
}> = ({
  orientation, setOrientation,
  bgColor, setBgColor,
  accentColor, setAccentColor,
  borderStyle, setBorderStyle,
  coursePrefix, setCoursePrefix,
}) => (
  <div className="space-y-4">
    <PropSection title="Page">
      <div>
        <label className="block text-[10px] text-gray-500 mb-1">Orientation</label>
        <div className="flex gap-1.5">
          {(["landscape", "portrait"] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOrientation(o)}
              className={`flex-1 py-1.5 rounded text-xs transition-colors ${
                orientation === o
                  ? "bg-skyblue text-white"
                  : "bg-black/30 text-gray-500 hover:text-white"
              }`}
            >
              {o === "landscape" ? "⬭ Landscape" : "⬯ Portrait"}
            </button>
          ))}
        </div>
      </div>
    </PropSection>

    <PropSection title="Colors">
      <div className="grid grid-cols-2 gap-2">
        <PropColor label="Background" value={bgColor} onChange={setBgColor} />
        <PropColor label="Accent" value={accentColor} onChange={setAccentColor} />
      </div>
    </PropSection>

    <PropSection title="Border">
      <select
        value={borderStyle}
        onChange={(e) => setBorderStyle(e.target.value as typeof borderStyle)}
        className="w-full bg-black/30 border border-white/10 text-white rounded px-2 py-1.5 text-xs"
      >
        <option value="none">None</option>
        <option value="single">Single</option>
        <option value="double">Double</option>
        <option value="ornate">Ornate</option>
      </select>
    </PropSection>

    <PropSection title="Certificate Number">
      <PropInput
        label="Prefix"
        value={coursePrefix}
        onChange={setCoursePrefix}
        placeholder="GR8QM"
      />
      <p className="text-[10px] text-gray-600 mt-1">
        Numbers will be: {coursePrefix.toUpperCase()}-2026-0001
      </p>
    </PropSection>
  </div>
);

// ════════════════════════════════════════════════════════════
// SHARED PROPERTY CONTROLS
// ════════════════════════════════════════════════════════════

const PropSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
      {title}
    </h4>
    {children}
  </div>
);

const PropInput: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-[10px] text-gray-500 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-black/30 border border-white/10 text-white rounded px-2 py-1.5 text-xs focus:border-skyblue focus:outline-none"
    />
  </div>
);

const PropNumber: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}> = ({ label, value, onChange, step = 1, min, max }) => (
  <div>
    <label className="block text-[10px] text-gray-500 mb-1">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      step={step}
      min={min}
      max={max}
      className="w-full bg-black/30 border border-white/10 text-white rounded px-2 py-1.5 text-xs focus:border-skyblue focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  </div>
);

const PropColor: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[10px] text-gray-500 mb-1">{label}</label>
    <div className="flex gap-1.5">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-7 rounded cursor-pointer border-0 bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-black/30 border border-white/10 text-white rounded px-2 py-1 text-xs font-mono focus:border-skyblue focus:outline-none"
      />
    </div>
  </div>
);

const ActionBtn: React.FC<{
  label: string;
  onClick: () => void;
  danger?: boolean;
}> = ({ label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
      danger
        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
    }`}
  >
    {label}
  </button>
);

export default CertificateDesigner;
