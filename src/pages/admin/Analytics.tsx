import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Monitor, Smartphone, Tablet, TrendingUp, TrendingDown, AlertCircle,
} from "lucide-react";
import type { AnalyticsData } from "../../lib/analytics";
import { fetchAnalytics, formatMonthLabel } from "../../lib/analytics";
import { useGA4Analytics } from "../../hooks/useGA4Analytics";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6", "#ec4899", "#6b7280"];

const TT_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

type Tab = "traffic" | "business";

const AnalyticsPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("traffic");
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [bizLoading, setBizLoading] = useState(true);
  const { stats: ga4, loading: ga4Loading, error: ga4Error, source: ga4Source } = useGA4Analytics(days);

  useEffect(() => {
    fetchAnalytics().then(setData).finally(() => setBizLoading(false));
  }, []);

  const loading = tab === "traffic" ? ga4Loading : bizLoading;

  if (loading && ((tab === "traffic" && !ga4Error) || tab === "business")) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics" subtitle="Traffic & business insights">
      <div className="flex flex-col gap-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex bg-white rounded-lg p-1 gap-0.5">
            {(["traffic", "business"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  tab === t ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "traffic" && (
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last 365 days</option>
            </select>
          )}
        </div>

        {/* ═══ TRAFFIC ═══ */}
        {tab === "traffic" && (
          <>
            {/* Source indicator */}
            {ga4Source === "ga4" && (
              <div className="flex items-center gap-2 text-[11px] text-green-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Live from Google Analytics
              </div>
            )}
            {ga4Source === "supabase" && (
              <div className="flex items-center gap-2 text-[11px] text-blue-500">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Internal analytics (page views)
              </div>
            )}
            {ga4Error && !ga4Source && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">No analytics data</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Ensure the <code className="bg-amber-100 px-1 rounded">page_views</code> table exists, or deploy the GA4 edge function.
                  </p>
                </div>
              </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <Stat label="Page Views" value={fmtNum(ga4.totalViews)} trend={ga4.viewsTrend} />
              <Stat label="Sessions" value={fmtNum(ga4.sessions30)} trend={ga4.sessionsTrend} />
              <Stat label="Bounce Rate" value={`${ga4.bounceRate}%`} />
              <Stat label="Pages / Session" value={ga4.avgPagesPerSession} />
              <Stat label="Direct Traffic" value={fmtNum(ga4.directTraffic)} />
            </div>

            {/* Daily views */}
            <Card title="Daily Page Views">
              {ga4.dailyViews.length === 0 ? <Empty /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={ga4.dailyViews}>
                    <defs>
                      <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(d) => `${new Date(d).getDate()}/${new Date(d).getMonth() + 1}`} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} allowDecimals={false} />
                    <Tooltip contentStyle={TT_STYLE} labelFormatter={(d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} />
                    <Area type="monotone" dataKey="count" name="Views" stroke="#3b82f6" fill="url(#vg)" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Top pages + referrers */}
            <div className="grid lg:grid-cols-2 gap-4">
              <Card title="Top Pages">
                {ga4.topPages.length === 0 ? <Empty /> : (
                  <div className="space-y-3">
                    {ga4.topPages.map((p, i) => {
                      const max = ga4.topPages[0]?.views || 1;
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500 truncate max-w-[220px]">{p.path}</span>
                            <span className="text-gray-900 font-medium ml-2 shrink-0 tabular-nums">{fmtNum(p.views)}</span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.round((p.views / max) * 100)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

              <Card title="Traffic Sources">
                {ga4.topReferrers.length === 0 && ga4.directTraffic === 0 ? <Empty /> : (
                  <div className="space-y-3">
                    {ga4.directTraffic > 0 && <BarRow label="Direct" value={ga4.directTraffic} max={Math.max(ga4.directTraffic, ga4.topReferrers[0]?.count || 0)} color="bg-green-400" />}
                    {ga4.topReferrers.map((r, i) => (
                      <BarRow key={i} label={r.source} value={r.count} max={Math.max(ga4.directTraffic, ga4.topReferrers[0]?.count || 0)} color="bg-blue-400" />
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Devices */}
            <Card title="Devices">
              {ga4.devices.desktop + ga4.devices.mobile + ga4.devices.tablet === 0 ? <Empty /> : (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Desktop", value: ga4.devices.desktop },
                          { name: "Mobile", value: ga4.devices.mobile },
                          { name: "Tablet", value: ga4.devices.tablet },
                        ].filter((d) => d.value > 0)}
                        dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3}
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#22c55e" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip contentStyle={TT_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {[
                      { icon: <Monitor size={16} />, label: "Desktop", count: ga4.devices.desktop, color: "#3b82f6" },
                      { icon: <Smartphone size={16} />, label: "Mobile", count: ga4.devices.mobile, color: "#22c55e" },
                      { icon: <Tablet size={16} />, label: "Tablet", count: ga4.devices.tablet, color: "#f59e0b" },
                    ].map((d) => {
                      const total = ga4.devices.desktop + ga4.devices.mobile + ga4.devices.tablet;
                      const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
                      return (
                        <div key={d.label} className="flex items-center gap-3">
                          <div className="text-gray-400">{d.icon}</div>
                          <span className="text-sm text-gray-600 w-16">{d.label}</span>
                          <span className="text-sm font-medium text-gray-900 tabular-nums">{fmtNum(d.count)}</span>
                          <span className="text-xs text-gray-400">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          </>
        )}

        {/* ═══ BUSINESS ═══ */}
        {tab === "business" && data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <Stat label="Revenue" value={`₦${fmtNum(data.overview.totalRevenue)}`} />
              <Stat label="Applications" value={String(data.overview.totalApplications)} />
              <Stat label="Invoices" value={String(data.overview.totalInvoices)} />
              <Stat label="Certificates" value={String(data.overview.totalCertificates)} />
              <Stat label="Alumni" value={String(data.overview.totalAlumni)} />
              <Stat label="Events" value={String(data.overview.totalEvents)} />
              <Stat label="Registrations" value={String(data.overview.totalEventRegistrations)} />
              <Stat label="Contacts" value={String(data.overview.totalContacts)} />
              <Stat label="Campaigns" value={String(data.overview.totalCampaigns)} />
              <Stat label="Messages" value={String(data.overview.totalMessages)} />
            </div>

            <Card title="Revenue (12 months)">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data.monthlyRevenue}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `₦${fmtNum(v)}`} />
                  <Tooltip contentStyle={TT_STYLE} labelFormatter={formatMonthLabel} formatter={(v: number) => [`₦${fmtNum(v)}`, "Revenue"]} />
                  <Area type="monotone" dataKey="amount" stroke="#22c55e" fill="url(#rg)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid lg:grid-cols-2 gap-4">
              <Card title="Applications by Course">
                {data.applicationsByCourse.length === 0 ? <Empty /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.applicationsByCourse} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <YAxis dataKey="course" type="category" width={110} tick={{ fill: "#64748b", fontSize: 10 }} />
                      <Tooltip contentStyle={TT_STYLE} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>

              <Card title="Application Status">
                {data.applicationsByStatus.length === 0 ? <Empty /> : (
                  <PieSection data={data.applicationsByStatus} nameKey="status" />
                )}
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <Card title="Invoice Status">
                {data.invoicesByStatus.length === 0 ? <Empty /> : (
                  <PieSection data={data.invoicesByStatus} nameKey="status" />
                )}
              </Card>

              <Card title="Certificates Issued (12 months)">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.monthlyCertificates}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} allowDecimals={false} />
                    <Tooltip contentStyle={TT_STYLE} labelFormatter={formatMonthLabel} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <Card title="Email Campaigns">
                {data.emailCampaignStats.total === 0 ? <Empty label="No campaigns sent" /> : (
                  <div className="space-y-3">
                    {[
                      { label: "Delivered", value: data.emailCampaignStats.delivered, color: "bg-green-400" },
                      { label: "Opened", value: data.emailCampaignStats.opened, color: "bg-blue-400" },
                      { label: "Clicked", value: data.emailCampaignStats.clicked, color: "bg-purple-400" },
                      { label: "Bounced", value: data.emailCampaignStats.bounced, color: "bg-red-400" },
                    ].map((s) => {
                      const pct = data.emailCampaignStats.total > 0 ? Math.round((s.value / data.emailCampaignStats.total) * 100) : 0;
                      return (
                        <div key={s.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">{s.label}</span>
                            <span className="text-gray-900 font-medium tabular-nums">{s.value} ({pct}%)</span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${s.color} rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

              <Card title="Events">
                {data.eventsByStatus.length === 0 ? <Empty label="No events yet" /> : (
                  <div className="space-y-3">
                    {data.eventsByStatus.map((item, i) => {
                      const total = data.eventsByStatus.reduce((s, e) => s + e.count, 0);
                      const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                      return (
                        <div key={item.status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500 capitalize">{item.status}</span>
                            <span className="text-gray-900 font-medium tabular-nums">{item.count} ({pct}%)</span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>

            <Card title="Recent Transactions">
              {data.recentTransactions.length === 0 ? <Empty label="No transactions" /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                        <th className="text-left pb-3">Reference</th>
                        <th className="text-left pb-3">Customer</th>
                        <th className="text-right pb-3">Amount</th>
                        <th className="text-right pb-3">Status</th>
                        <th className="text-right pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentTransactions.map((tx) => (
                        <tr key={tx.id} className="border-t border-gray-100">
                          <td className="py-3 font-mono text-xs text-gray-400">{tx.reference?.slice(0, 14) || "—"}</td>
                          <td className="py-3 text-gray-700">{tx.customer_name || "—"}</td>
                          <td className="py-3 text-right font-medium text-gray-900 tabular-nums">₦{fmtNum(tx.amount)}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              tx.status === "success" || tx.status === "completed" ? "bg-green-50 text-green-600" :
                              tx.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                            }`}>{tx.status}</span>
                          </td>
                          <td className="py-3 text-right text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}

        {tab === "business" && !data && (
          <div className="text-center py-32 text-gray-400 text-sm">Failed to load.</div>
        )}
      </div>
    </AdminLayout>
  );
};

/* ── Shared components ── */

const Stat: React.FC<{ label: string; value: string; trend?: number }> = ({ label, value, trend }) => (
  <div className="bg-white rounded-2xl p-5">
    <p className="text-[11px] uppercase tracking-wider font-medium text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1 leading-none tabular-nums">{value}</p>
    {trend !== undefined && trend !== 0 && (
      <div className={`flex items-center gap-1 mt-1.5 text-[11px] ${trend > 0 ? "text-green-600" : "text-red-500"}`}>
        {trend > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {trend > 0 ? "+" : ""}{trend}%
      </div>
    )}
  </div>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-6">
    <h3 className="text-[13px] font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const Empty: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex items-center justify-center py-10 text-sm text-gray-300">{label || "No data yet"}</div>
);

const BarRow: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-500 truncate max-w-[200px]">{label}</span>
      <span className="text-gray-900 font-medium ml-2 shrink-0 tabular-nums">{fmtNum(value)}</span>
    </div>
    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${max > 0 ? Math.round((value / max) * 100) : 0}%` }} />
    </div>
  </div>
);

const PieSection: React.FC<{ data: { status: string; count: number }[]; nameKey: string }> = ({ data: items }) => (
  <div className="flex items-center justify-center gap-6">
    <ResponsiveContainer width={140} height={140}>
      <PieChart>
        <Pie data={items} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3}>
          {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={TT_STYLE} />
      </PieChart>
    </ResponsiveContainer>
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={item.status} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
          <span className="text-gray-500 capitalize">{item.status}</span>
          <span className="text-gray-900 font-medium ml-auto tabular-nums">{item.count}</span>
        </div>
      ))}
    </div>
  </div>
);

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

export default AnalyticsPage;
