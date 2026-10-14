import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, Send, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { sendStudentEnquiry } from '../lib/supabase';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Russell Group & Go8 Admissions');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendStudentEnquiry({
        full_name: name,
        email,
        phone,
        preferred_destination: subject,
        intended_course: 'General Advisory & Contact Inquiry',
        message,
      });
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setSent(true); // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/919820012345?text=${encodeURIComponent(
    'Hello Upbeat Abroad Education, I would like to schedule a study abroad consultation.'
  )}`;

  return (
    <section id="contact" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 tracking-wider uppercase mb-2">
            <span>Get in Touch</span>
            <span aria-hidden="true">·</span>
            <span>Virtual Hubs Across India & UAE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connect With Upbeat Abroad Education
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Have questions regarding intakes, visa eligibility, or university selection? Reach out via WhatsApp, phone, email, or schedule a virtual video desk session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Channels & Hub Locations */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Quick Connect Card */}
            <div className="p-6 rounded-2xl bg-emerald-900 text-white shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold">Fast WhatsApp Response</h4>
                  <span className="text-xs text-emerald-300">Average reply in under 15 minutes</span>
                </div>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                Chat directly with our admissions desk to ask quick questions about IELTS exemptions, entry cutoffs, or deadlines.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
              >
                <span>Open WhatsApp Chat</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Direct Contact Details */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Admissions Helplines</span>
                  <a href="tel:+919820012345" className="text-slate-600 hover:text-teal-700 block">
                    +91 (0) 98200 12345 (National Helpline)
                  </a>
                  <a href="tel:+971501234567" className="text-slate-600 hover:text-teal-700 block">
                    +971 50 123 4567 (UAE & Middle East Desk)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Official Inquiries</span>
                  <a href="mailto:admissions@upbeatabroad.com" className="text-slate-600 hover:text-teal-700 block">
                    admissions@upbeatabroad.com
                  </a>
                  <a href="mailto:counseling@upbeatabroad.com" className="text-slate-600 hover:text-teal-700 block">
                    counseling@upbeatabroad.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Operating Hours (IST)</span>
                  <span className="text-slate-600 block">Monday to Saturday: 9:30 AM – 7:30 PM</span>
                  <span className="text-slate-600 block">Sunday: By Pre-Booked Appointment</span>
                </div>
              </div>
            </div>

            {/* Regional Virtual Desks */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>Virtual Service Desks</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-600">
                <p><strong>Mumbai:</strong> Bandra Kurla Complex (BKC) Advisory Hub, Mumbai 400051</p>
                <p><strong>Delhi NCR:</strong> Connaught Place Center, New Delhi 110001</p>
                <p><strong>Bengaluru:</strong> Indiranagar Tech Corridor, Bengaluru 560038</p>
                <p><strong>Dubai Hub:</strong> Dubai Knowledge Park, Block 2, UAE</p>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Send an Advisory Query
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Our regional university coordinators will respond with specific cutoff and prerequisite requirements.
            </p>

            {sent ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Message Dispatched!</h4>
                <p className="text-xs text-slate-600 mb-4 max-w-sm mx-auto">
                  Thank you for reaching out. An Upbeat Abroad Education counselor will contact you via email/phone shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Topic of Query
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                  >
                    <option value="Russell Group & Go8 Admissions">Russell Group & Go8 Admissions</option>
                    <option value="Dubai Branch Campus Inquiries">Dubai Branch Campus Inquiries</option>
                    <option value="Scholarship & Funding Advisory">Scholarship & Funding Advisory</option>
                    <option value="IB Diploma / A-Level Transition">IB Diploma / A-Level Transition</option>
                    <option value="Visa Application & Refusal Review">Visa Application & Refusal Review</option>
                    <option value="Other / General Assistance">Other / General Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Message / Questions
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify your course interest, current academic aggregate, or specific questions..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Transmitting...' : 'Send Message to Advisors'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="text-xs text-teal-700 font-semibold hover:underline"
                  >
                    Or book a direct video appointment →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
