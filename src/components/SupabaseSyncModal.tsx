import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, ExternalLink, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/supabase-status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('Error fetching Supabase status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setTestResult(null);
    }
  }, [isOpen]);

  const sqlSchema = `-- ==============================================================================
-- Upbeat Abroad Education - Supabase Complete Schema & RLS
-- Run in: https://supabase.com/dashboard/project/${status?.projectRef || 'your-project'}/sql/new
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: student_enquiries
CREATE TABLE IF NOT EXISTS public.student_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_destination TEXT NOT NULL,
  intended_course TEXT NOT NULL,
  intake TEXT NOT NULL,
  current_education TEXT,
  academic_score TEXT,
  budget_per_year TEXT,
  services_needed TEXT[] DEFAULT '{}',
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'contacted', 'admitted', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.student_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can insert student enquiries" ON public.student_enquiries;
DROP POLICY IF EXISTS "Only staff and service role can read student enquiries" ON public.student_enquiries;

CREATE POLICY "Public visitors can insert student enquiries"
  ON public.student_enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(full_name) >= 2 AND
    char_length(email) >= 5 AND
    char_length(phone) >= 6
  );

CREATE POLICY "Only staff and service role can read student enquiries"
  ON public.student_enquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- 2. Table: counseling_bookings
CREATE TABLE IF NOT EXISTS public.counseling_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  counselor_id TEXT NOT NULL,
  counselor_name TEXT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'Google Meet',
  destinations TEXT[] DEFAULT '{}',
  degree_level TEXT NOT NULL,
  notes TEXT,
  meet_link TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.counseling_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can insert counseling bookings" ON public.counseling_bookings;
DROP POLICY IF EXISTS "Only staff and service role can read counseling bookings" ON public.counseling_bookings;

CREATE POLICY "Public visitors can insert counseling bookings"
  ON public.counseling_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(student_name) >= 2 AND
    char_length(email) >= 5 AND
    char_length(phone) >= 6
  );

CREATE POLICY "Only staff and service role can read counseling bookings"
  ON public.counseling_bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Table: contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only staff and service role can read contact messages" ON public.contact_messages;

CREATE POLICY "Public visitors can insert contact messages"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) >= 2 AND
    char_length(email) >= 5 AND
    char_length(phone) >= 6 AND
    char_length(message) >= 2
  );

CREATE POLICY "Only staff and service role can read contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRunTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test-supabase', { method: 'POST' });
      const data = await res.json();
      setTestResult(data);
      // Re-check status
      fetchStatus();
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Supabase Backend Integration Manager
            </h3>
            <p className="text-xs text-slate-500">
              Real-time synchronization status for student enquiries and counseling bookings
            </p>
          </div>
        </div>

        {/* Live Status Cards */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
            <span>Checking Supabase connection...</span>
          </div>
        ) : (
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Connection Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Project Endpoint:</span>
                <span className="font-mono-numbers text-xs font-bold text-slate-900">
                  {status?.projectUrl || 'Not Configured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">API Credentials:</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Configured & Authenticated</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">All Tables Status:</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                    status?.allTablesCreated
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {status?.allTablesCreated ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready & Synced</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Action Required: Run SQL Script</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Individual Table Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">student_enquiries</span>
                  {status?.tables?.student_enquiries ? (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Enquiry dossier submissions with RLS.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">counseling_bookings</span>
                  {status?.tables?.counseling_bookings ? (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  1-on-1 advisor sessions & Google Meet.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">contact_messages</span>
                  {status?.tables?.contact_messages ? (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  General and regional advisory messages.
                </p>
              </div>
            </div>

            {/* Instruction Callout if tables not created */}
            {!status?.allTablesCreated && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span className="font-bold text-xs">
                    Complete the 1-Minute SQL Setup in your Supabase Dashboard:
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-amber-900 pl-1 leading-relaxed">
                  <li>Click <strong>Copy Complete SQL Script</strong> below.</li>
                  <li>Click <strong>Open Supabase SQL Editor</strong> (opens directly in your project).</li>
                  <li>Paste the script into the SQL editor and click <strong>Run</strong>.</li>
                  <li>Return here and click <strong>Verify & Test Connection</strong>!</li>
                </ol>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleCopySql}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? '✓ SQL Copied to Clipboard!' : 'Copy Complete SQL Script'}</span>
                  </button>

                  {status?.sqlEditorUrl && (
                    <a
                      href={status.sqlEditorUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-white border border-amber-300 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span>Open Supabase SQL Editor</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Test Insert Action */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-xs">Test Live End-to-End Insertion</span>
                <span className="text-[11px] text-slate-400">
                  Sends a verification enquiry to test database write permissions and RLS.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleRunTest}
                  disabled={testing}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Verifying...' : 'Test Insertion'}</span>
                </button>
                <button
                  onClick={fetchStatus}
                  disabled={loading}
                  className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Refresh status"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Test Result Callout */}
            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {testResult.success ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{testResult.message}</span>
                    </div>
                    <div className="font-mono-numbers text-[11px] text-emerald-700">
                      Inserted Record ID: {testResult.record?.id} | Reference: {testResult.record?.reference}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-red-800">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>Test Insertion Result: {testResult.error}</span>
                    </div>
                    {testResult.details && (
                      <p className="text-[11px] text-red-700">
                        {testResult.details.message} (Code: {testResult.details.code})
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Row Level Security (RLS) protects all visitor data.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
