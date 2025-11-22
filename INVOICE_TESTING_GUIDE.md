# Invoice & Email System - Testing Guide

## ✅ Features Implemented

### 1. **Invoice Management**

- Create invoices via admin panel
- Send/Resend invoices to clients
- Mark invoices as paid
- Print professional invoices
- Filter and search invoices

### 2. **Email Notifications**

- Course payment receipts (automatic)
- Service request notifications to admin
- Invoice emails to clients

---

## 🧪 Testing Steps

### **Test 1: Create an Invoice**

1. Navigate to `/admin/invoices`
2. Click **"New Invoice"** button
3. Fill in the form:
   - Client Name: `Test Client`
   - Client Email: Use your own email for testing
   - Phone: `+234 123 456 7890`
   - Amount: `100000`
   - Due Date: Pick a future date
   - Service Description: `Website Design and Development`
   - Notes (optional): `Payment via bank transfer`
4. Click **"Create Invoice"**
5. ✅ Verify invoice appears in the list

### **Test 2: Send Invoice Email**

**Prerequisites:**

- Update Edge Function with verified domain (see EMAIL_QUICKSTART.md)
- OR use the Resend test email (kingmclamba1@gmail.com)

**Steps:**

1. Find the invoice in the list
2. Click the **envelope icon** (📧) to send invoice
3. ✅ Check email inbox for invoice
4. ✅ Verify email contains:
   - Invoice number
   - Service description
   - Amount
   - Due date
   - Professional branding

### **Test 3: Mark as Paid**

1. Find a pending invoice
2. Click the **checkmark icon** (✓)
3. Confirm the action
4. ✅ Verify status changes to "Paid"
5. ✅ Verify checkmark button disappears (only for pending invoices)

### **Test 4: Print Invoice**

1. Click the **print icon** (🖨️) on any invoice
2. ✅ Verify print preview opens with:
   - GR8QM branding
   - Client details
   - Invoice number and dates
   - Service description
   - Amount total
   - Professional formatting

### **Test 5: View Invoice Details**

1. Click the **eye icon** (👁️) on any invoice
2. ✅ Verify modal shows:
   - Complete invoice details
   - Action buttons (Print, Send/Resend, Mark as Paid)
3. Test actions from the modal

### **Test 6: Filter & Search**

1. **Search**: Type invoice number, client name, or email
   - ✅ Verify list filters in real-time
2. **Status Filter**: Select "Paid", "Pending", etc.
   - ✅ Verify only matching invoices show
3. **Pagination**:
   - ✅ Verify "Next" and "Previous" buttons work
   - ✅ Verify count shows correctly

### **Test 7: Service Request Email**

1. Go to `/services/design-build` or `/services/print-shop`
2. Click "Get Started" or "Request Quote"
3. Fill in the service request form:
   - Name, Email, Phone
   - Budget Range, Timeline
   - Project Description
4. Submit the form
5. ✅ Check `hello@gr8qm.com` for notification email
6. ✅ Verify email contains all request details

### **Test 8: Course Payment Receipt**

1. Apply for a course at `/trainings`
2. Complete the payment (use test mode)
3. After successful payment:
   - ✅ Verify receipt displays on screen
   - ✅ Check applicant's email for receipt
   - ✅ Verify receipt has professional formatting

---

## 🔧 Troubleshooting

### Email Not Sending?

**Check:**

1. **ENV Variables**: Ensure `.env.local` has:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Resend API Key**: In Supabase Dashboard

   - Go to Edge Functions → Secrets
   - Verify `RESEND_API_KEY` is set

3. **Domain Verification** (for production):

   - Go to resend.com/domains
   - Verify your domain
   - Update Edge Function `from:` address

4. **Edge Function Deployed**:
   ```bash
   npx supabase functions list
   ```
   Should show `send-receipt-email`

### Invoice Not Creating?

**Check:**

1. Database table exists: `invoices`
2. Required columns match the form fields
3. Browser console for errors

### Service Request Email Not Arriving?

**Check:**

1. Edge Function URL is correct
2. `hello@gr8qm.com` is a valid, receiving email
3. Check spam folder
4. For testing, temporarily use your own email

---

## 📊 Expected Database Records

### `invoices` Table

```sql
- id (uuid)
- created_at (timestamp)
- invoice_number (text) - Auto-generated
- client_name (text)
- client_email (text)
- client_phone (text, nullable)
- service_description (text)
- amount (numeric)
- due_date (date)
- payment_status (text) - Default: 'pending'
- payment_date (timestamp, nullable)
- notes (text, nullable)
```

### `service_requests` Table

```sql
- id (uuid)
- created_at (timestamp)
- service_type (text) - 'design-build', 'print-shop', etc.
- name (text)
- email (text)
- phone (text)
- budget_range (text, nullable)
- timeline (text, nullable)
- project_description (text)
- status (text) - Default: 'pending'
```

---

## ✅ Success Criteria

An invoice system is working correctly when:

- [x] Invoices can be created via the admin panel
- [x] Emails send to the correct recipient
- [x] "Mark as Paid" updates the database
- [x] Print functionality generates professional PDFs
- [x] Service requests trigger admin notifications
- [x] Course payments trigger student receipts
- [x] All emails use professional HTML templates

---

## 🚀 Next Steps

Once testing is complete:

1. **Update Edge Function** with verified domain email
2. **Test in production** with real email addresses
3. **Train admin users** on the invoice workflow
4. **Set up monitoring** for failed emails

For detailed setup instructions, see:

- `EMAIL_QUICKSTART.md` - Email configuration
- `FIXES_APPLIED.md` - System architecture overview
