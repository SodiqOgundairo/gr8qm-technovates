/**
 * DevignFX Build Registration — signs and registers a build already uploaded to Storage.
 *
 * POST /api/devignfx/register-build
 * Body (JSON): { storagePath, tier, version, channel, releaseNotes, fileSize }
 *
 * Flow: browser uploads directly to Supabase Storage (no size limit),
 * then calls this lightweight API to sign + register metadata.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "devignfx-builds";

function generateBuildId(): string {
  return "BLD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Auth
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: "Invalid session" });
  }

  try {
    const { storagePath, tier, version, channel, releaseNotes, fileSize } = req.body || {};

    if (!storagePath || !version) {
      return res.status(400).json({ error: "storagePath and version are required" });
    }

    const buildId = generateBuildId();
    const buildFileName = `DevignFX-${buildId}.zip`;

    // Rename the uploaded file to include the build ID
    const newPath = tier === "root" ? buildFileName : `${tier}/${buildFileName}`;

    // Download original file from storage for signing + renaming
    const { data: fileData, error: dlError } = await supabase.storage
      .from(BUCKET)
      .download(storagePath);

    if (dlError || !fileData) {
      return res.status(400).json({ error: `File not found at ${storagePath}: ${dlError?.message}` });
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());

    // Upload with new name
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newPath, buffer, { contentType: "application/zip", upsert: true });

    if (uploadError) {
      return res.status(500).json({ error: `Rename failed: ${uploadError.message}` });
    }

    // Delete original if path differs
    if (newPath !== storagePath) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
    }

    // Sign with Ed25519 if key available
    let sha256: string | null = null;
    let signature: string | null = null;
    let signed = false;

    sha256 = crypto.createHash("sha256").update(buffer).digest("hex");

    const signingKeyB64 = process.env.DEVIGNFX_SIGNING_KEY;
    if (signingKeyB64) {
      try {
        const pemKey = Buffer.from(signingKeyB64, "base64").toString("utf-8");
        const privateKey = crypto.createPrivateKey(pemKey);
        const sig = crypto.sign(null, buffer, privateKey);
        signature = sig.toString("base64");
        signed = true;

        // Upload .sig file
        const sigContent = [
          "-----BEGIN DEVIGNFX SIGNATURE-----",
          `File: ${buildFileName}`,
          `Build: ${buildId}`,
          `SHA256: ${sha256}`,
          `Signature: ${signature}`,
          "-----END DEVIGNFX SIGNATURE-----",
        ].join("\n");

        await supabase.storage
          .from(BUCKET)
          .upload(newPath + ".sig", Buffer.from(sigContent), {
            contentType: "text/plain",
            upsert: true,
          });
      } catch (err) {
        console.error("Signing failed:", err);
        // Continue without signing
      }
    }

    // Insert into devignfx_builds table
    const { data: buildRow, error: insertError } = await supabase
      .from("devignfx_builds")
      .insert({
        build_id: buildId,
        version: version || "0.0.0",
        channel: channel || "stable",
        status: "draft",
        tier: tier || "standard",
        storage_path: newPath,
        file_name: buildFileName,
        file_size: fileSize || buffer.length,
        sha256,
        signature,
        signed,
        release_notes: releaseNotes || "",
      })
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: `DB insert failed: ${insertError.message}` });
    }

    return res.status(200).json({
      success: true,
      build: buildRow,
    });
  } catch (err: any) {
    console.error("Register build error:", err);
    return res.status(500).json({ error: err.message || "Registration failed" });
  }
}
