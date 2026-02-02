# Job Postings Database Schema

## Tables

### 1. `job_postings`

Main table for storing job posting information.

| Column                | Type        | Constraints                  | Description                                           |
| --------------------- | ----------- | ---------------------------- | ----------------------------------------------------- |
| `id`                  | UUID        | PRIMARY KEY                  | Unique identifier                                     |
| `title`               | TEXT        | NOT NULL                     | Job title                                             |
| `department`          | TEXT        | -                            | Department/category                                   |
| `location`            | TEXT        | -                            | Job location                                          |
| `employment_type`     | TEXT        | CHECK constraint             | full-time, part-time, contract, internship, temporary |
| `description`         | TEXT        | NOT NULL                     | Full job description                                  |
| `requirements`        | TEXT        | -                            | Job requirements                                      |
| `responsibilities`    | TEXT        | -                            | Job responsibilities                                  |
| `salary_range`        | TEXT        | -                            | Optional salary information                           |
| `application_form_id` | UUID        | FOREIGN KEY → forms(id)      | Linked application form                               |
| `status`              | TEXT        | CHECK constraint             | draft, published, closed                              |
| `posted_date`         | TIMESTAMPTZ | -                            | When job was posted                                   |
| `closing_date`        | TIMESTAMPTZ | -                            | Application deadline                                  |
| `created_by`          | UUID        | FOREIGN KEY → auth.users(id) | Admin who created                                     |
| `created_at`          | TIMESTAMPTZ | DEFAULT NOW()                | Creation timestamp                                    |
| `updated_at`          | TIMESTAMPTZ | DEFAULT NOW()                | Last update timestamp                                 |

### 2. `job_applications`

Links form responses to job postings and tracks application status.

| Column             | Type        | Constraints                      | Description                                      |
| ------------------ | ----------- | -------------------------------- | ------------------------------------------------ |
| `id`               | UUID        | PRIMARY KEY                      | Unique identifier                                |
| `job_posting_id`   | UUID        | FOREIGN KEY → job_postings(id)   | Associated job                                   |
| `form_response_id` | UUID        | FOREIGN KEY → form_responses(id) | Associated form response                         |
| `applicant_name`   | TEXT        | -                                | Applicant's name                                 |
| `applicant_email`  | TEXT        | -                                | Applicant's email                                |
| `resume_url`       | TEXT        | -                                | URL to uploaded resume                           |
| `status`           | TEXT        | CHECK constraint                 | pending, reviewing, shortlisted, rejected, hired |
| `notes`            | TEXT        | -                                | Admin notes                                      |
| `created_at`       | TIMESTAMPTZ | DEFAULT NOW()                    | Application timestamp                            |
| `updated_at`       | TIMESTAMPTZ | DEFAULT NOW()                    | Last update timestamp                            |

**Unique Constraint**: `(job_posting_id, form_response_id)` - prevents duplicate applications

## Indexes

- `idx_job_postings_status` - Fast filtering by status
- `idx_job_postings_department` - Fast filtering by department
- `idx_job_postings_employment_type` - Fast filtering by employment type
- `idx_job_postings_form_id` - Fast lookups by form
- `idx_job_postings_posted_date` - Ordered by posting date
- `idx_job_applications_job_id` - Fast application lookups by job
- `idx_job_applications_status` - Fast filtering by application status
- `idx_job_applications_email` - Fast lookups by applicant email

## Row Level Security (RLS) Policies

### job_postings

- **Public**: Can SELECT published jobs only
- **Authenticated (Admin)**: Full CRUD access to all jobs

### job_applications

- **Public**: Can INSERT (submit applications)
- **Authenticated (Admin)**: Full CRUD access to all applications

## Helper Functions

### `get_job_application_count(job_id UUID)`

Returns the total number of applications for a specific job posting.

## Views

### `job_postings_with_stats`

Combines job postings with application statistics:

- `application_count` - Total applications
- `pending_count` - Pending applications
- `reviewing_count` - Under review
- `shortlisted_count` - Shortlisted candidates
- `rejected_count` - Rejected applications
- `hired_count` - Hired candidates

## Relationships

```
job_postings
    ├─→ forms (application_form_id)
    ├─→ auth.users (created_by)
    └─← job_applications (job_posting_id)

job_applications
    ├─→ job_postings (job_posting_id)
    └─→ form_responses (form_response_id)
```

## Migration File Location

`supabase/migrations/20260202_job_postings_schema.sql`

## Usage Notes

1. **Creating a Job Posting**: Set `application_form_id` to link to an existing form or create a new form first
2. **Publishing**: Change `status` from 'draft' to 'published' to make visible to public
3. **Applications**: When a user applies, create both a `form_response` and a `job_application` record
4. **File Uploads**: Store resume files in Supabase Storage and save the URL in `resume_url`
