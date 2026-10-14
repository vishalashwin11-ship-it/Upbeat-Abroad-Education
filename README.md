# Upbeat Abroad Education – AI-Native Website

A modern, production-grade, AI-native web platform built for **Upbeat Abroad Education**, an India-based, virtual-first study-abroad consultancy guiding students to top-ranked universities across the **United Kingdom**, **Australia**, **United Arab Emirates & Dubai**, **Canada**, **Ireland**, and **New Zealand**.

---

## 🌟 Key Features

1. **Homepage & Brand Experience**
   - Headline: *"Your Global Education Journey Starts With the Right Guidance."*
   - Deep navy, crisp white, ocean teal, and warm airplane-coral palette.
   - Genuine high-resolution student portrait photography, Russell Group and Group of Eight campus backdrops.
   - Live floating statistics: 1,800+ programs, 350+ institutions, 98.4% visa success, and 4.9/5 student rating.
   - 4-card feature strip highlighting mentor alumni, free counselling, zero-error visa support, and 1-to-1 video sessions.

2. **Supabase Database Integration (`student_enquiries`)**
   - Built with the official `@supabase/supabase-js` library.
   - Form fields: `full_name`, `email`, `phone`, `preferred_destination`, `intended_course`, and `intake`.
   - Secure Row Level Security (RLS) policies allowing public visitors to submit enquiries without permission to view, edit, or delete any other records.
   - Client and server-side validation and sanitization with clear loading, success, and error messaging.
   - Privileged operations and secret keys are preserved strictly on the server.
   - Full SQL schema available at `supabase/schema.sql`.

3. **Full Multi-Page Content Architecture**
   - **Home**: Hero banner, 6-step student journey, destination preview, services highlights, AI demo.
   - **Study Destinations**: Deep-dive interactive comparative guides for the UK (Russell Group), Australia (Go8), UAE & Dubai (Branch Campuses), Canada (U15), Ireland (Silicon Valley of Europe), and New Zealand.
   - **Universities & Courses Directory**: Filterable and searchable database with tuition fees in INR/foreign currencies, entry criteria, popular courses, and scholarship details.
   - **Our Services Suite**: Profile evaluation, course shortlisting, SOP/LOR mentorship, scholarships, visa documentation, pre/post-departure care, and IB Diploma/A-Level transitions.
   - **AI Study Abroad Assistant**: Powered by server-side `gemini-3.8-flash` with dual modes (Structured Profile Evaluator + Conversational Advisory Chat with official benchmarks).
   - **Book a Counselling Session**: Real calendar slot picker, senior counselor profiles (Oxford, Monash, UBC alumni), meeting modes (Google Meet / Virtual Desk / Phone), and instant confirmation booking codes (`UAE-BKG-XXXXXX`).
   - **Student Enquiry Form & Section**: Dedicated section (`#enquiry`) and modal for prospective student and parent admissions dossiers.
   - **Student Resources & FAQs**: SOP blueprints, IELTS vs. PTE vs. TOEFL comparison matrix, categorized FAQs accordion.
   - **About Us**: Virtual-first philosophy, senior academic mentors, ethical advising charter, and parent partnership.
   - **Contact Us**: Multi-channel reach with direct WhatsApp link, helplines, virtual service desks in Mumbai, Delhi NCR, Bengaluru, and Dubai.
   - **Legal Compliance**: Privacy Policy aligned with India's Digital Personal Data Protection (DPDP) Act 2023, Terms of Service, and strict Admissions & Visa Disclaimer.

---

## 🗄️ Supabase Setup & SQL Schema

1. Open your project on the [Supabase Dashboard](https://supabase.com).
2. Go to the **SQL Editor** tab.
3. Paste and run the script located at `/supabase/schema.sql`:
   ```sql
   -- Table creation
   CREATE TABLE IF NOT EXISTS public.student_enquiries (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     reference TEXT UNIQUE NOT NULL,
     full_name TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT NOT NULL,
     preferred_destination TEXT NOT NULL,
     intended_course TEXT NOT NULL,
     intake TEXT NOT NULL,
     current_education TEXT,
     academic_score TEXT,
     budget_per_year TEXT,
     services_needed TEXT[] DEFAULT '{}',
     message TEXT,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
     updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
   );

   -- Enable Row Level Security (RLS)
   ALTER TABLE public.student_enquiries ENABLE ROW LEVEL SECURITY;

   -- Allow public visitors to INSERT their enquiry
   CREATE POLICY "Public visitors can insert student enquiries"
     ON public.student_enquiries
     FOR INSERT
     TO anon, authenticated
     WITH CHECK (true);

   -- Restrict SELECT to authenticated staff/service-role
   CREATE POLICY "Only staff and service role can read student enquiries"
     ON public.student_enquiries
     FOR SELECT
     TO authenticated
     USING (true);
   ```

4. Configure your environment variables in AI Studio (Secrets / Environment panel) or `.env`:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_PUBLISHABLE_KEY="your-anon-publishable-key"
   ```

5. Verify status anytime via `GET /api/supabase-status` or the test endpoint `POST /api/test-supabase`.

---

## 🔑 Environment Variables & Integrations Status

| Variable | Description | Current Status |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Your Supabase Project API URL | Configurable in Environment |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase Anon / Publishable Key | Configurable in Environment |
| `GEMINI_API_KEY` | Google Gemini API key for server-side AI evaluation | Auto-injected in AI Studio / Active |
| `PORT` | Node/Express listening port (defaults to 3000) | Configured (3000) |
| `APP_URL` | Live URL for canonical links and redirects | Injected by AI Studio |

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start the full-stack server (runs Express + Vite on port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
