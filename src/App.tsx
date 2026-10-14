import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { JourneySection } from './components/JourneySection';
import { DestinationsSection } from './components/DestinationsSection';
import { UniversityFinder } from './components/UniversityFinder';
import { ServicesSection } from './components/ServicesSection';
import { AiAssistant } from './components/AiAssistant';
import { BookingSection } from './components/BookingSection';
import { StudentEnquirySection } from './components/StudentEnquirySection';
import { ResourcesSection } from './components/ResourcesSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';
import { LegalModal } from './components/LegalModal';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import { MessageSquare, Calendar, ChevronUp } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryPrefill, setEnquiryPrefill] = useState('');
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'disclaimer'>('disclaimer');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenEnquiry = (prefillDest?: string) => {
    setEnquiryPrefill(prefillDest || '');
    setIsEnquiryOpen(true);
  };

  const handleOpenBooking = () => {
    setActiveSection('booking');
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAiAssistant = () => {
    setActiveSection('ai-assistant');
    const aiEl = document.getElementById('ai-assistant');
    if (aiEl) {
      aiEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenLegal = (tab: 'privacy' | 'terms' | 'disclaimer') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/919820012345?text=${encodeURIComponent(
    'Hi Upbeat Abroad Education, I would like to inquire about study abroad university admissions.'
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenBooking={handleOpenBooking}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Homepage Hero */}
        <HomeHero
          onOpenBooking={handleOpenBooking}
          onOpenAiAssistant={handleOpenAiAssistant}
          onOpenEnquiry={() => handleOpenEnquiry()}
          onExploreDestinations={() => handleNavigate('destinations')}
        />

        {/* 2. Structured 6-Step Student Journey */}
        <JourneySection
          onOpenBooking={handleOpenBooking}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />

        {/* 3. Study Destinations (UK, Australia, UAE, Canada, Ireland, NZ) */}
        <DestinationsSection
          onOpenBooking={handleOpenBooking}
          onOpenEnquiry={(dest) => handleOpenEnquiry(dest)}
        />

        {/* 4. University & Course Finder */}
        <UniversityFinder
          onOpenBooking={handleOpenBooking}
          onOpenEnquiry={(uni) => handleOpenEnquiry(uni)}
        />

        {/* 5. Comprehensive Advisory Services */}
        <ServicesSection
          onOpenBooking={handleOpenBooking}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />

        {/* 6. AI Study Abroad Assistant */}
        <AiAssistant
          onOpenBooking={handleOpenBooking}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />

        {/* 7. Book a Counselling Session */}
        <BookingSection />

        {/* 8. Official Student Enquiry Form (Direct to Supabase student_enquiries) */}
        <StudentEnquirySection onOpenSupabaseModal={() => setIsSupabaseOpen(true)} />

        {/* 9. Student Resources & FAQs */}
        <ResourcesSection />

        {/* 9. About Upbeat Abroad Education */}
        <AboutSection
          onOpenBooking={handleOpenBooking}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />

        {/* 10. Contact Us & Virtual Hubs */}
        <ContactSection onOpenBooking={handleOpenBooking} />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLegal={handleOpenLegal}
        onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
      />

      {/* Interactive Modals */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        prefilledDestination={enquiryPrefill}
      />

      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalTab}
      />

      <SupabaseSyncModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {/* Scroll To Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 bg-white text-slate-700 hover:text-slate-900 border border-slate-200 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer focus:outline-none"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

        {/* WhatsApp Floating Connect */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer font-semibold text-xs"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp Us</span>
        </a>
      </div>
    </div>
  );
}
