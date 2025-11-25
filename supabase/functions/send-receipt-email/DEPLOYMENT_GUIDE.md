# Edge Function Setup - Quick Guide

## QUESTION 1: Which File Goes to Supabase?

**Answer**: Use **`index.ts`** (the new generic version)

### The Files Explained:

1. **`supabase/functions/send-receipt-email/index.ts`** ✅ **USE THIS**

   - This is the NEW generic edge function I created
   - Sender: "Faith from Gr8QM <hello@gr8qm.com>"
   - Accepts any email (invoices, service requests, receipts)
   - **This goes to Supabase Dashboard**

2. **`supabase/functions/send-receipt-email/sample.ts`** ❌ **DON'T USE**

   - This is your OLD function (hardcoded for course receipts only)
   - You can delete this file

3. **`src/utils/email.ts`** 📧 **FRONTEND ONLY**
   - This is NOT an edge function
   - This creates email templates (HTML) in your frontend
   - The frontend calls the edge function with these templates
   - **Do NOT upload this to Supabase**

---

## QUESTION 2: How to Turn Off JWT in Supabase Dashboard?

### Step-by-Step:

1. **Go to Supabase Dashboard**

   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Go to Edge Functions**

   - Click "Edge Functions" in the left sidebar
   - Click on "send-receipt-email"

3. **Find the JWT Setting**

   - Look for one of these:
     - "Verify JWT" toggle/checkbox
     - "JWT Verification" option
     - "Import JWT" option
     - Settings/Configuration tab

4. **Turn it OFF**

   - **Uncheck** or **Disable** the JWT verification
   - If it says "Verify JWT": set to **OFF**
   - If it's a dropdown: select **"No Verification"** or **"Disabled"**

5. **Save/Deploy**
   - Click Save or Deploy
   - Wait for deployment to complete

### Visual Guide:

```
Dashboard → Edge Functions → send-receipt-email → Settings

Look for:
┌────────────────────────────┐
│ ☐ Verify JWT               │  ← UNCHECK THIS
│                            │
│ [Deploy]                   │  ← CLICK THIS
└────────────────────────────┘
```

**Why?** The JWT verification blocks your frontend's anon key. Turning it off allows your app to call the function.

---

## What to Deploy to Supabase

**Copy this entire code** from `supabase/functions/send-receipt-email/index.ts` and paste it into the Supabase Dashboard:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
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

    return new Response(JSON.stringify({ success: true, data: resendData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
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
```

---

## Deployment Checklist

- [ ] Copy code from `index.ts` (above)
- [ ] Paste into Supabase Dashboard Edge Function editor
- [ ] Turn OFF JWT Verification
- [ ] Click Deploy
- [ ] Test by creating an invoice or service request
- [ ] Check if email arrives with "Faith from Gr8QM" as sender

---

## After Deployment

You can safely **delete** these files from your project:

- `supabase/functions/send-receipt-email/sample.ts` (old version)
- `supabase/functions/send-receipt-email/config.json` (not needed for dashboard deployment)

Keep these files:

- `supabase/functions/send-receipt-email/index.ts` (your source of truth)
- `supabase/functions/send-receipt-email/README.md` (documentation)
- `src/utils/email.ts` (frontend email templates)
