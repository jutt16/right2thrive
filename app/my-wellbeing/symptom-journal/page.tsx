"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Loader2, Plus, Calendar, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getSymptomJournalOptions,
  getSymptomJournalEntries,
  createSymptomJournalEntry,
  type SymptomJournalEntry as Entry,
} from "@/lib/symptom-journal-api";

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return s;
  }
}

export default function SymptomJournalPage() {
  const router = useRouter();
  const [options, setOptions] = useState<{ mood_options: string[]; symptom_options: string[] }>({
    mood_options: [],
    symptom_options: [],
  });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [formDate, setFormDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [formMood, setFormMood] = useState("");
  const [formSymptoms, setFormSymptoms] = useState<string[]>([]);
  const [formNotes, setFormNotes] = useState("");

  const load = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    Promise.all([
      getSymptomJournalOptions(),
      getSymptomJournalEntries(from || to ? { from: from || undefined, to: to || undefined } : undefined),
    ])
      .then(([opt, ent]) => {
        setOptions(opt);
        setEntries(ent);
      })
      .catch(() => setError("Failed to load."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("token")) {
      router.replace("/auth/login");
      return;
    }
    load();
  }, [router]);

  useEffect(() => {
    if (!loading && (from || to)) {
      getSymptomJournalEntries({ from: from || undefined, to: to || undefined })
        .then(setEntries)
        .catch(() => {});
    }
  }, [from, to]);

  const toggleSymptom = (s: string) => {
    setFormSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMood.trim()) {
      setError("Please select a mood.");
      return;
    }
    setSubmitting(true);
    setError("");
    const result = await createSymptomJournalEntry({
      date: formDate,
      mood: formMood.trim(),
      symptoms: formSymptoms,
      notes: formNotes.trim() || undefined,
    });
    setSubmitting(false);
    if (result.success) {
      setShowForm(false);
      setFormMood("");
      setFormSymptoms([]);
      setFormNotes("");
      setFormDate(new Date().toISOString().slice(0, 10));
      if (result.data) setEntries((prev) => [result.data!, ...prev]);
    } else {
      setError(result.message ?? "Failed to save entry.");
    }
  };

  if (typeof window !== "undefined" && !localStorage.getItem("token")) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/my-wellbeing/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#00990d] hover:text-[#007a0a] mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-900">
            <BookOpen className="h-6 w-6 text-[#00990d]" />
            <h1 className="text-2xl font-bold tracking-tight">Symptom journal</h1>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#00990d] hover:bg-[#008008]"
          >
            <Plus className="h-4 w-4 mr-2" />
            New entry
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mb-4">
            {error}
          </p>
        )}

        {/* Date filter */}
        <Card className="mb-6 border-slate-200/90 bg-white shadow-sm">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-500">From</Label>
                <Input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">To</Label>
                <Input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New entry form */}
        {showForm && (
          <Card className="mb-6 border-[#00990d]/30 bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">New journal entry</CardTitle>
              <CardDescription>Record how you&apos;re feeling today.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitEntry} className="space-y-4">
                <div>
                  <Label htmlFor="journal-date">Date</Label>
                  <Input
                    id="journal-date"
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Smile className="h-4 w-4" />
                    Mood
                  </Label>
                  <select
                    value={formMood}
                    onChange={(e) => setFormMood(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select mood</option>
                    {options.mood_options.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                {options.symptom_options.length > 0 && (
                  <div>
                    <Label>Symptoms (optional)</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {options.symptom_options.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSymptom(s)}
                          className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                            formSymptoms.includes(s)
                              ? "bg-[#00990d]/10 border-[#00990d]/30 text-[#00990d]"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="journal-notes">Notes (optional)</Label>
                  <Textarea
                    id="journal-notes"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    rows={3}
                    className="mt-1 resize-none"
                    placeholder="Anything else you want to note..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting} className="bg-[#00990d] hover:bg-[#008008]">
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save entry"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setError("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Entries list */}
        <Card className="border-slate-200/90 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-500" />
              Your entries
            </CardTitle>
            <CardDescription>
              {entries.length === 0
                ? "No entries yet. Add one to start tracking."
                : `${entries.length} entr${entries.length === 1 ? "y" : "ies"}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#00990d]" />
              </div>
            ) : entries.length === 0 ? (
              <p className="text-slate-500 text-sm py-6 text-center">
                No journal entries in this range.
              </p>
            ) : (
              <ul className="space-y-3">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">
                        {formatDate(entry.date)}
                      </span>
                      <span className="text-sm text-[#00990d] font-medium capitalize">
                        {entry.mood}
                      </span>
                    </div>
                    {entry.symptoms && entry.symptoms.length > 0 && (
                      <p className="text-sm text-slate-600 mb-1">
                        {entry.symptoms.join(", ")}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-slate-500 mt-1">{entry.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
