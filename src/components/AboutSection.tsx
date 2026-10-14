import React from 'react';
import { Award, ShieldCheck, Users, Globe, CheckCircle2, HeartHandshake, Compass } from 'lucide-react';

interface AboutSectionProps {
  onOpenBooking: () => void;
  onOpenEnquiry: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenBooking,
  onOpenEnquiry,
}) => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-t border-slate-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 tracking-wider uppercase mb-2">
            <span>About Upbeat Abroad Education</span>
            <span aria-hidden="true">·</span>
            <span>Virtual-First Advisory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Democratizing Global Education for Indian Students
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Founded on the conviction that top-tier international counselling should not be limited to high-street physical offices or commercial sales targets.
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Story Column */}
          <div className="lg:col-span-7 space-y-5 text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>Upbeat Abroad Education</strong> is an India-based, virtual-first study abroad consultancy built by alumni and former international admissions directors from the UK, Australia, Canada, and the UAE.
            </p>
            <p>
              Traditional consultancy offices often push students toward whatever private colleges yield the highest commercial commissions. We operate differently: our core philosophy is <strong>institution-agnostic, student-first advising</strong>. Whether you aim for the historic quads of Oxford and Edinburgh in the Russell Group, the cutting-edge labs of Melbourne and Sydney in Australia’s Go8, or the tax-free, career-rich branch campuses of Dubai, our guidance is calibrated solely to your academic profile and personal aspirations.
            </p>
            <p>
              Being virtual-first means students and parents from Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Kolkata, Ahmedabad, and tier-2/3 cities receive identical, uncompromising access to senior international mentors without ever battling city traffic.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>100% Free Application Processing for Partner Universities</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Specialized Guidance for IB Diploma & Cambridge A-Levels</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero Hidden Fees or Non-Transparent Retainers</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Adherence to India’s DPDP Act 2023 & Student Data Privacy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual of Counseling Session */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <img
                src="/src/assets/images/counseling_session_mentor_1791974519549.jpg"
                alt="Upbeat Abroad Education counseling session with student and parent"
                className="w-full h-auto object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-slate-900 text-white text-xs">
                <span className="font-semibold block">Personalized 1-on-1 Guidance</span>
                <span className="text-slate-400">Our mentors conduct thorough video reviews with students & parents.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Our Ethical Charter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Ethical Integrity</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never fabricate CVs, falsify work experience, or submit misleading documents. Pure merit and honest presentation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Tier-1 Specialization</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct pathways and deep application expertise for Russell Group, Group of Eight, and Global Top 100 institutions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Virtual Efficiency</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Save hours of travel. Live video consultations, real-time shared application folders, and instant WhatsApp support.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Parent Partnership</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We proactively involve parents in financial planning, fee safety, student housing security, and health insurance.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-xl font-bold">Have questions regarding your academic background?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Talk directly with a senior university advisor who has guided hundreds of Indian students to top universities.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenBooking}
              className="px-5 py-3 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Book a Counselling Session
            </button>
            <button
              onClick={onOpenEnquiry}
              className="px-5 py-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Evaluate Profile (Free)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
