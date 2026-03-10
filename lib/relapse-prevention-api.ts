/**
 * Relapse Prevention API (Patient)
 * GET /api/relapse-prevention – list sections
 * GET /api/patient/relapse-plan – own plan
 * PUT /api/patient/relapse-plan – save own plan
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
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// --- Types ---

export interface RelapsePreventionSection {
  id: number;
  title: string;
  content: string;
  display_order: number;
  is_active?: boolean;
}

export interface RelapsePreventionSectionsResponse {
  success: boolean;
  data: { sections: RelapsePreventionSection[] };
}

export interface PatientRelapsePlan {
  id?: number;
  early_signs?: string;
  coping_strategies?: string;
  emergency_contacts?: string;
  updated_at?: string;
}

export interface PatientRelapsePlanResponse {
  success: boolean;
  data: { plan: PatientRelapsePlan | null };
}

// --- API functions ---

/**
 * List relapse prevention sections (content from admin).
 * GET /api/relapse-prevention
 */
export async function getRelapsePreventionSections(): Promise<
  RelapsePreventionSection[]
> {
  const res = await fetch(`${API_BASE}/api/relapse-prevention`, {
    headers: getAuthHeaders(),
  });
  const json: RelapsePreventionSectionsResponse = await res.json();
  if (!json.success || !json.data?.sections) {
    return [];
  }
  return json.data.sections;
}

/**
 * Get the authenticated patient's own relapse plan.
 * GET /api/patient/relapse-plan
 */
export async function getPatientRelapsePlan(): Promise<PatientRelapsePlan | null> {
  const res = await fetch(`${API_BASE}/api/patient/relapse-plan`, {
    headers: getAuthHeaders(),
  });
  const json: PatientRelapsePlanResponse = await res.json();
  if (!json.success) return null;
  return json.data.plan ?? null;
}

/**
 * Save the authenticated patient's relapse plan.
 * PUT /api/patient/relapse-plan
 */
export async function savePatientRelapsePlan(
  plan: Partial<PatientRelapsePlan>
): Promise<{ success: true; plan: PatientRelapsePlan } | { success: false; message: string }> {
  const res = await fetch(`${API_BASE}/api/patient/relapse-plan`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      early_signs: plan.early_signs ?? "",
      coping_strategies: plan.coping_strategies ?? "",
      emergency_contacts: plan.emergency_contacts ?? "",
    }),
  });
  const json = await res.json();
  if (!json.success) {
    return { success: false, message: json.message || "Failed to save plan." };
  }
  return { success: true, plan: json.data?.plan ?? plan as PatientRelapsePlan };
}
