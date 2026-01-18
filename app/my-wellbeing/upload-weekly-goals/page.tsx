'use client';

import { useEffect, useState } from 'react';
import {
  User2,
  Mail,
  Globe,
  VenetianMask,
  Phone,
  Smartphone,
  MapPin,
  Landmark,
  GraduationCap,
  Briefcase,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  FileDown,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type GoalRow = {
  number: number;
  goal?: string | null;
  how?: string | null;
  outcome?: string | null;
};

type WeeklyGoal = {
  id: number;
  therapist_id?: number;
  therapist_name?: string | null;
  goals_count?: number;
  goals: GoalRow[];
  reflection?: string | null;
  submitted_at?: string | null; // ISO
  created_at?: string | null;   // ISO
  updated_at?: string | null;   // ISO
};

interface TherapistProfile {
  id: number;
  user_id: string;
  date_of_birth?: string | null;
  gender?: string | null;
  cultural_background?: string | null;
  telephone?: string | null;
  mobile?: string | null;
  employment_status?: string | null;
  country?: string | null;
  address?: string | null;
  qualifications?: string | null;
  experience?: string | null;
}

interface TherapistDetails {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  profile?: TherapistProfile | null;
}

interface WeeklyGoalRow {
  number: number;
  goal: string;
  how: string;
  outcome: string;
}

const MAX_ROWS = 20;
const MIN_ROWS = 1;

export default function WeeklyGoalsPage() {
  // Therapist info
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [selectedTherapistDetails, setSelectedTherapistDetails] = useState<TherapistDetails | null>(null);
  const [isLoadingTherapistDetails, setIsLoadingTherapistDetails] = useState(false);
  const [error, setError] = useState('');

  // Form
  const [rows, setRows] = useState<WeeklyGoalRow[]>(Array.from({ length: 5 }, (_, i) => ({
    number: i + 1,
    goal: '',
    how: '',
    outcome: '',
  })));
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Submitted weekly goals
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [goalsError, setGoalsError] = useState<string | null>(null);

  // -------------------- Therapist Setup --------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      setError('You must be logged in.');
      return;
    }

    let stored: any = null;
    const tRaw = localStorage.getItem('therapist');
    if (tRaw) stored = JSON.parse(tRaw);
    if (!stored) {
      const authRaw = localStorage.getItem('auth');
      if (authRaw) {
        const parsed = JSON.parse(authRaw);
        if (parsed?.therapist) stored = parsed.therapist;
      }
    }

    if (stored?.id) {
      const tid = String(stored.id);
      setSelectedTherapist(tid);
      fetchTherapistDetails(tid);
    } else {
      setSelectedTherapist('');
    }
  }, []);

  const fetchTherapistDetails = async (therapistId: string) => {
    setIsLoadingTherapistDetails(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/therapists/${therapistId}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch therapist details');
      setSelectedTherapistDetails(data.data?.therapist ?? null);
    } catch (e) {
      setSelectedTherapistDetails(null);
      setError(e instanceof Error ? e.message : 'Failed to load therapist details');
    } finally {
      setIsLoadingTherapistDetails(false);
    }
  };

  const getTherapistDisplayName = (t?: TherapistDetails | null) => {
    if (!t) return '—';
    const full = `${t.first_name ?? ''} ${t.last_name ?? ''}`.trim();
    return full || '—';
  };

  // -------------------- Form Handlers --------------------
  const updateRow = (idx: number, key: keyof Omit<WeeklyGoalRow, 'number'>) => (value: string) => {
    setRows(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  };
  const addRow = () => setRows(prev => prev.length >= MAX_ROWS ? prev : [...prev, { number: prev.length + 1, goal: '', how: '', outcome: '' }]);
  const removeRowByIndex = (idx: number) => setRows(prev => {
    if (prev.length <= MIN_ROWS) return prev;
    const next = prev.filter((_, i) => i !== idx).map((r, i) => ({ ...r, number: i + 1 }));
    return next;
  });

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!selectedTherapist) {
      setSubmitError('We couldn’t find your assigned therapist. Please contact support.');
      return;
    }

    const hasAnyInput = rows.some(r => r.goal.trim() || r.how.trim() || r.outcome.trim()) || reflection.trim();
    if (!hasAnyInput) {
      setSubmitError('Please fill at least one goal or the reflection.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitError('You must be logged in to submit.');
        return;
      }
      const payload = { therapist_id: Number(selectedTherapist), goals: rows.map(({ number, goal, how, outcome }) => ({ number, goal, how, outcome })), reflection };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weekly-goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to submit weekly goals.');

      setSubmitSuccess('Weekly goals submitted successfully!');
      setRows(prev => prev.map(r => ({ ...r, goal: '', how: '', outcome: '' })));
      setReflection('');
      fetchGoals(); // refresh the list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unexpected error during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- Fetch Submitted Goals --------------------
  const fetchGoals = async () => {
    setLoadingGoals(true);
    setGoalsError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You are not logged in.');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weekly-goals`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch { throw new Error('Invalid JSON from server.'); }

      if (!res.ok || data?.success !== true) throw new Error(data?.message || 'Failed to load weekly goals.');
      setGoals(Array.isArray(data.data) ? data.data : []);
    } catch (e: any) {
      setGoalsError(e?.message || 'Failed to load weekly goals.');
    } finally {
      setLoadingGoals(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const toggleExpand = (id: number) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const fmt = (iso?: string | null) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  };

  const downloadJSON = (item: WeeklyGoal) => {
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const datePart = (item.submitted_at || item.created_at || '').slice(0, 10);
    a.download = `weekly-goals-${item.id}-${datePart}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // -------------------- Render --------------------
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* --- Submit Weekly Goals --- */}
      <div className="bg-white shadow-xl rounded-2xl border border-yellow-400 p-4 md:p-6 mb-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-1">My Weekly Goals</h2>
            <p className="text-xs md:text-sm text-gray-700">
              <span className="font-semibold">Instructions:</span> Write your goals for the week and note how it went.
            </p>
          </div>
          <button onClick={addRow} disabled={rows.length >= MAX_ROWS} className="inline-flex items-center justify-center rounded-full border border-blue-300 w-9 h-9 hover:bg-blue-50 active:scale-95 transition disabled:opacity-50" title="Add row">
            <Plus className="w-5 h-5"/>
          </button>
        </div>

        {/* Therapist Info */}
        <div className="mt-4 md:mt-5 mb-4 md:mb-5">
          <label className="block text-sm text-gray-700 mb-1">Your Wellbeing Coach</label>
          <div className="w-full border border-blue-300 rounded-md px-3 py-2 text-gray-800 text-sm bg-white">
            {isLoadingTherapistDetails ? <p className="text-gray-500">Loading therapist details…</p> : selectedTherapist ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2"><User2 className="w-4 h-4 text-blue-600"/><span><strong>Name:</strong> {getTherapistDisplayName(selectedTherapistDetails)}</span></div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600"/><span><strong>Email:</strong> {selectedTherapistDetails?.email ?? 'N/A'}</span></div>
                <div className="flex items-center gap-2"><VenetianMask className="w-4 h-4 text-blue-600"/><span><strong>Gender:</strong> {selectedTherapistDetails?.profile?.gender ?? 'N/A'}</span></div>
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-600"/><span><strong>Culture:</strong> {selectedTherapistDetails?.profile?.cultural_background ?? 'N/A'}</span></div>
              </div>
            ) : <p className="text-gray-500">No therapist found. Contact support.</p>}
            {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
          </div>
        </div>

        {/* Form Table */}
        <div className="overflow-x-auto mb-6 hidden md:block">
          <table className="min-w-full border border-gray-200 rounded-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-24 border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">Goal No.</th>
                <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">My Goal for This Week</th>
                <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">How Will I Do It?</th>
                <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">How Did It Go?</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.number} className="align-top">
                  <td className="border-t border-gray-200 px-3 py-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="inline-block min-w-[1.25rem]">{row.number}</span>
                      <button type="button" onClick={() => removeRowByIndex(idx)} className="inline-flex items-center justify-center rounded-full border border-gray-300 w-7 h-7 hover:bg-gray-50 active:scale-95 transition disabled:opacity-50" disabled={rows.length <= MIN_ROWS}><Minus className="w-4 h-4"/></button>
                    </div>
                  </td>
                  <td className="border-t border-gray-200 px-3 py-2"><textarea rows={3} onInput={(e)=>autoResize(e.currentTarget)} placeholder="Write your answer…" className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={row.goal} onChange={e=>updateRow(idx,'goal')(e.target.value)}/></td>
                  <td className="border-t border-gray-200 px-3 py-2"><textarea rows={3} onInput={(e)=>autoResize(e.currentTarget)} placeholder="Write your answer…" className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={row.how} onChange={e=>updateRow(idx,'how')(e.target.value)}/></td>
                  <td className="border-t border-gray-200 px-3 py-2"><textarea rows={3} onInput={(e)=>autoResize(e.currentTarget)} placeholder="Write your answer…" className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={row.outcome} onChange={e=>updateRow(idx,'outcome')(e.target.value)}/></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-end gap-2 mt-3 text-sm text-gray-600">Rows: <strong>{rows.length}</strong> (min {MIN_ROWS}, max {MAX_ROWS})</div>
        </div>

        {/* Reflection */}
        <div className="mb-6">
          <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-2">Weekly Reflection</h3>
          <textarea rows={3} onInput={(e)=>autoResize(e.currentTarget)} placeholder="Write your answer…" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={reflection} onChange={e=>setReflection(e.target.value)}/>
        </div>

        {/* Alerts */}
        {submitError && <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-3 text-sm"><AlertCircle className="w-4 h-4"/><span>{submitError}</span></div>}
        {submitSuccess && <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-3 text-sm"><CheckCircle2 className="w-4 h-4"/><span>{submitSuccess}</span></div>}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button onClick={handleSubmit} disabled={isSubmitting} className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-xl">
            <UploadCloud className="w-5 h-5"/>
            {isSubmitting ? 'Submitting…' : 'Submit Weekly Goals'}
          </button>
        </div>
      </div>

      {/* --- View Submitted Goals --- */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center">My Submitted Weekly Goals</h2>

        {loadingGoals && <p className="text-center text-gray-500">Loading…</p>}
        {!loadingGoals && goalsError && <p className="text-center text-red-600">{goalsError}</p>}
        {!loadingGoals && !goalsError && goals.length === 0 && <p className="text-center text-gray-500">No weekly goals submitted yet.</p>}

        {!loadingGoals && !goalsError && goals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map(item => {
              const isOpen = !!expanded[item.id];
              const submitted = item.submitted_at || item.created_at;
              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-5 transition hover:shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Submitted on</p>
                      <p className="text-md font-semibold text-gray-800">{fmt(submitted)}</p>
                      <p className="text-sm text-gray-600">Therapist: <span className="font-medium">{item.therapist_name || '—'}</span></p>
                      <p className="text-sm text-gray-600">Goals: <span className="font-medium">{item.goals_count ?? item.goals?.length ?? 0}</span></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => downloadJSON(item)} className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition" title="Download JSON"><FileDown className="w-4 h-4"/>JSON</button>
                      <button onClick={() => toggleExpand(item.id)} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition" title={isOpen ? 'Hide details' : 'View details'}>
                        <Eye className="w-4 h-4"/>{isOpen ? <>Hide <ChevronUp className="w-4 h-4"/></> : <>View <ChevronDown className="w-4 h-4"/></>}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-md">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="w-16 border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">#</th>
                              <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">My Goal for This Week</th>
                              <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">How Will I Do It?</th>
                              <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">How Did It Go?</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(item.goals || []).map(r => (
                              <tr key={r.number} className="align-top">
                                <td className="border-t border-gray-200 px-3 py-3 text-sm text-gray-700">{r.number}</td>
                                <td className="border-t border-gray-200 px-3 py-2 text-sm">{r.goal || <span className="text-gray-400">—</span>}</td>
                                <td className="border-t border-gray-200 px-3 py-2 text-sm">{r.how || <span className="text-gray-400">—</span>}</td>
                                <td className="border-t border-gray-200 px-3 py-2 text-sm">{r.outcome || <span className="text-gray-400">—</span>}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">Weekly Reflection</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.reflection || <span className="text-gray-400">—</span>}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
