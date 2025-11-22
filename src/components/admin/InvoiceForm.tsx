import { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Modal from "../layout/Modal";
import { supabase } from "../../utils/supabase";
import { emailTemplates } from "../../utils/email";

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface InvoiceFormData {
  client_name: string;
  client_email: string;
  client_phone: string;
  service_description: string;
  amount: string;
  due_date: string;
  notes: string;
}

interface ServiceRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  project_description: string;
  budget_range: string | null;
  timeline: string | null;
}

export default function InvoiceForm({
  open,
  onClose,
  onSuccess,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    client_name: "",
    client_email: "",
    client_phone: "",
    service_description: "",
    amount: "",
    due_date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Fetch pending service requests when modal opens
  useEffect(() => {
    if (open) {
      fetchServiceRequests();
    }
  }, [open]);

  const fetchServiceRequests = async () => {
    setLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setServiceRequests((data || []) as ServiceRequest[]);
    } catch (err) {
      console.error("Error fetching service requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleRequestSelect = (requestId: string) => {
    setSelectedRequestId(requestId);

    if (!requestId) {
      // Clear form if "Create manually" is selected
      setFormData({
        client_name: "",
        client_email: "",
        client_phone: "",
        service_description: "",
        amount: "",
        due_date: "",
        notes: "",
      });
      return;
    }

    const request = serviceRequests.find((r) => r.id === requestId);
    if (request) {
      setFormData({
        client_name: request.name,
        client_email: request.email,
        client_phone: request.phone,
        service_description: request.project_description,
        amount: "", // Admin needs to set this
        due_date: "",
        notes: `Service Type: ${request.service_type}\n${
          request.budget_range ? `Budget: ${request.budget_range}\n` : ""
        }${request.timeline ? `Timeline: ${request.timeline}` : ""}`,
      });
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `INV-${year}${month}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const invoice_number = generateInvoiceNumber();
      const amount = parseFloat(formData.amount);

      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const { error: insertError } = await supabase.from("invoices").insert({
        invoice_number,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone || null,
        service_description: formData.service_description,
        amount,
        due_date: formData.due_date,
        payment_status: "pending",
        notes: formData.notes || null,
      });

      if (insertError) throw insertError;

      // Send invoice email automatically
      try {
        const invoiceData = {
          invoice_number,
          client_name: formData.client_name,
          client_email: formData.client_email,
          service_description: formData.service_description,
          amount, // This is already parsed as a number
          due_date: formData.due_date,
          notes: formData.notes || null,
        };

        const emailTemplate = emailTemplates.invoice(invoiceData);

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        await fetch(`${supabaseUrl}/functions/v1/send-receipt-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            to: formData.client_email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          }),
        });

        console.log("✅ Invoice email sent to", formData.client_email);
      } catch (emailError) {
        console.error("⚠️ Invoice created but email failed:", emailError);
        // Don't fail the whole process if email fails
      }

      // Reset form
      setFormData({
        client_name: "",
        client_email: "",
        client_phone: "",
        service_description: "",
        amount: "",
        due_date: "",
        notes: "",
      });
      setSelectedRequestId("");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Invoice"
      description="Link to a service request or create manually"
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Service Request Selector */}
        <div className="space-y-2 pb-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700">
            Link to Service Request (Optional)
          </label>
          <select
            value={selectedRequestId}
            onChange={(e) => handleRequestSelect(e.target.value)}
            disabled={loadingRequests}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-skyblue focus:outline-none"
          >
            <option value="">Create invoice manually</option>
            {serviceRequests.map((request) => (
              <option key={request.id} value={request.id}>
                {request.name} - {request.email} ({request.service_type})
              </option>
            ))}
          </select>
          {loadingRequests && (
            <p className="text-xs text-gray-500">Loading service requests...</p>
          )}
          {selectedRequestId && (
            <p className="text-xs text-blue-600">
              ℹ️ Client details auto-filled from service request. You can still
              edit them.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            labelText="Client Name"
            showLabel
            requiredField
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
          <Input
            labelText="Client Email"
            showLabel
            requiredField
            type="email"
            name="client_email"
            value={formData.client_email}
            onChange={handleChange}
            required
            placeholder="client@example.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            labelText="Phone (Optional)"
            showLabel
            type="tel"
            name="client_phone"
            value={formData.client_phone}
            onChange={handleChange}
            placeholder="+234 xxx xxx xxxx"
          />
          <Input
            labelText="Amount (₦)"
            showLabel
            requiredField
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="50000"
            min="0"
            step="0.01"
          />
        </div>

        <Input
          labelText="Due Date"
          showLabel
          requiredField
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Service Description *
          </label>
          <textarea
            name="service_description"
            value={formData.service_description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-skyblue focus:outline-none"
            placeholder="Describe the service or product..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-skyblue focus:outline-none"
            placeholder="Additional notes or payment instructions..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="pry" disabled={loading}>
            {loading ? "Creating..." : "Create Invoice"}
          </Button>
          <Button
            type="button"
            variant="sec"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
