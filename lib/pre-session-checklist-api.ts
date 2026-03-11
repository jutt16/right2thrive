/**
 * Pre-session checklist API (patient).
 * GET /api/pre-session-checklist – config items + upcoming_booking
 * POST /api/pre-session-checklist – submit checklist
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

export interface UpcomingBooking {
  id: number;
  date: string;
  start_time: string;
}

export interface PreSessionChecklistResponse {
  success: boolean;
  data?: {
    items: string[];
    upcoming_booking?: UpcomingBooking | null;
  };
  message?: string;
}

/**
 * Get checklist config items and optional upcoming booking.
 * GET /api/pre-session-checklist
 */
export async function getPreSessionChecklist(): Promise<{
  items: string[];
  upcoming_booking: UpcomingBooking | null;
}> {
  const res = await fetch(`${API_BASE}/api/pre-session-checklist`, {
    headers: getAuthHeaders(),
  });
  const json: PreSessionChecklistResponse = await res.json();
  if (!json.success || !json.data) {
    return { items: [], upcoming_booking: null };
  }
  return {
    items: Array.isArray(json.data.items) ? json.data.items : [],
    upcoming_booking: json.data.upcoming_booking ?? null,
  };
}

/**
 * Submit pre-session checklist.
 * POST /api/pre-session-checklist
 * body: { booking_id?: number, items: string[] }
 */
export async function submitPreSessionChecklist(params: {
  booking_id?: number | null;
  items: string[];
}): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/api/pre-session-checklist`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      booking_id: params.booking_id ?? undefined,
      items: params.items,
    }),
  });
  const json = await res.json();
  return {
    success: json.success === true,
    message: json.message,
  };
}
