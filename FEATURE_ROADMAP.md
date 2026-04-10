# GR8QM Technovates - Feature Roadmap

Features inspired by [aienai-academy](../aienai-academy) that can be built into gr8qm-technovates.

---

## High Priority (Directly Applicable)

### 1. ~~Email Marketing System~~ ✅ BUILT
**Status:** Implemented

- **Email Template Builder** - HTML editor with starter templates + live preview
- **Campaign Builder** - Compose, select recipients (all/category/labels), schedule
- **Recipient Segmentation** - Filter by category, labels, with unsubscribe filtering
- **Campaign Analytics** - Delivered, opened, clicked, bounced tracking via Resend webhooks
- **Contact Management** - CRUD, bulk ops (labels, category, delete), CSV import/export
- **Unsubscribe System** - Public `/unsubscribe` page, auto-footer on campaigns

**Files:** `src/pages/admin/EmailMarketing.tsx`, `src/lib/emailCampaigns.ts`, `src/lib/contacts.ts`, `src/lib/emailTemplates.ts`, `src/lib/emailSenders.ts`, `api/resend-webhook.ts`, `api/unsubscribe.ts`, `src/pages/Unsubscribe.tsx`
**Tables:** `email_templates`, `email_campaigns`, `email_campaign_messages`, `contacts`, `email_unsubscribes`, `email_senders`
**Routes:** `/admin/email-marketing`, `/unsubscribe`

---

### 2. ~~Certificate & Alumni System~~ ✅ BUILT
**Status:** Implemented

- **Certificate Templates** - Custom template editor with orientation, colors, border styles, signature, QR code toggle, live preview
- **Issue Certificates** - Issue certs linked to alumni + courses with auto-generated cert numbers (PREFIX-YEAR-XXXX)
- **PDF Generation** - Client-side PDF rendering with jsPDF (borders, QR codes, signatures, accent stripes)
- **Public Verification** - `/verify/:certNumber` page for certificate authenticity checks
- **Alumni Portal** - Public `/alumni` page with tier-based grouping (Top Achievers, Certified, Community), search, cohort filter
- **Alumni Management** - Admin CRUD for graduate profiles (name, email, photo, bio, LinkedIn, cohort)
- **Certificate Lifecycle** - Active/revoked/expired statuses, revoke & delete actions
- **Realtime Updates** - Supabase realtime subscriptions for all certificate/alumni tables

**Files:** `src/pages/admin/Certificates.tsx`, `src/lib/certificates.ts`, `src/lib/certificatePdf.ts`, `src/types/certificates.ts`, `src/pages/Alumni.tsx`, `src/pages/CertificateVerify.tsx`
**Tables:** `certificate_templates`, `certificates`, `alumni`
**Routes:** `/admin/certificates`, `/alumni`, `/verify`, `/verify/:certNumber`

---

### 3. ~~Event Management~~ ✅ BUILT
**Status:** Implemented

- **Event CRUD** - Create/edit/delete webinars, workshops, meetups, AMAs with full details
- **Public Events Page** - `/events` listing with type filtering, upcoming/past sections
- **Event Detail Page** - `/events/:slug` with description, speakers, tags, calendar integration
- **Inline Registration** - Public registration form with duplicate/capacity checks, atomic count increment
- **Attendee Management** - View registrations per event, remove attendees, CSV export
- **Event Types** - Webinar, Workshop, Meetup, AMA with color-coded badges
- **Status Workflow** - Upcoming, Live, Completed, Cancelled with status filtering
- **Add to Calendar** - Google Calendar link generation from event data
- **Capacity Tracking** - Visual progress bar, auto-blocks registration when full

**Files:** `src/pages/admin/Events.tsx`, `src/lib/events.ts`, `src/types/events.ts`, `src/pages/Events.tsx`, `src/pages/EventDetail.tsx`
**Tables:** `events`, `event_registrations` + RPC functions for atomic count updates
**Routes:** `/admin/events`, `/events`, `/events/:slug`

---

### 4. ~~Flexible Checkout Modal~~ ✅ BUILT
**Status:** Implemented

- **Multi-Step Checkout** - Reusable `CheckoutModal` with Details → Review → Processing flow
- **Installment Plans** - Optional split payments (2 or 3 months) with per-month display
- **Coupon/Discount System** - Real-time coupon validation (percentage/fixed), inline apply/remove, discount preview
- **Coupon Admin** - Full CRUD for coupons with code generator, usage limits, expiry, active toggle
- **Coupon API** - Server-side validation via Vercel serverless + Supabase RPC
- **Course Integration** - `CourseApplicationForm` now uses `CheckoutModal` with coupon support

**Files:** `src/components/checkout/CheckoutModal.tsx`, `src/lib/coupons.ts`, `src/types/checkout.ts`, `src/pages/admin/Coupons.tsx`, `api/validate-coupon.ts`
**Tables:** `coupons` + `validate_coupon()` and `use_coupon()` RPC functions
**Routes:** `/admin/coupons`

---

### 5. ~~Analytics Dashboard~~ ✅ BUILT
**Status:** Implemented

- **12-Month Trend Charts** - Revenue area chart, course applications bar chart, certificate issuance trends
- **10 Stat Cards** - Revenue, applications, invoices, messages, certificates, alumni, events, registrations, contacts, campaigns
- **Application Insights** - By status (pie chart) and by course (bar chart)
- **Invoice Breakdown** - Pie chart by payment status
- **Email Campaign Stats** - Delivered/opened/clicked/bounced performance bars
- **Events Overview** - By status with progress bars
- **Recent Transactions** - Sortable table with status badges

**Files:** `src/lib/analytics.ts`, `src/pages/admin/Analytics.tsx`
**Dependencies:** `recharts`
**Routes:** `/admin/analytics`

---

### 6. ~~Role-Based Admin Permissions~~ ✅ BUILT
**Status:** Implemented

- **Role Tiers** - `super_admin` (full access), `admin` (limited settings), `viewer` (read-only)
- **Per-Module Permissions** - Granular CRUD for 17 admin modules with role defaults and custom overrides
- **Auth Context** - `AuthProvider` with `useAuth()` hook providing user, profile, permissions, `can()` helper
- **Permission Gate Component** - `<PermissionGate module="..." action="...">` for conditional rendering
- **Permission-Aware Sidebar** - Nav items filtered by read access, user info + role badge, sign out
- **Settings Page** - Admin user list with role management (super admin only), last active tracking
- **Auto-Provisioning** - First user gets super_admin, subsequent users get viewer role

**Files:** `src/types/permissions.ts`, `src/lib/auth.ts`, `src/components/auth/PermissionGate.tsx`, `src/components/auth/ProtectedRoute.tsx`, `src/pages/admin/Settings.tsx`, `src/components/admin/AdminSidebar.tsx`
**Tables:** `admin_profiles` (user_id, role, display_name, email, permissions JSONB, last_active_at)
**Routes:** `/admin/settings`

---

## Medium Priority (Needs Customization)

### 7. ~~Enhanced Form Builder~~ ✅ BUILT
**Status:** Implemented (enhancements to existing form builder)

- **Completion Actions** - Configurable post-submission behavior: custom success message, redirect to URL, or send confirmation email
- **Conditional Logic** - Show/hide fields based on previous answers (already existed)
- **Screener Questions** - Auto-disqualify respondents based on answers (already existed)
- **File Upload Fields** - Upload to Supabase Storage with 10MB limit, supports PDF/DOC/images/CSV
- **Number Fields** - Numeric input with min/max validation
- **Max Responses** - Optional response cap per form
- **Form Analytics** - Completion rates via FormAnalytics page (already existed)

**Files:** `src/pages/admin/FormBuilder.tsx`, `src/pages/PublicForm.tsx` (updated)
**Storage:** `form-uploads` bucket in Supabase Storage

---

### 8. ~~Client/Graduate Showcase (Alumni System)~~ ✅ BUILT (merged into Certificate & Alumni System above)

---

### 9. ~~Unsubscribe & Email Compliance~~ ✅ BUILT (part of Email Marketing System #1)

Included in the Email Marketing implementation: unsubscribe page, Resend webhook for bounce/complaint handling, auto-footer on campaigns.

---

## Low Priority (Reference / Future)

### 10. ~~Floating Contact Widget~~ ✅ KEPT AS-IS
AI-powered ChatWidget already in place — no changes needed.

### 11. ~~Digi Dictionary / Glossary~~ ✅ BUILT
**Status:** Implemented

- **Public Glossary Page** - A-Z browseable, search, alphabet nav bar, category badges (web, design, data, ai, general)
- **Admin CRUD** - Add/edit/delete terms, toggle published, search, category selector
- **Realtime Updates** - Supabase realtime subscription for live admin list

**Files:** `src/pages/Glossary.tsx`, `src/pages/admin/Glossary.tsx`, `src/lib/glossary.ts`
**Tables:** `glossary_terms` (term, definition, category, letter (generated), published)
**Routes:** `/glossary`, `/admin/glossary`

### 12. ~~Page View Tracking~~ ✅ BUILT
**Status:** Implemented

- **usePageTracking hook** - Logs every route change to `page_views` table
- **Device detection** - Desktop/mobile/tablet from user agent
- **Referrer tracking** - Captures document.referrer
- **Admin-excluded** - Skips `/admin` routes to avoid inflating counts

**Files:** `src/hooks/usePageTracking.ts`
**Tables:** `page_views` (path, referrer, device, user_agent, created_at)

---

## Implementation Notes

### Shared Tech Stack
Both projects use the same stack, making porting straightforward:
- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- Resend API for emails
- Paystack for payments
- Vercel for hosting

### Key Directories in aienai-academy to Reference
```
aienai-academy/
  src/components/CheckoutModal.tsx    # Checkout flow
  src/components/ContactWidget.tsx    # Floating widget
  src/pages/admin/EmailMarketingPage.tsx  # Email campaigns
  src/pages/admin/EventsPage.tsx      # Event management
  src/pages/admin/AnalyticsPage.tsx   # Analytics dashboard
  src/pages/admin/CertificateDesignerPage.tsx  # Certificate builder
  src/pages/admin/FormsPage.tsx       # Enhanced form builder
  src/lib/certificate.ts              # PDF generation logic
  src/types/permissions.ts            # Permission definitions
  src/hooks/usePermissions.ts         # Permission hook
  api/send-scheduled-campaigns.ts     # Cron job for emails
  api/validate-coupon.ts              # Coupon validation
  api/create-stripe-session.ts        # Stripe integration
  supabase/migrations/                # Database schemas
```
