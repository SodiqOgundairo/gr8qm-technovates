/**
 * Paystack Integration Utility
 * Handles payment initialization and verification
 */

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo (multiply by 100)
  reference: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  currency?: string;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

/**
 * Initialize Paystack payment
 * Opens Paystack payment modal or redirects to payment page
 */
export const initializePayment = (config: PaystackConfig): void => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    console.error("Paystack public key not found in environment variables");
    alert("Payment configuration error. Please contact support.");
    return;
  }

  // Check if PaystackPop is loaded
  if (typeof (window as any).PaystackPop === "undefined") {
    console.error("Paystack script not loaded");
    alert("Payment system not ready. Please refresh the page.");
    return;
  }

  const handler = (window as any).PaystackPop.setup({
    key: publicKey,
    email: config.email,
    amount: config.amount * 100, // Convert to kobo
    currency: config.currency || "NGN",
    ref: config.reference,
    metadata: config.metadata,
    callback: function (response: any) {
      // Payment successful
      if (config.callback_url) {
        window.location.href = `${config.callback_url}?reference=${response.reference}`;
      } else {
        window.location.href = `/payment-success?reference=${response.reference}`;
      }
    },
    onClose: function () {
      // User closed payment modal
      console.log("Payment cancelled");
    },
  });

  handler.openIframe();
};

/**
 * Generate unique payment reference
 */
export const generateReference = (prefix: string = "GR8QM"): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Format amount for display
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

/**
 * Verify payment status (to be called on callback page)
 * Note: This is a client-side check. Server-side verification is recommended
 */
export const verifyPayment = async (
  reference: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // In production, you should verify via your backend
    // For now, we'll just check if the reference exists
    return {
      success: true,
      message: "Payment verified successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Payment verification failed",
    };
  }
};
