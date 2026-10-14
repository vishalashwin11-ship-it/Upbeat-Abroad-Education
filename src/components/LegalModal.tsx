import React, { useState } from 'react';
import { X, ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'disclaimer',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close legal modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Headers */}
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'disclaimer'
                ? 'bg-amber-100 text-amber-900'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Admissions & Visa Disclaimer
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-teal-100 text-teal-900'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Privacy Policy (DPDP 2023)
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Terms of Service
          </button>
        </div>

        {/* Disclaimer Content */}
        {activeTab === 'disclaimer' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Zero-Guarantee Regulatory Disclosure</strong>
                <span>
                  Upbeat Abroad Education strictly operates as an advisory consultancy. We do not and cannot guarantee university admission, scholarship awards, student visas, permanent residency, or post-study employment.
                </span>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 text-sm">1. University Admissions Authority</h4>
            <p>
              All academic admission decisions, offer letter conditions, and credit transfer evaluations rest solely within the statutory jurisdiction of the admissions committees of the respective institutions. Upbeat Abroad Education prepares, reviews, and submits student dossiers in good faith based on published criteria.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">2. Visa & Immigration Authority</h4>
            <p>
              Granting or refusal of entry visas, student permits (UKVI CAS, Australian Subclass 500, IRCC Study Permits, Irish Stamp 2, and UAE Student Visas) is the sovereign prerogative of the respective national immigration departments and high commissions. No educational consultant possesses authority to influence visa officer decisions.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">3. Financial Estimates</h4>
            <p>
              Tuition fees, living expenses, exchange rates, and scholarship values quoted on this website and in counseling sessions are indicative figures derived from university publications and may fluctuate. Students are advised to verify exact invoice totals directly on university portals prior to payment.
            </p>
          </div>
        )}

        {/* Privacy Policy Content */}
        {activeTab === 'privacy' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-sm">Digital Personal Data Protection (DPDP) Act 2023 Compliance</h4>
            <p>
              Upbeat Abroad Education is committed to protecting the privacy and personal data of students, parents, and website visitors in accordance with India’s Digital Personal Data Protection Act, 2023, and international best practices.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">1. Purpose of Data Collection</h4>
            <p>
              We collect personal data (including full name, contact information, academic transcripts, test scorecards, and study preferences) exclusively for evaluating academic eligibility, submitting university applications, booking counseling appointments, and generating customized admissions roadmaps.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">2. Consent & Student Rights</h4>
            <p>
              You maintain the right to access, rectify, or request the deletion of your personal data stored within our systems at any time by contacting our Data Grievance Officer at <code>privacy@upbeatabroad.com</code>.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">3. Data Sharing & Third Parties</h4>
            <p>
              We never sell, rent, or lease student information to commercial lead brokers. Your data is shared solely with prospective universities, official application services (e.g., UCAS), and verified banking partners upon your explicit authorization.
            </p>
          </div>
        )}

        {/* Terms of Service Content */}
        {activeTab === 'terms' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-sm">Terms & Advisory Engagement</h4>
            <p>
              By accessing the Upbeat Abroad Education website, booking counseling sessions, or submitting enquiry dossiers, you agree to these terms:
            </p>

            <h4 className="font-bold text-slate-900 text-sm">1. Honesty of Academic Information</h4>
            <p>
              Applicants undertake to furnish authentic, verifiable academic transcripts, degree certificates, and test results. Submission of fraudulent documents will result in immediate termination of advising services.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">2. Free University Counseling</h4>
            <p>
              Core counseling and university application submissions to partnered institutions are free for students. Ancillary customized services (e.g., intensive executive SOP ghostwriting or specialized visa appeals) require separate written engagement.
            </p>

            <h4 className="font-bold text-slate-900 text-sm">3. Jurisdiction</h4>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.
            </p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
};
