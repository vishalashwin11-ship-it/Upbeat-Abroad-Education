import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, AlertCircle, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

interface AiAssistantProps {
  onOpenBooking: () => void;
  onOpenEnquiry: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  onOpenBooking,
  onOpenEnquiry,
}) => {
  const [activeTab, setActiveTab] = useState<'evaluator' | 'chat'>('evaluator');

  // Evaluator Form State
  const [evalProfile, setEvalProfile] = useState({
    degreeLevel: 'Masters / Postgraduate',
    destination: 'United Kingdom (Russell Group)',
    field: 'Computer Science / Data / AI',
    academicScore: '72% (First Class)',
    englishTest: 'IELTS Academic (Expected 6.5–7.0)',
    budget: '₹20L – ₹28L / year',
    workExp: '1–2 Years',
  });

  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<string | null>(null);

  // Chat State
  const [inputQuery, setInputQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your **Upbeat Abroad AI Advisor**. How can I help you today?

I can evaluate your profile for **UK Russell Group**, **Australia Group of Eight (Go8)**, **UAE/Dubai branch campuses**, **Canada**, **Ireland**, and **New Zealand**, or break down tuition fees, visa requirements, and scholarships.

*Note: Guidance is strictly informational based on official admission rules and does not constitute a guarantee of admission or visa.*`,
    },
  ]);

  const promptSuggestions = [
    'Can I get into Russell Group with 68% in my Indian Bachelor’s?',
    'Compare UK vs Australia for MSc Computer Science & Stay Back',
    'What are the advantages of Dubai branch campuses for Indian students?',
    'I am an IB Diploma student with 34 predicted points. What are my options?',
    'What are the 2026 Genuine Student (GS) rules for Australia?',
  ];

  const handleRunEvaluator = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvalLoading(true);
    setEvalResult(null);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'profile_eval',
          profile: evalProfile,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setEvalResult(data.reply);
      } else {
        setEvalResult('Unable to evaluate profile at this moment. Please connect with our human advisors directly.');
      }
    } catch (err) {
      console.error('Evaluator error:', err);
      setEvalResult('An error occurred connecting to the advising engine. Please try again or book a video session.');
    } finally {
      setEvalLoading(false);
    }
  };

  const handleSendChat = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          mode: 'general_chat',
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        role: 'assistant',
        content: data.reply || 'Thank you for your inquiry. Please consult our human advisors for custom case files.',
        source: data.source,
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but our server encountered a momentary communication glitch. Please feel free to book a direct 1-on-1 advisor call.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <section id="ai-assistant" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="max-w-3xl mb-10 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 tracking-wider uppercase mb-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>AI-Powered Study Abroad Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Grounded in Official University Data</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Instant Profile Evaluation & University Advisory
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Powered by modern AI models trained on international admissions benchmarks, Russell Group criteria, Australian GS requirements, and verified course catalogs.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-800/80 rounded-xl border border-slate-700/80 w-fit mb-8">
          <button
            onClick={() => setActiveTab('evaluator')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'evaluator'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Structured Profile Evaluator
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive Advisory Chat
          </button>
        </div>

        {/* TAB 1: Structured Profile Evaluator */}
        {activeTab === 'evaluator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl p-6 sm:p-7 border border-slate-700 shadow-xl text-left">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>Enter Your Academic Parameters</span>
              </h3>

              <form onSubmit={handleRunEvaluator} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Target Degree Level
                  </label>
                  <select
                    value={evalProfile.degreeLevel}
                    onChange={(e) => setEvalProfile({ ...evalProfile, degreeLevel: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Masters / Postgraduate (1-Year or 2-Year)">Masters / Postgraduate (1 or 2-Year)</option>
                    <option value="Undergraduate / Bachelor's (After 12th / IBDP)">Undergraduate / Bachelor's (After 12th / IB)</option>
                    <option value="MBA / Global Executive Business">MBA / Global Executive</option>
                    <option value="Diploma / Pathway / Foundation">Diploma / Pathway / Foundation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Primary Destination Preference
                  </label>
                  <select
                    value={evalProfile.destination}
                    onChange={(e) => setEvalProfile({ ...evalProfile, destination: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="United Kingdom (Russell Group Focus)">United Kingdom (Russell Group Focus)</option>
                    <option value="Australia (Group of Eight - Go8)">Australia (Group of Eight - Go8)</option>
                    <option value="United Arab Emirates & Dubai (Branch Campuses)">United Arab Emirates & Dubai (Branch Campuses)</option>
                    <option value="Canada (U15 & Public Universities)">Canada (U15 & Public Universities)</option>
                    <option value="Ireland (Tech & Bio Hubs)">Ireland (Tech & Bio Hubs)</option>
                    <option value="New Zealand (Top 8 Universities)">New Zealand (Top 8 Universities)</option>
                    <option value="Multi-Country Comparative Review">Multi-Country Comparative Review</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Academic Score / GPA
                    </label>
                    <input
                      type="text"
                      value={evalProfile.academicScore}
                      onChange={(e) => setEvalProfile({ ...evalProfile, academicScore: e.target.value })}
                      placeholder="e.g. 74% or 7.8 CGPA"
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      English Test Readiness
                    </label>
                    <input
                      type="text"
                      value={evalProfile.englishTest}
                      onChange={(e) => setEvalProfile({ ...evalProfile, englishTest: e.target.value })}
                      placeholder="e.g. IELTS 7.0 or Planning"
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Field of Study / Course Interest
                  </label>
                  <input
                    type="text"
                    value={evalProfile.field}
                    onChange={(e) => setEvalProfile({ ...evalProfile, field: e.target.value })}
                    placeholder="e.g. Artificial Intelligence, Finance, Aerospace, Law"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Budget Per Year
                    </label>
                    <select
                      value={evalProfile.budget}
                      onChange={(e) => setEvalProfile({ ...evalProfile, budget: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Under ₹15 Lakhs">Under ₹15 Lakhs (Dubai / Grants)</option>
                      <option value="₹16L – ₹24L">₹16L – ₹24L (UK / Ireland / NZ)</option>
                      <option value="₹25L – ₹35L">₹25L – ₹35L (Russell Group / Go8)</option>
                      <option value="₹35L+">₹35L+ (Tier-1 Global Top 30)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Work Experience
                    </label>
                    <select
                      value={evalProfile.workExp}
                      onChange={(e) => setEvalProfile({ ...evalProfile, workExp: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Fresh Graduate / None">Fresh Graduate / None</option>
                      <option value="1–2 Years">1–2 Years</option>
                      <option value="3–5 Years">3–5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={evalLoading}
                  className="w-full mt-2 py-3 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  {evalLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Auditing Academic Criteria...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Generate AI Preliminary Evaluation</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 bg-slate-800/90 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl text-left min-h-[460px] flex flex-col justify-between">
              {evalLoading ? (
                <div className="flex flex-col items-center justify-center my-auto py-12 text-center">
                  <div className="w-12 h-12 rounded-full border-3 border-teal-400 border-t-transparent animate-spin mb-4" />
                  <p className="text-sm font-semibold text-white">Analyzing University Admissions Criteria...</p>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Mapping GPA equivalencies, Russell Group / Go8 subject requirements, and scholarship eligibility.
                  </p>
                </div>
              ) : evalResult ? (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                        Official Criteria Evaluation Report
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Generated Just Now</span>
                  </div>

                  {/* Rendered Text Output */}
                  <div className="prose prose-invert prose-sm max-w-none text-xs sm:text-sm text-slate-200 space-y-3 leading-relaxed whitespace-pre-line">
                    {evalResult}
                  </div>

                  {/* Next Step Action Box */}
                  <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-slate-400">
                      Want human review of your SOP & transcripts?
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={onOpenBooking}
                        className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                      >
                        Book Video Session
                      </button>
                      <button
                        onClick={onOpenEnquiry}
                        className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
                      >
                        Submit Dossier
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="my-auto py-12 text-center max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-slate-700/60 text-teal-400 flex items-center justify-center mx-auto mb-4 border border-slate-600">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    Your Personalized Academic Report Will Appear Here
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Fill in your target degree, score, and preferred destination on the left to receive an immediate breakdown of Ambitious, Target, and Safe institutions, costs, and visa benchmarks.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Interactive Advisory Chat */}
        {activeTab === 'chat' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl overflow-hidden text-left flex flex-col h-[580px]">
            {/* Chat Messages Log */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs sm:text-sm ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-xl p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-teal-700 text-white rounded-br-xs'
                        : 'bg-slate-900 border border-slate-700 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  <span>Upbeat Abroad AI is compiling university requirements...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-700/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0 font-bold">
                Try Asking:
              </span>
              {promptSuggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendChat(sug)}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-4 bg-slate-900 border-t border-slate-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask about admissions, Russell Group, Go8, fees, visas, or scholarships..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !inputQuery.trim()}
                  className="p-2.5 bg-teal-700 hover:bg-teal-600 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer shrink-0"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Ethical Disclaimer Callout */}
        <div className="mt-6 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-slate-400 text-[11px] leading-relaxed flex items-start gap-2.5 text-left">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Official Advisory Disclosure:</strong> Upbeat Abroad Education provides preliminary academic and immigration guidance based on official university admission rubrics and government portals (UKVI, Home Affairs Australia, IRCC Canada). Final admission offers and visas are governed exclusively by sovereign immigration authorities and university admissions boards.
          </span>
        </div>
      </div>
    </section>
  );
};
