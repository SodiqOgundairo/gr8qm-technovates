import { supabase } from "../utils/supabase";

// ════════════════════════════════════════════════════════════
// ANALYTICS DATA FETCHING
// ════════════════════════════════════════════════════════════

export interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalApplications: number;
    totalInvoices: number;
    totalMessages: number;
    totalCertificates: number;
    totalAlumni: number;
    totalEvents: number;
    totalEventRegistrations: number;
    totalContacts: number;
    totalCampaigns: number;
  };
  monthlyRevenue: { month: string; amount: number }[];
  applicationsByStatus: { status: string; count: number }[];
  applicationsByCourse: { course: string; count: number }[];
  invoicesByStatus: { status: string; count: number }[];
  emailCampaignStats: {
    total: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
  monthlyCertificates: { month: string; count: number }[];
  eventsByStatus: { status: string; count: number }[];
  recentTransactions: {
    id: string;
    reference: string;
    customer_name: string;
    amount: number;
    status: string;
    created_at: string;
  }[];
}

function getMonthKey(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getLast12Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

export function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  const d = new Date(parseInt(year), parseInt(month) - 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const last12 = getLast12Months();

  // Safe query helper — returns { count: 0, data: [] } if table doesn't exist
  async function safeCount(table: string): Promise<number> {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
    return count || 0;
  }

  // Parallel queries
  const [
    appCount,
    invoiceCount,
    msgCount,
    certCount,
    alumniCount,
    eventCount,
    regCount,
    contactCount,
    campaignCount,
    { data: transactions },
    { data: applications },
    { data: invoices },
    { data: certificates },
    { data: events },
    { data: campaignMessages },
  ] = await Promise.all([
    safeCount("course_applications"),
    safeCount("invoices"),
    safeCount("messages"),
    safeCount("certificates"),
    safeCount("alumni"),
    safeCount("events"),
    safeCount("event_registrations"),
    safeCount("contacts"),
    safeCount("email_campaigns"),
    supabase.from("transactions").select("id, reference, customer_name, amount, status, created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("course_applications").select("id, status, course_id, created_at, courses(title)"),
    supabase.from("invoices").select("id, payment_status, amount, created_at"),
    supabase.from("certificates").select("id, created_at"),
    supabase.from("events").select("id, status"),
    supabase.from("email_campaign_messages").select("id, status"),
  ]);

  // Revenue from transactions
  const txList = (transactions || []) as { id: string; reference: string; customer_name: string; amount: number; status: string; created_at: string }[];
  const successfulTx = txList.filter((t) => t.status === "success" || t.status === "completed");
  const totalRevenue = successfulTx.reduce((sum, t) => sum + (t.amount || 0), 0);

  // Also add paid invoice amounts
  const invoiceList = (invoices || []) as { id: string; payment_status: string; amount: number; created_at: string }[];
  const paidInvoices = invoiceList.filter((i) => i.payment_status === "paid");
  const invoiceRevenue = paidInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);

  // Monthly revenue
  const monthlyMap = new Map<string, number>();
  last12.forEach((m) => monthlyMap.set(m, 0));
  for (const tx of successfulTx) {
    const key = getMonthKey(tx.created_at);
    if (monthlyMap.has(key)) monthlyMap.set(key, (monthlyMap.get(key) || 0) + tx.amount);
  }
  for (const inv of paidInvoices) {
    const key = getMonthKey(inv.created_at);
    if (monthlyMap.has(key)) monthlyMap.set(key, (monthlyMap.get(key) || 0) + inv.amount);
  }
  const monthlyRevenue = last12.map((m) => ({ month: m, amount: monthlyMap.get(m) || 0 }));

  // Applications by status
  const appList = (applications || []) as { id: string; status: string; course_id: string; created_at: string; courses: { title: string } | null }[];
  const statusCounts = new Map<string, number>();
  for (const a of appList) {
    statusCounts.set(a.status, (statusCounts.get(a.status) || 0) + 1);
  }
  const applicationsByStatus = [...statusCounts.entries()].map(([status, count]) => ({ status, count }));

  // Applications by course
  const courseCounts = new Map<string, number>();
  for (const a of appList) {
    const name = a.courses?.title || "Unknown";
    courseCounts.set(name, (courseCounts.get(name) || 0) + 1);
  }
  const applicationsByCourse = [...courseCounts.entries()]
    .map(([course, count]) => ({ course, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Invoices by status
  const invStatusCounts = new Map<string, number>();
  for (const i of invoiceList) {
    invStatusCounts.set(i.payment_status, (invStatusCounts.get(i.payment_status) || 0) + 1);
  }
  const invoicesByStatus = [...invStatusCounts.entries()].map(([status, count]) => ({ status, count }));

  // Email campaign stats
  const msgs = (campaignMessages || []) as { id: string; status: string }[];
  const emailCampaignStats = {
    total: msgs.length,
    delivered: msgs.filter((m) => m.status === "delivered" || m.status === "opened" || m.status === "clicked").length,
    opened: msgs.filter((m) => m.status === "opened" || m.status === "clicked").length,
    clicked: msgs.filter((m) => m.status === "clicked").length,
    bounced: msgs.filter((m) => m.status === "bounced").length,
  };

  // Monthly certificates
  const certList = (certificates || []) as { id: string; created_at: string }[];
  const certMonthly = new Map<string, number>();
  last12.forEach((m) => certMonthly.set(m, 0));
  for (const c of certList) {
    const key = getMonthKey(c.created_at);
    if (certMonthly.has(key)) certMonthly.set(key, (certMonthly.get(key) || 0) + 1);
  }
  const monthlyCertificates = last12.map((m) => ({ month: m, count: certMonthly.get(m) || 0 }));

  // Events by status
  const evtList = (events || []) as { id: string; status: string }[];
  const evtStatusCounts = new Map<string, number>();
  for (const e of evtList) {
    evtStatusCounts.set(e.status, (evtStatusCounts.get(e.status) || 0) + 1);
  }
  const eventsByStatus = [...evtStatusCounts.entries()].map(([status, count]) => ({ status, count }));

  return {
    overview: {
      totalRevenue: totalRevenue + invoiceRevenue,
      totalApplications: appCount || 0,
      totalInvoices: invoiceCount || 0,
      totalMessages: msgCount || 0,
      totalCertificates: certCount || 0,
      totalAlumni: alumniCount || 0,
      totalEvents: eventCount || 0,
      totalEventRegistrations: regCount || 0,
      totalContacts: contactCount || 0,
      totalCampaigns: campaignCount || 0,
    },
    monthlyRevenue,
    applicationsByStatus,
    applicationsByCourse,
    invoicesByStatus,
    emailCampaignStats,
    monthlyCertificates,
    eventsByStatus,
    recentTransactions: txList.slice(0, 10),
  };
}
