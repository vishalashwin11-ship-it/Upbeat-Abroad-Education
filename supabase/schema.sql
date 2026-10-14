-- ==============================================================================
-- Upbeat Abroad Education - Supabase Complete Schema & Row Level Security (RLS)
-- Tables: student_enquiries, counseling_bookings, contact_messages
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/swnwqsgmzzjykxfhtalj/sql/new
-- ==============================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. Table: student_enquiries
-- ==============================================================================
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'contacted', 'admitted', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_student_enquiries_email ON public.student_enquiries(email);
CREATE INDEX IF NOT EXISTS idx_student_enquiries_created_at ON public.student_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_enquiries_destination ON public.student_enquiries(preferred_destination);

ALTER TABLE public.student_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can insert student enquiries" ON public.student_enquiries;
DROP POLICY IF EXISTS "Only staff and service role can read student enquiries" ON public.student_enquiries;
DROP POLICY IF EXISTS "Only staff and service role can update student enquiries" ON public.student_enquiries;
DROP POLICY IF EXISTS "Only staff and service role can delete student enquiries" ON public.student_enquiries;

CREATE POLICY "Public visitors can insert student enquiries"
  ON public.student_enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(full_name) >= 2 AND
    char_length(email) >= 5 AND
    char_length(phone) >= 6 AND
    char_length(preferred_destination) >= 2 AND
    char_length(intended_course) >= 2 AND
    char_length(intake) >= 2
  );

CREATE POLICY "Only staff and service role can read student enquiries"
  ON public.student_enquiries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only staff and service role can update student enquiries"
  ON public.student_enquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only staff and service role can delete student enquiries"
  ON public.student_enquiries
  FOR DELETE
  TO authenticated
  USING (true);

-- ==============================================================================
-- 2. Table: counseling_bookings
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.counseling_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  counselor_id TEXT NOT NULL,
  counselor_name TEXT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'Google Meet',
  destinations TEXT[] DEFAULT '{}',
  degree_level TEXT NOT NULL,
  notes TEXT,
  meet_link TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_counseling_bookings_email ON public.counseling_bookings(email);
CREATE INDEX IF NOT EXISTS idx_counseling_bookings_date ON public.counseling_bookings(booking_date, time_slot);

ALTER TABLE public.counseling_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can insert counseling bookings" ON public.counseling_bookings;
DROP POLICY IF EXISTS "Only staff and service role can read counseling bookings" ON public.counseling_bookings;
DROP POLICY IF EXISTS "Only staff and service role can update counseling bookings" ON public.counseling_bookings;

CREATE POLICY "Public visitors can insert counseling bookings"
  ON public.counseling_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(student_name) >= 2 AND
    char_length(email) >= 5 AND
    char_length(phone) >= 6
  );

CREATE POLICY "Only staff and service role can read counseling bookings"
  ON public.counseling_bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only staff and service role can update counseling bookings"
  ON public.counseling_bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 3. Table: contact_messages
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only staff and service role can read contact messages" ON public.contact_messages;

CREATE POLICY "Public visitors can insert contact messages"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) >= 2 AND
    char_length(email) >= 5 AND
    char_length(phone) >= 6 AND
    char_length(message) >= 2
  );

CREATE POLICY "Only staff and service role can read contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- ==============================================================================
-- 4. Automatic updated_at Trigger Function
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_student_enquiries_updated_at ON public.student_enquiries;
CREATE TRIGGER set_student_enquiries_updated_at
BEFORE UPDATE ON public.student_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_counseling_bookings_updated_at ON public.counseling_bookings;
CREATE TRIGGER set_counseling_bookings_updated_at
BEFORE UPDATE ON public.counseling_bookings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
