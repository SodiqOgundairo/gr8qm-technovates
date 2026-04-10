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
} from "lucide-react";
import type { AnalyticsData } from "../../lib/analytics";
import { fetchAnalytics, formatMonthLabel } from "../../lib/analytics";
import { useGA4Analytics, type GA4TrafficStats } from "../../hooks/useGA4Analytics";

const COLORS = {
  blue: "#0098da",
  green: "#22c55e",
  purple: "#9333ea",
  orange: "#f97316",
  amber: "#f59e0b",
  red: "#ef4444",
  teal: "#14b8a6",
  pink: "#ec4899",
  gray: "#6b7280",
};

const PIE_COLORS = [
  COLORS.blue,
  COLORS.green,
  COLORS.orange,
  COLORS.purple,
  COLORS.amber,
  COLORS.red,
  COLORS.teal,
  COLORS.pink,
];

type Tab = "traffic" | "business";

const AnalyticsPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("traffic");
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [bizLoading, setBizLoading] = useState(true);
  const { stats: ga4, loading: ga4Loading, error: ga4Error } = useGA4Analytics(days);

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .finally(() => setBizLoading(false));
  }, []);

  const loading = tab === "traffic" ? ga4Loading : bizLoading;

  if (loading && ((tab === "traffic" && !ga4Error) || tab === "business")) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin w-8 h-8 border-2 border-skyblue border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Website traffic & business insights.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switcher */}
            <div className="flex bg-oxford-elevated rounded-lg p-1">
              {(["traffic", "business"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                    tab === t
                      ? "bg-skyblue text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Time range (traffic only) */}
            {tab === "traffic" && (
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="bg-oxford-elevated border border-oxford-border rounded-lg px-3 py-2 text-sm text-white outline-none"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last 365 days</option>
              </select>
            )}
          </div>
        </div>

        {/* ═══════════ TRAFFIC TAB ═══════════ */}
        {tab === "traffic" && (
          <>
            {/* GA4 data source indicator */}
            <div className="flex items-center gap-2 text-xs">
              {ga4Error ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-400">Using internal analytics (GA4 unavailable)</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-400">Live data from Google Analytics</span>
                </>
              )}
            </div>

            {/* Overview stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <TrafficStatCard
                label="Page Views"
                value={fmtNum(ga4.totalViews)}
                trend={ga4.viewsTrend}
                icon={<Eye size={16} />}
                color={COLORS.blue}
              />
              <TrafficStatCard
                label="Sessions"
                value={fmtNum(ga4.sessions30)}
                trend={ga4.sessionsTrend}
                icon={<MousePointerClick size={16} />}
                color={COLORS.green}
              />
              <TrafficStatCard
                label="Bounce Rate"
                value={`${ga4.bounceRate}%`}
                icon={<ArrowUpRight size={16} />}
                color={COLORS.orange}
              />
              <TrafficStatCard
                label="Pages/Session"
                value={ga4.avgPagesPerSession}
                icon={<Globe size={16} />}
                color={COLORS.purple}
              />
              <TrafficStatCard
                label="Direct Traffic"
                value={fmtNum(ga4.directTraffic)}
                icon={<ExternalLink size={16} />}
                color={COLORS.teal}
              />
            </div>

            {/* Daily views chart */}
            <ChartCard title="Daily Page Views">
              {ga4.dailyViews.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={ga4.dailyViews}>
                    <defs>
                      <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      tickFormatter={(d) => {
                        const dt = new Date(d);
                        return `${dt.getDate()}/${dt.getMonth() + 1}`;
                      }}
                    />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111118",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                      labelFormatter={(d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="Views"
                      stroke={COLORS.blue}
                      fill="url(#viewsGrad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Two-column: Top pages + Referrers */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <ChartCard title="Top Pages">
                {ga4.topPages.length === 0 ? (
                  <EmptyChart />
                ) : (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
                    {ga4.topPages.map((p, i) => {
                      const maxViews = ga4.topPages[0]?.views || 1;
                      const pct = Math.round((p.views / maxViews) * 100);
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-300 truncate max-w-[200px]" title={p.title}>
                              {p.path}
                            </span>
                            <span className="text-white font-medium ml-2 shrink-0">
                              {fmtNum(p.views)}
                            </span>
                          </div>
                          <div className="h-1.5 bg-oxford-elevated rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: COLORS.blue }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ChartCard>

              {/* Traffic Sources */}
              <ChartCard title="Traffic Sources">
                {ga4.topReferrers.length === 0 && ga4.directTraffic === 0 ? (
                  <EmptyChart />
                ) : (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
                    {/* Direct traffic first */}
                    {ga4.directTraffic > 0 && (
                      <SourceRow
                        source="Direct"
                        count={ga4.directTraffic}
                        max={Math.max(ga4.directTraffic, ga4.topReferrers[0]?.count || 0)}
                        color={COLORS.green}
                      />
                    )}
                    {ga4.topReferrers.map((r, i) => (
                      <SourceRow
                        key={i}
                        source={r.source}
                        count={r.count}
                        max={Math.max(ga4.directTraffic, ga4.topReferrers[0]?.count || 0)}
                        color={PIE_COLORS[(i + 1) % PIE_COLORS.length]}
                      />
                    ))}
                  </div>
                )}
              </ChartCard>
            </div>

            {/* Device breakdown */}
            <ChartCard title="Device Breakdown">
              {ga4.devices.desktop + ga4.devices.mobile + ga4.devices.tablet === 0 ? (
                <EmptyChart />
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Desktop", value: ga4.devices.desktop },
                          { name: "Mobile", value: ga4.devices.mobile },
                          { name: "Tablet", value: ga4.devices.tablet },
                        ].filter((d) => d.value > 0)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        <Cell fill={COLORS.blue} />
                        <Cell fill={COLORS.green} />
                        <Cell fill={COLORS.orange} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-4">
                    <DeviceRow
                      icon={<Monitor size={20} />}
                      label="Desktop"
                      count={ga4.devices.desktop}
                      total={ga4.devices.desktop + ga4.devices.mobile + ga4.devices.tablet}
                      color={COLORS.blue}
                    />
                    <DeviceRow
                      icon={<Smartphone size={20} />}
                      label="Mobile"
                      count={ga4.devices.mobile}
                      total={ga4.devices.desktop + ga4.devices.mobile + ga4.devices.tablet}
                      color={COLORS.green}
                    />
                    <DeviceRow
                      icon={<Tablet size={20} />}
                      label="Tablet"
                      count={ga4.devices.tablet}
                      total={ga4.devices.desktop + ga4.devices.mobile + ga4.devices.tablet}
                      color={COLORS.orange}
                    />
                  </div>
                </div>
              )}
            </ChartCard>
          </>
        )}

        {/* ═══════════ BUSINESS TAB ═══════════ */}
        {tab === "business" && data && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard label="Revenue" value={`₦${fmtNum(data.overview.totalRevenue)}`} color={COLORS.green} />
              <StatCard label="Applications" value={String(data.overview.totalApplications)} color={COLORS.blue} />
              <StatCard label="Invoices" value={String(data.overview.totalInvoices)} color={COLORS.orange} />
              <StatCard label="Certificates" value={String(data.overview.totalCertificates)} color={COLORS.purple} />
              <StatCard label="Alumni" value={String(data.overview.totalAlumni)} color={COLORS.teal} />
              <StatCard label="Events" value={String(data.overview.totalEvents)} color={COLORS.amber} />
              <StatCard label="Registrations" value={String(data.overview.totalEventRegistrations)} color={COLORS.pink} />
              <StatCard label="Contacts" value={String(data.overview.totalContacts)} color={COLORS.blue} />
              <StatCard label="Campaigns" value={String(data.overview.totalCampaigns)} color={COLORS.orange} />
              <StatCard label="Messages" value={String(data.overview.totalMessages)} color={COLORS.gray} />
            </div>

            {/* Revenue chart */}
            <ChartCard title="Revenue (12 months)">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.monthlyRevenue}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => `₦${fmtNum(v)}`} />
                  <Tooltip content={<CustomTooltip prefix="₦" />} />
                  <Area type="monotone" dataKey="amount" stroke={COLORS.green} fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Applications row */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ChartCard title="Applications by Course">
                {data.applicationsByCourse.length === 0 ? (
                  <EmptyChart />
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.applicationsByCourse} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <YAxis dataKey="course" type="category" width={120} tick={{ fill: "#9ca3af", fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill={COLORS.blue} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              <ChartCard title="Application Status">
                {data.applicationsByStatus.length === 0 ? (
                  <EmptyChart />
                ) : (
                  <div className="flex items-center justify-center gap-8">
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie data={data.applicationsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                          {data.applicationsByStatus.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {data.applicationsByStatus.map((item, i) => (
                        <div key={item.status} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-gray-400 capitalize">{item.status}</span>
                          <span className="text-white font-medium ml-auto">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ChartCard>
            </div>

            {/* Invoices + Certificates row */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ChartCard title="Invoice Status">
                {data.invoicesByStatus.length === 0 ? (
                  <EmptyChart />
                ) : (
                  <div className="flex items-center justify-center gap-8">
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie data={data.invoicesByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                          {data.invoicesByStatus.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {data.invoicesByStatus.map((item, i) => (
                        <div key={item.status} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-gray-400 capitalize">{item.status}</span>
                          <span className="text-white font-medium ml-auto">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ChartCard>

              <ChartCard title="Certificates Issued (12 months)">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.monthlyCertificates}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Email + Events row */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ChartCard title="Email Campaign Performance">
                {data.emailCampaignStats.total === 0 ? (
                  <EmptyChart label="No campaigns sent yet" />
                ) : (
                  <div className="space-y-4">
                    <EmailStatBar label="Delivered" value={data.emailCampaignStats.delivered} total={data.emailCampaignStats.total} color={COLORS.green} />
                    <EmailStatBar label="Opened" value={data.emailCampaignStats.opened} total={data.emailCampaignStats.total} color={COLORS.blue} />
                    <EmailStatBar label="Clicked" value={data.emailCampaignStats.clicked} total={data.emailCampaignStats.total} color={COLORS.purple} />
                    <EmailStatBar label="Bounced" value={data.emailCampaignStats.bounced} total={data.emailCampaignStats.total} color={COLORS.red} />
                    <p className="text-gray-600 text-xs text-right">{data.emailCampaignStats.total} total messages</p>
                  </div>
                )}
              </ChartCard>

              <ChartCard title="Events Overview">
                {data.eventsByStatus.length === 0 ? (
                  <EmptyChart label="No events created yet" />
                ) : (
                  <div className="space-y-3">
                    {data.eventsByStatus.map((item, i) => {
                      const total = data.eventsByStatus.reduce((s, e) => s + e.count, 0);
                      const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                      return (
                        <div key={item.status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400 capitalize">{item.status}</span>
                            <span className="text-white font-medium">{item.count} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-oxford-elevated rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-2 border-t border-oxford-border/50 flex justify-between text-sm">
                      <span className="text-gray-500">Total Registrations</span>
                      <span className="text-white font-medium">{data.overview.totalEventRegistrations}</span>
                    </div>
                  </div>
                )}
              </ChartCard>
            </div>

            {/* Recent Transactions */}
            <ChartCard title="Recent Transactions">
              {data.recentTransactions.length === 0 ? (
                <EmptyChart label="No transactions yet" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs border-b border-oxford-border/50">
                        <th className="text-left py-2 font-medium">Reference</th>
                        <th className="text-left py-2 font-medium">Customer</th>
                        <th className="text-right py-2 font-medium">Amount</th>
                        <th className="text-right py-2 font-medium">Status</th>
                        <th className="text-right py-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-oxford-border/20">
                          <td className="py-2.5 text-gray-300 font-mono text-xs">{tx.reference?.slice(0, 20) || "—"}</td>
                          <td className="py-2.5 text-white">{tx.customer_name || "—"}</td>
                          <td className="py-2.5 text-white text-right font-medium">₦{fmtNum(tx.amount)}</td>
                          <td className="py-2.5 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              tx.status === "success" || tx.status === "completed"
                                ? "bg-green-500/20 text-green-300"
                                : tx.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-red-500/20 text-red-300"
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-gray-500 text-right text-xs">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ChartCard>
          </>
        )}

        {tab === "business" && !data && (
          <div className="text-center py-32 text-gray-500">Failed to load business analytics.</div>
        )}
      </div>
    </AdminLayout>
  );
};

// ════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════════════

const TrafficStatCard: React.FC<{
  label: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, trend, icon, color }) => (
  <div className="bg-oxford-card border border-oxford-border rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-500 text-xs">{label}</span>
      <div style={{ color }} className="opacity-60">{icon}</div>
    </div>
    <p className="text-white text-xl font-bold">{value}</p>
    {trend !== undefined && trend !== 0 && (
      <div className={`flex items-center gap-1 mt-1 text-xs ${trend > 0 ? "text-green-400" : "text-red-400"}`}>
        {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{trend > 0 ? "+" : ""}{trend}% vs prev period</span>
      </div>
    )}
  </div>
);

const StatCard: React.FC<{ label: string; value: string; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div className="bg-oxford-card border border-oxford-border rounded-lg p-4">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
    <p className="text-white text-xl font-bold">{value}</p>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-oxford-card border border-oxford-border rounded-xl p-5">
    <h3 className="text-white font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const EmptyChart: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex items-center justify-center py-12 text-gray-600 text-sm">
    {label || "No data available"}
  </div>
);

const SourceRow: React.FC<{
  source: string;
  count: number;
  max: number;
  color: string;
}> = ({ source, count, max, color }) => {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-300 truncate max-w-[200px]">{source}</span>
        <span className="text-white font-medium ml-2 shrink-0">{fmtNum(count)}</span>
      </div>
      <div className="h-1.5 bg-oxford-elevated rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
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
    <div className="flex items-center gap-4">
      <div style={{ color }} className="opacity-70">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-300">{label}</span>
          <span className="text-white font-medium">{fmtNum(count)} ({pct}%)</span>
        </div>
        <div className="h-1.5 bg-oxford-elevated rounded-full overflow-hidden w-40">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
};

const EmailStatBar: React.FC<{
  label: string;
  value: number;
  total: number;
  color: string;
}> = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value} ({pct}%)</span>
      </div>
      <div className="h-2 bg-oxford-elevated rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  prefix?: string;
}> = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111118] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
      {label && <p className="text-gray-500 text-xs mb-1">{formatMonthLabel(label)}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-white text-sm font-medium">
          {prefix}{fmtNum(p.value)}
        </p>
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

export default AnalyticsPage;
