import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;    // Plain text version (improves deliverability)
  replyTo?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const emailData: EmailRequest = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Validate required fields
    if (!emailData.to || !emailData.subject || !emailData.html) {
      throw new Error("Missing required fields: to, subject, or html");
    }

    console.log("📧 Sending email to:", emailData.to);
    console.log("📧 Subject:", emailData.subject);

    // Prepare email payload
    const emailPayload: any = {
      from: "Faith from Gr8QM <hello@gr8qm.com>",
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
    };

    // Add plain text version if provided (improves deliverability)
    if (emailData.text) {
      emailPayload.text = emailData.text;
    }

    // Add reply-to if provided (useful for service requests)
    if (emailData.replyTo) {
      emailPayload.reply_to = emailData.replyTo;
    }

    // Send email using Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("❌ Resend API error:", resendData);
      throw new Error(resendData.message || "Failed to send email via Resend");
    }

    console.log("✅ Email sent successfully:", resendData);

    return new Response(
      JSON.stringify({ success: true, data: resendData }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error sending email:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
