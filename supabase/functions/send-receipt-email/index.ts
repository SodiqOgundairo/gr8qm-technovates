import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { to, subject, html } = await req.json();

    console.log("📧 Sending email to:", to);
    console.log("📧 Subject:", subject);

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    if (!to || !subject || !html) {
      throw new Error("Missing required fields: to, subject, or html");
    }

    // Send email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "GR8QM Technovates <onboarding@resend.dev>", // Use Resend test domain
        // After domain verification, change to: "GR8QM Technovates <noreply@gr8qm.com>"
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Resend API error:", data);
      throw new Error(data.message || "Failed to send email via Resend");
    }

    console.log("✅ Email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
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
        error: error.message 
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
