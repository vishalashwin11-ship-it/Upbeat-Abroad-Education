import React from 'react';
import { ArrowRight, CheckCircle2, UserCheck, Compass, FileEdit, Coins, Stamp, PlaneTakeoff } from 'lucide-react';

interface JourneySectionProps {
  onOpenBooking: () => void;
  onOpenEnquiry: () => void;
}

export const JourneySection: React.FC<JourneySectionProps> = ({ onOpenBooking, onOpenEnquiry }) => {
  const steps = [
    {
      num: '01',
      title: 'Profile Evaluation & Eligibility',
      desc: 'Transcript conversion (GPA to UK 2:1 / Australian WAM), backlog audit, and tier-ranking against official entry criteria.',
      icon: UserCheck,
      details: 'Evaluates GPA, work experience, English score readiness, and IB/A-Level credits.',
    },
    {
      num: '02',
      title: 'Course & University Shortlisting',
      desc: 'Curating a strategic blend of Ambitious, Target, and Safe institutions across the UK, Australia, Canada, Ireland, NZ, and UAE.',
      icon: Compass,
      details: 'Includes Russell Group and Group of Eight priority matching.',
    },
    {
      num: '03',
      title: 'SOP Mentorship & Direct Applications',
      desc: 'Rigorous multi-round Statement of Purpose (SOP) crafting, LOR curation, and official university application filing with fee waivers.',
      icon: FileEdit,
      details: 'Zero-plagiarism review by alumni editors from top global institutions.',
    },
    {
      num: '04',
      title: 'Scholarship & Loan Sanctioning',
      desc: 'Securing early-bird merit discounts, diversity bursaries, and collateral/non-collateral education loans with top Indian banking partners.',
      icon: Coins,
      details: 'Guidance on university fee remissions up to 100% and fast-track loan sanctions.',
    },
    {
      num: '05',
      title: 'Flawless Visa Documentation',
      desc: 'End-to-end Genuine Student (GS) statements, financial affidavits, CAS/eCoE audits, biometrics, and mock consular interviews.',
      icon: Stamp,
      details: 'Demonstrated 98.4% visa grant rate backed by strict checklist compliance.',
    },
    {
      num: '06',
      title: 'Pre-Departure, Housing & Landing',
      desc: 'University dorm reservation, forex cards at interbank rates, international SIM cards, health insurance, and local student community intro.',
      icon: PlaneTakeoff,
      details: 'Arrival briefings so students hit the ground running with absolute confidence.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 tracking-wider uppercase mb-2">
            <span>Structured 6-Step Roadmap</span>
            <span aria-hidden="true">·</span>
            <span>Zero Guesswork</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Upbeat Abroad Guides You From India to Your Dream Campus
          </h2>
          <p className="mt-3 text-base text-slate-600">
            A transparent, milestone-driven framework developed to eliminate anxiety, prevent costly documentation errors, and ensure timely admissions.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-2xl p-7 border border-slate-200 hover:border-teal-500/50 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-extrabold font-mono-numbers text-teal-600/30 group-hover:text-teal-600 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-teal-50 group-hover:bg-teal-700 text-teal-700 group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{step.details}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Journey Bottom Action Bar */}
        <div className="mt-12 bg-teal-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-xl font-bold">Ready to take Step 01 of your international journey?</h3>
            <p className="text-sm text-teal-200 mt-1">
              Start with our online profile evaluator or book a direct video consultation with a senior advisor.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenEnquiry}
              className="px-5 py-3 text-xs font-semibold text-teal-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              Start Free Assessment
            </button>
            <button
              onClick={onOpenBooking}
              className="px-5 py-3 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 border border-teal-600/40 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Book Video Session
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
