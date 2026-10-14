import React, { useState, useMemo } from 'react';
import { UNIVERSITIES_DATA } from '../data/universities';
import { University } from '../types';
import { Search, MapPin, Award, BookOpen, GraduationCap, Coins, CheckCircle, ExternalLink, X } from 'lucide-react';

interface UniversityFinderProps {
  onOpenBooking: () => void;
  onOpenEnquiry: (uniName?: string) => void;
}

export const UniversityFinder: React.FC<UniversityFinderProps> = ({
  onOpenBooking,
  onOpenEnquiry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedAlliance, setSelectedAlliance] = useState('All');
  const [onlyScholarships, setOnlyScholarships] = useState(false);
  const [activeModalUni, setActiveModalUni] = useState<University | null>(null);

  const destinationsList = [
    'All',
    'United Kingdom',
    'Australia',
    'United Arab Emirates & Dubai',
    'Canada',
    'Ireland',
    'New Zealand',
  ];

  const alliancesList = [
    'All',
    'Russell Group',
    'Group of Eight (Go8)',
    'Branch Campus',
    'U15',
    'Global Top 100',
  ];

  const filteredUniversities = useMemo(() => {
    return UNIVERSITIES_DATA.filter((uni) => {
      const matchesSearch =
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.popularCourses.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDestination =
        selectedDestination === 'All' || uni.destination === selectedDestination;

      const matchesAlliance =
        selectedAlliance === 'All' || uni.alliance === selectedAlliance;

      const matchesScholarship = !onlyScholarships || uni.scholarshipAvailable;

      return matchesSearch && matchesDestination && matchesAlliance && matchesScholarship;
    });
  }, [searchTerm, selectedDestination, selectedAlliance, onlyScholarships]);

  return (
    <section id="universities" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 tracking-wider uppercase mb-2">
            <span>Course & University Directory</span>
            <span aria-hidden="true">·</span>
            <span>Over 1,800+ Programs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Your Ideal University & Program
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Search institutions by global rank, course specialization, tuition fee brackets, and entry prerequisites.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by university name, city, or course (e.g. Data Science, MBA, Engineering)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Destination Select */}
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {destinationsList.map((d) => (
                <option key={d} value={d}>
                  Destination: {d}
                </option>
              ))}
            </select>

            {/* Alliance Select */}
            <select
              value={selectedAlliance}
              onChange={(e) => setSelectedAlliance(e.target.value)}
              className="px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {alliancesList.map((a) => (
                <option key={a} value={a}>
                  Tier: {a}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filter Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnlyScholarships(!onlyScholarships)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                  onlyScholarships
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {onlyScholarships ? '✓ Showing With Scholarships' : 'Filter: Has Scholarships'}
              </button>
            </div>

            <span className="text-slate-500 font-mono-numbers">
              Showing {filteredUniversities.length} of {UNIVERSITIES_DATA.length} Institutions
            </span>
          </div>
        </div>

        {/* University Cards Grid */}
        {filteredUniversities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No institutions found matching criteria</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try broadening your search term or clearing destination and alliance filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDestination('All');
                setSelectedAlliance('All');
                setOnlyScholarships(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni) => (
              <div
                key={uni.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-500/40 transition-all flex flex-col justify-between text-left"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={uni.campusImage}
                      alt={uni.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-[11px] font-semibold text-white">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>{uni.ranking}</span>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-700 text-white">
                      {uni.alliance}
                    </div>
                    <div className="absolute bottom-2.5 left-3 right-3 text-xs text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span className="truncate">{uni.city}, {uni.destination}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 mb-2">
                      {uni.name}
                    </h3>

                    {/* Tuition Range */}
                    <div className="text-xs text-slate-600 mb-3 flex items-center justify-between">
                      <span className="text-slate-500">Tuition:</span>
                      <span className="font-semibold text-slate-900 font-mono-numbers">{uni.tuitionRange}</span>
                    </div>

                    {/* Popular Courses */}
                    <div className="mb-4">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                        Key Programs:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {uni.popularCourses.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium truncate max-w-full"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Scholarship Flag */}
                    {uni.scholarshipAvailable && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60 mb-3">
                        <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{uni.scholarshipDetails}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalUni(uni)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onOpenEnquiry(uni.name)}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Check Eligibility
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed University Modal */}
        {activeModalUni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative text-left">
              <button
                onClick={() => setActiveModalUni(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                <span>{activeModalUni.destination}</span>
                <span aria-hidden="true">·</span>
                <span>{activeModalUni.alliance}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
                {activeModalUni.name}
              </h3>
              <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeModalUni.city} · Rank: {activeModalUni.ranking}</span>
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block mb-1">Indicative Tuition Fees</span>
                  <span className="text-slate-700 font-mono-numbers">{activeModalUni.tuitionRange}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block mb-1">Minimum GPA / Academic Entry Benchmark</span>
                  <span className="text-slate-700">{activeModalUni.minGpaPercentage}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block mb-1">Standard English Language Benchmark</span>
                  <span className="text-slate-700">{activeModalUni.englishReq}</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900">
                  <span className="text-xs font-bold block mb-1">Scholarship Opportunities</span>
                  <p>{activeModalUni.scholarshipDetails}</p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-900 block mb-2">Popular Course Streams</span>
                  <div className="flex flex-wrap gap-2">
                    {activeModalUni.popularCourses.map((c, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const name = activeModalUni.name;
                    setActiveModalUni(null);
                    onOpenEnquiry(name);
                  }}
                  className="flex-1 py-3 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all cursor-pointer text-center"
                >
                  Apply to {activeModalUni.name}
                </button>
                <button
                  onClick={() => {
                    setActiveModalUni(null);
                    onOpenBooking();
                  }}
                  className="flex-1 py-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer text-center"
                >
                  Speak with University Specialist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
