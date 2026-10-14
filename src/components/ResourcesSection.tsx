import React, { useState } from 'react';
import { FAQS_DATA, ENGLISH_TEST_COMPARISON } from '../data/resources';
import { FaqItem } from '../types';
import { HelpCircle, ChevronDown, ChevronUp, FileText, CheckCircle2, Award, BookOpen, Layers } from 'lucide-react';

export const ResourcesSection: React.FC = () => {
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories = ['All', 'Admissions', 'Visas', 'Scholarships', 'Destinations', 'IB Pathways'];

  const filteredFaqs = FAQS_DATA.filter(
    (faq) => activeFaqCategory === 'All' || faq.category === activeFaqCategory
  );

  return (
    <section id="resources" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 tracking-wider uppercase mb-2">
            <span>Student Knowledge Base</span>
            <span aria-hidden="true">·</span>
            <span>Guides & FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive International Education Resources
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Clear, authoritative guides on standard entrance exams, SOP drafting, Genuine Student (GS) statements, and common queries.
          </p>
        </div>

        {/* 2 Main Feature Guides: SOP Master Guide & English Test Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Guide 1: Statement of Purpose (SOP) Blueprint */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                <FileText className="w-4 h-4" />
                <span>Admissions Toolkit</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                The Anatomy of a Winning Statement of Purpose (SOP)
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Admissions officers at Russell Group and Group of Eight evaluate hundreds of essays weekly. Here is what separates accepted applicants:
              </p>
              <div className="space-y-2.5 text-xs text-slate-700 mb-6">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Intellectual Spark:</strong> Specific academic projects, research papers, or industry challenges that ignited your curiosity.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Course Alignment:</strong> Naming specific modules, labs, and faculty publications matching your career trajectory.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Cliché Rule:</strong> Avoid starting with quotes from Einstein or childhood anecdotes; dive straight into your academic maturity.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Definite Post-Graduation Goals:</strong> Clear 3-to-5 year career plan stating target roles and industries.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Need your SOP audited?</span>
              <span className="font-semibold text-teal-700">Complimentary 1-on-1 Review Included</span>
            </div>
          </div>

          {/* Guide 2: English Language Proficiency Comparison */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>Test Strategy</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                IELTS Academic vs. PTE Academic vs. TOEFL iBT
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Selecting the right test based on your comfort with computer-adaptive grading and university deadlines:
              </p>

              {/* Table */}
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                      <th className="py-2 pr-3">Feature</th>
                      <th className="py-2 pr-3 text-teal-800">IELTS Academic</th>
                      <th className="py-2 pr-3 text-slate-800">PTE Academic</th>
                      <th className="py-2 text-slate-800">TOEFL iBT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {ENGLISH_TEST_COMPARISON.slice(0, 4).map((row, i) => (
                      <tr key={i}>
                        <td className="py-2 font-medium text-slate-900">{row.metric}</td>
                        <td className="py-2 pr-3 font-semibold text-teal-700">{row.ielts}</td>
                        <td className="py-2 pr-3">{row.pte}</td>
                        <td className="py-2">{row.toefl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span>Tip: Many UAE universities accept high school English 75%+ waivers in place of IELTS.</span>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-teal-700" />
                <span>Frequently Asked Questions</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Answers to key admissions, visa, and fee questions asked by Indian students and parents.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFaqCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeFaqCategory === cat
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/90 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-teal-700 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 bg-slate-50/50 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
