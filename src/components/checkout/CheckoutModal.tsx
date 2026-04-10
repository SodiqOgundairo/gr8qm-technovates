import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Check, AlertCircle, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { validateCoupon, useCoupon } from "../../lib/coupons";
import { initializePayment, generateReference, formatAmount } from "../../utils/paystack";
import type { CouponValidationResult } from "../../types/checkout";

// ════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════

export interface CheckoutItem {
  id: string;
  name: string;
  description?: string;
  amount: number; // in naira
}

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface InstallmentPlan {
  months: number;
  label: string;
  perMonth: number;
  total: number;
}

export interface CheckoutConfig {
  item: CheckoutItem;
  context: "courses" | "invoices";
  /** Pre-fill customer info if known */
  customer?: Partial<CheckoutCustomer>;
  /** Payment metadata passed to Paystack */
  metadata?: Record<string, any>;
  /** Allow installment plans */
  enableInstallments?: boolean;
  /** Allow coupon codes */
  enableCoupons?: boolean;
  /** Custom fields to collect before payment */
  extraFields?: ExtraField[];
  /** Called after successful payment (before redirect) */
  onBeforePayment?: (data: {
    customer: CheckoutCustomer;
    finalAmount: number;
    couponCode?: string;
    installmentMonths?: number;
    extraData: Record<string, string>;
  }) => Promise<void>;
  /** Called when modal is closed without paying */
  onClose: () => void;
}

interface ExtraField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "checkbox";
  required?: boolean;
  placeholder?: string;
}

type Step = "details" | "review" | "processing";

// ════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════

const CheckoutModal: React.FC<CheckoutConfig> = ({
  item,
  context,
  customer: prefill,
  metadata,
  enableInstallments = false,
  enableCoupons = true,
  extraFields = [],
  onBeforePayment,
  onClose,
}) => {
  // Form state
  const [name, setName] = useState(prefill?.name || "");
  const [email, setEmail] = useState(prefill?.email || "");
  const [phone, setPhone] = useState(prefill?.phone || "");
  const [extraData, setExtraData] = useState<Record<string, string>>({});

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Installment state
  const [installmentMonths, setInstallmentMonths] = useState(1);

  // Step state
  const [step, setStep] = useState<Step>("details");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Computed amounts
  const originalAmount = item.amount;
  const discountAmount = couponResult?.valid ? couponResult.discountAmount || 0 : 0;
  const finalAmount = Math.max(0, originalAmount - discountAmount);

  // Installment plans
  const installmentPlans: InstallmentPlan[] = enableInstallments
    ? [
        { months: 1, label: "Full payment", perMonth: finalAmount, total: finalAmount },
        { months: 2, label: "2 months", perMonth: Math.ceil(finalAmount / 2), total: finalAmount },
        { months: 3, label: "3 months", perMonth: Math.ceil(finalAmount / 3), total: finalAmount },
      ]
    : [{ months: 1, label: "Full payment", perMonth: finalAmount, total: finalAmount }];

  const selectedPlan = installmentPlans.find((p) => p.months === installmentMonths) || installmentPlans[0];
  const payNowAmount = selectedPlan.perMonth;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Validate coupon
  const handleValidateCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponResult(null);
    try {
      const result = await validateCoupon(couponCode.trim(), originalAmount, context);
      setCouponResult(result);
    } catch {
      setCouponResult({ valid: false, error: "Failed to validate coupon." });
    } finally {
      setValidatingCoupon(false);
    }
  }, [couponCode, originalAmount, context]);

  const removeCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
  };

  // Validate details step
  const validateDetails = (): boolean => {
    if (!name.trim()) { setError("Name is required."); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Valid email is required."); return false; }
    if (!phone.trim()) { setError("Phone number is required."); return false; }
    for (const field of extraFields) {
      if (field.required && !extraData[field.name]?.trim()) {
        setError(`${field.label} is required.`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const goToReview = () => {
    if (validateDetails()) setStep("review");
  };

  // Process payment
  const handlePay = async () => {
    setProcessing(true);
    setStep("processing");
    setError(null);

    try {
      // Run pre-payment callback (e.g., save application to DB)
      if (onBeforePayment) {
        await onBeforePayment({
          customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          finalAmount,
          couponCode: couponResult?.valid ? couponCode.trim() : undefined,
          installmentMonths: installmentMonths > 1 ? installmentMonths : undefined,
          extraData,
        });
      }

      // Mark coupon as used
      if (couponResult?.valid && couponCode.trim()) {
        await useCoupon(couponCode.trim());
      }

      // Generate reference and pay
      const reference = generateReference(`GR8QM-${context.toUpperCase()}`);

      initializePayment({
        email: email.trim(),
        amount: payNowAmount,
        reference,
        metadata: {
          ...metadata,
          type: context === "courses" ? "course" : "invoice",
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          original_amount: originalAmount,
          discount_amount: discountAmount,
          coupon_code: couponResult?.valid ? couponCode.trim() : null,
          installment_months: installmentMonths,
          installment_of: installmentMonths > 1 ? `1/${installmentMonths}` : null,
        },
        onClose: () => {
          setProcessing(false);
          setStep("review");
        },
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setProcessing(false);
      setStep("review");
    }
  };

  // ── Render ──────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={processing ? undefined : onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
            <p className="text-sm text-gray-500 truncate max-w-[280px]">{item.name}</p>
          </div>
          {!processing && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 text-xs">
            {(["details", "review", "processing"] as Step[]).map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <div className={`flex-1 h-0.5 ${step === s || (s === "review" && step === "processing") || (s === "details" && step !== "details") ? "bg-skyblue" : "bg-gray-200"}`} />}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s ? "bg-skyblue text-white" : (s === "details" && step !== "details") || (s === "review" && step === "processing") ? "bg-skyblue/20 text-skyblue" : "bg-gray-200 text-gray-400"}`}>
                  {(s === "details" && step !== "details") || (s === "review" && step === "processing") ? <Check size={12} /> : i + 1}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Details ── */}
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-skyblue focus:ring-2 focus:ring-skyblue/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-skyblue focus:ring-2 focus:ring-skyblue/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 XXX XXX XXXX"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-skyblue focus:ring-2 focus:ring-skyblue/20 outline-none transition-all"
                  />
                </div>

                {/* Extra fields */}
                {extraFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && "*"}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={extraData[field.name] || ""}
                        onChange={(e) => setExtraData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-skyblue focus:ring-2 focus:ring-skyblue/20 outline-none transition-all resize-none"
                      />
                    ) : field.type === "checkbox" ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={extraData[field.name] === "true"}
                          onChange={(e) => setExtraData((prev) => ({ ...prev, [field.name]: e.target.checked ? "true" : "" }))}
                          className="w-4 h-4 text-skyblue rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{field.placeholder || field.label}</span>
                      </label>
                    ) : (
                      <input
                        type={field.type}
                        value={extraData[field.name] || ""}
                        onChange={(e) => setExtraData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-skyblue focus:ring-2 focus:ring-skyblue/20 outline-none transition-all"
                      />
                    )}
                  </div>
                ))}

                {/* Coupon */}
                {enableCoupons && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Tag size={14} className="inline mr-1" /> Coupon Code
                    </label>
                    {couponResult?.valid ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            {couponCode.toUpperCase()} — {couponResult.coupon?.discount_type === "percentage"
                              ? `${couponResult.coupon.discount_value}% off`
                              : `${formatAmount(couponResult.coupon?.discount_value || 0)} off`}
                          </span>
                        </div>
                        <button onClick={removeCoupon} className="text-green-600 hover:text-green-800 text-sm underline">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value); setCouponResult(null); }}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-skyblue focus:ring-2 focus:ring-skyblue/20 outline-none transition-all uppercase"
                        />
                        <button
                          onClick={handleValidateCoupon}
                          disabled={!couponCode.trim() || validatingCoupon}
                          className="px-4 py-3 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          {validatingCoupon ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                        </button>
                      </div>
                    )}
                    {couponResult && !couponResult.valid && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {couponResult.error}
                      </p>
                    )}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── STEP 2: Review ── */}
            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Customer summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Details</h3>
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-sm text-gray-600">{email}</p>
                  <p className="text-sm text-gray-600">{phone}</p>
                </div>

                {/* Order summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium">{formatAmount(originalAmount)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({couponCode.toUpperCase()})</span>
                      <span>-{formatAmount(discountAmount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">{formatAmount(finalAmount)}</span>
                  </div>
                </div>

                {/* Installment plans */}
                {enableInstallments && finalAmount > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Plan</h3>
                    <div className="grid gap-2">
                      {installmentPlans.map((plan) => (
                        <button
                          key={plan.months}
                          onClick={() => setInstallmentMonths(plan.months)}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                            installmentMonths === plan.months
                              ? "border-skyblue bg-skyblue/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">{plan.label}</p>
                            {plan.months > 1 && (
                              <p className="text-xs text-gray-500">
                                {formatAmount(plan.perMonth)}/month × {plan.months} months
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              {plan.months === 1 ? formatAmount(plan.total) : formatAmount(plan.perMonth)}
                            </p>
                            {plan.months > 1 && (
                              <p className="text-xs text-gray-500">pay now</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── STEP 3: Processing ── */}
            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-skyblue/10 flex items-center justify-center mx-auto">
                  <Loader2 size={32} className="text-skyblue animate-spin" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Setting up payment...</p>
                  <p className="text-sm text-gray-500 mt-1">You'll be redirected to the payment gateway shortly.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step !== "processing" && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
            {step === "details" && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Amount due</p>
                  <p className="text-xl font-bold text-gray-900">{formatAmount(finalAmount)}</p>
                </div>
                <button
                  onClick={goToReview}
                  className="flex items-center gap-1 px-6 py-3 bg-skyblue text-white rounded-xl font-semibold hover:bg-skyblue/90 transition-colors"
                >
                  Review <ChevronRight size={18} />
                </button>
              </div>
            )}
            {step === "review" && (
              <div className="flex gap-3">
                <button
                  onClick={() => { setStep("details"); setError(null); }}
                  className="flex items-center gap-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-skyblue text-white rounded-xl font-semibold hover:bg-skyblue/90 disabled:opacity-50 transition-colors"
                >
                  {processing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Pay {formatAmount(payNowAmount)}</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
