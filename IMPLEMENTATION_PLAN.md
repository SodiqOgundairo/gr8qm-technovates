# GR8QM Technovates - Implementation Plan

## Overview

This document outlines the implementation of the enhanced services system including tech training, service requests, portfolio management, and admin dashboard.

## Database Setup

1. Run `supabase-setup.sql` in your Supabase SQL Editor
2. Add your Paystack Public Key to `.env` file as `VITE_PAYSTACK_PUBLIC_KEY`

## Services Structure

### 1. Build & Design (formerly Research & Design)

- **Purpose**: Custom development and design projects
- **User Flow**:
  - View service details
  - Fill contact form (name, email, phone, project details)
  - Form submits to `service_requests` table
  - Email sent to hello@gr8qm.com
  - View portfolio button → Portfolio page
- **Admin Flow**:
  - View service requests
  - Create invoice for approved projects
  - Generate Paystack payment link
  - Track payment status

### 2. Print Shop

- **Purpose**: Printing services
- **User Flow**:
  - View service details
  - Fill contact form
  - View portfolio button → Portfolio page (filtered to print-shop category)
- **Admin Flow**: Same as Build & Design

### 3. Tech Training

- **Purpose**: FREE courses with commitment fee
- **Courses**:

  - Product Design
  - Product Management
  - Frontend Development
  - Backend Development
  - DevOps
  - Cybersecurity
  - QA Testing

- **User Flow**:

  - Browse available courses
  - Click course → Modal with details (cohort, start date, duration, commitment fee)
  - Apply Now → Application form
  - Form fields: name, email, phone, existing skills (yes/no + details)
  - Submit → Redirect to Paystack for commitment fee
  - Payment success → Receipt page
  - View portfolio button → Portfolio page (filtered to tech-training)

- **Admin Flow**:
  - Create/Edit courses
  - Set commitment fee, cohort name, start date
  - Open/Close applications
  - View applications
  - Track payments
  - Generate receipts

## File Structure

```
src/
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx          # Main admin dashboard
│   │   ├── Messages.tsx            # Contact messages (moved from AdminMessages.tsx)
│   │   ├── Courses.tsx             # Manage courses
│   │   ├── Applications.tsx        # View course applications
│   │   ├── ServiceRequests.tsx     # View service requests
│   │   ├── Invoices.tsx            # Manage invoices
│   │   ├── Portfolio.tsx           # Manage portfolio items
│   │   └── Transactions.tsx        # View all transactions
│   ├── Services.tsx                # Updated services page
│   ├── Portfolio.tsx               # Updated portfolio with filters
│   ├── PaymentSuccess.tsx          # Payment success/receipt page
│   └── ...existing pages
├── components/
│   ├── services/
│   │   ├── ServiceCard.tsx
│   │   ├── CourseCard.tsx
│   │   ├── CourseModal.tsx
│   │   └── ApplicationForm.tsx
│   ├── admin/
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── CourseForm.tsx
│   │   ├── InvoiceForm.tsx
│   │   └── PortfolioForm.tsx
│   └── ...existing components
└── utils/
    ├── paystack.ts                 # Paystack integration
    └── ...existing utils
```

## Payment Flow

### Course Applications

1. User fills application form
2. Form data saved to `course_applications` (status: pending)
3. Redirect to Paystack with:
   - Amount: course.commitment_fee
   - Email: applicant email
   - Reference: unique transaction ID
   - Callback URL: /payment-success?type=course&ref={reference}
4. Paystack processes payment
5. Callback URL receives payment status
6. Update `course_applications.payment_status` to 'paid'
7. Create transaction record
8. Display receipt with:
   - "This is a COMMITMENT FEE for a FREE course"
   - Course details
   - Refund policy
   - Next steps

### Service Invoices

1. Admin creates invoice for service request
2. Invoice saved with unique invoice number
3. Customer receives email with payment link
4. Payment link → Paystack with invoice details
5. Callback → Update invoice status
6. Create transaction record
7. Display receipt

## Admin Dashboard Features

### Navigation

- Dashboard (Overview stats)
- Messages
- Courses
- Applications
- Service Requests
- Invoices
- Portfolio
- Transactions

### Dashboard Overview

- Total applications (this month)
- Total revenue (this month)
- Pending service requests
- Recent transactions
- Quick actions

### Course Management

- List all courses
- Create new course
- Edit course (name, description, fee, cohort, dates)
- Open/Close applications
- View applicants per course

### Transaction History

- Unified view of all payments
- Filters: Type (course/service), Status, Date range
- Export to CSV
- Search by customer name/email

## Environment Variables

```env
# Supabase
VITE_SUPABASE_URL="your-project-url"
VITE_SUPABASE_ANON_KEY="your-anon-key"

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# Paystack
VITE_PAYSTACK_PUBLIC_KEY="pk_test_xxx or pk_live_xxx"
```

## Key Messages

### For Tech Training

- **Headline**: "FREE Tech Training with Commitment Fee"
- **Subtext**: "We believe in quality education. A refundable commitment fee ensures serious learners."
- **Application Form**: "This course is completely FREE. The commitment fee demonstrates your dedication and is refundable upon course completion."
- **Receipt**: "COMMITMENT FEE RECEIPT - This is NOT a course fee. Your course is FREE."

## Implementation Progress

### Completed ✅

1. **Database Setup**

   - ✅ Created `supabase-setup.sql` with all tables
   - ✅ Created migrations for `invoices` and `service_requests` tables
   - ✅ Environment variables configured

2. **Admin System**

   - ✅ Admin layout and navigation created
   - ✅ Admin login and route protection
   - ✅ Service Requests management page
   - ✅ Invoices management page with create, send, and mark as paid features
   - ✅ Messages/Contact form submissions viewer

3. **Services Pages**

   - ✅ Design & Build service page
   - ✅ Print Shop service page
   - ✅ Tech Training service page
   - ✅ Service request forms with email notifications

4. **Payment Integration**

   - ✅ Paystack integration complete
   - ✅ Invoice payment page (`/pay-invoice/:invoiceNumber`)
   - ✅ Payment success page with receipts
   - ✅ Course application payment flow

5. **Email System**

   - ✅ Supabase Edge Function (`send-receipt-email`)
   - ✅ Invoice email notifications
   - ✅ Service request notifications
   - ✅ Course receipt emails
   - ✅ Contact form notifications (Contact page + Footer)
   - ✅ All emails from "Faith from Gr8QM <hello@gr8qm.com>"

6. **Portfolio**
   - ✅ Portfolio page with filtering

### In Progress 🔄

7. **Admin Dashboard**

   - 🔄 Dashboard overview with stats
   - 🔄 Course management (CRUD)
   - 🔄 Applications management
   - 🔄 Transactions/Revenue tracking

8. **Testing & Refinement**
   - 🔄 End-to-end testing of all flows
   - 🔄 Email deliverability optimization (DNS setup pending)
   - 🔄 Performance optimization

### Remaining Tasks 📋

- [ ] Complete admin dashboard with overview stats
- [ ] Build course management pages (if not already complete)
- [ ] Build applications management page
- [ ] Create unified transactions view
- [ ] Add export to CSV functionality
- [ ] Comprehensive testing of all features
- [ ] Set up DNS records for email deliverability (SPF, DKIM, DMARC)
- [ ] Production deployment checklist

---

## Email Configuration

### Supabase Edge Function

**Function**: `send-receipt-email`  
**Location**: `supabase/functions/send-receipt-email/index.ts`  
**Status**: ✅ Deployed and Working

**Sender Configuration**:

- **Email**: hello@gr8qm.com
- **Name**: Faith from Gr8QM
- **Domain**: gr8qm.com (verified in Resend)
- **Reply-To**: Dynamically set based on email type

**Supported Email Types**:

1. **Invoice Emails** (to clients)

   - Template: `emailTemplates.invoice()` in `src/utils/email.ts`
   - Includes "Pay Now" button with payment link
   - Sent automatically when admin creates invoice
   - Sent from: Faith from Gr8QM <hello@gr8qm.com>

2. **Service Request Notifications** (to hello@gr8qm.com)

   - Template: `emailTemplates.serviceRequestNotification()` in `src/utils/email.ts`
   - Sent when users submit service requests
   - Includes all form details
   - Sent from: Faith from Gr8QM <hello@gr8qm.com>

3. **Course Receipt Emails** (to applicants)

   - Template: `emailTemplates.courseReceipt()` in `src/utils/email.ts`
   - Sent after successful payment
   - Includes commitment fee details and refund policy
   - Sent from: Faith from Gr8QM <hello@gr8qm.com>

4. **Contact Form Notifications** (to hello@gr8qm.com)
   - Template: `emailTemplates.contactMessage()` in `src/utils/email.ts`
   - Sent from Contact page and Footer forms
   - Reply-To set to sender's email
   - Sent from: Faith from Gr8QM <hello@gr8qm.com>

**Email Deliverability**:

- ⚠️ DNS records (SPF, DKIM, DMARC) need to be configured for gr8qm.com to prevent spam
- See deployment guide for DNS setup instructions
- Plain text version support added to edge function

---

## Notes

- All forms submit to Supabase tables
- Paystack handles all payments
- Admin manages everything through dashboard
- Receipts generated automatically
- Email notifications working for all forms
