import React from 'react';
import { Calendar, Sparkles, CheckCircle2, Star, ArrowRight, ShieldCheck, Award, Users, BookOpen } from 'lucide-react';

interface HomeHeroProps {
  onOpenBooking: () => void;
  onOpenAiAssistant: () => void;
  onOpenEnquiry: () => void;
  onExploreDestinations: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onOpenBooking,
  onOpenAiAssistant,
  onOpenEnquiry,
  onExploreDestinations,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white">
      {/* Background Subtle Geometric Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Decorative Gradient Flares */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Value Proposition, Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Unboxed Metadata Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-teal-300">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-950/60 border border-teal-500/30 text-teal-200">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Virtual-First Global Consultancy
              </span>
              <span className="text-teal-400/60">·</span>
              <span>Based in India · Guiding Worldwide</span>
            </div>

            {/* Main Required Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
              Your Global Education Journey Starts With the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-200 to-amber-200">
                Right Guidance.
              </span>
            </h1>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl font-normal leading-relaxed">
              Empowering students and parents across India with unbiased admissions to UK Russell Group, Australian Group of Eight (Go8), Canada, Ireland, New Zealand, and UAE branch campuses. AI-powered evaluation backed by senior human mentors.
            </p>

            {/* Trust Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Free Application Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>IB & A-Level University Credit Mapping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-Error Visa Documentation (98.4% Rate)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Access to ₹14Cr+ in Merit Scholarships</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer whitespace-nowrap group"
              >
                <Calendar className="w-4 h-4 text-slate-900" />
                <span>Book a Counselling Session</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenAiAssistant}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>AI Profile Evaluator</span>
              </button>

              <button
                onClick={onExploreDestinations}
                className="text-xs text-teal-200 hover:text-white underline underline-offset-4 font-medium transition-colors text-center py-2 sm:py-0"
              >
                View 6 Destinations
              </button>
            </div>

            {/* Social Proof Star Review */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-teal-900 object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Student reviewer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-teal-900 object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Student reviewer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-teal-900 object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                  alt="Student reviewer"
                />
              </div>
              <div className="text-xs text-slate-300">
                <div className="flex items-center gap-1 font-semibold text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5 Rating</span>
                </div>
                <span className="text-slate-400">Based on 3,400+ student & parent reviews</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Real Student Photo & Floating Stat Cards */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Backing Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-amber-500/10 rounded-3xl transform rotate-1 scale-105 filter blur-lg" />

              {/* Main Student Portrait Photo Container */}
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-slate-800/80 shadow-2xl">
                <img
                  src="/src/assets/images/hero_student_counseling_1791974517609.jpg"
                  alt="Happy Indian student holding study abroad prospectus with thumbs up"
                  className="w-full h-auto object-cover max-h-[520px]"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Gradient Scrim at Bottom of Image */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                  <span className="font-semibold text-white">Diya S. · MSc Data Science Admit</span>
                  <span className="text-teal-300 font-medium">University of Edinburgh (Russell Group)</span>
                </div>
              </div>

              {/* Floating Stat Card 1: Total Programs */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-slate-400 block font-medium">Total Courses</span>
                  <span className="text-base font-extrabold text-white font-mono-numbers">1,800+</span>
                </div>
              </div>

              {/* Floating Stat Card 2: Visa Success */}
              <div className="absolute top-1/3 -right-4 sm:-right-6 bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-slate-400 block font-medium">Visa Success</span>
                  <span className="text-base font-extrabold text-white font-mono-numbers">98.4%</span>
                </div>
              </div>

              {/* Floating Stat Card 3: Partner Universities */}
              <div className="absolute -bottom-5 -left-3 sm:-left-4 bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-slate-400 block font-medium">Top Universities</span>
                  <span className="text-base font-extrabold text-white font-mono-numbers">350+ Institutions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Strip Below Hero (Matching the Reference UI Layout) */}
      <div className="relative border-t border-white/10 bg-white text-slate-900 py-6 sm:py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Best Mentors */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-500/40 transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Elite Global Mentors</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Admissions alumni from Oxford, Monash, and UBC guiding your university selection and SOP strategy.
              </p>
            </div>

            {/* Card 2: 100% Free Advising (Highlighted Card like in reference) */}
            <div className="p-5 rounded-2xl bg-teal-700 text-white shadow-md hover:bg-teal-800 transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Zero Service Charge</h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                100% free university counselling and application processing funded directly by global institutions.
              </p>
            </div>

            {/* Card 3: Fast & Transparent */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-500/40 transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Ethical & Transparent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No fake promises. Clear guidance based on official university cutoffs and immigration rules.
              </p>
            </div>

            {/* Card 4: 1-to-1 Discussion */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-500/40 transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">1-to-1 Video Advising</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct live sessions on Google Meet or phone with dedicated advisors for students and parents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
