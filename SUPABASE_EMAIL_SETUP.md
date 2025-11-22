# 📧 Email Setup Guide - Supabase Edge Function

## Yes, You Need to Set Up the Email Edge Function!

Your app is calling `${supabaseUrl}/functions/v1/send-receipt-email` but this Edge Function doesn't exist yet.

---

## Step 1: Create the Edge Function

### Option A: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not installed):

```bash
npm install -g supabase
```

2. **Login to Supabase**:

```bash
supabase login
```

3. **Link your project**:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

(Get YOUR_PROJECT_REF from your Supabase dashboard URL)

4. **Create the function**:

```bash
supabase functions new send-receipt-email
```

5. **Replace the generated file** at `supabase/functions/send-receipt-email/index.ts` with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { to, subject, html } = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    // Send email using Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "GR8QM Technovates <noreply@gr8qm.com>", // Change to your verified domain
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
```

6. **Deploy the function**:

```bash
supabase functions deploy send-receipt-email
```

---

## Step 2: Set Up Resend API Key

1. **Get Resend API Key**:

   - Go to [resend.com](https://resend.com/)
   - Sign up/Login
   - Create API key
   - Verify your domain `gr8qm.com` (or use their test domain initially)

2. **Set the secret in Supabase**:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

**OR** via Supabase Dashboard:

- Go to Project Settings → Edge Functions → Secrets
- Add: `RESEND_API_KEY` = `your_resend_api_key`

---

## Step 3: Update Email "From" Address

In the Edge Function code, change:

```typescript
from: "GR8QM Technovates <noreply@gr8qm.com>",
```

To match your verified domain in Resend.

**During testing**, you can use:

```typescript
from: "onboarding@resend.dev", // Resend's test domain
```

---

## Step 4: Test the Function

### Test from Supabase Dashboard:

1. Go to Edge Functions → `send-receipt-email`
2. Click "Invoke Function"
3. Send test payload:

```json
{
  "to": "your-email@example.com",
  "subject": "Test Email",
  "html": "<h1>Hello from GR8QM!</h1><p>This is a test email.</p>"
}
```

### Test from your app:

1. Create an invoice
2. Check the client's email
3. Check console logs for success/error

---

## Alternative: Using Your Own SMTP

If you prefer not to use Resend, you can use **Nodemailer** or any SMTP service:

```typescript
// Example with Gmail SMTP
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const client = new SMTPClient({
  connection: {
    hostname: "smtp.gmail.com",
    port: 465,
    tls: true,
    auth: {
      username: Deno.env.get("SMTP_USERNAME"),
      password: Deno.env.get("SMTP_PASSWORD"),
    },
  },
});

await client.send({
  from: "noreply@gr8qm.com",
  to: to,
  subject: subject,
  html: html,
});
```

---

## Quick Summary:

**What you need:**

1. ✅ Supabase Edge Function (`send-receipt-email`)
2. ✅ Resend.com account (or SMTP credentials)
3. ✅ API key set as Supabase secret
4. ✅ Verified email domain (or use test domain)

**Current Status:**

- ❌ Edge Function not created yet
- ❌ No email service configured

**Once set up:**

- ✅ Invoice emails will send automatically
- ✅ Service request notifications will work
- ✅ Course receipt emails will function

---

## Need Help?

If you encounter issues:

1. Check Edge Function logs in Supabase Dashboard
2. Verify RESEND_API_KEY is set correctly
3. Ensure domain is verified in Resend
4. Test with Resend's test domain first

Let me know when you're ready to set this up and I can guide you through it! 🚀
