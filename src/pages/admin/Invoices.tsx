import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../utils/supabase";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import { formatAmount } from "../../utils/paystack";
import { emailTemplates } from "../../utils/email";
import InvoiceForm from "../../components/admin/InvoiceForm";
import Modal from "../../components/layout/Modal";
import {
  IoIosArrowRoundForward,
  IoIosArrowRoundBack,
  IoMdRefresh,
  IoMdAdd,
} from "react-icons/io";
import { FaEye, FaPrint, FaEnvelope, FaCheck } from "react-icons/fa";

interface Invoice {
  id: string;
  created_at: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  service_description: string;
  amount: number;
  due_date: string;
  payment_status: string;
  payment_date: string | null;
  notes: string | null;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchInvoices = async (
    pageIndex: number,
    size: number,
    q: string,
    status: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const from = pageIndex * size;
      const to = from + size - 1;
      let base = supabase
        .from("invoices")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (q.trim()) {
        base = base.or(
          `invoice_number.ilike.%${q}%,client_name.ilike.%${q}%,client_email.ilike.%${q}%`
        );
      }

      if (status !== "all") {
        base = base.eq("payment_status", status);
      }

      const { data, count, error: selErr } = await base.range(from, to);

      if (selErr) {
        setError(selErr.message);
      } else {
        setInvoices((data || []) as Invoice[]);
        setTotal(count || 0);
        setPage(pageIndex);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvoices(0, pageSize, query, statusFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, statusFilter]);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      overdue: "bg-red-100 text-red-700",
      cancelled: "bg-gray-100 text-gray-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const sendInvoiceEmail = async (invoice: Invoice) => {
    setActionLoading(`send-${invoice.id}`);
    try {
      const emailTemplate = emailTemplates.invoice(invoice);

      // Call Edge Function to send email
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/send-receipt-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            to: invoice.client_email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Invoice sent successfully!");
      } else {
        throw new Error(result.error || "Failed to send invoice");
      }
    } catch (err: any) {
      alert(`Error sending invoice: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const markAsPaid = async (invoice: Invoice) => {
    if (!confirm(`Mark invoice ${invoice.invoice_number} as paid?`)) return;

    setActionLoading(`paid-${invoice.id}`);
    try {
      const { error } = await supabase
        .from("invoices")
        .update({
          payment_status: "paid",
          payment_date: new Date().toISOString(),
        })
        .eq("id", invoice.id);

      if (error) throw error;

      alert("Invoice marked as paid!");
      fetchInvoices(page, pageSize, query, statusFilter);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const printInvoice = (invoice: Invoice) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: 'Epilogue', Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #0098da; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .client-info, .invoice-info { flex: 1; }
            .invoice-info { text-align: right; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">GR8QM Technovates</div>
            <p>Faith that builds. Impact that lasts.</p>
          </div>
          
          <div class="invoice-details">
            <div class="client-info">
              <h3>Bill To:</h3>
              <p><strong>${invoice.client_name}</strong></p>
              <p>${invoice.client_email}</p>
              ${invoice.client_phone ? `<p>${invoice.client_phone}</p>` : ""}
            </div>
            <div class="invoice-info">
              <h2>INVOICE</h2>
              <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
              <p><strong>Date:</strong> ${new Date(
                invoice.created_at
              ).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> ${new Date(
                invoice.due_date
              ).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${invoice.payment_status.toUpperCase()}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice.service_description}</td>
                <td style="text-align: right;">${formatAmount(
                  invoice.amount
                )}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            <p>Total Amount: ${formatAmount(invoice.amount)}</p>
          </div>

          ${
            invoice.notes
              ? `<div><p><strong>Notes:</strong> ${invoice.notes}</p></div>`
              : ""
          }

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>GR8QM Technovates | hello@gr8qm.com</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-oxford">Invoices</h1>
            <p className="text-gray-600 mt-1">
              Create and manage service invoices
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="pry"
              onClick={() => fetchInvoices(page, pageSize, query, statusFilter)}
              className="!px-4"
            >
              <IoMdRefresh className="text-xl" />
            </Button>
            <Button variant="pry" onClick={() => setShowCreateModal(true)}>
              <IoMdAdd className="text-xl mr-1" />
              New Invoice
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            placeholder="Search invoice #, name, or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 focus:border-skyblue focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <Skeleton width={100} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={150} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={80} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={100} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={80} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={100} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-oxford">
                          {invoice.invoice_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-oxford">
                            {invoice.client_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.client_email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-oxford">
                          {formatAmount(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.payment_status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="text-skyblue hover:text-oxford transition-colors p-1"
                              title="View"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              onClick={() => printInvoice(invoice)}
                              className="text-green-600 hover:text-green-800 transition-colors p-1"
                              title="Print"
                            >
                              <FaPrint size={16} />
                            </button>
                            <button
                              onClick={() => sendInvoiceEmail(invoice)}
                              disabled={actionLoading === `send-${invoice.id}`}
                              className="text-blue-600 hover:text-blue-800 transition-colors p-1 disabled:opacity-50"
                              title={
                                invoice.payment_status === "paid"
                                  ? "Resend Invoice"
                                  : "Send Invoice"
                              }
                            >
                              <FaEnvelope size={16} />
                            </button>
                            {invoice.payment_status !== "paid" && (
                              <button
                                onClick={() => markAsPaid(invoice)}
                                disabled={
                                  actionLoading === `paid-${invoice.id}`
                                }
                                className="text-green-600 hover:text-green-800 transition-colors p-1 disabled:opacity-50"
                                title="Mark as Paid"
                              >
                                <FaCheck size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td
                          className="px-6 py-12 text-center text-gray-500"
                          colSpan={6}
                        >
                          No invoices found
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {invoices.length > 0 ? page * pageSize + 1 : 0} to{" "}
              {Math.min((page + 1) * pageSize, total)} of {total} invoices
            </div>
            <div className="flex gap-2">
              <Button
                variant="sec"
                onClick={() =>
                  fetchInvoices(
                    Math.max(page - 1, 0),
                    pageSize,
                    query,
                    statusFilter
                  )
                }
                disabled={page === 0 || loading}
              >
                <IoIosArrowRoundBack className="text-xl mr-1" />
                Previous
              </Button>
              <Button
                variant="sec"
                onClick={() =>
                  fetchInvoices(page + 1, pageSize, query, statusFilter)
                }
                disabled={(page + 1) * pageSize >= total || loading}
              >
                Next
                <IoIosArrowRoundForward className="text-xl ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* View Invoice Modal */}
        {selectedInvoice && (
          <Modal
            open={!!selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            title={`Invoice ${selectedInvoice.invoice_number}`}
            width="max-w-2xl"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Client Information
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="font-semibold">
                      {selectedInvoice.client_name}
                    </p>
                    <p className="text-sm">{selectedInvoice.client_email}</p>
                    {selectedInvoice.client_phone && (
                      <p className="text-sm">{selectedInvoice.client_phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Invoice Details
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">Created:</span>{" "}
                      {new Date(
                        selectedInvoice.created_at
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Due:</span>{" "}
                      {new Date(selectedInvoice.due_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Status:</span>{" "}
                      {getStatusBadge(selectedInvoice.payment_status)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Service Description
                </h3>
                <p className="mt-2 text-gray-700">
                  {selectedInvoice.service_description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Amount
                </h3>
                <p className="mt-2 text-2xl font-bold text-oxford">
                  {formatAmount(selectedInvoice.amount)}
                </p>
              </div>

              {selectedInvoice.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Notes
                  </h3>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="pry"
                  onClick={() => printInvoice(selectedInvoice)}
                >
                  <FaPrint className="mr-2" />
                  Print
                </Button>
                <Button
                  variant="sec"
                  onClick={() => sendInvoiceEmail(selectedInvoice)}
                >
                  <FaEnvelope className="mr-2" />
                  {selectedInvoice.payment_status === "paid"
                    ? "Resend"
                    : "Send"}{" "}
                  Invoice
                </Button>
                {selectedInvoice.payment_status !== "paid" && (
                  <Button
                    variant="sec"
                    onClick={() => markAsPaid(selectedInvoice)}
                  >
                    <FaCheck className="mr-2" />
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* Create Invoice Modal */}
        <InvoiceForm
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchInvoices(page, pageSize, query, statusFilter);
          }}
        />
      </div>
    </AdminLayout>
  );
}
