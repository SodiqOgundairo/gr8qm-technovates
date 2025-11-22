# 🚀 Quick Edge Function Setup (3 Steps)

## Step 1: Get Resend API Key (2 minutes)

1. Go to **https://resend.com**
2. Sign up/Login (free account)
3. Click "API Keys" → "Create API Key"
4. Copy the API key (it starts with `re_`)

---

## Step 2: Add API Key to Supabase (1 minute)

### Via Supabase Dashboard:

1. Open **https://supabase.com/dashboard**
2. Select your project
3. Go to **Project Settings** (⚙️) → **Edge Functions**
4. Click **"Manage secrets"**
5. Add secret:
   - **Name**: `RESEND_API_KEY`
   - **Value**: (paste your Resend API key from Step 1)
6. Click **"Add secret"**

---

## Step 3: Deploy Edge Function (2 minutes)

### Open Terminal and run:

```bash
# 1. Install Supabase CLI (if not installed)
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link your project
# Get YOUR_PROJECT_REF from your Supabase dashboard URL:
# https://supabase.com/dashboard/project/YOUR_PROJECT_REF
supabase link --project-ref YOUR_PROJECT_REF

# 4. Deploy the function
supabase functions deploy send-receipt-email
```

---

## ✅ That's It!

After these 3 steps, your emails will work:

- ✅ Invoice emails to clients
- ✅ Service request notifications to hello@gr8qm.com
- ✅ Course receipt emails

---

## 🧪 Test It:

1. Create an invoice in your app (`/admin/invoices`)
2. Check the client's email
3. Check browser console for success/error logs

---

## ⚠️ Important Note:

**For testing**, emails will be sent from `onboarding@resend.dev` (Resend's test domain).

**For production**, verify your domain `gr8qm.com` in Resend and update line 37 in the Edge Function to:

```typescript
from: "GR8QM Technovates <noreply@gr8qm.com>",
```

---

## 📝 Troubleshooting:

**If deployment fails:**

```bash
# Check if logged in
supabase status

# Try logout and login again
supabase logout
supabase login
```

**If emails don't send:**

1. Check Supabase → Edge Functions → Logs
2. Verify `RESEND_API_KEY` is set correctly
3. Check Resend dashboard for error logs

**Need your project ref?**
Find it in your Supabase dashboard URL: `https://supabase.com/dashboard/project/[THIS-IS-YOUR-PROJECT-REF]`

---

## 🎯 Quick Reference:

| What            | Where                | How Long |
| --------------- | -------------------- | -------- |
| Get Resend Key  | resend.com           | 2 min    |
| Add to Supabase | Dashboard → Settings | 1 min    |
| Deploy Function | Terminal commands    | 2 min    |

**Total Time: ~5 minutes** ⏱️
