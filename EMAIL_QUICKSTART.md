# Email Setup - Quick Start Guide

## 🚀 Steps to Enable Email Functionality

### 1. Create Resend Account (Free)

1. Go to https://resend.com
2. Sign up for a free account (3,000 emails/month free)
3. Verify your email
4. Get your API key from the dashboard

### 2. Set Up Supabase Edge Function

The Edge Function is already created in `supabase/functions/send-receipt-email/index.ts`

**Deploy the function:**

```bash
# Make sure you're in the project root
cd d:\YEMI\dev\FRONTEND\gr8qm-technovates

# Login to Supabase (if not already)
npx supabase login

# Link your project (use your Supabase project ID)
npx supabase link --project-ref YOUR_PROJECT_ID

# Set the Resend API key as a secret
npx supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Deploy the function
npx supabase functions deploy send-receipt-email
```

### 3. Verify Email Domain (For Production)

**For testing:** You can send to any email, but it might go to spam.

**For production:**

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Add your domain (e.g., `gr8qmtechnovates.com`)
4. Add the DNS records they provide:
   - SPF record
   - DKIM record
   - DMARC record (optional but recommended)
5. Wait for verification (usually a few minutes)

### 4. Update Email "From" Address

If you verified a domain, update the Edge Function:

```typescript
// In supabase/functions/send-receipt-email/index.ts, line 206
from: "GR8QM Technovates <noreply@yourdomain.com>",
// Change to your verified domain
```

Redeploy:

```bash
npx supabase functions deploy send-receipt-email
```

### 5. Test the Email Flow

1. Make a test payment in your app
2. Check the browser console for email logs
3. Check the recipient's inbox
4. Check Supabase Functions logs:
   ```bash
   npx supabase functions logs send-receipt-email
   ```

## ⚙️ Environment Variables

The app already uses these from your `.env.local`:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

The Edge Function uses:

- `RESEND_API_KEY` - Set via `supabase secrets set`

## 🔍 Troubleshooting

### Function not found error

```bash
# Make sure function is deployed
npx supabase functions list
npx supabase functions deploy send-receipt-email
```

### Email not sending

```bash
# Check function logs
npx supabase functions logs send-receipt-email

# Test the function directly
curl -X POST \
  'https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-receipt-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "test@example.com",
    "customerName": "Test User",
    "courseName": "Test Course",
    "amount": 5000,
    "reference": "TEST-123",
    "date": "2025-11-22",
    "type": "course"
  }'
```

### Emails going to spam

1. **Verify your domain** in Resend
2. **Add SPF/DKIM records** to your DNS
3. **Use a real "from" address** (not @gmail.com, etc.)
4. **Warm up your domain** - start with small volume
5. **Test with mail-tester.com** to check spam score

## 📊 Monitoring

### Resend Dashboard

- View sent emails
- Check delivery status
- See bounce/complaint rates
- View email logs

### Supabase Dashboard

- Functions → send-receipt-email
- View logs
- Check invocations
- Monitor errors

## 💰 Pricing

### Resend Free Tier

- 3,000 emails/month
- 100 emails/day
- All features included
- No credit card required

### Paid Plans (if needed)

- $20/month for 50,000 emails
- $80/month for 100,000 emails

## 🎯 Quick Test

After deployment, test with a real payment or use this test:

```javascript
// In browser console on your site
const testEmail = await fetch(
  "/payment-success?reference=TEST-123&type=course"
);
// Then check if email was sent
```

## ✅ Checklist

- [ ] Resend account created
- [ ] API key obtained
- [ ] Supabase CLI installed
- [ ] Project linked
- [ ] Secret set (`RESEND_API_KEY`)
- [ ] Function deployed
- [ ] Test email sent
- [ ] Domain verified (for production)
- [ ] DNS records added (for production)

## 🆘 Need Help?

- **Resend Docs**: https://resend.com/docs
- **Supabase Functions**: https://supabase.com/docs/guides/functions
- **Support**: Check the Resend dashboard or Supabase logs

## Next Step After Setup

Once emails are working, test the full payment flow:

1. Apply for a course
2. Complete payment
3. Check PaymentSuccess page
4. Verify receipt email arrives
5. Print the receipt PDF

Your email system is now production-ready! 🎉
