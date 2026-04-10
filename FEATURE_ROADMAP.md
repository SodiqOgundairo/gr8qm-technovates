# GR8QM Technovates - Feature Roadmap

Features inspired by [aienai-academy](../aienai-academy) that can be built into gr8qm-technovates.

---

## High Priority (Directly Applicable)

### 1. Email Marketing System
**Source:** `aienai-academy/src/pages/admin/EmailMarketingPage.tsx`

Gr8qm currently only sends transactional emails (invoices, receipts, contact notifications). This adds bulk outreach.

- **Email Template Builder** - Rich HTML editor with reusable templates
- **Campaign Builder** - Compose campaigns, select recipients, schedule send time
- **Recipient Segmentation** - Filter by labels, enrollment status, service type
- **Merge Tags** - Dynamic content (`{{name}}`, `{{service_type}}`, etc.)
- **Campaign Analytics** - Open rates, click tracking, unsubscribe rates
- **Scheduled Sending** - Vercel cron job runs daily at midnight to send queued campaigns
- **Contact List Management** - Bulk label assignment, CSV export

**Supabase tables needed:** `email_templates`, `email_campaigns`, `email_campaign_messages`, `contacts`, `email_unsubscribes`
**API routes needed:** `/api/send-scheduled-campaigns` (Vercel cron), `/api/resend-webhook` (bounce/complaint tracking)

---

### 2. Event Management
**Source:** `aienai-academy/src/pages/admin/EventsPage.tsx`

For gr8qm's tech training workshops, webinars, and community events.

- **Event CRUD** - Create webinars, workshops, meetups, AMAs with details
- **Registration Forms** - Public registration page per event
- **Reminder Emails** - Automated reminders before event date
- **Attendee Tracking** - View registrations, check-in status
- **Event Types** - Webinar, Workshop, Meetup, AMA

**Supabase tables needed:** `events`, `event_registrations`
**Public route needed:** `/events/:slug` (registration page)
**Admin route needed:** `/admin/events`

---

### 3. Certificate Generation
**Source:** `aienai-academy/src/pages/admin/CertificateDesignerPage.tsx` + `aienai-academy/src/lib/certificate.ts`

Gr8qm has training courses but no completion certificates.

- **Visual Template Designer** - Canvas-based editor with drag-and-drop elements
- **Preset Templates** - Pre-built certificate layouts
- **Dynamic Fields** - Student name, certificate number, completion date, course name
- **PDF Export** - Generate downloadable PDF certificates (jsPDF)
- **Alumni Portal** - Public page where graduates can view/download their certificates

**Supabase tables needed:** `certificate_templates`, `certificates`
**Public route needed:** `/alumni` or `/certificates/:id`
**Admin route needed:** `/admin/certificates`

---

### 4. Flexible Checkout Modal
**Source:** `aienai-academy/src/components/CheckoutModal.tsx`

Currently gr8qm only has Paystack with no installment options.

- **Multi-Step Checkout** - Form fill -> payment selection -> processing -> success
- **Installment Plans** - Split payments over multiple months with slider UI
- **Coupon/Discount System** - Real-time coupon validation with percentage/fixed discounts
- **Multi-Provider Payments** - Stripe + PayPal + Paystack abstraction
- **Phone Number Formatting** - Country code selector with validation

**Supabase tables needed:** `coupons` (code, discount_type, discount_value, max_uses, expires_at)
**API routes needed:** `/api/validate-coupon`, `/api/create-stripe-session`, `/api/create-paypal-order`

---

### 5. Analytics Dashboard
**Source:** `aienai-academy/src/pages/admin/AnalyticsPage.tsx`

Gr8qm's admin dashboard only shows basic counts. This adds real insights.

- **12-Month Trend Charts** - Area and bar charts (Recharts library)
- **GA4 Integration** - Page views, unique visitors, session duration
- **Device Breakdown** - Desktop vs mobile vs tablet distribution
- **Top Pages Ranking** - Most visited pages
- **Conversion Funnels** - Track visitor -> contact -> client flow
- **Revenue Analytics** - Monthly revenue trends, average invoice value

**Dependencies:** `recharts` for charts, GA4 API via Vercel serverless function
**Admin route needed:** `/admin/analytics`

---

### 6. Role-Based Admin Permissions
**Source:** `aienai-academy/src/lib/AuthContext.tsx` + `aienai-academy/src/types/permissions.ts`

Gr8qm currently has flat auth — any logged-in user can do anything.

- **Role Tiers** - `super_admin` (full access), `admin` (limited), `viewer` (read-only)
- **Per-Module Permissions** - Granular CRUD for each admin section (invoices, blog, portfolio, etc.)
- **Permission Gate Component** - Wrap UI elements to show/hide based on permissions
- **Session Timeout** - Auto-logout after 24h of inactivity
- **Google OAuth** - Add Google sign-in alongside email/password

**Supabase tables needed:** `admin_roles` (or add `role` + `permissions` JSON to existing auth)

---

## Medium Priority (Needs Customization)

### 7. Enhanced Form Builder
**Source:** `aienai-academy/src/pages/admin/FormsPage.tsx`

Gr8qm already has a form builder. These are enhancements.

- **Completion Actions** - After submission: send email, calendar invite, file download, redirect, custom message
- **Conditional Logic** - Show/hide fields based on previous answers
- **Display Modes** - Embedded, popup, or standalone page
- **File Upload Fields** - Upload to Supabase Storage
- **Form Analytics** - Completion rates, drop-off points

---

### 8. Client/Graduate Showcase (Alumni System)
**Source:** `aienai-academy/src/pages/AlumniPage.tsx`

Adapt for gr8qm to showcase training graduates and client projects.

- **Graduate Profiles** - Name, photo, cohort, testimonial, certificate link
- **Testimonial Management** - Collect and display client/student reviews
- **Draggable Testimonial Carousel** - Interactive component for homepage/landing pages
- **Bulk Upload** - CSV import for alumni data

**Public route:** `/graduates` or `/testimonials`

---

### 9. Unsubscribe & Email Compliance
**Source:** `aienai-academy/src/pages/UnsubscribePage.tsx`

Required for email marketing compliance (CAN-SPAM, GDPR).

- **Unsubscribe Page** - One-click unsubscribe from marketing emails
- **Preference Center** - Choose which email types to receive
- **Bounce/Complaint Handling** - Resend webhook to auto-remove bad addresses

**Public route:** `/unsubscribe?email=...&token=...`
**API route:** `/api/unsubscribe`, `/api/resend-webhook`

---

## Low Priority (Reference / Future)

### 10. Floating Contact Widget
**Source:** `aienai-academy/src/components/ContactWidget.tsx`

Gr8qm has a ChatWidget already. Could upgrade to a tabbed version:
- "Drop a Message" tab (form)
- "Chat with Someone" tab (WhatsApp link or live chat)

### 11. Digi Dictionary / Glossary
**Source:** `aienai-academy/src/pages/DigiDictionaryPage.tsx`

A-Z glossary of tech/design terms. Could be useful for gr8qm's tech training arm as a resource page.

### 12. Page View Tracking
**Source:** `aienai-academy/src/hooks/usePageTracking.ts`

Custom hook that logs every page view to a Supabase `page_views` table. Lightweight alternative to GA4 for basic analytics without third-party scripts.

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
