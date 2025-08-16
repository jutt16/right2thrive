"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

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

export default function UploadWeeklyGoals() {
  // assigned therapist (locked from localStorage)
  const [selectedTherapist, setSelectedTherapist] = useState<string>("");
  const [selectedTherapistDetails, setSelectedTherapistDetails] =
    useState<TherapistDetails | null>(null);
  const [isLoadingTherapistDetails, setIsLoadingTherapistDetails] =
    useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [rows, setRows] = useState<WeeklyGoalRow[]>(
    Array.from({ length: 5 }, (_, i) => ({
      number: i + 1,
      goal: "",
      how: "",
      outcome: "",
    }))
  );
  const [reflection, setReflection] = useState("");

  // read therapist from localStorage (prefer "therapist", fallback "auth.therapist")
  useEffect(() => {
    if (typeof window === "undefined") return;

    // must be logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      setError("You must be logged in.");
      return;
    }

    let stored: any = null;
    const tRaw = localStorage.getItem("therapist");
    if (tRaw) {
      try {
        stored = JSON.parse(tRaw);
      } catch {}
    }
    if (!stored) {
      const authRaw = localStorage.getItem("auth");
      if (authRaw) {
        try {
          const parsed = JSON.parse(authRaw);
          if (parsed?.therapist) stored = parsed.therapist;
        } catch {}
      }
    }

    if (stored?.id) {
      const tid = String(stored.id);
      setSelectedTherapist(tid);
      fetchTherapistDetails(tid);
    } else {
      setSelectedTherapist("");
    }
  }, []);

  const fetchTherapistDetails = async (therapistId: string) => {
    setIsLoadingTherapistDetails(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/therapists/${therapistId}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch therapist details");
      }
      setSelectedTherapistDetails(data.data?.therapist ?? null);
    } catch (e) {
      setSelectedTherapistDetails(null);
      setError(
        e instanceof Error ? e.message : "Failed to load therapist details"
      );
    } finally {
      setIsLoadingTherapistDetails(false);
    }
  };

  const getTherapistDisplayName = (t?: TherapistDetails | null) => {
    if (!t) return "—";
    const full = `${t.first_name ?? ""} ${t.last_name ?? ""}`.trim();
    return full || "—";
  };

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
      prev.length >= MAX_ROWS
        ? prev
        : [...prev, { number: prev.length + 1, goal: "", how: "", outcome: "" }]
    );

  const removeRowByIndex = (idx: number) =>
    setRows((prev) => {
      if (prev.length <= MIN_ROWS) return prev;
      const next = prev
        .filter((_, i) => i !== idx)
        .map((r, i) => ({ ...r, number: i + 1 }));
      return next;
    });

  // autosize helper
  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!selectedTherapist) {
      setSubmitError(
        "We couldn’t find your assigned therapist. Please contact support."
      );
      return;
    }

    const hasAnyInput =
      rows.some((r) => r.goal.trim() || r.how.trim() || r.outcome.trim()) ||
      reflection.trim();
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
        therapist_id: Number(selectedTherapist),
        goals: rows.map(({ number, goal, how, outcome }) => ({
          number,
          goal,
          how,
          outcome,
        })),
        reflection,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/weekly-goals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to submit weekly goals.");

      setSubmitSuccess("Weekly goals submitted successfully!");
      setRows((prev) =>
        prev.map((r) => ({ ...r, goal: "", how: "", outcome: "" }))
      );
      setReflection("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during submission."
      );
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
            <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-1">
              My Weekly Goals
            </h2>
            <p className="text-xs md:text-sm text-gray-700">
              <span className="font-semibold">Instructions:</span> Write your
              goals for the week and note how it went.
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

        {/* Your Therapist (read-only, from localStorage) */}
        <div className="mt-4 md:mt-5 mb-4 md:mb-5">
          <label className="block text-sm text-gray-700 mb-1">
            Your Therapist
          </label>

          <div className="w-full border border-blue-300 rounded-md px-3 py-2 text-gray-800 text-sm bg-white">
            {isLoadingTherapistDetails ? (
              <p className="text-gray-500">Loading therapist details…</p>
            ) : selectedTherapist ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <User2 className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Name:</strong>{" "}
                    {getTherapistDisplayName(selectedTherapistDetails)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Email:</strong>{" "}
                    {selectedTherapistDetails?.email ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <VenetianMask className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Gender:</strong>{" "}
                    {selectedTherapistDetails?.profile?.gender ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Culture:</strong>{" "}
                    {selectedTherapistDetails?.profile?.cultural_background ??
                      "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Telephone:</strong>{" "}
                    {selectedTherapistDetails?.profile?.telephone ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Mobile:</strong>{" "}
                    {selectedTherapistDetails?.profile?.mobile ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Address:</strong>{" "}
                    {selectedTherapistDetails?.profile?.address ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Country:</strong>{" "}
                    {selectedTherapistDetails?.profile?.country ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Qualifications:</strong>{" "}
                    {selectedTherapistDetails?.profile?.qualifications ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Experience:</strong>{" "}
                    {selectedTherapistDetails?.profile?.experience ?? "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                No therapist found in your account. Please contact support if
                this is unexpected.
              </p>
            )}
          </div>

          {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
        </div>

        {/* MOBILE layout (cards) */}
        <div className="space-y-3 md:hidden">
          {rows.map((row, idx) => {
            const disableRowDelete = rows.length <= MIN_ROWS;
            return (
              <div key={row.number} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Goal {row.number}
                  </span>
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

                <label className="block text-xs text-gray-600 mb-1">
                  My Goal for This Week
                </label>
                <textarea
                  rows={2}
                  ref={autoResize as any}
                  onInput={(e) => autoResize(e.currentTarget)}
                  placeholder="Write your answer…"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={row.goal}
                  onChange={(e) => updateRow(idx, "goal")(e.target.value)}
                />

                <label className="block text-xs text-gray-600 mt-3 mb-1">
                  How Will I Do It?
                </label>
                <textarea
                  rows={2}
                  ref={autoResize as any}
                  onInput={(e) => autoResize(e.currentTarget)}
                  placeholder="Write your answer…"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={row.how}
                  onChange={(e) => updateRow(idx, "how")(e.target.value)}
                />

                <label className="block text-xs text-gray-600 mt-3 mb-1">
                  How Did It Go? (What I learned, tried, or enjoyed)
                </label>
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

          <div className="text-right text-sm text-gray-600">
            Rows: <strong>{rows.length}</strong> (min {MIN_ROWS}, max {MAX_ROWS}
            )
          </div>
        </div>

        {/* DESKTOP layout (table) */}
        <div className="overflow-x-auto mb-6 hidden md:block">
          <table className="min-w-full border border-gray-200 rounded-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-24 border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                  Goal No.
                </th>
                <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                  My Goal for This Week
                </th>
                <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                  How Will I Do It?
                </th>
                <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                  How Did It Go?{" "}
                  <span className="font-normal">
                    (What I learned, tried, or enjoyed)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const disableRowDelete = rows.length <= MIN_ROWS;
                return (
                  <tr key={row.number} className="align-top">
                    <td className="border-t border-gray-200 px-3 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="inline-block min-w-[1.25rem]">
                          {row.number}
                        </span>
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
                        onChange={(e) =>
                          updateRow(idx, "outcome")(e.target.value)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-end gap-2 mt-3 text-sm text-gray-600">
            <span>
              Rows: <strong>{rows.length}</strong> (min {MIN_ROWS}, max{" "}
              {MAX_ROWS})
            </span>
          </div>
        </div>

        {/* Weekly Reflection */}
        <div className="mb-20 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-2">
            Weekly Reflection
          </h3>
          <ul className="list-disc ml-5 text-gray-800 mb-2">
            <li className="font-medium text-sm md:text-base">
              What was the best part of my week?
            </li>
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

        {/* Sticky submit on mobile / normal on desktop */}
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
            <span>
              {isSubmitting ? "Submitting..." : "Submit Weekly Goals"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
