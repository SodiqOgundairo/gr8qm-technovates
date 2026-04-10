import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, context } = req.body || {};

  if (!code || typeof code !== "string") {
    return res.status(400).json({ valid: false, error: "Coupon code is required." });
  }

  try {
    const { data, error } = await supabase.rpc("validate_coupon", {
      p_code: code.trim(),
      p_context: context || "courses",
    });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      valid: false,
      error: "Failed to validate coupon.",
    });
  }
}
