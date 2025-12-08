# Email Edge Function - Deployment Guide

## Overview

This edge function sends emails using Resend for all email types:

- Invoice notifications (to clients)
- Service request notifications (to hello@gr8qm.com)
- Course receipt emails (to applicants)

**Sender**: `Faith from Gr8QM <hello@gr8qm.com>`

---

## Prerequisites

✅ RESEND_API_KEY is already set (you confirmed this is working)
✅ Domain `gr8qm.com` is verified in Resend
✅ Sender email `hello@gr8qm.com` is configured

---

## Deployment Steps

### Method 1: Supabase Dashboard (Recommended)

1. **Login to Supabase Dashboard**

   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Edge Functions**

   - Click "Edge Functions" in the left sidebar
   - You should see "send-receipt-email" if it exists, or click "New Function"

3. **Update the Function**

   - If updating existing: Click on "send-receipt-email"
   - If creating new: Name it "send-receipt-email"
   - Copy the entire contents of `supabase/functions/send-receipt-email/index.ts`
   - Paste into the code editor
   - Click "Deploy" or "Save"

4. **Verify Deployment**
   - Check the "Logs" tab to confirm it deployed successfully
   - Note the function URL (it should be similar to):
     `https://[your-project-ref].supabase.co/functions/v1/send-receipt-email`

### Method 2: Supabase CLI

If you prefer using the CLI:

```bash
# 1. Install Supabase CLI (if not installed)
npm install -g supabase

# 2. Login
supabase login

# 3. Link your project
supabase link --project-ref YOUR_PROJECT_REF

# 4. Deploy the function
supabase functions deploy send-receipt-email

# 5. Verify deployment
supabase functions list
```

---

## Testing After Deployment

### Test 1: Invoice Email

1. Go to `/admin/invoices`
2. Create a test invoice with your email
3. Check your inbox for email from "Faith from Gr8QM"

**Expected**:

- From: `Faith from Gr8QM <hello@gr8qm.com>`
- Subject: "Invoice from GR8QM Technovates - INV-XXXXXX"
- Contains professional invoice layout with "Pay Now" button

### Test 2: Service Request Email

1. Go to `/services/design-build`
2. Submit a service request
3. Check `hello@gr8qm.com` inbox

**Expected**:

- From: `Faith from Gr8QM <hello@gr8qm.com>`
- Subject: "New Service Request - Design & Build"
- Contains all form details

### Test 3: Course Receipt Email

1. Go to `/services/tech-training`
2. Apply for a course and complete payment
3. Check applicant's email

**Expected**:

- From: `Faith from Gr8QM <hello@gr8qm.com>`
- Subject: "Payment Receipt - [Course Name]"
- Contains commitment fee details and refund badge

---

## Monitoring

### Supabase Logs

1. Go to Edge Functions → send-receipt-email → Logs
2. Look for:
   - `📧 Sending email to: ...`
   - `✅ Email sent successfully`
   - Or errors: `❌ Resend API error`

### Resend Dashboard

1. Login to https://resend.com
2. Check "Emails" tab for sent emails
3. Verify delivery status
4. Confirm sender shows as "Faith from Gr8QM"

---

## Troubleshooting

### Email Not Sending

**Check Edge Function Logs**:

- Go to Supabase → Edge Functions → Logs
- Look for error messages

**Common Issues**:

1. **"RESEND_API_KEY not configured"**

   - The secret is missing or incorrect
   - Verify in Supabase → Project Settings → Edge Functions → Secrets
   - Should be named exactly: `RESEND_API_KEY`

2. **"Failed to send email via Resend"**

   - Check Resend dashboard for error details
   - Verify domain is verified
   - Ensure sender email is authorized

3. **CORS errors**
   - Ensure frontend is using correct headers
   - Check that `Authorization` header includes `Bearer` token

### Frontend Not Calling Function

**Verify frontend code**:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

await fetch(`${supabaseUrl}/functions/v1/send-receipt-email`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${supabaseKey}`,
  },
  body: JSON.stringify({
    to: "recipient@example.com",
    subject: "Test Email",
    html: "<h1>Test</h1>",
  }),
});
```

---

## Edge Function API

### Request Format

```typescript
POST /functions/v1/send-receipt-email

Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_SUPABASE_ANON_KEY

Body:
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "html": "<html>...</html>",
  "replyTo": "optional@example.com"  // Optional
}
```

### Response Format

**Success**:

```json
{
  "success": true,
  "data": {
    "id": "resend-email-id"
  }
}
```

**Error**:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Notes

- The function is **generic** - it accepts any email HTML from the frontend
- Email templates are defined in `src/utils/email.ts`
- All emails use the same sender: `Faith from Gr8QM <hello@gr8qm.com>`
- The `replyTo` field is optional and useful for service request notifications
