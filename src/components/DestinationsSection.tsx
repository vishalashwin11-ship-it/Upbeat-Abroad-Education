import React, { useState } from 'react';
import { DESTINATIONS_DATA } from '../data/destinations';
import { Destination } from '../types';
import { CheckCircle2, ArrowRight, Clock, Banknote, Briefcase, GraduationCap, Building2 } from 'lucide-react';

interface DestinationsSectionProps {
  onOpenBooking: () => void;
  onOpenEnquiry: (destName?: string) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  onOpenBooking,
  onOpenEnquiry,
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>('uk');

  const currentDest: Destination =
    DESTINATIONS_DATA.find((d) => d.id === selectedDestId) || DESTINATIONS_DATA[0];

  return (
    <section id="destinations" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 tracking-wider uppercase mb-2">
            <span>Study Destinations</span>
            <span aria-hidden="true">·</span>
            <span>Russell Group & Go8 Specialists</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Premier Global Education Hubs
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Compare post-study work rights, average tuition fees, intake timelines, and admissions benchmarks across top destinations.
          </p>
        </div>

        {/* Interactive Segmented Destination Selector (Buttons/Tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-slate-200 mb-8">
          {DESTINATIONS_DATA.map((dest) => {
            const isSelected = dest.id === selectedDestId;
            return (
              <button
                key={dest.id}
                onClick={() => setSelectedDestId(dest.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span className="text-lg">{dest.flag}</span>
                <span>{dest.name}</span>
              </button>
            );
          })}
        </div>

        {/* Destination Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Key Facts & Detailed Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentDest.flag}</span>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{currentDest.name}</h3>
                    <p className="text-xs text-teal-700 font-semibold">{currentDest.tagline}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 hidden sm:inline-block">
                  {currentDest.specialHighlight}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                {currentDest.overview}
              </p>

              {/* Core Strengths */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Key Advantages for Indian Students
                </h4>
                {currentDest.keyStrengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>

              {/* Top Universities List */}
              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  <span>Featured & Ranked Universities</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                  {currentDest.topUniversities.map((uni, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200/60">
                      <GraduationCap className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{uni}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Action for Destination */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onOpenEnquiry(currentDest.name)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <span>Check Eligibility for {currentDest.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                <span>Book 1-on-1 Country Specialist</span>
              </button>
            </div>
          </div>

          {/* Right Column: Financial & Visa Snapshot Bento */}
          <div className="lg:col-span-5 space-y-4">
            {/* Metric Card 1: Tuition */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Average Tuition Fee
                  </span>
                  <div className="text-lg font-bold text-slate-900 font-mono-numbers">
                    {currentDest.avgTuitionINR}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Tuition varies by course tier (Business, STEM, Arts). Partial scholarships of ₹2L–₹8L available.
              </p>
            </div>

            {/* Metric Card 2: Living Cost */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Estimated Living Cost
                  </span>
                  <div className="text-lg font-bold text-slate-900 font-mono-numbers">
                    {currentDest.avgLivingINR}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Covers student housing, meals, transport, and utilities based on official proof-of-funds thresholds.
              </p>
            </div>

            {/* Metric Card 3: Post-Study Work Rights */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Post-Study Work Rights
                  </span>
                  <div className="text-sm font-bold text-slate-900">
                    {currentDest.workRights}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Allows graduates to gain international work experience without requiring immediate sponsorship.
              </p>
            </div>

            {/* Metric Card 4: Intakes & Visa Timeline */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 text-teal-300 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Intakes & Visa Processing
                  </span>
                  <div className="text-sm font-semibold text-white">
                    {currentDest.intakes.join(' · ')}
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>Visa Turnaround:</span>
                <span className="font-semibold text-amber-300">{currentDest.visaProcessing}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
