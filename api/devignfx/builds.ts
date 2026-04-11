import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );
    return res.status(200).json({
      ok: true,
      hasClient: !!supabase,
      envCheck: {
        url: !!process.env.VITE_SUPABASE_URL,
        serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        anonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
      },
      time: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
      stack: err.stack,
      name: err.name,
    });
  }
}
