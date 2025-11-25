# 🚀 Email Edge Function - Deployment Guide

## Quick Start (5 minutes)

### Step 1: Get Resend API Key (2 min)

1. Go to **https://resend.com**
2. Sign up for free account (3,000 emails/month free)
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy the key (starts with `re_`)

---

### Step 2: Deploy Using npx (No Installation Needed!)

Run these commands in your terminal:

```powershell
#1. Login to Supabase
npx supabase login

# 2. Link your project (get project ref from your Supabase dashboard URL)
npx supabase link --project-ref YOUR_PROJECT_REF

# 3. Set the Resend API key as a secret
npx supabase secrets set RESEND_API_KEY=your_resend_api_key_here

# 4. Deploy the edge function
npx supabase functions deploy send-receipt-email

# 5. Verify deployment
npx supabase functions list
```

**Where to find YOUR_PROJECT_REF:**

- Open your Supabase dashboard
- Look at the URL: `https://supabase.com/dashboard/project/[YOUR_PROJECT_REF]`
- Copy that project reference ID

---

### Step 3: Test the Deployment

After deployment, test each email type:

#### Test 1: Invoice Email

1. Go to http://localhost:5173/admin/invoices
2. Click "New Invoice"
3. Fill in:
   - Client Email: (your email)
   - Amount: 10000
   - Other required fields
4. Submit
5. Check your email inbox!

#### Test 2: Service Request Email

1. Go to http://localhost:5173/services/design-build
2. Click "Request Service"
3. Fill in the form
4. Submit
5. Check `hello@gr8qm.com` inbox

#### Test 3: Course Receipt (after payment)

1. Apply for a course
2. Complete test payment
3. Check applicant's email for receipt

---

## Troubleshooting

**If deployment fails:**

1. Make sure you're logged in: `npx supabase status`
2. Check project is linked: `npx supabase projects list`
3. Verify secret is set: `npx supabase secrets list`

**If emails don't send:**

1. Check Supabase dashboard → Edge Functions → Logs
2. Verify Resend API key is correct
3. Check browser console for errors
4. Look in spam/junk folder

**Common Issues:**

- ❌ "Project not linked" → Run `npx supabase link --project-ref YOUR_REF` again
- ❌ "RESEND_API_KEY not set" → Run secrets command again
- ❌ Email not received → Check Resend dashboard for delivery status

---

## Production Checklist

Once testing is complete:

- [ ] Verify domain in Resend (optional but recommended)
- [ ] Update sender email from `onboarding@resend.dev` to `noreply@gr8qm.com`
- [ ] Test all three email types in production
- [ ] Monitor Resend dashboard for delivery issues
- [ ] Document for your team

---

## Commands Reference

```powershell
# Login
npx supabase login

# Link project
npx supabase link --project-ref YOUR_PROJECT_REF

# Set API key
npx supabase secrets set RESEND_API_KEY=your_key

# Deploy function
npx supabase functions deploy send-receipt-email

# Check deployment
npx supabase functions list

# View logs (for debugging)
npx supabase functions logs send-receipt-email

# Update secret (if needed)
npx supabase secrets set RESEND_API_KEY=new_key
```
