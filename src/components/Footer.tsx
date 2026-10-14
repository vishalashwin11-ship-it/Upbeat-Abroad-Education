import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenLegal: (tab: 'privacy' | 'terms' | 'disclaimer') => void;
  onOpenSupabaseModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal, onOpenSupabaseModal }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 text-left">
          {/* Col 1: Brand Info & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Upbeat Abroad Education is an India-based, virtual-first overseas education consultancy. Providing ethical, data-driven admissions guidance to Russell Group, Group of Eight, and top global institutions.
            </p>
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Certified Advisors · British Council & ICEF Screened</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Virtual Advisory Desks in Mumbai · Delhi NCR · Bengaluru · Dubai Knowledge Park
            </div>
          </div>

          {/* Col 2: Study Destinations */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Study Destinations
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  United Kingdom (Russell Group)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Australia (Group of Eight)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  UAE & Dubai (Branch Campuses)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Canada (U15 & Public Hubs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ireland (Tech Capital)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  New Zealand
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Pathways */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Admissions Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Profile & Eligibility Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Course & University Matching
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  SOP & LOR Mentorship
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Scholarship & Loan Advisory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Genuine Student (GS) Visa Prep
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  IB Diploma & A-Level Pathways
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Help & Legal */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Legal & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLegal('disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer text-amber-400"
                >
                  Admissions & Visa Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy (DPDP 2023)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Student Resources & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Virtual Desks & Contact
                </button>
              </li>
              {onOpenSupabaseModal && (
                <li>
                  <button
                    onClick={onOpenSupabaseModal}
                    className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1.5 text-teal-400/90 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Supabase Backend Sync</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Regulatory Notice */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Upbeat Abroad Education Private Limited. All Rights Reserved.
          </div>
          <div className="text-center sm:text-right">
            Guidance based on official university & government guidelines. No guarantee of admission or visa.
          </div>
        </div>
      </div>
    </footer>
  );
};
