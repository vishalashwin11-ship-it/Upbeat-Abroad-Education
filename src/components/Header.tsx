import React, { useState } from 'react';
import { Logo } from './Logo';
import { Menu, X, Calendar, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenEnquiry: () => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onOpenEnquiry,
  onOpenBooking,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'destinations', label: 'Study Destinations' },
    { id: 'universities', label: 'Universities & Courses' },
    { id: 'services', label: 'Our Services' },
    { id: 'enquiry', label: 'Student Enquiry' },
    { id: 'ai-assistant', label: 'AI Study Assistant', isAi: true },
    { id: 'resources', label: 'Resources & FAQs' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice: Virtual First Indian Consultancy */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-teal-400 font-medium">Virtual-First Global Advisory</span>
            <span className="text-slate-500">·</span>
            <span>Russell Group (UK) & Group of Eight (Australia) Admissions Open for 2026/2027</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <button
              onClick={onOpenEnquiry}
              className="text-white hover:text-teal-300 transition-colors font-medium cursor-pointer"
            >
              Check Eligibility Online
            </button>
            <span className="text-slate-600">|</span>
            <a href="tel:+919820012345" className="hover:text-teal-300 transition-colors">
              +91 (0) 98200 12345
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Bar strictly obeying the 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark / Logo */}
        <button
          onClick={() => handleLinkClick('home')}
          className="text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-sm"
          aria-label="Upbeat Abroad Education Home"
        >
          <Logo size="md" />
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-teal-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {link.isAi && <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Book a Counselling Session</span>
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-md focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${
                activeSection === link.id
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-teal-700 rounded-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Counselling Session</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full text-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              Evaluate Profile (Free)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
