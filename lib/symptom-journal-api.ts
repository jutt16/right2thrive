/**
 * Symptom journal API (patient).
 * GET /api/symptom-journal – list entries (query: from, to)
 * POST /api/symptom-journal – create entry
 * GET /api/symptom-journal/options – mood_options, symptom_options for forms
 */

const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
    : process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export interface SymptomJournalEntry {
  id: number;
  patient_id: number;
  date: string;
  mood: string;
  symptoms: string[];
  notes?: string | null;
  created_at?: string;
}

export interface SymptomJournalOptions {
  mood_options: string[];
  symptom_options: string[];
}

/**
 * Get mood and symptom options for the form.
 * GET /api/symptom-journal/options
 */
export async function getSymptomJournalOptions(): Promise<SymptomJournalOptions> {
  const res = await fetch(`${API_BASE}/api/symptom-journal/options`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  const d = json.data ?? json;
  return {
    mood_options: Array.isArray(d?.mood_options) ? d.mood_options : [],
    symptom_options: Array.isArray(d?.symptom_options) ? d.symptom_options : [],
  };
}

/**
 * List journal entries with optional date range.
 * GET /api/symptom-journal?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function getSymptomJournalEntries(params?: {
  from?: string;
  to?: string;
}): Promise<SymptomJournalEntry[]> {
  const search = new URLSearchParams();
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  const query = search.toString();
  const url = `${API_BASE}/api/symptom-journal${query ? `?${query}` : ""}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  const json = await res.json();
  if (!json.success) return [];
  const list = json.data?.entries ?? json.data ?? json.entries;
  return Array.isArray(list) ? list : [];
}

/**
 * Create a symptom journal entry.
 * POST /api/symptom-journal
 * body: { date: string (YYYY-MM-DD), mood: string, symptoms: string[], notes?: string }
 */
export async function createSymptomJournalEntry(params: {
  date: string;
  mood: string;
  symptoms: string[];
  notes?: string | null;
}): Promise<{ success: boolean; data?: SymptomJournalEntry; message?: string }> {
  const res = await fetch(`${API_BASE}/api/symptom-journal`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      date: params.date,
      mood: params.mood,
      symptoms: params.symptoms,
      notes: params.notes ?? "",
    }),
  });
  const json = await res.json();
  return {
    success: json.success === true,
    data: json.data,
    message: json.message,
  };
}
