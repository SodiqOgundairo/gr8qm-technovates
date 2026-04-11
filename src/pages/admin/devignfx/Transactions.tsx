import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import type { DevignFXLicense } from "../../../types/devignfx";
import { subscribeLicenses } from "../../../lib/devignfx-licenses";

const DevignFXTransactions: React.FC = () => {
  const [licenses, setLicenses] = useState<DevignFXLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("all");

  useEffect(() => {
    const ch = subscribeLicenses((data) => {
      setLicenses(data);
      setLoading(false);
    });
    return () => { ch.unsubscribe(); };
  }, []);

  // Only licenses that have payment data
  const transactions = licenses
    .filter((l) => l.payment_reference || l.amount_paid)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filtered = transactions.filter((l) => {
    if (filterTier !== "all" && l.tier !== filterTier) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        (l.payment_reference || "").toLowerCase().includes(q) ||
        (l.coupon_code || "").toLowerCase().includes(q) ||
        l.license_key.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalRevenue = transactions.reduce((sum, l) => sum + (l.amount_paid || 0), 0);
  const thisMonthRevenue = transactions
    .filter((l) => {
      const d = new Date(l.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, l) => sum + (l.amount_paid || 0), 0);
  const withCoupon = transactions.filter((l) => l.coupon_code).length;

  const handleExportCSV = () => {
    const headers = ["Date", "Reference", "Client", "Email", "Tier", "Amount", "Coupon", "License Key"];
    const csvContent = [
      headers.join(","),
      ...filtered.map((l) =>
        [
          new Date(l.created_at).toLocaleDateString(),
          l.payment_reference || "",
          `"${l.name || ""}"`,
          l.email || "",
          l.tier,
          l.amount_paid || 0,
          l.coupon_code || "",
          l.license_key,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `devignfx-transactions_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              DevignFX <span className="text-emerald-400">Transactions</span>
            </h1>
            <p className="text-gray-400 mt-1">Payment history for all DevignFX license purchases.</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Transactions", value: transactions.length, color: "text-white" },
            { label: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, color: "text-emerald-400" },
            { label: "This Month", value: `₦${thisMonthRevenue.toLocaleString()}`, color: "text-amber-400" },
            { label: "Used Coupons", value: withCoupon, color: "text-gray-300" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0a1a0a] border border-emerald-500/10 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email, reference, coupon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-[#0a1a0a] border border-emerald-500/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/30"
          />
          <div className="flex gap-2">
            {["all", "standard", "premium", "enterprise"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterTier(t)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filterTier === t
                    ? "bg-emerald-500 text-black"
                    : "bg-[#0a1a0a] border border-emerald-500/10 text-gray-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No transactions found</p>
            <p className="text-sm mt-1">DevignFX payment records will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-emerald-500/10">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Client</th>
                  <th className="pb-3 pr-4">Reference</th>
                  <th className="pb-3 pr-4">Tier</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Coupon</th>
                  <th className="pb-3">License</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-emerald-500/5 hover:bg-emerald-500/[0.03]">
                    <td className="py-3 pr-4 text-xs">
                      <span className="text-white">{new Date(l.created_at).toLocaleDateString()}</span>
                      <span className="block text-gray-600 text-[10px]">{new Date(l.created_at).toLocaleTimeString()}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-white text-sm">{l.name || "—"}</span>
                      {l.email && <span className="block text-[10px] text-gray-500">{l.email}</span>}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-mono text-[11px] text-gray-400">{l.payment_reference || "—"}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                        l.tier === "standard" ? "bg-emerald-500/20 text-emerald-300" :
                        l.tier === "premium" ? "bg-purple-500/20 text-purple-300" :
                        "bg-amber-500/20 text-amber-300"
                      }`}>
                        {l.tier}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-bold text-emerald-400">
                      ₦{(l.amount_paid || 0).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      {l.coupon_code ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">
                          {l.coupon_code}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="font-mono text-[10px] text-gray-500">{l.license_key}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DevignFXTransactions;
