import { jsPDF } from "jspdf";
import type { CertificateTemplate, Alumni, Certificate } from "../types/certificates";

const SITE_URL = "https://www.gr8qm.com";

/**
 * Generate a certificate PDF client-side using jsPDF.
 * Returns an object URL for the PDF blob.
 */
export async function generateCertificatePdf(
  certificate: Certificate,
  alumni: Alumni,
  template: CertificateTemplate | null
): Promise<string> {
  const t = template || getDefaultTemplate();

  // If template has visual designer elements, use element-based rendering
  if (t.elements && t.elements.length > 0) {
    return generateFromElements(certificate, alumni, t);
  }
  const isLandscape = t.orientation === "landscape";

  const doc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // ── Background ─────────────────────────────────────
  doc.setFillColor(t.background_color);
  doc.rect(0, 0, pageW, pageH, "F");

  // ── Border ─────────────────────────────────────────
  drawBorder(doc, t.border_style, t.accent_color, pageW, pageH);

  // ── Accent stripe at top ───────────────────────────
  doc.setFillColor(t.accent_color);
  doc.rect(0, 0, pageW, 3, "F");

  // ── Header ─────────────────────────────────────────
  const centerX = pageW / 2;
  let y = isLandscape ? 28 : 35;

  // Company name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor("#ffffff");
  doc.text("GR8QM TECHNOVATES", centerX, y, { align: "center" });
  y += 6;

  // Small tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(t.accent_color);
  doc.text("Faith that builds. Impact that lasts.", centerX, y, {
    align: "center",
  });
  y += 14;

  // ── Certificate title ──────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(t.accent_color);
  doc.text(t.header_text, centerX, y, { align: "center" });
  y += 12;

  // ── Decorative line ────────────────────────────────
  doc.setDrawColor(t.accent_color);
  doc.setLineWidth(0.5);
  doc.line(centerX - 40, y, centerX + 40, y);
  y += 10;

  // ── Subheader ──────────────────────────────────────
  if (t.subheader_text) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor("#cccccc");
    doc.text(t.subheader_text, centerX, y, { align: "center" });
    y += 12;
  }

  // ── Recipient name ─────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor("#ffffff");
  const fullName = `${alumni.first_name} ${alumni.last_name}`;
  doc.text(fullName, centerX, y, { align: "center" });
  y += 14;

  // ── Course name ────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor("#cccccc");
  doc.text("has successfully completed", centerX, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(t.accent_color);
  doc.text(certificate.course_name, centerX, y, { align: "center" });
  y += 14;

  // ── Date & cert number ─────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#999999");

  const dateStr = new Date(certificate.issue_date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Issued: ${dateStr}`, centerX, y, { align: "center" });
  y += 5;
  doc.text(
    `Certificate No: ${certificate.certificate_number}`,
    centerX,
    y,
    { align: "center" }
  );
  y += 12;

  // ── Signature ──────────────────────────────────────
  if (t.signature_name) {
    // Signature line
    doc.setDrawColor("#666666");
    doc.setLineWidth(0.3);
    doc.line(centerX - 30, y, centerX + 30, y);
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor("#ffffff");
    doc.text(t.signature_name, centerX, y, { align: "center" });
    y += 4;

    if (t.signature_title) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor("#999999");
      doc.text(t.signature_title, centerX, y, { align: "center" });
    }
  }

  // ── QR Code (verify link) ─────────────────────────
  if (t.show_qr_code) {
    const verifyUrl = `${SITE_URL}/verify/${certificate.certificate_number}`;
    await drawQrCode(doc, verifyUrl, isLandscape ? pageW - 35 : pageW - 30, pageH - 30, 20);

    doc.setFontSize(6);
    doc.setTextColor("#666666");
    doc.text("Scan to verify", isLandscape ? pageW - 25 : pageW - 20, pageH - 8, {
      align: "center",
    });
  }

  // ── Footer ─────────────────────────────────────────
  if (t.footer_text) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor("#666666");
    doc.text(t.footer_text, centerX, pageH - 8, { align: "center" });
  }

  // ── Bottom accent stripe ───────────────────────────
  doc.setFillColor(t.accent_color);
  doc.rect(0, pageH - 3, pageW, 3, "F");

  // Return blob URL
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}

// ── Border drawing ───────────────────────────────────────

function drawBorder(
  doc: jsPDF,
  style: string,
  color: string,
  w: number,
  h: number
) {
  if (style === "none") return;

  doc.setDrawColor(color);

  if (style === "single") {
    doc.setLineWidth(0.8);
    doc.rect(8, 8, w - 16, h - 16);
  } else if (style === "double") {
    doc.setLineWidth(0.5);
    doc.rect(6, 6, w - 12, h - 12);
    doc.setLineWidth(0.3);
    doc.rect(10, 10, w - 20, h - 20);
  } else if (style === "ornate") {
    doc.setLineWidth(0.8);
    doc.rect(6, 6, w - 12, h - 12);
    doc.setLineWidth(0.3);
    doc.rect(9, 9, w - 18, h - 18);
    // Corner accents
    const s = 5;
    const corners = [
      [12, 12],
      [w - 12, 12],
      [12, h - 12],
      [w - 12, h - 12],
    ];
    for (const [cx, cy] of corners) {
      doc.line(cx - s, cy, cx + s, cy);
      doc.line(cx, cy - s, cx, cy + s);
    }
  }
}

// ── QR Code rendering ────────────────────────────────────

async function drawQrCode(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  size: number
) {
  // Use a canvas-based QR code generator
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;

  // Dynamic import of qrcode.react is not suitable here,
  // so we use a simple QR code approach with a text-based placeholder
  // and the QR encoding library
  try {
    const QRCode = await import("qrcode.react");
    // qrcode.react is a React component — we need raw canvas rendering
    // Instead, use a simple data URL approach
    const { createRoot } = await import("react-dom/client");
    const React = await import("react");

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    const root = createRoot(container);

    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(QRCode.QRCodeCanvas, {
          value: text,
          size: 200,
          bgColor: "transparent",
          fgColor: "#ffffff",
          level: "M",
          ref: (canvasEl: HTMLCanvasElement | null) => {
            if (canvasEl) {
              const imgData = canvasEl.toDataURL("image/png");
              doc.addImage(imgData, "PNG", x, y, size, size);
            }
            setTimeout(() => {
              root.unmount();
              document.body.removeChild(container);
              resolve();
            }, 50);
          },
        })
      );
    });
  } catch {
    // Fallback: draw a simple box with the verify URL text
    doc.setDrawColor("#ffffff");
    doc.setLineWidth(0.3);
    doc.rect(x, y, size, size);
    doc.setFontSize(4);
    doc.setTextColor("#ffffff");
    doc.text("VERIFY", x + size / 2, y + size / 2, { align: "center" });
  }
}

// ── Element-based PDF rendering ───────────────────────────

async function generateFromElements(
  certificate: Certificate,
  alumni: Alumni,
  t: CertificateTemplate
): Promise<string> {
  const isLandscape = t.orientation === "landscape";
  const doc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(t.background_color);
  doc.rect(0, 0, pageW, pageH, "F");

  // Border
  drawBorder(doc, t.border_style, t.accent_color, pageW, pageH);

  // Accent stripes
  doc.setFillColor(t.accent_color);
  doc.rect(0, 0, pageW, 3, "F");
  doc.setFillColor(t.accent_color);
  doc.rect(0, pageH - 3, pageW, 3, "F");

  // Variable data
  const fullName = `${alumni.first_name} ${alumni.last_name}`;
  const dateStr = new Date(certificate.issue_date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const vars: Record<string, string> = {
    name: fullName,
    course: certificate.course_name,
    date: dateStr,
    certNumber: certificate.certificate_number,
    company: "GR8QM Technovates",
    sigName: t.signature_name || "Faith Ogunbayo",
    sigTitle: t.signature_title || "Founder & CEO, GR8QM Technovates",
  };

  const resolveVars = (text: string) =>
    text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] || `{{${k}}}`);

  // Sort elements by zIndex
  const sorted = [...t.elements!].sort((a, b) => a.zIndex - b.zIndex);

  for (const el of sorted) {
    const opacity = el.opacity ?? 1;
    if (opacity <= 0) continue;

    if (el.type === "line") {
      doc.setDrawColor(el.lineColor || "#666666");
      doc.setLineWidth(el.lineThickness || 0.5);
      doc.line(el.x, el.y, el.x + el.width, el.y);
    } else if (el.type === "qrcode") {
      const verifyUrl = `${SITE_URL}/verify/${certificate.certificate_number}`;
      await drawQrCode(doc, verifyUrl, el.x, el.y, el.width);
      doc.setFontSize(6);
      doc.setTextColor("#666666");
      doc.text("Scan to verify", el.x + el.width / 2, el.y + el.height + 3, { align: "center" });
    } else if (el.type === "image") {
      if (el.imageUrl) {
        try {
          doc.addImage(el.imageUrl, "PNG", el.x, el.y, el.width, el.height);
        } catch {
          // Skip broken images
        }
      }
    } else {
      // text or variable
      let text = el.type === "variable" ? resolveVars(el.content || "") : (el.content || "");
      if (el.textTransform === "uppercase") text = text.toUpperCase();
      else if (el.textTransform === "capitalize") text = text.replace(/\b\w/g, (c) => c.toUpperCase());

      doc.setFont("helvetica", el.fontWeight === "bold" ? "bold" : "normal");
      doc.setFontSize(el.fontSize || 12);
      doc.setTextColor(el.color || "#ffffff");

      const align = el.textAlign || "center";
      let textX = el.x;
      if (align === "center") textX = el.x + el.width / 2;
      else if (align === "right") textX = el.x + el.width;

      // Vertically center text in element box
      const textY = el.y + el.height / 2 + (el.fontSize || 12) * 0.12;
      doc.text(text, textX, textY, { align: align as "left" | "center" | "right" });
    }
  }

  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}

// ── Default template fallback ────────────────────────────

function getDefaultTemplate(): CertificateTemplate {
  return {
    id: "",
    name: "Default",
    orientation: "landscape",
    background_color: "#05235a",
    accent_color: "#0098da",
    logo_url: null,
    border_style: "double",
    header_text: "Certificate of Completion",
    subheader_text: "This is to certify that",
    footer_text: "GR8QM Technovates — Faith that builds. Impact that lasts.",
    signature_name: "Faith Ogunbayo",
    signature_title: "Founder & CEO, GR8QM Technovates",
    signature_image_url: null,
    show_qr_code: true,
    course_prefix: "GR8QM",
    elements: null,
    created_at: "",
    updated_at: "",
  };
}
