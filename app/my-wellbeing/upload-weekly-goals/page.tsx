"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  User2, Mail, Globe, VenetianMask, Phone, Smartphone, MapPin, Landmark,
  GraduationCap, Briefcase, UploadCloud, CheckCircle2, AlertCircle, Plus, Minus
} from "lucide-react";

interface Therapist {
  id: number;
  name?: string | null;
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  cultural_background?: string;
  telephone?: string;
  mobile?: string;
  address?: string;
  country?: string;
  qualifications?: string;
  experience?: string;
}
interface WeeklyGoalRow {
  number: number;
  goal: string;
  how: string;
  outcome: string;
}

const MAX_ROWS = 20;
const MIN_ROWS = 1;

export default function UploadWeeklyGoals() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoadingTherapists, setIsLoadingTherapists] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [rows, setRows] = useState<WeeklyGoalRow[]>(
    Array.from({ length: 5 }, (_, i) => ({ number: i + 1, goal: "", how: "", outcome: "" }))
  );
  const [reflection, setReflection] = useState("");

  const selectedTherapistObj = useMemo(
    () => therapists.find((t) => t.id.toString() === selectedTherapist),
    [therapists, selectedTherapist]
  );

  useEffect(() => {
    const fetchTherapists = async () => {
      setIsLoadingTherapists(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/therapists`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch therapists");
        if (data.success && Array.isArray(data.data?.therapists)) setTherapists(data.data.therapists);
        else throw new Error("No therapists available");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load therapists");
        setTherapists([]);
      } finally {
        setIsLoadingTherapists(false);
      }
    };
    fetchTherapists();
  }, []);

  const getTherapistDisplayName = (t: Therapist) =>
    t.name?.trim() ? t.name : `${t.first_name || ""} ${t.last_name || ""}`.trim();

  const updateRow =
    (idx: number, key: keyof Omit<WeeklyGoalRow, "number">) =>
    (value: string) => {
      setRows((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], [key]: value };
        return next;
      });
    };

  const addRow = () =>
    setRows((prev) =>
      prev.length >= MAX_ROWS ? prev : [...prev, { number: prev.length + 1, goal: "", how: "", outcome: "" }]
    );

  const removeRowByIndex = (idx: number) =>
    setRows((prev) => {
      if (prev.length <= MIN_ROWS) return prev;
      const next = prev.filter((_, i) => i !== idx).map((r, i) => ({ ...r, number: i + 1 }));
      return next;
    });

  // autosize helper
  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`; // cap height
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);
    if (!selectedTherapist) {
      setSubmitError("Please select a therapist.");
      return;
    }
    const hasAnyInput =
      rows.some((r) => r.goal.trim() || r.how.trim() || r.outcome.trim()) || reflection.trim();
    if (!hasAnyInput) {
      setSubmitError("Please fill at least one goal or the reflection.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setSubmitError("You must be logged in to submit.");
        return;
      }
      const payload = {
        therapist_id: selectedTherapist,
        goals: rows.map(({ number, goal, how, outcome }) => ({ number, goal, how, outcome })),
        reflection,
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weekly-goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to submit weekly goals.");

      setSubmitSuccess("Weekly goals submitted successfully!");
      setRows((prev) => prev.map((r) => ({ ...r, goal: "", how: "", outcome: "" })));
      setReflection("");
      // scroll to top on mobile
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-3 md:px-4 py-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl border border-yellow-400 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-1">My Weekly Goals</h2>
            <p className="text-xs md:text-sm text-gray-700">
              <span className="font-semibold">Instructions:</span> Write your goals for the week and note how it went.
            </p>
          </div>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center justify-center rounded-full border border-blue-300 w-9 h-9 hover:bg-blue-50 active:scale-95 transition disabled:opacity-50"
            disabled={rows.length >= MAX_ROWS}
            title="Add row"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Therapist select */}
        <div className="mt-4 md:mt-5 mb-4 md:mb-5">
          <label className="block text-sm text-gray-700 mb-1">Select Therapist</label>
          <select
            className="w-full border border-blue-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={selectedTherapist}
            onChange={(e) => setSelectedTherapist(e.target.value)}
          >
            <option value="">-- Select --</option>
            {isLoadingTherapists && <option>Loading...</option>}
            {!isLoadingTherapists &&
              therapists.map((t) => (
                <option key={t.id} value={t.id}>
                  {getTherapistDisplayName(t)} - {t.cultural_background ?? "N/A"}
                </option>
              ))}
            {!isLoadingTherapists && therapists.length === 0 && (
              <option disabled>No therapists found</option>
            )}
          </select>
          {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
        </div>

        {/* Therapist details */}
        {selectedTherapistObj && (
          <div className="mb-5 p-3 md:p-4 border border-blue-200 rounded-lg bg-blue-50 text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2"><User2 className="w-4 h-4 text-blue-600" /><span><strong>Name:</strong> {getTherapistDisplayName(selectedTherapistObj)}</span></div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /><span><strong>Email:</strong> {selectedTherapistObj.email ?? "N/A"}</span></div>
            <div className="flex items-center gap-2"><VenetianMask className="w-4 h-4 text-blue-600" /><span><strong>Gender:</strong> {selectedTherapistObj.gender ?? "N/A"}</span></div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-600" /><span><strong>Culture:</strong> {selectedTherapistObj.cultural_background ?? "N/A"}</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600" /><span><strong>Telephone:</strong> {selectedTherapistObj.telephone ?? "N/A"}</span></div>
            <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-blue-600" /><span><strong>Mobile:</strong> {selectedTherapistObj.mobile ?? "N/A"}</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" /><span><strong>Address:</strong> {selectedTherapistObj.address ?? "N/A"}</span></div>
            <div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-blue-600" /><span><strong>Country:</strong> {selectedTherapistObj.country ?? "N/A"}</span></div>
            <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-600" /><span><strong>Qualifications:</strong> {selectedTherapistObj.qualifications ?? "N/A"}</span></div>
            <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-600" /><span><strong>Experience:</strong> {selectedTherapistObj.experience ?? "N/A"}</span></div>
          </div>
        )}

        {/* MOBILE layout (cards) */}
        <div className="space-y-3 md:hidden">
          {rows.map((row, idx) => {
            const disableRowDelete = rows.length <= MIN_ROWS;
            return (
              <div key={row.number} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Goal {row.number}</span>
                  <button
                    type="button"
                    onClick={() => removeRowByIndex(idx)}
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 w-7 h-7 hover:bg-gray-50 active:scale-95 transition disabled:opacity-50"
                    disabled={disableRowDelete}
                    title={`Remove row ${row.number}`}
                    aria-label={`Remove row ${row.number}`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>

                <label className="block text-xs text-gray-600 mb-1">My Goal for This Week</label>
                <textarea
                  rows={2}
                  ref={autoResize as any}
                  onInput={(e) => autoResize(e.currentTarget)}
                  placeholder="Write your answer…"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={row.goal}
                  onChange={(e) => updateRow(idx, "goal")(e.target.value)}
                />

                <label className="block text-xs text-gray-600 mt-3 mb-1">How Will I Do It?</label>
                <textarea
                  rows={2}
                  ref={autoResize as any}
                  onInput={(e) => autoResize(e.currentTarget)}
                  placeholder="Write your answer…"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={row.how}
                  onChange={(e) => updateRow(idx, "how")(e.target.value)}
                />

                <label className="block text-xs text-gray-600 mt-3 mb-1">How Did It Go? (What I learned, tried, or enjoyed)</label>
                <textarea
                  rows={2}
                  ref={autoResize as any}
                  onInput={(e) => autoResize(e.currentTarget)}
                  placeholder="Write your answer…"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={row.outcome}
                  onChange={(e) => updateRow(idx, "outcome")(e.target.value)}
                />
              </div>
            );
          })}

          <div className="text-right text-sm text-gray-600">Rows: <strong>{rows.length}</strong> (min {MIN_ROWS}, max {MAX_ROWS})</div>
        </div>

        {/* DESKTOP layout (table) */}
        <div className="overflow-x-auto mb-6 hidden md:block">
          <table className="min-w-full border border-gray-200 rounded-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-24 border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">Goal No.</th>
                <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">My Goal for This Week</th>
                <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">How Will I Do It?</th>
                <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">How Did It Go? <span className="font-normal">(What I learned, tried, or enjoyed)</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const disableRowDelete = rows.length <= MIN_ROWS;
                return (
                  <tr key={row.number} className="align-top">
                    <td className="border-t border-gray-200 px-3 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="inline-block min-w-[1.25rem]">{row.number}</span>
                        <button
                          type="button"
                          onClick={() => removeRowByIndex(idx)}
                          className="inline-flex items-center justify-center rounded-full border border-gray-300 w-7 h-7 hover:bg-gray-50 active:scale-95 transition disabled:opacity-50"
                          disabled={disableRowDelete}
                          title="Remove this row"
                          aria-label={`Remove row ${row.number}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="border-t border-gray-200 px-3 py-2">
                      <textarea
                        rows={3}
                        onInput={(e) => autoResize(e.currentTarget)}
                        placeholder="Write your answer…"
                        className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={row.goal}
                        onChange={(e) => updateRow(idx, "goal")(e.target.value)}
                      />
                    </td>
                    <td className="border-t border-gray-200 px-3 py-2">
                      <textarea
                        rows={3}
                        onInput={(e) => autoResize(e.currentTarget)}
                        placeholder="Write your answer…"
                        className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={row.how}
                        onChange={(e) => updateRow(idx, "how")(e.target.value)}
                      />
                    </td>
                    <td className="border-t border-gray-200 px-3 py-2">
                      <textarea
                        rows={3}
                        onInput={(e) => autoResize(e.currentTarget)}
                        placeholder="Write your answer…"
                        className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={row.outcome}
                        onChange={(e) => updateRow(idx, "outcome")(e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-end gap-2 mt-3 text-sm text-gray-600">
            <span>Rows: <strong>{rows.length}</strong> (min {MIN_ROWS}, max {MAX_ROWS})</span>
          </div>
        </div>

        {/* Weekly Reflection */}
        <div className="mb-20 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-2">Weekly Reflection</h3>
          <ul className="list-disc ml-5 text-gray-800 mb-2">
            <li className="font-medium text-sm md:text-base">What was the best part of my week?</li>
          </ul>
          <textarea
            rows={3}
            onInput={(e) => autoResize(e.currentTarget)}
            placeholder="Write your answer…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
        </div>

        {/* Alerts */}
        {submitError && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-3 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{submitError}</span>
          </div>
        )}
        {submitSuccess && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-3 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitSuccess}</span>
          </div>
        )}

        {/* Sticky submit on mobile */}
        <div className="fixed md:static bottom-3 left-0 right-0 px-3">
          <div className="md:hidden mx-auto max-w-3xl">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl shadow-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Weekly Goals"}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="hidden md:flex w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 rounded justify-center items-center space-x-2 transition"
          >
            <UploadCloud className="h-5 w-5" />
            <span>{isSubmitting ? "Submitting..." : "Submit Weekly Goals"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
