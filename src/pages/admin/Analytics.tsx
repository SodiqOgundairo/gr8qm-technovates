import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  ArrowUpRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import type { AnalyticsData } from "../../lib/analytics";
import { fetchAnalytics, formatMonthLabel } from "../../lib/analytics";
import { useGA4Analytics } from "../../hooks/useGA4Analytics";

const CHART_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6", "#ec4899", "#6b7280"];

type Tab = "traffic" | "business";

const AnalyticsPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("traffic");
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [bizLoading, setBizLoading] = useState(true);
  const { stats: ga4, loading: ga4Loading, error: ga4Error, source: ga4Source } = useGA4Analytics(days);

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .finally(() => setBizLoading(false));
  }, []);

  const loading = tab === "traffic" ? ga4Loading : bizLoading;

  if (loading && ((tab === "traffic" && !ga4Error) || tab === "business")) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  const ga4HasData = ga4.totalViews > 0 || ga4.sessions30 > 0;

  return (
    <AdminLayout title="Analytics" subtitle="Traffic & business insights">
      <div className="space-y-6 max-w-7xl">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {(["traffic", "business"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  tab === t ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"
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
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-300"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last 365 days</option>
            </select>
          )}
        </div>

        {/* ═══════════ TRAFFIC TAB ═══════════ */}
        {tab === "traffic" && (
          <>
            {/* Data source indicator */}
            {ga4Source === "ga4" && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Live from Google Analytics
              </div>
            )}

            {ga4Source === "supabase" && (
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Internal analytics (from page views)
                <span className="text-gray-400 ml-1">— connect GA4 for richer data</span>
              </div>
            )}

            {ga4Error && !ga4Source && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">No analytics data available</p>
                  <p className="text-xs text-amber-600 mt-1">
                    Ensure the <code className="bg-amber-100 px-1 rounded">page_views</code> table exists, or deploy the GA4 edge function for live Google Analytics data.
                  </p>
                </div>
              </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard label="Page Views" value={fmtNum(ga4.totalViews)} trend={ga4.viewsTrend} icon={<Eye size={16} />} color="text-blue-600" bg="bg-blue-50" />
              <StatCard label="Sessions" value={fmtNum(ga4.sessions30)} trend={ga4.sessionsTrend} icon={<MousePointerClick size={16} />} color="text-green-600" bg="bg-green-50" />
              <StatCard label="Bounce Rate" value={`${ga4.bounceRate}%`} icon={<ArrowUpRight size={16} />} color="text-amber-600" bg="bg-amber-50" />
              <StatCard label="Pages/Session" value={ga4.avgPagesPerSession} icon={<Globe size={16} />} color="text-purple-600" bg="bg-purple-50" />
              <StatCard label="Direct Traffic" value={fmtNum(ga4.directTraffic)} icon={<ExternalLink size={16} />} color="text-teal-600" bg="bg-teal-50" />
            </div>

            {/* Daily views chart */}
            <Card title="Daily Page Views">
              {ga4.dailyViews.length === 0 ? (
                <Empty />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={ga4.dailyViews}>
                    <defs>
                      <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(d) => `${new Date(d).getDate()}/${new Date(d).getMonth() + 1}`} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} labelFormatter={(d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
                    <Area type="monotone" dataKey="count" name="Views" stroke="#3b82f6" fill="url(#viewsGrad)" strokeWidth={2} />
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
                            <span className="text-gray-600 truncate max-w-[220px]" title={p.title}>{p.path}</span>
                            <span className="text-gray-900 font-medium ml-2 shrink-0">{fmtNum(p.views)}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round((p.views / max) * 100)}%` }} />
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
                    {ga4.directTraffic > 0 && (
                      <BarRow label="Direct" value={ga4.directTraffic} max={Math.max(ga4.directTraffic, ga4.topReferrers[0]?.count || 0)} color="bg-green-500" />
                    )}
                    {ga4.topReferrers.map((r, i) => (
                      <BarRow key={i} label={r.source} value={r.count} max={Math.max(ga4.directTraffic, ga4.topReferrers[0]?.count || 0)} color={`bg-blue-${400 + (i % 3) * 100}`} />
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Device breakdown */}
            <Card title="Devices">
              {ga4.devices.desktop + ga4.devices.mobile + ga4.devices.tablet === 0 ? <Empty /> : (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Desktop", value: ga4.devices.desktop },
                          { name: "Mobile", value: ga4.devices.mobile },
                          { name: "Tablet", value: ga4.devices.tablet },
                        ].filter((d) => d.value > 0)}
                        dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3}
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#22c55e" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-4">
                    <DeviceRow icon={<Monitor size={18} />} label="Desktop" count={ga4.devices.desktop} total={ga4.devices.desktop + ga4.devices.mobile + ga4.devices.tablet} color="bg-blue-500" />
                    <DeviceRow icon={<Smartphone size={18} />} label="Mobile" count={ga4.devices.mobile} total={ga4.devices.desktop + ga4.devices.mobile + ga4.devices.tablet} color="bg-green-500" />
                    <DeviceRow icon={<Tablet size={18} />} label="Tablet" count={ga4.devices.tablet} total={ga4.devices.desktop + ga4.devices.mobile + ga4.devices.tablet} color="bg-amber-500" />
                  </div>
                </div>
              )}
            </Card>
          </>
        )}

        {/* ═══════════ BUSINESS TAB ═══════════ */}
        {tab === "business" && data && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <BizStat label="Revenue" value={`₦${fmtNum(data.overview.totalRevenue)}`} />
              <BizStat label="Applications" value={data.overview.totalApplications} />
              <BizStat label="Invoices" value={data.overview.totalInvoices} />
              <BizStat label="Certificates" value={data.overview.totalCertificates} />
              <BizStat label="Alumni" value={data.overview.totalAlumni} />
              <BizStat label="Events" value={data.overview.totalEvents} />
              <BizStat label="Registrations" value={data.overview.totalEventRegistrations} />
              <BizStat label="Contacts" value={data.overview.totalContacts} />
              <BizStat label="Campaigns" value={data.overview.totalCampaigns} />
              <BizStat label="Messages" value={data.overview.totalMessages} />
            </div>

            {/* Revenue chart */}
            <Card title="Revenue (12 months)">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.monthlyRevenue}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `₦${fmtNum(v)}`} />
                  <Tooltip contentStyle={tooltipStyle} labelFormatter={formatMonthLabel} formatter={(v: number) => [`₦${fmtNum(v)}`, "Revenue"]} />
                  <Area type="monotone" dataKey="amount" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Applications */}
            <div className="grid lg:grid-cols-2 gap-4">
              <Card title="Applications by Course">
                {data.applicationsByCourse.length === 0 ? <Empty /> : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={data.applicationsByCourse} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis dataKey="course" type="category" width={120} tick={{ fill: "#64748b", fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>

              <Card title="Application Status">
                {data.applicationsByStatus.length === 0 ? <Empty /> : (
                  <div className="flex items-center justify-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie data={data.applicationsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                          {data.applicationsByStatus.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {data.applicationsByStatus.map((item, i) => (
                        <div key={item.status} className="flex items-center gap-2 text-sm">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span className="text-gray-500 capitalize">{item.status}</span>
                          <span className="text-gray-900 font-medium ml-auto">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Invoices + Certificates */}
            <div className="grid lg:grid-cols-2 gap-4">
              <Card title="Invoice Status">
                {data.invoicesByStatus.length === 0 ? <Empty /> : (
                  <div className="flex items-center justify-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie data={data.invoicesByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                          {data.invoicesByStatus.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {data.invoicesByStatus.map((item, i) => (
                        <div key={item.status} className="flex items-center gap-2 text-sm">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span className="text-gray-500 capitalize">{item.status}</span>
                          <span className="text-gray-900 font-medium ml-auto">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <Card title="Certificates Issued (12 months)">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.monthlyCertificates}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} labelFormatter={formatMonthLabel} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Email + Events */}
            <div className="grid lg:grid-cols-2 gap-4">
              <Card title="Email Campaigns">
                {data.emailCampaignStats.total === 0 ? <Empty label="No campaigns sent yet" /> : (
                  <div className="space-y-4">
                    <ProgressBar label="Delivered" value={data.emailCampaignStats.delivered} total={data.emailCampaignStats.total} color="bg-green-500" />
                    <ProgressBar label="Opened" value={data.emailCampaignStats.opened} total={data.emailCampaignStats.total} color="bg-blue-500" />
                    <ProgressBar label="Clicked" value={data.emailCampaignStats.clicked} total={data.emailCampaignStats.total} color="bg-purple-500" />
                    <ProgressBar label="Bounced" value={data.emailCampaignStats.bounced} total={data.emailCampaignStats.total} color="bg-red-500" />
                    <p className="text-gray-400 text-xs text-right">{data.emailCampaignStats.total} total</p>
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
                            <span className="text-gray-900 font-medium">{item.count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
                      <span className="text-gray-400">Total Registrations</span>
                      <span className="text-gray-900 font-medium">{data.overview.totalEventRegistrations}</span>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card title="Recent Transactions">
              {data.recentTransactions.length === 0 ? <Empty label="No transactions yet" /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 border-b border-gray-100">
                        <th className="text-left py-2 font-medium">Reference</th>
                        <th className="text-left py-2 font-medium">Customer</th>
                        <th className="text-right py-2 font-medium">Amount</th>
                        <th className="text-right py-2 font-medium">Status</th>
                        <th className="text-right py-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 font-mono text-xs text-gray-500">{tx.reference?.slice(0, 16) || "—"}</td>
                          <td className="py-2.5 text-gray-900">{tx.customer_name || "—"}</td>
                          <td className="py-2.5 text-right font-medium text-gray-900">₦{fmtNum(tx.amount)}</td>
                          <td className="py-2.5 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              tx.status === "success" || tx.status === "completed" ? "bg-green-50 text-green-700" :
                              tx.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                            }`}>{tx.status}</span>
                          </td>
                          <td className="py-2.5 text-gray-400 text-right text-xs">{new Date(tx.created_at).toLocaleDateString()}</td>
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
          <div className="text-center py-32 text-gray-400">Failed to load business analytics.</div>
        )}
      </div>
    </AdminLayout>
  );
};

// ════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════════════

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  color: "#111827",
  fontSize: "13px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
};

const StatCard: React.FC<{
  label: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}> = ({ label, value, trend, icon, color, bg }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <div className={`${bg} ${color} p-1.5 rounded-lg`}>{icon}</div>
    </div>
    <p className="text-xl font-bold text-gray-900">{value}</p>
    {trend !== undefined && trend !== 0 && (
      <div className={`flex items-center gap-1 mt-1 text-xs ${trend > 0 ? "text-green-600" : "text-red-500"}`}>
        {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{trend > 0 ? "+" : ""}{trend}%</span>
      </div>
    )}
  </div>
);

const BizStat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4">
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
    <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const Empty: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex items-center justify-center py-10 text-gray-400 text-sm">{label || "No data yet"}</div>
);

const BarRow: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 truncate max-w-[200px]">{label}</span>
        <span className="text-gray-900 font-medium ml-2 shrink-0">{fmtNum(value)}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const DeviceRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  count: number;
  total: number;
  color: string;
}> = ({ icon, label, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <div className="flex-1 min-w-[140px]">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="text-gray-900 font-medium">{fmtNum(count)} ({pct}%)</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-900 font-medium">{value} ({pct}%)</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

export default AnalyticsPage;
