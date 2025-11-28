import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { initializePayment } from "../utils/paystack";
import { formatAmount } from "../utils/paystack";
import Button from "../components/common/Button";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  service_description: string;
  amount: number;
  due_date: string;
  payment_status: string;
  notes: string | null;
}

export default function PayInvoice() {
  const { invoiceNumber } = useParams<{ invoiceNumber: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (invoiceNumber) {
      fetchInvoice();
    }
  }, [invoiceNumber]);

  const fetchInvoice = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("invoice_number", invoiceNumber)
        .single();

      if (error) throw error;

      if (!data) {
        setError("Invoice not found");
        return;
      }

      if (data.payment_status === "paid") {
        setError("This invoice has already been paid");
      }

      setInvoice(data as Invoice);
    } catch (err: any) {
      setError(err.message || "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!invoice) return;

    setPaying(true);
    try {
      const reference = `INV-PAY-${invoice.invoice_number}-${Date.now()}`;

      await initializePayment({
        email: invoice.client_email,
        amount: invoice.amount,
        reference,
        metadata: {
          type: "invoice",
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          client_name: invoice.client_name,
        },
        callback_url: `${window.location.origin}/payment-success?reference=${reference}&type=invoice`,
        onClose: () => {
          setPaying(false);
        },
      });
    } catch (err: any) {
      alert(`Payment initialization failed: ${err.message}`);
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skyblue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-oxford mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="pry" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-skyblue/10 to-orange/10 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-oxford mb-2">
            GR8QM Technovates
          </h1>
          <p className="text-gray-600">Faith that builds. Impact that lasts.</p>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-skyblue to-orange p-6 text-white">
            <h2 className="text-2xl font-bold mb-1">Invoice</h2>
            <p className="text-white/90">{invoice.invoice_number}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Client Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Bill To
              </h3>
              <p className="text-lg font-semibold text-oxford">
                {invoice.client_name}
              </p>
              <p className="text-gray-600">{invoice.client_email}</p>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-semibold text-oxford">
                  {new Date(invoice.due_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold text-yellow-600">
                  {invoice.payment_status.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Service Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Service Description
              </h3>
              <p className="text-gray-700">{invoice.service_description}</p>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Notes
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Amount */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">
                  Total Amount:
                </span>
                <span className="text-3xl font-bold text-oxford">
                  {formatAmount(invoice.amount)}
                </span>
              </div>
            </div>

            {/* Pay Now Button */}
            {invoice.payment_status !== "paid" && (
              <Button
                variant="pry"
                onClick={handlePayment}
                disabled={paying}
                className="w-full py-4 "
                size="lg"
              >
                {paying
                  ? "Processing..."
                  : `Pay ${formatAmount(invoice.amount)} Now`}
              </Button>
            )}

            {invoice.payment_status === "paid" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-700 font-semibold">
                  ✓ This invoice has been paid
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>
            Questions? Contact us at{" "}
            <a
              href="mailto:hello@gr8qm.com"
              className="text-skyblue hover:underline"
            >
              hello@gr8qm.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
