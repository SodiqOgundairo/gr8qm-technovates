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

## Next Steps

1. ✅ Database setup (SQL file created)
2. ✅ Environment variables (template updated)
3. ✅ Create admin layout and navigation
4. ✅ Build Services page
5. ✅ Build course listing and application flow
6. ✅ Integrate Paystack
7. ✅ Build admin dashboard
8. ✅ Update Portfolio page
9. ✅ Service requests with email notifications
10. ✅ Invoice management system
11. 🔄 **Email Edge Function Setup** (IN PROGRESS)
12. 🔄 Testing and refinement

## Current Work: Email Automation System

### Status: Setting up Supabase Edge Functions

**Completed:**

- ✅ Email templates created in `src/utils/email.ts`
  - Invoice emails with payment links
  - Service request notifications to admin
  - Course receipt emails
- ✅ Frontend integration ready
- ✅ Build errors fixed (TypeScript serviceType issues)

**In Progress:**

- 🔄 Creating Supabase Edge Function for email delivery
- 🔄 Configuring Resend API integration
- 🔄 Setting up environment variables

**Required Email Types:**

1. **Invoice Emails** - Sent to clients when admin creates an invoice
   - Includes payment link to `/pay-invoice/:invoiceNumber`
   - Displays invoice details, amount, due date
2. **Service Request Notifications** - Sent to `hello@gr8qm.com`
   - Triggers when users submit service requests
   - Includes customer info and project details
3. **Course Receipt Emails** - Sent to students after payment
   - Payment confirmation
   - Course details and commitment fee info
   - Refund policy

### Edge Function Implementation

**File:** `supabase/functions/send-receipt-email/index.ts`

**Features:**

- Generic email sender (accepts to, subject, html)
- Uses Resend API for delivery
- CORS support for frontend calls
- Error handling and logging
- Configurable sender address

- Receipts generated automatically
- **Email notifications via Supabase Edge Functions + Resend**
- Edge function supports all email types through templating system
