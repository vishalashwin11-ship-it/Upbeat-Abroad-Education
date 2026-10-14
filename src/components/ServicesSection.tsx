import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/services';
import { ServiceItem } from '../types';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface ServicesSectionProps {
  onOpenBooking: () => void;
  onOpenEnquiry: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenBooking,
  onOpenEnquiry,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('eval');

  const selectedService: ServiceItem =
    SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];

  return (
    <section id="services" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 tracking-wider uppercase mb-2">
            <span>Our Advisory Services</span>
            <span aria-hidden="true">·</span>
            <span>Comprehensive Student Support</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialized Overseas Higher Education Mentorship
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From your preliminary eligibility review in India to unpacking your suitcases abroad, our senior advisors manage every stage with strict ethical rigor.
          </p>
        </div>

        {/* 2-Column Layout: Service List on Left, Active Deep Dive on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Numbered Service Selection List */}
          <div className="lg:col-span-5 space-y-2">
            {SERVICES_DATA.map((service) => {
              const isSelected = service.id === selectedServiceId;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer border flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold font-mono-numbers ${
                        isSelected ? 'text-teal-400' : 'text-slate-400'
                      }`}
                    >
                      {service.stepNumber}
                    </span>
                    <span className="text-xs sm:text-sm font-bold leading-tight">
                      {service.title}
                    </span>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-teal-400 translate-x-1' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Service Specification */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-extrabold text-teal-700 font-mono-numbers">
                Service {selectedService.stepNumber}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                Guaranteed Ethical Standard
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">
              {selectedService.title}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed mb-6">
              {selectedService.fullDesc}
            </p>

            {/* Feature Checklist */}
            <div className="mb-6 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                What’s Included in This Service:
              </h4>
              {selectedService.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Strategic Value Callout */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 mb-8 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-0.5">Advisor Insight:</span>
                <span className="text-xs text-slate-600 leading-relaxed">{selectedService.highlight}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <span>Consult on {selectedService.title.split('&')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenEnquiry}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                <span>Submit Student Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
