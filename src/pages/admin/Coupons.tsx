import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import type { Coupon } from "../../types/checkout";
import {
  subscribeCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../lib/coupons";

const CouponsAdmin: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const ch = subscribeCoupons((data) => {
      setCoupons(data);
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
            <h1 className="text-2xl font-bold text-white">Coupons & Discounts</h1>
            <p className="text-gray-400 mt-1">Create and manage discount codes.</p>
          </div>
          <button
            onClick={() => { setEditCoupon(null); setShowModal(true); }}
            className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Create Coupon
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-skyblue border-t-transparent rounded-full mx-auto" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No coupons yet</p>
            <p className="text-sm mt-1">Create a coupon to offer discounts to customers.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map((c) => (
              <div
                key={c.id}
                className={`bg-oxford-card border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${
                  c.active ? "border-oxford-border" : "border-oxford-border/50 opacity-60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold font-mono text-lg tracking-wider">
                      {c.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      c.active ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-400"
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
                    <span className="capitalize">Applies to: {c.applies_to}</span>
                    <span>
                      Used: {c.times_used}{c.max_uses !== null ? `/${c.max_uses}` : ""}
                    </span>
                    {c.expires_at && (
                      <span>
                        Expires: {new Date(c.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(c)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors ${
                      c.active
                        ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                        : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    }`}
                  >
                    {c.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => { setEditCoupon(c); setShowModal(true); }}
                    className="px-3 py-1.5 bg-skyblue/20 text-skyblue rounded text-xs hover:bg-skyblue/30 transition-colors"
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
        <CouponFormModal
          coupon={editCoupon}
          onClose={() => { setShowModal(false); setEditCoupon(null); }}
        />
      )}
    </AdminLayout>
  );
};

// ═══════════════════════════════════════════════════════════
// COUPON FORM MODAL
// ═══════════════════════════════════════════════════════════

const CouponFormModal: React.FC<{
  coupon: Coupon | null;
  onClose: () => void;
}> = ({ coupon: c, onClose }) => {
  const [code, setCode] = useState(c?.code || "");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(c?.discount_type || "percentage");
  const [discountValue, setDiscountValue] = useState(c?.discount_value || 10);
  const [appliesTo, setAppliesTo] = useState<"all" | "courses" | "invoices">(c?.applies_to === "devignfx" ? "all" : c?.applies_to || "all");
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
    let result = "GR8QM-";
    for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
    setCode(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-oxford-card border border-oxford-border rounded-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-oxford-border">
          <h2 className="text-lg font-bold text-white">{c ? "Edit" : "Create"} Coupon</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Code *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SAVE20"
                className="flex-1 bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm font-mono uppercase"
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs transition-colors whitespace-nowrap"
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
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
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
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Applies To</label>
            <select
              value={appliesTo}
              onChange={(e) => setAppliesTo(e.target.value as "all" | "courses" | "invoices")}
              className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All (Courses & Invoices)</option>
              <option value="courses">Courses Only</option>
              <option value="invoices">Invoices Only</option>
            </select>
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
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Expires At</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-oxford-elevated border border-oxford-border text-white rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="rounded" />
            Active
          </label>

          {/* Preview */}
          <div className="bg-oxford-elevated rounded-lg p-4 text-center">
            <p className="text-gray-500 text-xs">Preview</p>
            <p className="text-white font-mono text-2xl font-bold tracking-wider mt-1">{code || "CODE"}</p>
            <p className="text-skyblue text-sm mt-1">
              {discountType === "percentage"
                ? `${discountValue}% off`
                : `₦${discountValue.toLocaleString()} off`}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-oxford-border">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : c ? "Update" : "Create Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponsAdmin;
