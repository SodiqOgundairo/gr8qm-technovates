import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "devign";
import type { Coupon } from "../../../types/checkout";
import {
  subscribeCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../../lib/coupons";

const DevignFXCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const ch = subscribeCoupons((data) => {
      setCoupons(data.filter((c) => c.applies_to === "devignfx"));
      setLoading(false);
    });
    return () => { ch.unsubscribe(); };
  }, []);

  const handleToggle = async (coupon: Coupon) => {
    await updateCoupon(coupon.id, { active: !coupon.active });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await deleteCoupon(id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              DevignFX <span className="text-emerald-400">Coupons</span>
            </h1>
            <p className="text-gray-400 mt-1">Manage discount codes for DevignFX purchases.</p>
          </div>
          <button
            onClick={() => { setEditCoupon(null); setShowModal(true); }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Create Coupon
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Coupons", value: coupons.length, color: "text-emerald-400" },
            { label: "Active", value: coupons.filter((c) => c.active).length, color: "text-white" },
            { label: "Total Uses", value: coupons.reduce((sum, c) => sum + c.times_used, 0), color: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0a1a0a] border border-emerald-500/10 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No DevignFX coupons yet</p>
            <p className="text-sm mt-1">Create a coupon to offer discounts on DevignFX licenses.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map((c) => (
              <div
                key={c.id}
                className={`bg-[#0a1a0a] border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${
                  c.active ? "border-emerald-500/10" : "border-emerald-500/5 opacity-60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold font-mono text-lg tracking-wider">
                      {c.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      c.active ? "bg-emerald-500/20 text-emerald-300" : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>
                      {c.discount_type === "percentage"
                        ? `${c.discount_value}% off`
                        : `₦${c.discount_value.toLocaleString()} off`}
                    </span>
                    <span>
                      Used: {c.times_used}{c.max_uses !== null ? `/${c.max_uses}` : ""}
                    </span>
                    {c.expires_at && (
                      <span>Expires: {new Date(c.expires_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(c)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors ${
                      c.active
                        ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    }`}
                  >
                    {c.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => { setEditCoupon(c); setShowModal(true); }}
                    className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded text-xs hover:bg-emerald-500/30 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <DevignFXCouponModal
          coupon={editCoupon}
          onClose={() => { setShowModal(false); setEditCoupon(null); }}
        />
      )}
    </AdminLayout>
  );
};

// ═══════════════════════════════════════════════════════════
// COUPON FORM MODAL — DevignFX themed
// ═══════════════════════════════════════════════════════════

const DevignFXCouponModal: React.FC<{
  coupon: Coupon | null;
  onClose: () => void;
}> = ({ coupon: c, onClose }) => {
  const [code, setCode] = useState(c?.code || "");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(c?.discount_type || "percentage");
  const [discountValue, setDiscountValue] = useState(c?.discount_value || 10);
  const appliesTo = "devignfx" as const;
  const [maxUses, setMaxUses] = useState<string>(c?.max_uses?.toString() || "");
  const [expiresAt, setExpiresAt] = useState(
    c?.expires_at ? new Date(c.expires_at).toISOString().split("T")[0] : ""
  );
  const [active, setActive] = useState(c?.active ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!code.trim()) {
      alert("Coupon code is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: discountValue,
        applies_to: appliesTo,
        max_uses: maxUses ? parseInt(maxUses) : null,
        expires_at: expiresAt ? new Date(expiresAt + "T23:59:59").toISOString() : null,
        active,
      };
      if (c) {
        await updateCoupon(c.id, payload);
      } else {
        await createCoupon(payload);
      }
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "DEVFX-";
    for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
    setCode(result);
  };

  const inputCls = "w-full bg-[#0a1a0a] border border-emerald-500/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/30";

  return (
    <Dialog open={true} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="!bg-gradient-to-br !from-[#0f1f0f] !via-[#0a1a0a] !to-[#0f1f0f] !border-emerald-500/10 !text-white sm:!max-w-lg !max-h-[90vh] !overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{c ? "Edit" : "Create"} DevignFX Coupon</DialogTitle>
          <DialogDescription className="text-gray-400">
            {c ? "Update the coupon details below." : "Set up a new discount code for DevignFX purchases."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Code *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. DEVFX-SAVE20"
                className={`${inputCls} flex-1 font-mono uppercase`}
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs transition-colors whitespace-nowrap"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                className={inputCls}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₦)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Value {discountType === "percentage" ? "(%)" : "(₦)"}
              </label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                min={0}
                max={discountType === "percentage" ? 100 : undefined}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Uses (empty = unlimited)</label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                min={0}
                placeholder="Unlimited"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Expires At</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="rounded accent-emerald-500" />
            Active
          </label>

          {/* Preview */}
          <div className="bg-[#0a1a0a] border border-emerald-500/10 rounded-lg p-4 text-center">
            <p className="text-gray-500 text-xs">Preview</p>
            <p className="text-white font-mono text-2xl font-bold tracking-wider mt-1">{code || "CODE"}</p>
            <p className="text-emerald-400 text-sm mt-1">
              {discountType === "percentage"
                ? `${discountValue}% off`
                : `₦${discountValue.toLocaleString()} off`}
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : c ? "Update" : "Create Coupon"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DevignFXCoupons;
