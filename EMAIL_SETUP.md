# Email Setup Guide

## Current Status

The application is now configured to send payment receipt emails to customers after successful payments. Currently, emails are logged to the console (development mode).

## Production Setup Options

### Option 1: Supabase Edge Functions + Resend (Recommended)

1. **Install Resend**

   ```bash
   npm install resend
   ```

2. **Create Supabase Edge Function**

   ```bash
   supabase functions new send-receipt-email
   ```

3. **Add Function Code** (`supabase/functions/send-receipt-email/index.ts`):

   ```typescript
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   import { Resend } from "npm:resend";

   const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

   serve(async (req) => {
     const { to, customerName, courseName, amount, reference, date } =
       await req.json();

     // Use the template from src/utils/email.ts (emailTemplates.courseReceipt)
     const template = emailTemplates.courseReceipt({
       to,
       customerName,
       courseName,
       amount,
       reference,
       date,
       type: "course",
     });

     const data = await resend.emails.send({
       from: "GR8QM Technovates <noreply@gr8qmtechnovates.com>",
       to: [to],
       subject: template.subject,
       html: template.html,
     });

     return new Response(JSON.stringify(data), {
       headers: { "Content-Type": "application/json" },
     });
   });
   ```

4. **Set Environment Variable**

   ```bash
   # In Supabase Dashboard > Settings > Edge Functions
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

5. **Update `src/utils/email.ts`**:

   ```typescript
   export const sendReceiptEmail = async (receipt: EmailReceipt) => {
     const { data, error } = await supabase.functions.invoke(
       "send-receipt-email",
       {
         body: receipt,
       }
     );

     if (error) {
       console.error("Email sending error:", error);
       return { success: false, message: error.message };
     }

     return { success: true, message: "Email sent successfully" };
   };
   ```

6. **Deploy**:
   ```bash
   supabase functions deploy send-receipt-email
   ```

### Option 2: Direct Resend Integration (Simpler but less secure)

1. **Install Resend**

   ```bash
   npm install resend
   ```

2. **Update `src/utils/email.ts`**:

   ```typescript
   import { Resend } from "resend";

   const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

   export const sendReceiptEmail = async (receipt: EmailReceipt) => {
     try {
       const template = emailTemplates.courseReceipt(receipt);

       const { data, error } = await resend.emails.send({
         from: "GR8QM Technovates <noreply@gr8qmtechnovates.com>",
         to: [receipt.to],
         subject: template.subject,
         html: template.html,
       });

       if (error) throw error;

       return { success: true, message: "Email sent successfully" };
     } catch (error) {
       console.error("Email error:", error);
       return { success: false, message: "Failed to send email" };
     }
   };
   ```

3. **Add to `.env.local`**:

   ```
   VITE_RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

   ⚠️ **Note**: This exposes your API key to the client. Use Edge Functions in production!

### Option 3: SendGrid

Similar to Option 2, but use SendGrid SDK instead:

```bash
npm install @sendgrid/mail
```

## Email Service Providers

### Resend (Recommended)

- **Pricing**: Free for 3,000 emails/month
- **Website**: https://resend.com
- **Setup**: Very simple, great developer experience
- **Deliverability**: Excellent

### SendGrid

- **Pricing**: Free for 100 emails/day
- **Website**: https://sendgrid.com
- **Setup**: More complex, but very reliable
- **Deliverability**: Excellent

### AWS SES

- **Pricing**: $0.10 per 1,000 emails
- **Website**: https://aws.amazon.com/ses/
- **Setup**: More complex, requires AWS account
- **Deliverability**: Best-in-class

## Testing Emails Locally

Use [MailHog](https://github.com/mailhog/MailHog) or [MailCatcher](https://mailcatcher.me/) to test emails locally:

```bash
# Install MailHog
brew install mailhog  # macOS
# or download from GitHub releases

# Run MailHog
mailhog

# Access UI at http://localhost:8025
```

Then configure your email service to use SMTP:

```
Host: localhost
Port: 1025
```

## Verification

After setup, test the email flow:

1. Make a test payment
2. Check console logs for "📧 Receipt email sent successfully"
3. Check customer inbox for receipt
4. Verify all details are correct

## Troubleshooting

### Emails not sending

- Check API key is correct
- Verify domain is verified (for production)
- Check Supabase Edge Function logs
- Ensure CORS is configured if using direct API

### Emails going to spam

- Add SPF and DKIM records to your domain
- Use a verified domain email address
- Avoid spam trigger words
- Test with Mail Tester (mail-tester.com)

## Domain Verification

For production emails, verify your domain:

1. **Resend**: Dashboard > Domains > Add Domain
2. **SendGrid**: Settings > Sender Authentication > Domain Authentication
3. **AWS SES**: Identities > Create Identity > Domain

Add required DNS records (SPF, DKIM, DMARC).

## Current Implementation

The email system is ready but disabled for development. It will:

1. ✅ Trigger automatically after successful payment
2. ✅ Include full receipt details
3. ✅ Use professional HTML template
4. ✅ Log to console (development)

To enable in production: Follow Option 1 above!
