# Database Setup for Invoice & Service Request Features

## Quick Setup Steps

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**

   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**

   - Click on "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Run Invoice Table Migration**

   - Copy the contents of `supabase/migrations/create_invoices_table.sql`
   - Paste into the SQL editor
   - Click "RUN" or press Ctrl+Enter
   - ✅ Should see "Success. No rows returned"

4. **Run Service Requests Table Migration**

   - Copy the contents of `supabase/migrations/create_service_requests_table.sql`
   - Paste into the SQL editor
   - Click "RUN"
   - ✅ Should see "Success. No rows returned"

5. **Verify Tables Created**
   - Go to "Table Editor" in the sidebar
   - You should see:
     - `invoices` table
     - `service_requests` table

---

### Option 2: Using Supabase CLI

```bash
# Make sure you're logged in
npx supabase login

# Link to your project (if not already linked)
npx supabase link --project-ref your-project-ref

# Run migrations
npx supabase db push
```

---

## 🔍 Verify Setup

### Check Invoices Table

Run this in SQL Editor:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'invoices';
```

Should return columns:

- id (uuid)
- created_at (timestamp with time zone)
- invoice_number (text)
- client_name (text)
- client_email (text)
- client_phone (text)
- service_description (text)
- amount (numeric)
- due_date (date)
- payment_status (text)
- payment_date (timestamp with time zone)
- notes (text)

### Check Service Requests Table

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'service_requests';
```

Should return columns:

- id (uuid)
- created_at (timestamp with time zone)
- service_type (text)
- name (text)
- email (text)
- phone (text)
- budget_range (text)
- timeline (text)
- project_description (text)
- status (text)

---

## 🧪 Test After Setup

1. **Refresh your app** (hard refresh: Ctrl+Shift+R)
2. **Go to** `/admin/invoices`
3. **Click** "New Invoice"
4. **Fill the form** and submit
5. ✅ Should work without errors!

---

## ❌ Troubleshooting

### "Permission denied" error

- Check that RLS policies were created
- Run the migration again to ensure policies are set

### "Table already exists" error

- Table was already created
- You can drop and recreate:
  ```sql
  DROP TABLE IF EXISTS public.invoices CASCADE;
  DROP TABLE IF EXISTS public.service_requests CASCADE;
  ```
- Then run the migrations again

### Columns still missing

- Clear Supabase cache in your app
- Restart your dev server
- Hard refresh browser

---

## ✅ Next Steps

Once tables are created:

1. Test invoice creation
2. Test service request submission
3. Verify email notifications work
4. Follow `INVOICE_TESTING_GUIDE.md` for comprehensive testing
