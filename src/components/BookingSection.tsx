import React, { useState, useEffect } from 'react';
import { Counselor } from '../types';
import { Calendar as CalendarIcon, Clock, Video, Phone, CheckCircle2, Star, ShieldCheck, User, Mail, Globe, MapPin, X, Copy, ExternalLink } from 'lucide-react';
import { COUNSELORS } from '../data/counselors';
import { sendBooking } from '../lib/supabase';

interface BookingSectionProps {
  onSuccess?: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = () => {
  const [counselors, setCounselors] = useState<Counselor[]>(COUNSELORS);
  const [selectedCounselorId, setSelectedCounselorId] = useState<string>('counselor-1');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [consultationMode, setConsultationMode] = useState<'Google Meet' | 'Virtual Video Desk' | 'Direct Phone Call'>('Google Meet');

  // Form Fields
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [degreeLevel, setDegreeLevel] = useState('Masters / Postgraduate');
  const [destinations, setDestinations] = useState<string[]>(['United Kingdom']);
  const [notes, setNotes] = useState('');

  // Submission & Confirmation State
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmationData, setConfirmationData] = useState<any | null>(null);

  // Available upcoming dates (next 7 days starting tomorrow)
  const [availableDates, setAvailableDates] = useState<{ dayName: string; dateStr: string; display: string }[]>([]);

  useEffect(() => {
    // Fetch counselors from backend
    fetch('/api/counselors')
      .then((res) => res.json())
      .then((data) => {
        if (data.counselors && data.counselors.length > 0) {
          setCounselors(data.counselors);
          setSelectedCounselorId(data.counselors[0].id);
        }
      })
      .catch((err) => console.error('Error fetching counselors:', err));

    // Generate next 6 dates
    const dates = [];
    for (let i = 1; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = d.toISOString().split('T')[0];
      const display = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push({ dayName, dateStr, display });
    }
    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0].dateStr);
    }
  }, []);

  const activeCounselor = counselors.find((c) => c.id === selectedCounselorId) || counselors[0];

  useEffect(() => {
    if (activeCounselor && activeCounselor.slots.length > 0) {
      setSelectedTimeSlot(activeCounselor.slots[0]);
    }
  }, [selectedCounselorId, counselors]);

  const handleDestinationToggle = (dest: string) => {
    if (destinations.includes(dest)) {
      if (destinations.length > 1) {
        setDestinations(destinations.filter((d) => d !== dest));
      }
    } else {
      setDestinations([...destinations, dest]);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!studentName.trim() || !email.trim() || !phone.trim() || !selectedDate || !selectedTimeSlot) {
      setErrorMsg('Please complete all required fields (Name, Email, Phone, Date, and Time Slot).');
      return;
    }

    setSubmitting(true);

    try {
      const res = await sendBooking({
        studentName,
        email,
        phone,
        counselorId: activeCounselor.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        mode: consultationMode,
        destinations,
        degreeLevel,
        notes,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to complete booking. Please try another slot.');
        setSubmitting(false);
        return;
      }

      setConfirmationData(res.booking || {
        studentName,
        email,
        phone,
        counselorName: activeCounselor.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        mode: consultationMode,
        reference: `UAE-BKG-${Date.now().toString(36).toUpperCase()}`,
        status: 'confirmed',
      });
      setSubmitting(false);
    } catch (err) {
      console.error('Booking request failed:', err);
      setErrorMsg('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 tracking-wider uppercase mb-2">
            <span>Direct 1-on-1 Advising</span>
            <span aria-hidden="true">·</span>
            <span>Zero Consultation Fees</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Book a Personal Counselling Session
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Select your preferred academic mentor, choose a convenient time slot (IST), and receive an instant calendar invite and Google Meet link.
          </p>
        </div>

        {/* Booking Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Counselor & Slot Selection */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* 1. Counselor Selection */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                1. Select Academic Mentor / Country Specialist
              </label>
              <div className="space-y-2.5">
                {counselors.map((c) => {
                  const isSelected = c.id === selectedCounselorId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCounselorId(c.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-teal-700 bg-teal-50/70 shadow-xs ring-1 ring-teal-700'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{c.name}</h4>
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{c.rating}</span>
                          </span>
                        </div>
                        <p className="text-xs text-teal-800 font-medium truncate">{c.role}</p>
                        <p className="text-[11px] text-slate-500 truncate">{c.credentials}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Date Selection */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                2. Choose Consultation Date
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableDates.map((item) => {
                  const isSelected = item.dateStr === selectedDate;
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        {item.dayName}
                      </span>
                      <span className="block text-xs font-extrabold mt-0.5">{item.display}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Time Slot Selection */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                3. Select Time Slot (Indian Standard Time · IST)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activeCounselor?.slots.map((slot) => {
                  const isSelected = slot === selectedTimeSlot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Student Intake Form & Confirmation */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              4. Student Profile & Consultation Details
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Tell us about your background so your counselor can pre-screen university options ahead of the call.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Aryan Malhotra"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address (For Calendar Invite) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aryan@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Target Degree Level
                  </label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 cursor-pointer"
                  >
                    <option value="Masters / Postgraduate">Masters / Postgraduate (1-2 Years)</option>
                    <option value="Undergraduate / Bachelor's">Undergraduate / Bachelor's (After 12th/IB)</option>
                    <option value="MBA / Global Executive">MBA / Global Executive</option>
                    <option value="IB Diploma Pathway">IB Diploma Pathway to UK/Australia</option>
                  </select>
                </div>
              </div>

              {/* Destination Checkbox Tags */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Destinations of Interest (Select All That Apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'United Kingdom',
                    'Australia',
                    'UAE & Dubai',
                    'Canada',
                    'Ireland',
                    'New Zealand',
                  ].map((dest) => {
                    const isChecked = destinations.includes(dest);
                    return (
                      <button
                        type="button"
                        key={dest}
                        onClick={() => handleDestinationToggle(dest)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '}
                        {dest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Mode */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Preferred Meeting Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mode: 'Google Meet', icon: Video, label: 'Google Meet' },
                    { mode: 'Virtual Video Desk', icon: Globe, label: 'Virtual Room' },
                    { mode: 'Direct Phone Call', icon: Phone, label: 'Phone Call' },
                  ].map((m) => {
                    const isSelected = consultationMode === m.mode;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.mode}
                        type="button"
                        onClick={() => setConsultationMode(m.mode as any)}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Specific Queries or Target Universities (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Looking for Russell Group scholarships in AI, or transitioning from IB DP with 35 points..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 text-xs sm:text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {submitting
                    ? 'Confirming Slot with Counselor...'
                    : `Confirm Session on ${selectedDate} at ${selectedTimeSlot}`}
                </span>
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                Guaranteed zero pressure. We never share your contact information with unapproved third parties.
              </p>
            </form>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmationData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left">
              <button
                onClick={() => setConfirmationData(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close confirmation dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                Counselling Session Confirmed!
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                Your reservation with {confirmationData.counselorName} has been booked. A calendar invite has been queued for {confirmationData.email}.
              </p>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs mb-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="font-mono-numbers font-bold text-slate-900">
                    {confirmationData.reference}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Advisor:</span>
                  <span className="font-semibold text-slate-900">{confirmationData.counselorName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-semibold text-slate-900">
                    {confirmationData.date} · {confirmationData.timeSlot} (IST)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mode:</span>
                  <span className="font-semibold text-slate-900">{confirmationData.mode}</span>
                </div>
                {confirmationData.meetLink && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">Meeting Room:</span>
                    <a
                      href={confirmationData.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Join Room</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-6">
                <span className="font-bold block mb-0.5">Preparation Tip:</span>
                Keep digital copies of your semester marksheets, 10th/12th marksheets, and passport handy for transcript evaluations.
              </div>

              <button
                onClick={() => setConfirmationData(null)}
                className="w-full py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-center"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
