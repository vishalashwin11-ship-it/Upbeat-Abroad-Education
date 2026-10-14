import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    console.log(`[Supabase] Initialized client for ${supabaseUrl}`);
  } catch (err) {
    console.error('[Supabase] Failed to initialize client:', err);
  }
} else {
  console.log('[Supabase] Credentials not set in environment. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY to sync to Supabase cloud.');
}

// Validation & Sanitization Helpers
function sanitizeString(val: any, maxLen = 300): string {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/[<>]/g, '').slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 18;
}

// Initialize Google GenAI with required server headers
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  genAI = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Data persistence helpers
const DATA_FILE = path.resolve(__dirname, 'data_store.json');

interface Enquiry {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  destination: string;
  degreeLevel: string;
  intendedIntake: string;
  currentEducation: string;
  academicScore: string;
  englishTest: string;
  budgetPerYear: string;
  servicesNeeded: string[];
  message?: string;
  createdAt: string;
  status: 'Pending' | 'Contacted' | 'In Review';
}

interface Booking {
  id: string;
  reference: string;
  studentName: string;
  email: string;
  phone: string;
  counselorId: string;
  counselorName: string;
  date: string;
  timeSlot: string;
  mode: 'Google Meet' | 'Virtual Video Desk' | 'Direct Phone Call';
  destinations: string[];
  degreeLevel: string;
  notes?: string;
  createdAt: string;
  status: 'Confirmed' | 'Completed';
  meetLink?: string;
}

const COUNSELORS = [
  {
    id: 'counselor-1',
    name: 'Dr. Ananya Sharma',
    role: 'Lead Overseas Admissions Strategist',
    credentials: 'Ex-Oxford Academic Fellow · 12+ Yrs Experience',
    specialties: ['UK Russell Group', 'Ivy League & Tier-1', 'SOP & Personal Statement'],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    slots: ['10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewsCount: 380,
  },
  {
    id: 'counselor-2',
    name: 'Rohan Kulkarni',
    role: 'Senior Director – Australia & New Zealand Admissions',
    credentials: 'Monash University Alumnus · 9+ Yrs Experience',
    specialties: ['Australia Group of Eight (Go8)', 'Post-Study Work & PR Pathways', 'Engineering & Tech'],
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    slots: ['11:00 AM', '01:30 PM', '03:30 PM', '05:30 PM'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.95,
    reviewsCount: 420,
  },
  {
    id: 'counselor-3',
    name: 'Meera Varma',
    role: 'North America & Europe Academic Advisor',
    credentials: 'University of British Columbia Alum · 8+ Yrs Experience',
    specialties: ['Canada PGWP & Co-op', 'Ireland Tech Hub Programs', 'Scholarships & Merit Grants'],
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
    slots: ['10:00 AM', '12:30 PM', '03:00 PM', '07:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    rating: 4.88,
    reviewsCount: 295,
  },
  {
    id: 'counselor-4',
    name: 'Tariq Al-Mansoor',
    role: 'UAE & Middle East University Specialist',
    credentials: 'Dubai International Academic City Advisor · 10+ Yrs Experience',
    specialties: ['Dubai Branch Campuses (Heriot-Watt, Birmingham, RIT)', 'UAE Golden Visa Pathways', 'Affordable Global Degrees'],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    slots: ['11:30 AM', '02:30 PM', '05:00 PM', '06:30 PM'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.92,
    reviewsCount: 310,
  },
  {
    id: 'counselor-5',
    name: 'Priya Sundaram',
    role: 'Head of IB Pathways & Early Career Counselling',
    credentials: 'Former International Baccalaureate DP Coordinator · 11+ Yrs Experience',
    specialties: ['IB & Cambridge A-Levels Transition', 'Direct Undergraduate Applications', 'Extracurricular Profiling'],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    slots: ['09:30 AM', '12:00 PM', '04:00 PM', '06:30 PM'],
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    rating: 4.97,
    reviewsCount: 340,
  },
];

function loadData(): { enquiries: Enquiry[]; bookings: Booking[] } {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }
  return { enquiries: [], bookings: [] };
}

function saveData(data: { enquiries: Enquiry[]; bookings: Booking[] }) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data file:', err);
  }
}

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Upbeat Abroad Education API',
    hasGeminiKey: Boolean(apiKey),
    hasSupabase: Boolean(supabase),
    supabaseUrl: supabaseUrl ? supabaseUrl.replace(/https:\/\/(.*?)\..*/, 'https://$1.supabase.co') : null,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/supabase-status', async (_req, res) => {
  if (!supabaseUrl || !supabaseKey) {
    return res.json({
      configured: false,
      connected: false,
      message: 'SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are not configured in environment variables.',
      envStatus: {
        hasUrl: Boolean(supabaseUrl),
        hasKey: Boolean(supabaseKey),
      },
    });
  }

  try {
    const projectRef = supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/)?.[1] || '';

    // Probe student_enquiries
    const enquiriesProbe = await supabase!
      .from('student_enquiries')
      .select('id')
      .limit(1);

    // Probe counseling_bookings
    const bookingsProbe = await supabase!
      .from('counseling_bookings')
      .select('id')
      .limit(1);

    // Probe contact_messages
    const contactProbe = await supabase!
      .from('contact_messages')
      .select('id')
      .limit(1);

    const hasEnquiriesTable = !enquiriesProbe.error || enquiriesProbe.error.code !== 'PGRST205';
    const hasBookingsTable = !bookingsProbe.error || bookingsProbe.error.code !== 'PGRST205';
    const hasContactTable = !contactProbe.error || contactProbe.error.code !== 'PGRST205';
    const allTablesCreated = hasEnquiriesTable && hasBookingsTable;

    return res.json({
      configured: true,
      connected: true,
      projectUrl: supabaseUrl,
      projectRef,
      sqlEditorUrl: projectRef ? `https://supabase.com/dashboard/project/${projectRef}/sql/new` : 'https://supabase.com/dashboard',
      tables: {
        student_enquiries: hasEnquiriesTable,
        counseling_bookings: hasBookingsTable,
        contact_messages: hasContactTable,
      },
      allTablesCreated,
      message: allTablesCreated
        ? 'Connected & all Supabase tables ready for enquiries and bookings!'
        : 'Supabase credentials verified! Run the schema script in your SQL Editor to create the tables.',
      errors: {
        student_enquiries: enquiriesProbe.error ? enquiriesProbe.error.message : null,
        counseling_bookings: bookingsProbe.error ? bookingsProbe.error.message : null,
        contact_messages: contactProbe.error ? contactProbe.error.message : null,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      configured: true,
      connected: false,
      error: err.message,
      message: 'Failed to communicate with Supabase instance.',
    });
  }
});

// Test Supabase Flow Endpoint
app.post('/api/test-supabase', async (_req, res) => {
  if (!supabase) {
    return res.status(400).json({
      success: false,
      error: 'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in environment variables.',
    });
  }

  const testRef = `UAE-TEST-${Date.now().toString().slice(-6)}`;
  const testPayload = {
    reference: testRef,
    full_name: 'Test Student (Verification)',
    email: 'verification.test@upbeatabroad.com',
    phone: '+91 98200 99999',
    preferred_destination: 'United Kingdom',
    intended_course: 'MSc Data Science (Verification Probe)',
    intake: 'Fall 2026',
    current_education: 'B.Tech / B.E.',
    academic_score: '80%',
    budget_per_year: '₹25L – ₹35L',
    services_needed: ['University Shortlisting', 'Visa Guidance'],
    message: 'Automated integration verification record.',
    status: 'pending',
  };

  try {
    const { data: inserted, error: insertErr } = await supabase
      .from('student_enquiries')
      .insert([testPayload])
      .select()
      .single();

    if (insertErr) {
      return res.status(500).json({
        success: false,
        phase: 'insert',
        error: insertErr.message,
        details: insertErr,
      });
    }

    return res.json({
      success: true,
      message: 'Test enquiry successfully created in Supabase table "student_enquiries"!',
      record: inserted,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.get('/api/counselors', (_req, res) => {
  res.json({ counselors: COUNSELORS });
});

// Enquiries Endpoint: Validates, Sanitizes, and Saves to Supabase & Local Store
app.post('/api/enquiries', async (req, res) => {
  try {
    const rawFullName = req.body.full_name || req.body.fullName || req.body.name;
    const rawEmail = req.body.email;
    const rawPhone = req.body.phone;
    const rawDestination =
      req.body.preferred_destination || req.body.preferredDestination || req.body.destination;
    const rawCourse =
      req.body.intended_course || req.body.intendedCourse || req.body.course || req.body.degreeLevel;
    const rawIntake = req.body.intake || req.body.intendedIntake;
    const rawCurrentEdu = req.body.current_education || req.body.currentEducation;
    const rawScore = req.body.academic_score || req.body.academicScore;
    const rawBudget = req.body.budget_per_year || req.body.budgetPerYear;
    const rawServices = req.body.services_needed || req.body.servicesNeeded;
    const rawMessage = req.body.message;
    const rawCity = req.body.city;

    // 1. Validation & Sanitization
    const fullName = sanitizeString(rawFullName, 100);
    const email = sanitizeString(rawEmail, 120).toLowerCase();
    const phone = sanitizeString(rawPhone, 25);
    const preferredDestination = sanitizeString(rawDestination, 100) || 'United Kingdom';
    const intendedCourse = sanitizeString(rawCourse, 150) || 'Masters / Postgraduate';
    const intake = sanitizeString(rawIntake, 100) || 'Fall 2026';
    const currentEducation = sanitizeString(rawCurrentEdu, 100);
    const academicScore = sanitizeString(rawScore, 50);
    const budgetPerYear = sanitizeString(rawBudget, 100);
    const city = sanitizeString(rawCity, 100);
    const message = sanitizeString(rawMessage, 1000);
    const servicesNeeded = Array.isArray(rawServices)
      ? rawServices.map((s) => sanitizeString(s, 80)).filter(Boolean)
      : [];

    if (!fullName || fullName.length < 2) {
      return res.status(400).json({
        error: 'Please provide a valid full name (minimum 2 characters).',
        field: 'full_name',
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address.',
        field: 'email',
      });
    }

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        error: 'Please provide a valid phone or WhatsApp number with at least 6 digits.',
        field: 'phone',
      });
    }

    if (!preferredDestination || preferredDestination.length < 2) {
      return res.status(400).json({
        error: 'Please specify a preferred study destination.',
        field: 'preferred_destination',
      });
    }

    if (!intendedCourse || intendedCourse.length < 2) {
      return res.status(400).json({
        error: 'Please specify your intended course or study program.',
        field: 'intended_course',
      });
    }

    if (!intake || intake.length < 2) {
      return res.status(400).json({
        error: 'Please specify your target intake period (e.g. Fall 2026).',
        field: 'intake',
      });
    }

    const reference = `UAE-ENQ-${Date.now().toString().slice(-6)}`;
    let savedToSupabase = false;
    let supabaseRecordId = null;
    let supabaseErrorNotice = null;

    // 2. Insert into Supabase Table `student_enquiries` if configured
    if (supabase) {
      try {
        const { data: inserted, error: sbError } = await supabase
          .from('student_enquiries')
          .insert([
            {
              reference,
              full_name: fullName,
              email,
              phone,
              preferred_destination: preferredDestination,
              intended_course: intendedCourse,
              intake,
              current_education: currentEducation || null,
              academic_score: academicScore || null,
              budget_per_year: budgetPerYear || null,
              services_needed: servicesNeeded,
              message: message || null,
              status: 'pending',
            },
          ])
          .select()
          .single();

        if (sbError) {
          console.error('[Supabase Error] Failed to insert student enquiry:', sbError);
          supabaseErrorNotice = sbError.message;
        } else if (inserted) {
          savedToSupabase = true;
          supabaseRecordId = inserted.id;
          console.log(`[Supabase Success] Record created in student_enquiries: ${inserted.id} (${reference})`);
        }
      } catch (err: any) {
        console.error('[Supabase Exception] Failed during insert:', err);
        supabaseErrorNotice = err.message;
      }
    }

    // 3. Persist into Local Backup Store for Complete Redundancy
    const data = loadData();
    const newEnquiry: Enquiry = {
      id: supabaseRecordId || `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      reference,
      name: fullName,
      email,
      phone,
      city: city || 'Not specified',
      destination: preferredDestination,
      degreeLevel: intendedCourse,
      intendedIntake: intake,
      currentEducation: currentEducation || 'Not specified',
      academicScore: academicScore || 'Not specified',
      englishTest: 'Standard/IELTS',
      budgetPerYear: budgetPerYear || 'Flexible',
      servicesNeeded,
      message,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };

    data.enquiries.unshift(newEnquiry);
    saveData(data);

    return res.status(201).json({
      success: true,
      reference,
      message: 'Enquiry submitted successfully! An Upbeat Abroad Education advisor will contact you within 24 business hours.',
      enquiry: {
        id: newEnquiry.id,
        reference,
        full_name: fullName,
        email,
        phone,
        preferred_destination: preferredDestination,
        intended_course: intendedCourse,
        intake,
        saved_to_supabase: savedToSupabase,
      },
      savedToSupabase,
      supabaseErrorNotice,
    });
  } catch (error: any) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ error: 'Failed to process enquiry. Please try again.' });
  }
});

app.get('/api/enquiries', (_req, res) => {
  const data = loadData();
  res.json({ enquiries: data.enquiries });
});

// Contact Messages Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const rawName = req.body.name || req.body.fullName;
    const rawEmail = req.body.email;
    const rawPhone = req.body.phone;
    const rawSubject = req.body.subject || req.body.destination || 'General Inquiry';
    const rawMessage = req.body.message || '';

    const name = sanitizeString(rawName, 100);
    const email = sanitizeString(rawEmail, 120).toLowerCase();
    const phone = sanitizeString(rawPhone, 25);
    const subject = sanitizeString(rawSubject, 150);
    const message = sanitizeString(rawMessage, 1000);

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ error: 'Please provide a valid phone or WhatsApp number.' });
    }
    if (!message || message.length < 2) {
      return res.status(400).json({ error: 'Please provide a message or inquiry.' });
    }

    let savedToSupabase = false;
    if (supabase) {
      try {
        const { error: sbContactErr } = await supabase
          .from('contact_messages')
          .insert([{ name, email, phone, subject, message }]);
        if (sbContactErr) {
          console.warn('[Supabase Warning] Failed to insert into contact_messages:', sbContactErr.message);
        } else {
          savedToSupabase = true;
          console.log(`[Supabase Success] Message saved to contact_messages for ${email}`);
        }
      } catch (err: any) {
        console.warn('[Supabase Exception] Error saving contact message:', err.message);
      }
    }

    // Also persist as an enquiry in data_store.json so it's tracked
    const data = loadData();
    const reference = `UAE-MSG-${Date.now().toString().slice(-6)}`;
    const newEnquiry: Enquiry = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      reference,
      name,
      email,
      phone,
      city: 'Not specified',
      destination: subject,
      degreeLevel: 'General Counseling Inquiry',
      intendedIntake: 'Upcoming Intakes',
      currentEducation: 'Not specified',
      academicScore: 'Not specified',
      englishTest: 'Standard/IELTS',
      budgetPerYear: 'Flexible',
      servicesNeeded: [subject],
      message,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };
    data.enquiries.unshift(newEnquiry);
    saveData(data);

    return res.status(201).json({
      success: true,
      reference,
      message: 'Thank you! Your message has been received. An Upbeat Abroad Education advisor will contact you shortly.',
      savedToSupabase,
    });
  } catch (err: any) {
    console.error('Error in /api/contact:', err);
    return res.status(500).json({ error: 'Failed to process message. Please try again.' });
  }
});

// Bookings Endpoint
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      studentName,
      email,
      phone,
      counselorId,
      date,
      timeSlot,
      mode = 'Google Meet',
      destinations = [],
      degreeLevel = 'Masters',
      notes,
    } = req.body;

    if (!studentName || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({ error: 'Student name, email, phone, date, and time slot are required.' });
    }

    const counselor = COUNSELORS.find((c) => c.id === counselorId) || COUNSELORS[0];
    const data = loadData();

    // Check collision
    const existing = data.bookings.find(
      (b) => b.counselorId === counselor.id && b.date === date && b.timeSlot === timeSlot
    );

    if (existing) {
      return res.status(409).json({
        error: `Slot ${timeSlot} on ${date} with ${counselor.name} is already reserved. Please select another time or counselor.`,
      });
    }

    const reference = `UAE-BKG-${Date.now().toString().slice(-6)}`;
    const newBooking: Booking = {
      id: `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      reference,
      studentName,
      email,
      phone,
      counselorId: counselor.id,
      counselorName: counselor.name,
      date,
      timeSlot,
      mode,
      destinations: Array.isArray(destinations) ? destinations : [destinations],
      degreeLevel,
      notes,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      meetLink: `https://meet.google.com/uae-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`,
    };

    let savedToSupabase = false;
    if (supabase) {
      try {
        const { error: sbBookingErr } = await supabase
          .from('counseling_bookings')
          .insert([
            {
              reference,
              student_name: sanitizeString(studentName, 100),
              email: sanitizeString(email, 120).toLowerCase(),
              phone: sanitizeString(phone, 25),
              counselor_id: counselor.id,
              counselor_name: counselor.name,
              booking_date: date,
              time_slot: timeSlot,
              mode,
              destinations: Array.isArray(destinations) ? destinations : [destinations],
              degree_level: degreeLevel,
              notes: notes ? sanitizeString(notes, 1000) : null,
              meet_link: newBooking.meetLink,
              status: 'confirmed',
            },
          ]);

        if (sbBookingErr) {
          console.warn('[Supabase Warning] Failed to insert booking:', sbBookingErr.message);
        } else {
          savedToSupabase = true;
          console.log(`[Supabase Success] Booking saved to counseling_bookings: ${reference}`);
        }
      } catch (err: any) {
        console.warn('[Supabase Exception] Error saving booking:', err.message);
      }
    }

    data.bookings.unshift(newBooking);
    saveData(data);

    res.status(201).json({
      success: true,
      message: `Your counselling session with ${counselor.name} is confirmed for ${date} at ${timeSlot} (IST).`,
      booking: {
        ...newBooking,
        saved_to_supabase: savedToSupabase,
      },
      savedToSupabase,
    });
  } catch (error: any) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Failed to complete booking. Please try again.' });
  }
});

app.get('/api/bookings', (_req, res) => {
  const data = loadData();
  res.json({ bookings: data.bookings });
});

// AI Study Abroad Assistant Server-Side Endpoint
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { prompt, mode = 'general', profile = {} } = req.body;

    if (!prompt && !profile.degreeLevel) {
      return res.status(400).json({ error: 'A query or student profile details are required.' });
    }

    const userPrompt = prompt || `Evaluate my study abroad profile: Degree: ${profile.degreeLevel || 'Masters'}, Destination: ${profile.destination || 'UK/Australia'}, Academic Score: ${profile.academicScore || '75%'}, Budget: ${profile.budget || 'Flexible'}, Field: ${profile.field || 'Computer Science / Business'}.`;

    const systemInstruction = `You are the Expert AI Study Abroad Advisor for "Upbeat Abroad Education", a virtual-first premier international education consultancy based in India.
Your guidance covers:
- United Kingdom (Russell Group, London universities, Tier-2, Graduate Route Visa)
- Australia (Group of Eight - Go8, Australian Technology Network, Subclass 500 visa, Post-Study Work streams)
- New Zealand (Top 8 universities including Auckland, Otago, Canterbury, post-study work rights)
- Canada (U15, reputable public universities & colleges, PGWP regulations, provincial caps)
- Ireland (Trinity College Dublin, UCD, Galway, 2-year Third Level Graduate Scheme in Dublin tech hub)
- UAE & Dubai (Dubai International Academic City & Dubai Knowledge Park: Heriot-Watt Dubai, University of Birmingham Dubai, Wollongong Dubai, Middlesex, Rochester Institute of Technology Dubai, affordable British/Australian degrees with zero currency loss, UAE Golden Visa pathways)
- IB (International Baccalaureate) Diploma & Cambridge A-Level pathways to overseas Bachelor's programs.

CRITICAL ETHICAL & REGULATORY GUIDELINES:
1. NEVER GUARANTEE admission, scholarship awards, visas, PR, or employment. Always state that admission decisions rest with individual university faculties and visa decisions rest with sovereign immigration authorities (UKVI, Australian Dept of Home Affairs, IRCC, etc.).
2. Cite official university entry benchmarks and government sources where relevant (e.g., UKVI CAS requirements, IELTS/PTE/TOEFL standard bands, Australian GTE/GS requirements).
3. If an input is borderline or incomplete, explicitly outline the conditions or bridge pathways (pre-masters, foundation year, English pre-sessional).
4. Provide structured, actionable, and encouraging recommendations formatted in clean Markdown with sections:
   - Profile Assessment & Eligibility Rating (Ambitious / Target / Safe institutions)
   - Recommended Universities & Programs (Highlighting Russell Group / Go8 / Leading hubs where applicable)
   - Indicative Tuition & Cost of Living Breakdown
   - Visa & English Proficiency Requirements (IELTS/PTE/TOEFL)
   - Personalised Action Plan & Next Steps
   - Mandatory Disclaimer note.
Tone: Highly knowledgeable, student-centric, realistic, professional, and warmly encouraging.`;

    if (genAI) {
      try {
        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        });

        const reply = response.text || 'No response generated from the AI model.';
        return res.json({
          reply,
          source: 'gemini-3.8-flash',
          disclaimer: 'Guidance is informational and based on official educational guidelines. Final admissions and visas are governed by respective universities and government immigration departments.',
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local expert knowledge engine:', geminiError?.message);
      }
    }

    // Fallback Knowledge Engine (curated, rich, structured response)
    const fallbackResponse = generateCuratedAdvisoryResponse(userPrompt, profile);
    return res.json({
      reply: fallbackResponse,
      source: 'knowledge-engine',
      disclaimer: 'Guidance is informational and based on official university admission guidelines. Upbeat Abroad Education provides personalized 1-on-1 counselor reviews for all profiles.',
    });
  } catch (error: any) {
    console.error('Error in /api/ai-assistant:', error);
    res.status(500).json({ error: 'Failed to process AI advising request.' });
  }
});

function generateCuratedAdvisoryResponse(prompt: string, profile: any): string {
  const dest = (profile.destination || prompt).toLowerCase();
  const degree = profile.degreeLevel || 'Postgraduate';

  let destSpecifics = '';
  if (dest.includes('uk') || dest.includes('united kingdom') || dest.includes('russell')) {
    destSpecifics = `### Recommended UK Institutions (Russell Group & Reputable Hubs)
- **Target / Dream:** University of Manchester, University of Edinburgh, King's College London, University of Bristol
- **Competitive / Safe:** University of Birmingham, University of Leeds, Queen Mary University of London, Newcastle University
- **Entry Requirements:** Typically 60%–75% in Indian Bachelor's (equivalent to UK 2:1 or 2:2); IELTS 6.5 overall (no band < 6.0) or PTE 62+.
- **Post-Study Work:** 2-year Graduate Route visa allows working in the UK across all sectors.`;
  } else if (dest.includes('australia') || dest.includes('go8')) {
    destSpecifics = `### Recommended Australian Institutions (Group of Eight - Go8 & ATN)
- **Target / Dream:** University of Melbourne, University of Sydney, UNSW Sydney, Monash University
- **Competitive / Safe:** University of Queensland, University of Adelaide, UTS Sydney, RMIT University
- **Entry Requirements:** 65%–80% academic average; IELTS 6.5–7.0 or PTE 58–65; Genuine Student (GS) assessment.
- **Post-Study Work:** Temporary Graduate Visa (Subclass 485) offering 2–4 years work authorization with regional study bonuses.`;
  } else if (dest.includes('uae') || dest.includes('dubai')) {
    destSpecifics = `### Recommended UAE & Dubai Campuses (World-Class Global Hubs)
- **Target Campuses:** Heriot-Watt University Dubai, University of Birmingham Dubai, University of Wollongong in Dubai (UOWD), Rochester Institute of Technology (RIT) Dubai, Middlesex University Dubai
- **Key Advantage:** Identical degree certificate to UK/Australian home campuses at 40-50% lower overall living cost; tax-free part-time work and UAE Golden Visa pathways for top graduates.
- **Entry Requirements:** 55%–70% in 12th/UG; IELTS 6.0–6.5 or equivalent medium of instruction waivers.`;
  } else if (dest.includes('canada')) {
    destSpecifics = `### Recommended Canadian Institutions
- **Top Universities:** University of Toronto, UBC, McGill, McMaster, University of Waterloo, University of Alberta
- **Reputable Colleges & Polytechnics:** Seneca, Humber, George Brown, Conestoga (designated learning institutions with PGWP eligibility)
- **Entry Requirements:** Minimum 70%+ academic aggregate; IELTS 6.5 minimum with no band below 6.0; Provincial Attestation Letter (PAL) compliance.`;
  } else if (dest.includes('ireland')) {
    destSpecifics = `### Recommended Irish Institutions (European Silicon Valley)
- **Top Universities:** Trinity College Dublin, University College Dublin (UCD), University of Galway, University College Cork, Dublin City University (DCU)
- **Key Advantage:** 2-year post-study work visa; European headquarters of Google, Meta, Apple, Pfizer, and Stripe offering high-tech internship opportunities.
- **Entry Requirements:** 60%–70% in relevant UG degree; IELTS 6.5.`;
  } else {
    destSpecifics = `### Multi-Destination Comparative Overview
- **UK (Russell Group):** 1-Year Masters programs, saving living expenses; 2-year Graduate Route work visa.
- **Australia (Go8):** 1.5 to 2-year Master programs with rich research infrastructure and high starting tech/business salaries.
- **UAE / Dubai:** Rapidly growing regional education capital with British/Australian branch campuses, zero personal income tax, and seamless student visa processing.
- **Ireland:** High-demand European tech hub with 2-year post-study work rights for Masters graduates.`;
  }

  return `## Preliminary Profile Evaluation – Upbeat Abroad Education

Thank you for consulting Upbeat Abroad Education. Here is your structured preliminary roadmap tailored for **${degree}** programs.

${destSpecifics}

---

### Key Financial & Cost Estimates
- **Tuition Range:** ₹16,00,000 – ₹32,00,000 per academic year (dependent on university tier and course stream).
- **Estimated Living Expenses:** ₹8,00,000 – ₹14,00,000 per year (housing, food, transport, student insurance).
- **Scholarship Potential:** Merit-based university fee discounts (₹2,00,000 – ₹8,00,000) are available for candidates applying 6–9 months ahead of intake deadlines.

---

### Step-by-Step Action Plan
1. **Academic Transcript & Syllabus Audit:** Verify tier equivalency and core prerequisite subject credits.
2. **English Proficiency Test:** Schedule IELTS Academic or PTE Academic to hit the required bands early.
3. **Statement of Purpose (SOP) & Recommendation Letters (LORs):** Work with your dedicated Upbeat advisor to draft a compelling, plagiarism-free narrative.
4. **Funding & Financial Documentation:** Prepare liquid savings proofs, sponsor letters, or education loan pre-approvals required for CAS/I-20/eCoE issuance.
5. **Direct 1-on-1 Counselling:** Schedule an in-depth video session with our senior university mentors.

*Disclaimer: This evaluation is generated based on standard admission criteria published by universities. Admission and visa decisions remain strictly under the authority of university admissions boards and official foreign embassies. Upbeat Abroad Education guarantees ethical guidance, transparent documentation, and personalized application support.*`;
}

// Development or Production handler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Upbeat Abroad Education Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
