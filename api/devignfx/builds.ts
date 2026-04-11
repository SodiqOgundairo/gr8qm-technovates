import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function requireAuth(req: VercelRequest): Promise<boolean> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return !error && !!user;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.status(200).end();

    const action = (req.query.action as string) || "";

    if (action === "ping") {
      return res.status(200).json({ ok: true, time: new Date().toISOString() });
    }

    if (action === "register") {
      if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
      if (!(await requireAuth(req))) return res.status(401).json({ error: "Unauthorized" });

      const body = req.body || {};
      if (!body.storagePath || !body.version) {
        return res.status(400).json({ error: "storagePath and version required" });
      }

      const buildId = "BLD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
      const fileName = (body.storagePath as string).split("/").pop() || "build.zip";

      const { data: row, error: err } = await supabase
        .from("devignfx_builds")
        .insert({
          build_id: buildId,
          version: body.version || "0.0.0",
          channel: body.channel || "stable",
          status: "draft",
          tier: body.tier || "standard",
          storage_path: body.storagePath,
          file_name: fileName,
          file_size: body.fileSize || 0,
          sha256: null,
          signature: null,
          signed: false,
          release_notes: body.releaseNotes || "",
        })
        .select()
        .single();

      if (err) return res.status(500).json({ error: "DB insert failed: " + err.message });
      return res.status(200).json({ success: true, build: row });
    }

    return res.status(400).json({ error: "Unknown action: " + action });
  } catch (err: any) {
    console.error("Builds API error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
