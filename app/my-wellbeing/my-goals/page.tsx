'use client';

import { useEffect, useState } from 'react';
import { FileDown, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { getApiUrl } from "@/lib/api-client";

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

export default function Download() {
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }

        const res = await fetch(getApiUrl("/api/weekly-goals"), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const text = await res.text();
        let data: any;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error('Invalid JSON from server.');
        }

        if (!res.ok || data?.success !== true) {
          throw new Error(data?.message || 'Failed to load weekly goals.');
        }

        setGoals(Array.isArray(data.data) ? data.data : []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load weekly goals.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const toggleExpand = (id: number) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">My Weekly Goals</h2>

      {loading && (
        <p className="text-center text-gray-500">Loading…</p>
      )}

      {!loading && error && (
        <p className="text-center text-red-600">{error}</p>
      )}

      {!loading && !error && goals.length === 0 && (
        <p className="text-center text-gray-500">No weekly goals submitted yet.</p>
      )}

      {!loading && !error && goals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((item) => {
            const isOpen = !!expanded[item.id];
            const submitted = item.submitted_at || item.created_at;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-5 transition hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Submitted on</p>
                    <p className="text-md font-semibold text-gray-800">
                      {fmt(submitted)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Therapist: <span className="font-medium">{item.therapist_name || '—'}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Goals: <span className="font-medium">{item.goals_count ?? item.goals?.length ?? 0}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadJSON(item)}
                      className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition"
                      title="Download JSON"
                    >
                      <FileDown className="w-4 h-4" />
                      JSON
                    </button>

                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      title={isOpen ? 'Hide details' : 'View details'}
                    >
                      <Eye className="w-4 h-4" />
                      {isOpen ? (
                        <>
                          Hide <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4">
                    {/* Goals Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-md">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="w-16 border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                              #
                            </th>
                            <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                              My Goal for This Week
                            </th>
                            <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                              How Will I Do It?
                            </th>
                            <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                              How Did It Go?
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(item.goals || []).map((r) => (
                            <tr key={r.number} className="align-top">
                              <td className="border-t border-gray-200 px-3 py-3 text-sm text-gray-700">
                                {r.number}
                              </td>
                              <td className="border-t border-gray-200 px-3 py-2 text-sm">
                                {r.goal || <span className="text-gray-400">—</span>}
                              </td>
                              <td className="border-t border-gray-200 px-3 py-2 text-sm">
                                {r.how || <span className="text-gray-400">—</span>}
                              </td>
                              <td className="border-t border-gray-200 px-3 py-2 text-sm">
                                {r.outcome || <span className="text-gray-400">—</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Reflection */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Weekly Reflection
                      </h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {item.reflection || <span className="text-gray-400">—</span>}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
