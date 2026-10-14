import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Database, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface StudentEnquirySectionProps {
  onSuccess?: () => void;
  onOpenSupabaseModal?: () => void;
}

export const StudentEnquirySection: React.FC<StudentEnquirySectionProps> = ({
  onSuccess,
  onOpenSupabaseModal,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDestination, setPreferredDestination] = useState('United Kingdom (Russell Group)');
  const [intendedCourse, setIntendedCourse] = useState('');
  const [intake, setIntake] = useState('Fall 2026 (September/October)');
  const [currentEducation, setCurrentEducation] = useState('B.Tech / B.E. (Undergraduate)');
  const [academicScore, setAcademicScore] = useState('');
  const [budgetPerYear, setBudgetPerYear] = useState('₹20L – ₹28L / year');
  const [message, setMessage] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successResult, setSuccessResult] = useState<{
    reference: string;
    savedToSupabase?: boolean;
    full_name: string;
    preferred_destination: string;
    intended_course: string;
    intake: string;
  } | null>(null);

  // Client-Side Validation
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim() || phoneDigits.length < 6) {
      errors.phone = 'Please provide a valid phone or WhatsApp number (at least 6 digits).';
    }

    if (!preferredDestination.trim()) {
      errors.preferredDestination = 'Please select your preferred study destination.';
    }

    if (!intendedCourse.trim() || intendedCourse.trim().length < 2) {
      errors.intendedCourse = 'Please specify your intended course (e.g. MSc Data Science, MBA, BEng Mechanical).';
    }

    if (!intake.trim()) {
      errors.intake = 'Please choose your target intake.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) {
      setErrorMessage('Please fix the highlighted fields below before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          preferred_destination: preferredDestination.trim(),
          intended_course: intendedCourse.trim(),
          intake: intake.trim(),
          current_education: currentEducation,
          academic_score: academicScore.trim(),
          budget_per_year: budgetPerYear,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to submit enquiry. Please check your inputs.');
        setLoading(false);
        return;
      }

      setSuccessResult({
        reference: data.reference || data.enquiry?.reference || `UAE-ENQ-${Date.now().toString().slice(-6)}`,
        savedToSupabase: data.savedToSupabase ?? data.enquiry?.saved_to_supabase,
        full_name: fullName,
        preferred_destination: preferredDestination,
        intended_course: intendedCourse,
        intake,
      });

      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setIntendedCourse('');
      setAcademicScore('');
      setMessage('');
      setFieldErrors({});
      setLoading(false);
    } catch (err: any) {
      console.error('Enquiry submission error:', err);
      setErrorMessage('Network connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section id="enquiry" className="py-16 sm:py-24 bg-white border-t border-slate-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 tracking-wider uppercase">
              <Database className="w-4 h-4 text-teal-600" />
              <span>Direct Admissions Dossier</span>
              <span aria-hidden="true">·</span>
              {onOpenSupabaseModal ? (
                <button
                  type="button"
                  onClick={onOpenSupabaseModal}
                  className="hover:underline flex items-center gap-1 text-teal-800 cursor-pointer"
                  title="View Supabase backend synchronization status"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Supabase Backend (Live)</span>
                </button>
              ) : (
                <span>Supabase Connected</span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Submit Your Student Enquiry for Instant Evaluation
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Complete this official application pre-screening form. Your profile is securely recorded in our database and audited against official entrance criteria for the UK, Australia, UAE, Canada, Ireland, and New Zealand.
            </p>

            <div className="space-y-3.5 pt-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                </div>
                <div>
                  <strong className="block text-slate-900">Zero Pressure & 100% Free</strong>
                  <span>Free initial university shortlisting without hidden consultation retainers.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                </div>
                <div>
                  <strong className="block text-slate-900">Secure Row Level Security (RLS)</strong>
                  <span>Your student records are protected by database policies preventing public access.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                </div>
                <div>
                  <strong className="block text-slate-900">Dedicated University Mentor</strong>
                  <span>Direct alumni advisor contact within 24 business hours of submission.</span>
                </div>
              </div>
            </div>

            {/* Quick Stat Pill */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Database Table:</span>
              <span className="font-mono-numbers font-semibold text-slate-900">public.student_enquiries</span>
            </div>
          </div>

          {/* Right Column: The Required Enquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            {successResult ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Enquiry Successfully Recorded!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{successResult.full_name}</strong>. Your enquiry dossier has been logged under reference{' '}
                  <span className="font-mono-numbers font-bold text-slate-900">{successResult.reference}</span>.
                </p>

                {successResult.savedToSupabase ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <Database className="w-3.5 h-3.5" />
                    <span>Synchronized with Supabase `student_enquiries` Table</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                    <Database className="w-3.5 h-3.5" />
                    <span>Stored in Secure Lead Database (Local & Cloud Ready)</span>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-left space-y-2 mt-4 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Destination:</span>
                    <span className="font-semibold text-slate-900">{successResult.preferred_destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Intended Course:</span>
                    <span className="font-semibold text-slate-900">{successResult.intended_course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Intake:</span>
                    <span className="font-semibold text-slate-900">{successResult.intake}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setSuccessResult(null)}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Submit Another Student Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Student Details & Academic Intent
                  </h3>
                  <span className="text-xs text-slate-500">* All fields required</span>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. Full Name */}
                <div>
                  <label htmlFor="form_full_name" className="text-xs font-semibold text-slate-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    id="form_full_name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: '' });
                    }}
                    placeholder="e.g. Aryan Malhotra"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      fieldErrors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                    }`}
                  />
                  {fieldErrors.fullName && (
                    <span className="text-[11px] text-red-600 mt-1 block">{fieldErrors.fullName}</span>
                  )}
                </div>

                {/* 2. Email & Phone in 2-Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form_email" className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      id="form_email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                      }}
                      placeholder="e.g. aryan.malhotra@gmail.com"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        fieldErrors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {fieldErrors.email && (
                      <span className="text-[11px] text-red-600 mt-1 block">{fieldErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="form_phone" className="text-xs font-semibold text-slate-700 block mb-1">
                      Phone Number (with WhatsApp) *
                    </label>
                    <input
                      id="form_phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                      }}
                      placeholder="e.g. +91 98200 12345"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        fieldErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <span className="text-[11px] text-red-600 mt-1 block">{fieldErrors.phone}</span>
                    )}
                  </div>
                </div>

                {/* 3. Preferred Destination & Intended Intake */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form_destination" className="text-xs font-semibold text-slate-700 block mb-1">
                      Preferred Destination *
                    </label>
                    <select
                      id="form_destination"
                      value={preferredDestination}
                      onChange={(e) => setPreferredDestination(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      <option value="United Kingdom (Russell Group)">United Kingdom (Russell Group Focus)</option>
                      <option value="Australia (Group of Eight - Go8)">Australia (Group of Eight - Go8)</option>
                      <option value="United Arab Emirates & Dubai">UAE & Dubai (Branch Campuses)</option>
                      <option value="Canada (U15 & Public Hubs)">Canada (U15 & Public Hubs)</option>
                      <option value="Ireland (Tech & Bio Capital)">Ireland (Tech & Bio Capital)</option>
                      <option value="New Zealand">New Zealand (Top 8 Universities)</option>
                      <option value="Undecided / Need Comparative Review">Undecided / Open to Guidance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="form_intake" className="text-xs font-semibold text-slate-700 block mb-1">
                      Intended Intake *
                    </label>
                    <select
                      id="form_intake"
                      value={intake}
                      onChange={(e) => setIntake(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      <option value="Fall 2026 (September/October)">Fall 2026 (September/October)</option>
                      <option value="Spring 2027 (January/February)">Spring 2027 (January/February)</option>
                      <option value="July 2026 (Australia / NZ)">July 2026 (Australia / NZ)</option>
                      <option value="February 2027 (Australia / NZ)">February 2027 (Australia / NZ)</option>
                      <option value="Late 2027 or Later">Late 2027 or Later</option>
                    </select>
                  </div>
                </div>

                {/* 4. Intended Course */}
                <div>
                  <label htmlFor="form_course" className="text-xs font-semibold text-slate-700 block mb-1">
                    Intended Course / Program of Interest *
                  </label>
                  <input
                    id="form_course"
                    type="text"
                    required
                    value={intendedCourse}
                    onChange={(e) => {
                      setIntendedCourse(e.target.value);
                      if (fieldErrors.intendedCourse) setFieldErrors({ ...fieldErrors, intendedCourse: '' });
                    }}
                    placeholder="e.g. MSc Data Science, Master of Management, BEng Aerospace, LLM Law"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      fieldErrors.intendedCourse ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                    }`}
                  />
                  {fieldErrors.intendedCourse && (
                    <span className="text-[11px] text-red-600 mt-1 block">{fieldErrors.intendedCourse}</span>
                  )}
                </div>

                {/* 5. Optional Background Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form_academic_score" className="text-xs font-semibold text-slate-700 block mb-1">
                      Current Score / Percentage / CGPA
                    </label>
                    <input
                      id="form_academic_score"
                      type="text"
                      value={academicScore}
                      onChange={(e) => setAcademicScore(e.target.value)}
                      placeholder="e.g. 76% or 8.1 CGPA (Optional)"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="form_budget" className="text-xs font-semibold text-slate-700 block mb-1">
                      Annual Tuition Budget
                    </label>
                    <select
                      id="form_budget"
                      value={budgetPerYear}
                      onChange={(e) => setBudgetPerYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      <option value="Under ₹15 Lakhs">Under ₹15 Lakhs (Dubai / Scholarships)</option>
                      <option value="₹16L – ₹24L">₹16L – ₹24L (UK / Ireland / NZ)</option>
                      <option value="₹25L – ₹35L">₹25L – ₹35L (Russell Group / Go8)</option>
                      <option value="₹35L+">₹35L+ (Global Top 30)</option>
                    </select>
                  </div>
                </div>

                {/* 6. Message / Questions */}
                <div>
                  <label htmlFor="form_message" className="text-xs font-semibold text-slate-700 block mb-1">
                    Specific Queries / Target Institutions (Optional)
                  </label>
                  <textarea
                    id="form_message"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Interested in scholarships for University of Manchester or Melbourne..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 text-xs sm:text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Validating and Recording Dossier...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Student Enquiry Dossier</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2.5">
                    Protected by Supabase Row Level Security. We never sell student data to third parties.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
