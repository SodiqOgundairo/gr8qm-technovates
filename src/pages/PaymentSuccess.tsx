// src/pages/PaymentSuccess.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { verifyPayment } from "../utils/paystack";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type");
  const ref = searchParams.get("ref");

  const [status, setStatus] = useState<"checking" | "success" | "error">(
    "checking"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!ref) {
      setStatus("error");
      setMessage("Missing payment reference.");
      return;
    }

    // 1️⃣ Verify (client‑side placeholder)
    verifyPayment(ref).then((res) => {
      if (!res.success) {
        setStatus("error");
        setMessage(res.message);
        return;
      }

      // 2️⃣ Update DB (only for course payments for now)
      if (type === "course") {
        supabase
          .from("course_applications")
          .update({ payment_status: "paid", status: "confirmed" })
          .eq("payment_reference", ref)
          .then(({ error }) => {
            if (error) {
              setStatus("error");
              setMessage(error.message);
            } else {
              setStatus("success");
              setMessage("Your payment was recorded successfully.");
            }
          });
      } else {
        // future invoice handling …
        setStatus("success");
        setMessage("Payment recorded.");
      }
    });
  }, [ref, type]);

  if (status === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skyblue"></div>
        <p className="ml-4 text-gray-600">Verifying payment…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      {status === "error" ? (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <p className="font-semibold">Payment Error</p>
          <p>{message}</p>
        </div>
      ) : (
        <div className="bg-iceblue/20 border border-skyblue rounded-lg p-6">
          <h1 className="text-2xl font-bold text-oxford mb-4">
            Payment Successful!
          </h1>
          <p className="mb-2">{message}</p>
          <ul className="list-disc list-inside mb-4">
            <li>Reference: {ref}</li>
            {type === "course" && <li>Course payment (commitment fee)</li>}
          </ul>
          <button
            className="bg-skyblue text-white px-4 py-2 rounded"
            onClick={() => navigate("/trainings")}
          >
            Back to Trainings
          </button>
        </div>
      )}
    </div>
  );
}
