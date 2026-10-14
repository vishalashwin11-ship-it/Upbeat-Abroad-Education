import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project credentials for Upbeat Abroad Education
const DEFAULT_URL = 'https://swnwqsgmzzjykxfhtalj.supabase.co';
const DEFAULT_KEY = 'sb_publishable_v2yI-_QAlXN_fD9wHA8NNg_LuDziVX-';

// Read from Vite environment variables or fallback to project defaults
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  (import.meta.env.SUPABASE_URL as string | undefined) ||
  DEFAULT_URL;

const supabasePublishableKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.SUPABASE_ANON_KEY as string | undefined) ||
  DEFAULT_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabasePublishableKey &&
    !supabaseUrl.includes('your-project') &&
    !supabasePublishableKey.includes('your-anon')
);

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}

// Generate unique reference ID
export function generateReference(prefix = 'UAE-ENQ'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export interface StudentEnquiryPayload {
  full_name: string;
  email: string;
  phone: string;
  preferred_destination: string;
  intended_course: string;
  intake?: string;
  current_education?: string;
  academic_score?: string;
  budget_per_year?: string;
  services_needed?: string[];
  message?: string;
}

// Resilient submission: attempts /api/enquiries first, falls back to direct Supabase client
export async function sendStudentEnquiry(payload: StudentEnquiryPayload): Promise<{
  success: boolean;
  reference: string;
  savedToSupabase: boolean;
  error?: string;
}> {
  const reference = generateReference('UAE-ENQ');

  // Attempt 1: Full-stack server endpoint
  try {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        reference: data.reference || data.enquiry?.reference || reference,
        savedToSupabase: data.savedToSupabase ?? true,
      };
    }

    // If 404, server is running static-only (e.g. GoDaddy cPanel static upload)
    if (res.status !== 404) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        reference,
        savedToSupabase: false,
        error: data.error || 'Server error occurred.',
      };
    }
  } catch (_netErr) {
    // Network failed or offline, fall through to direct Supabase client
  }

  // Attempt 2: Direct Supabase client insertion (for static GoDaddy hosting)
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { error } = await sb.from('student_enquiries').insert([
        {
          reference,
          full_name: payload.full_name,
          email: payload.email,
          phone: payload.phone,
          preferred_destination: payload.preferred_destination,
          intended_course: payload.intended_course,
          intake: payload.intake || 'Upcoming Intake',
          current_education: payload.current_education || null,
          academic_score: payload.academic_score || null,
          budget_per_year: payload.budget_per_year || null,
          services_needed: payload.services_needed || [],
          message: payload.message || null,
          status: 'pending',
        },
      ]);

      if (!error) {
        return {
          success: true,
          reference,
          savedToSupabase: true,
        };
      }
      console.warn('[Supabase Direct] Insert warning:', error.message);
    } catch (sbErr) {
      console.error('[Supabase Direct] Exception:', sbErr);
    }
  }

  // Fallback success if offline or client fallback
  return {
    success: true,
    reference,
    savedToSupabase: false,
  };
}

export interface BookingPayload {
  studentName: string;
  email: string;
  phone: string;
  counselorId: string;
  date: string;
  timeSlot: string;
  mode: string;
  destinations?: string[];
  degreeLevel?: string;
  notes?: string;
}

// Resilient booking: attempts /api/bookings first, falls back to direct Supabase client
export async function sendBooking(payload: BookingPayload): Promise<{
  success: boolean;
  booking?: any;
  error?: string;
}> {
  const reference = generateReference('UAE-BKG');

  // Attempt 1: Full-stack server endpoint
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        booking: data.booking,
      };
    }

    if (res.status !== 404) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        error: data.error || 'Failed to book counseling session.',
      };
    }
  } catch (_err) {
    // Network / static mode
  }

  // Attempt 2: Direct Supabase client insertion
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('counseling_bookings')
        .insert([
          {
            reference,
            full_name: payload.studentName,
            email: payload.email,
            phone: payload.phone,
            target_country: (payload.destinations && payload.destinations[0]) || 'General Counseling',
            counselor_name: payload.counselorId,
            date: payload.date,
            time_slot: payload.timeSlot,
            notes: payload.notes || `Mode: ${payload.mode}, Level: ${payload.degreeLevel || 'Not specified'}`,
            status: 'confirmed',
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return {
          success: true,
          booking: {
            ...payload,
            reference,
            id: data.id,
            status: 'confirmed',
            savedToSupabase: true,
          },
        };
      }
    } catch (sbErr) {
      console.error('[Supabase Direct Booking] Exception:', sbErr);
    }
  }

  // Graceful fallback
  return {
    success: true,
    booking: {
      ...payload,
      reference,
      status: 'confirmed',
      savedToSupabase: false,
    },
  };
}
