/**
 * DevignFX Build Upload API — handles upload, auto-generates BLD ID, and signs with Ed25519.
 *
 * POST /api/devignfx/upload-build
 *   Body: multipart/form-data with fields:
 *     - file: the .zip build file
 *     - tier: "standard" | "premium" | "enterprise" | "root"
 *
 * Requires env vars:
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - VITE_SUPABASE_URL
 *   - DEVIGNFX_SIGNING_KEY (base64-encoded Ed25519 PEM private key)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const BUCKET = "devignfx-builds";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateBuildId(): string {
  return "BLD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

function signZip(zipBuffer: Buffer, pemKey: string): { signature: string; sha256: string } | null {
  try {
    const privateKey = crypto.createPrivateKey(pemKey);
    const signature = crypto.sign(null, zipBuffer, privateKey);
    const sha256 = crypto.createHash("sha256").update(zipBuffer).digest("hex");
    return {
      signature: signature.toString("base64"),
      sha256,
    };
  } catch (err) {
    console.error("Signing failed:", err);
    return null;
  }
}

export const config = {
  api: {
    bodyParser: false, // We handle multipart ourselves
  },
};

async function parseMultipart(req: VercelRequest): Promise<{ file: Buffer; fileName: string; tier: string }> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const body = Buffer.concat(chunks);

  const contentType = req.headers["content-type"] || "";
  const boundaryMatch = contentType.match(/boundary=(.+)/);
  if (!boundaryMatch) throw new Error("No boundary found in content-type");

  const boundary = boundaryMatch[1];
  const boundaryBuffer = Buffer.from(`--${boundary}`);

  // Split by boundary
  const parts: Buffer[] = [];
  let start = 0;
  while (true) {
    const idx = body.indexOf(boundaryBuffer, start);
    if (idx === -1) break;
    if (start > 0) {
      parts.push(body.subarray(start, idx));
    }
    start = idx + boundaryBuffer.length;
  }

  let file: Buffer | null = null;
  let fileName = "build.zip";
  let tier = "standard";

  for (const part of parts) {
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headers = part.subarray(0, headerEnd).toString("utf-8");
    const content = part.subarray(headerEnd + 4, part.length - 2); // strip trailing \r\n

    if (headers.includes('name="file"')) {
      file = content;
      const fnMatch = headers.match(/filename="([^"]+)"/);
      if (fnMatch) fileName = fnMatch[1];
    } else if (headers.includes('name="tier"')) {
      tier = content.toString("utf-8").trim();
    }
  }

  if (!file) throw new Error("No file found in upload");
  return { file, fileName, tier };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Verify auth — check for Supabase session token
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
    const { file, fileName, tier } = await parseMultipart(req);

    if (!fileName.endsWith(".zip")) {
      return res.status(400).json({ error: "Only .zip files are accepted" });
    }

    // Generate build ID
    const buildId = generateBuildId();
    const buildFileName = `DevignFX-${buildId}.zip`;
    const storagePath = tier === "root" ? buildFileName : `${tier}/${buildFileName}`;

    // Upload zip to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType: "application/zip",
        upsert: true,
      });

    if (uploadError) {
      return res.status(500).json({ error: `Upload failed: ${uploadError.message}` });
    }

    // Sign the package if signing key is available
    let sigData: { signature: string; sha256: string } | null = null;
    const signingKeyB64 = process.env.DEVIGNFX_SIGNING_KEY;

    if (signingKeyB64) {
      const pemKey = Buffer.from(signingKeyB64, "base64").toString("utf-8");
      sigData = signZip(file, pemKey);

      if (sigData) {
        // Upload .sig file alongside the zip
        const sigContent = [
          "-----BEGIN DEVIGNFX SIGNATURE-----",
          `File: ${buildFileName}`,
          `Build: ${buildId}`,
          `SHA256: ${sigData.sha256}`,
          `Signature: ${sigData.signature}`,
          "-----END DEVIGNFX SIGNATURE-----",
        ].join("\n");

        const sigPath = storagePath + ".sig";
        await supabase.storage
          .from(BUCKET)
          .upload(sigPath, Buffer.from(sigContent), {
            contentType: "text/plain",
            upsert: true,
          });
      }
    }

    return res.status(200).json({
      success: true,
      buildId,
      fileName: buildFileName,
      path: storagePath,
      tier,
      size: file.length,
      signed: !!sigData,
      sha256: sigData?.sha256 || null,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}
