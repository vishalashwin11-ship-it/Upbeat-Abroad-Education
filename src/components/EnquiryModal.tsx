import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ArrowLeft, Send, Database, AlertCircle } from 'lucide-react';
import { sendStudentEnquiry } from '../lib/supabase';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledDestination?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  prefilledDestination = '',
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDestination, setPreferredDestination] = useState(
    prefilledDestination || 'United Kingdom (Russell Group)'
  );
  const [intendedCourse, setIntendedCourse] = useState('');
  const [intake, setIntake] = useState('Fall 2026 (September/October)');
  const [currentEducation, setCurrentEducation] = useState('B.Tech / B.E. (Engineering)');
  const [academicScore, setAcademicScore] = useState('');
  const [budgetPerYear, setBudgetPerYear] = useState('₹20L – ₹28L');
  const [servicesNeeded, setServicesNeeded] = useState<string[]>([
    'University Shortlisting',
    'Visa Guidance',
  ]);
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  if (!isOpen) return null;

  const toggleService = (serv: string) => {
    if (servicesNeeded.includes(serv)) {
      setServicesNeeded(servicesNeeded.filter((s) => s !== serv));
    } else {
      setServicesNeeded([...servicesNeeded, serv]);
    }
  };

  const handleNextStep1 = () => {
    setErrorMsg('');
    if (!currentEducation.trim()) {
      setErrorMsg('Please specify your current education.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setErrorMsg('');
    if (!intendedCourse.trim() || intendedCourse.trim().length < 2) {
      setErrorMsg('Please enter your intended course (e.g. MSc Data Science, MBA, BEng Mechanical).');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (!phone.trim() || digits.length < 6) {
      setErrorMsg('Please enter a valid phone number with at least 6 digits.');
      return;
    }

    if (!intendedCourse.trim()) {
      setErrorMsg('Please enter your intended course.');
      setStep(2);
      return;
    }

    setSubmitting(true);

    try {
      const result = await sendStudentEnquiry({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        preferred_destination: preferredDestination.trim(),
        intended_course: intendedCourse.trim(),
        intake: intake.trim(),
        current_education: currentEducation,
        academic_score: academicScore.trim(),
        budget_per_year: budgetPerYear,
        services_needed: servicesNeeded,
        message: message.trim(),
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Failed to submit enquiry.');
        setSubmitting(false);
        return;
      }

      setSubmissionSuccess({
        reference: result.reference,
        full_name: fullName,
        preferred_destination: preferredDestination,
        intended_course: intendedCourse,
        intake,
        savedToSupabase: result.savedToSupabase,
      });
      setSubmitting(false);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setErrorMsg('A connection error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close enquiry modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submissionSuccess ? (
          <div className="py-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Profile Dossier Successfully Saved!
            </h3>
            <p className="text-xs text-slate-600 mb-4 max-w-md mx-auto">
              Your profile has been logged under reference{' '}
              <strong className="text-slate-900 font-mono-numbers">
                {submissionSuccess.reference}
              </strong>
              . An Upbeat Abroad Education university specialist will conduct an eligibility pre-check and reach out within 24 business hours.
            </p>

            {submissionSuccess.savedToSupabase && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4">
                <Database className="w-3.5 h-3.5" />
                <span>Secured in Supabase `student_enquiries` Table</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate Name:</span>
                <span className="font-semibold text-slate-900">{submissionSuccess.full_name || fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-semibold text-slate-900">{submissionSuccess.preferred_destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Intended Course:</span>
                <span className="font-semibold text-slate-900">{submissionSuccess.intended_course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Intake:</span>
                <span className="font-semibold text-slate-900">{submissionSuccess.intake}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <div>
            {/* Header & Steps Indicator */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
                <span>Student Enquiry Dossier</span>
                <span aria-hidden="true">·</span>
                <span>Step {step} of 3</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {step === 1 && 'Academic Background & Highest Qualification'}
                {step === 2 && 'Intended Course & Preferred Destination'}
                {step === 3 && 'Contact Details & Verification'}
              </h3>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-teal-700 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Academics */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Current / Highest Qualification *
                  </label>
                  <select
                    value={currentEducation}
                    onChange={(e) => setCurrentEducation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="B.Tech / B.E. (Engineering)">B.Tech / B.E. (Engineering)</option>
                    <option value="B.Com / BBA / Business">B.Com / BBA / Business Studies</option>
                    <option value="B.Sc / Computer Science / IT">B.Sc / Computer Science / IT</option>
                    <option value="12th Grade (CBSE / ISC / State)">12th Grade (CBSE / ISC / State Board)</option>
                    <option value="IB Diploma (IBDP) / Cambridge A-Levels">IB Diploma (IBDP) / Cambridge A-Levels</option>
                    <option value="Postgraduate / Masters">Postgraduate / Masters (Looking for 2nd Degree)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Academic Aggregate / CGPA / %
                    </label>
                    <input
                      type="text"
                      value={academicScore}
                      onChange={(e) => setAcademicScore(e.target.value)}
                      placeholder="e.g. 76% or 8.2 CGPA"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Annual Tuition Budget
                    </label>
                    <select
                      value={budgetPerYear}
                      onChange={(e) => setBudgetPerYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Under ₹15 Lakhs">Under ₹15 Lakhs (Dubai / Grants)</option>
                      <option value="₹16L – ₹24L">₹16L – ₹24L (UK / Ireland / NZ)</option>
                      <option value="₹25L – ₹35L">₹25L – ₹35L (Russell Group / Go8)</option>
                      <option value="₹35L+">₹35L+ (Tier-1 Global Top 30)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep1}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Next: Destination & Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Preferences & Course */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Preferred Destination *
                  </label>
                  <select
                    value={preferredDestination}
                    onChange={(e) => setPreferredDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="United Kingdom">United Kingdom (Russell Group Focus)</option>
                    <option value="Australia">Australia (Group of Eight - Go8)</option>
                    <option value="United Arab Emirates & Dubai">UAE & Dubai (Branch Campuses)</option>
                    <option value="Canada">Canada (U15 & Public Institutions)</option>
                    <option value="Ireland">Ireland (Silicon Valley of Europe)</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Undecided / Open to Recommendations">Undecided / Need Guidance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Intended Course / Program *
                  </label>
                  <input
                    type="text"
                    required
                    value={intendedCourse}
                    onChange={(e) => setIntendedCourse(e.target.value)}
                    placeholder="e.g. MSc Data Science, Master of Finance, BEng Aerospace"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Intended Intake *
                  </label>
                  <select
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Fall 2026 (September/October)">Fall 2026 (September/October)</option>
                    <option value="Spring 2027 (January/February)">Spring 2027 (January/February)</option>
                    <option value="July 2026 (Australia / NZ)">July 2026 (Australia / NZ)</option>
                    <option value="February 2027 (Australia / NZ)">February 2027 (Australia / NZ)</option>
                    <option value="Late 2027 or Later">Late 2027 or Later</option>
                  </select>
                </div>

                {/* Services Checkboxes */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Assistance Needed
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      'University Shortlisting',
                      'SOP & LOR Mentorship',
                      'Scholarship Applications',
                      'Visa Documentation',
                    ].map((serv) => (
                      <button
                        type="button"
                        key={serv}
                        onClick={() => toggleService(serv)}
                        className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                          servicesNeeded.includes(serv)
                            ? 'bg-teal-50 border-teal-600 text-teal-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-teal-700 font-bold">
                          {servicesNeeded.includes(serv) ? '✓' : '+'}
                        </span>
                        <span className="truncate">{serv}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep2}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Next: Contact Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Contact & Submit */}
            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sneha Kulkarni"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sneha@example.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Mobile / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Additional Notes or Target Universities (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Interested in University of Manchester or Melbourne for MSc Data Science..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Dossier...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Student Enquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
