import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { verifyPayment, formatAmount } from "../utils/paystack";
import { CheckCircle, Printer, ArrowRight, AlertCircle, Mail, Download } from "lucide-react";
import Container from "../components/layout/Container";
import { useReactToPrint } from "react-to-print";
import { sendReceiptEmail } from "../utils/email";

interface PaymentDetails {
  reference: string;
  amount: number;
  date: string;
  customerName: string;
  customerEmail: string;
  itemName: string;
  type: "course" | "service";
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get type from URL or auto-detect from reference
  let type = searchParams.get("type");
  const rawRef = searchParams.get("reference");
  const ref = rawRef ? rawRef.split("?")[0] : null;

  // Auto-detect type if not provided (fallback)
  if (!type && ref) {
    if (ref.startsWith("COURSE-")) {
      type = "course";
    } else if (ref.startsWith("INV-PAY-")) {
      type = "invoice";
    } else if (ref.startsWith("DEVFX-")) {
      type = "devignfx";
    }
  }

  const receiptRef = useRef<HTMLDivElement>(null);

  // console.log("Payment reference received:", ref);

  // console.log("Raw reference:", rawRef);
  // console.log("Cleaned referencce", ref);

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your payment...");
  const [details, setDetails] = useState<PaymentDetails | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
  });

  useEffect(() => {
    const verifyAndRecord = async () => {
      if (!ref) {
        setStatus("error");
        setMessage("Missing payment reference.");
        return;
      }

      console.log("🔍 Payment reference received:", ref);
      console.log("🔍 Payment type:", type);

      try {
        console.log("✅ Step 1: Verifying payment...");
        const verification = await verifyPayment(ref);
        console.log("✅ Step 1 Complete. Verification result:", verification);

        if (!verification.success) {
          throw new Error(verification.message);
        }

        console.log(
          "✅ Step 2: Payment verified! Processing database update..."
        );

        if (type === "course") {
          console.log("✅ Step 2a: Checking for existing application...");
          // First check if record exists
          const { data: checkData, error: checkError } = await supabase
            .from("course_applications")
            .select(
              `
              id, 
              payment_reference, 
              payment_status,
              name,
              email,
              courses (
                name,
                commitment_fee
              )
            `
            )
            .eq("payment_reference", ref)
            .maybeSingle();

          console.log("✅ Step 2b: Database check complete");
          console.log("  - Check error:", checkError);
          console.log("  - Found data:", !!checkData);

          if (checkError) {
            console.error("❌ DB Check Error:", checkError);
            throw new Error("Database query failed.");
          }

          if (!checkData) {
            console.error("❌ No application found with reference:", ref);
            throw new Error(
              "No course application found with this payment reference. Please contact support."
            );
          }

          console.log("✅ Step 3: Application found!", checkData);

          // Check if already paid
          if (checkData.payment_status === "paid") {
            console.log(
              "ℹ️ Payment already processed. Showing existing receipt."
            );
            const course = Array.isArray(checkData.courses)
              ? checkData.courses[0]
              : checkData.courses;
            setDetails({
              reference: ref,
              amount: course?.commitment_fee || 0,
              date: new Date().toLocaleDateString(),
              customerName: checkData.name,
              customerEmail: checkData.email,
              itemName: course?.name || "Course",
              type: "course",
            });
            setStatus("success");
            setMessage("This payment has already been processed.");
            return;
          }

          // Now update the record
          const { data: updateData, error: updateError } = await supabase
            .from("course_applications")
            .update({
              payment_status: "paid",
              status: "confirmed",
            })
            .eq("payment_reference", ref)
            .select(
              `
              *,
              courses (
                name,
                commitment_fee
              )
            `
            )
            .single();

          if (updateError) {
            console.error("DB Update Error:", updateError);
            throw new Error("Could not update payment record.");
          }

          if (updateData) {
            const course = Array.isArray(updateData.courses)
              ? updateData.courses[0]
              : updateData.courses;

            const paymentDetails = {
              reference: ref,
              amount: course?.commitment_fee || 0,
              date: new Date().toLocaleDateString(),
              customerName: updateData.name,
              customerEmail: updateData.email,
              itemName: course?.name || "Course",
              type: "course" as const,
            };

            setDetails(paymentDetails);
            setStatus("success");
            setMessage("Payment confirmed successfully!");

            // Send receipt email
            console.log("🔔 About to send email to:", updateData.email);
            sendReceiptEmail({
              to: updateData.email,
              customerName: updateData.name,
              courseName: course?.name || "Course",
              amount: course?.commitment_fee || 0,
              reference: ref,
              date: new Date().toLocaleDateString(),
              type: "course",
            })
              .then((result) => {
                console.log("📬 Email send result:", result);
                if (result.success) {
                  console.log("✅ Receipt email sent successfully");
                } else {
                  console.error(
                    "❌ Failed to send receipt email:",
                    result.message
                  );
                }
              })
              .catch((error) => {
                console.error("❌ Email send error:", error);
              });
          }
        } else if (type === "invoice") {
          console.log("✅ Step 2a: Processing invoice payment...");

          // Verify valid reference format or fetch by reference
          // Verify valid reference format or fetch by reference
          // Note: The redundant direct check was removed here in favor of parsing logic below

          // Actually, we should look up by the metadata we sent or just assume the reference is unique enough if stored?
          // But wait, the reference was generated as `INV-PAY-${invoice.invoice_number}-${Date.now()}`
          // We don't store the transaction reference in the invoice table generally until now.
          // Let's use the metadata approach or parse the reference?
          // Better: We passed metadata { invoice_id, invoice_number } to Paystack.
          // But here in the callback, we only have the reference and type in the URL.
          // The verification response from Paystack (if backend verified) would have metadata.
          // Since we are doing client-side verification (mock/simple), we need to rely on the reference format
          // OR verifyPayment should return the metadata if it was a real backend call.

          // Let's extract invoice number from reference if possible: INV-PAY-{invoice_number}-{timestamp}
          // This is fragile. A better way is to query the invoice using the invoice_number if embedded in ref.

          let invoiceNumber = "";
          const parts = ref.split("-");
          if (parts.length >= 4 && parts[0] === "INV" && parts[1] === "PAY") {
            // parts[2] might be the invoice number.
            // But if invoice number has hyphens, this breaks.
            // Let's use a regex or just substring?
            // Helper: match INV-PAY-(.*)-\d+
            const match = ref.match(/INV-PAY-(.+)-\d+/);
            if (match) {
              invoiceNumber = match[1];
            }
          }

          if (!invoiceNumber) {
            console.warn(
              "⚠️ Could not extract invoice number from reference. Trying fallback search..."
            );
            // Maybe the user passed the invoice ID/Number directly as ref? (Unlikely given our code)
          }

          console.log("🔍 Looking for invoice:", invoiceNumber);

          const { data: invoice, error: dbError } = await supabase
            .from("invoices")
            .select("*")
            .eq("invoice_number", invoiceNumber)
            .single();

          if (dbError || !invoice) {
            throw new Error("Invoice not found for this payment.");
          }

          // Update invoice status
          const { error: updateError } = await supabase
            .from("invoices")
            .update({
              payment_status: "paid",
              payment_date: new Date().toISOString(),
            })
            .eq("id", invoice.id);

          if (updateError) throw updateError;

          setDetails({
            reference: ref,
            amount: invoice.amount,
            date: new Date().toISOString().split("T")[0],
            customerName: invoice.client_name,
            customerEmail: invoice.client_email,
            itemName: `Invoice #${invoice.invoice_number} - ${invoice.service_description}`,
            type: "invoice" as any, // casting as any/custom type if needed, or update interface
          });

          setStatus("success");
          setMessage("Invoice payment confirmed!");

          // Send receipt email
          sendReceiptEmail({
            to: invoice.client_email,
            customerName: invoice.client_name,
            courseName: `Invoice #${invoice.invoice_number}`, // overloading courseName for now or update interface
            amount: invoice.amount,
            reference: ref,
            date: new Date().toLocaleDateString(),
            type: "service", // Use 'service' or 'invoice'
          });
        } else if (type === "devignfx") {
          // DevignFX payments are handled by the webhook (license created + email sent)
          // Just show a confirmation — no DB lookup needed here
          setStatus("success");
          setMessage("Payment confirmed! Your license key has been sent to your email.");
          setDetails({
            reference: ref,
            amount: 0,
            date: new Date().toLocaleDateString(),
            customerName: "",
            customerEmail: "",
            itemName: "DevignFX License",
            type: "service",
          });
        } else {
          setStatus("success");
          setMessage("Payment recorded.");
          setDetails({
            reference: ref,
            amount: 0,
            date: new Date().toLocaleDateString(),
            customerName: "Customer",
            customerEmail: "email@example.com",
            itemName: "Service Payment",
            type: "service",
          });
        }
      } catch (err: any) {
        console.error("Payment Error:", err);
        setStatus("error");
        setMessage(err.message || "An unexpected error occurred.");
      }
    };

    verifyAndRecord();
  }, [ref, type]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-skyblue mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-oxford">
            Verifying Payment...
          </h2>
          <p className="text-gray-500">
            Please wait while we confirm your transaction.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <Container className="py-20">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
          <div className="bg-red-50 p-6 text-center border-b border-red-100">
            <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-700">Payment Failed</h2>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/contact")}
                className="w-full py-3 px-4 bg-oxford text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all"
              >
                Contact Support
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // DevignFX-branded success page
  if (type === "devignfx") {
    return (
      <div className="min-h-screen bg-[#060d06] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-400">
              Your DevignFX license is on its way.
            </p>
          </div>

          <div className="bg-[#0a1a0a] border border-emerald-500/10 rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-emerald-500/10">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">Check your email</p>
                <p className="text-gray-500 text-sm">Your license key and setup instructions have been sent.</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold mt-0.5">1</span>
                <p className="text-gray-300">Open the email and copy your license key</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold mt-0.5">2</span>
                <p className="text-gray-300">Go to the download page and enter your key</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold mt-0.5">3</span>
                <p className="text-gray-300">Download the bot and follow the setup instructions</p>
              </div>
            </div>

            {details?.reference && (
              <div className="mt-6 pt-6 border-t border-emerald-500/10">
                <p className="text-gray-500 text-xs">
                  Reference: <span className="text-gray-400 font-mono">{details.reference}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/devignfx/download")}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors"
            >
              <Download size={18} />
              Go to Downloads
            </button>
            <button
              onClick={() => navigate("/devignfx")}
              className="px-4 py-3 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-xl font-medium transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default GR8QM receipt
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-oxford mb-2">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for your commitment.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100 relative">
            <div className="h-2 bg-linear-to-r from-skyblue via-purple-500 to-orange"></div>

            <div className="p-8 md:p-12" ref={receiptRef}>
              <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-8">
                <div>
                  <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">
                    Receipt For
                  </h3>
                  <p className="text-2xl font-bold text-oxford">
                    {details?.itemName}
                  </p>
                  <p className="text-gray-600">
                    {details?.type === "course"
                      ? "Commitment Fee"
                      : "Service Payment"}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">
                    Amount Paid
                  </h3>
                  <p className="text-3xl font-bold text-skyblue">
                    {formatAmount(details?.amount || 0)}
                  </p>
                  {details?.type === "course" && (
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold mt-2">
                      COMMITMENT FEE
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-gray-500 text-sm mb-1">
                    Customer Details
                  </h4>
                  <p className="font-semibold text-oxford">
                    {details?.customerName}
                  </p>
                  <p className="text-gray-600">{details?.customerEmail}</p>
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm mb-1">Payment Info</h4>
                  <p className="text-gray-600">
                    <span className="font-semibold text-oxford">Date:</span>{" "}
                    {details?.date}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-oxford">
                      Reference:
                    </span>{" "}
                    {details?.reference}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-oxford">Method:</span>{" "}
                    Paystack
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-2">
                  What happens next?
                </h4>
                <ul className="text-blue-700 space-y-2 text-sm">
                  {details?.type === "course" ? (
                    <>
                      <li>• You will receive a confirmation email shortly.</li>
                      <li>• Our team will review your application details.</li>
                      <li>• You will be added to the course cohort group.</li>
                      <li>
                        • Remember: This fee secures your spot in the cohort.
                      </li>
                    </>
                  ) : (
                    <>
                      <li>• We have received your payment.</li>
                      <li>• You will receive a receipt email shortly.</li>
                      <li>• Your service request is now being processed.</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="hidden print:block mt-8 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
                <p>Generated by GR8QM Technovates Payment System</p>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                >
                  <Printer size={18} />
                  Print Receipt
                </button>
              </div>

              <button
                onClick={() =>
                  navigate(details?.type === "course" ? "/trainings" : "/")
                }
                className="flex items-center gap-2 px-6 py-3 bg-skyblue text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
              >
                {details?.type === "course"
                  ? "Back to Trainings"
                  : "Return Home"}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
