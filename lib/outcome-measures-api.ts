/**
 * Patient Outcome Measures API
 * Status for baseline, midpoint, and end-of-treatment assessments (GAD-7, PHQ-9, PCL-5, goals rating)
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

export type TreatmentPhase = "baseline" | "midpoint" | "end";

export type AssessmentType = "gad7" | "phq9" | "pcl5" | "goals_rating";

export interface PhaseConfig {
  baseline_sessions: number;
  midpoint_sessions: number;
  end_sessions: number;
}

export interface CompletedAssessment {
  id: number;
  completed_at?: string;
}

export interface OutcomeMeasuresStatus {
  current_phase: TreatmentPhase;
  session_count: number;
  phase_config: PhaseConfig;
  assessments_due: AssessmentType[];
  assessments_done: Partial<Record<AssessmentType, CompletedAssessment>>;
  all_complete_for_phase: boolean;
}

export interface OutcomeMeasuresStatusResponse {
  success: boolean;
  message: string;
  data: OutcomeMeasuresStatus;
}

// --- API functions ---

/**
 * Get outcome measures status for the authenticated patient.
 * Returns current phase, assessments due, and completed assessments.
 * GET /api/patient/outcome-measures/status
 */
export async function getOutcomeMeasuresStatus(): Promise<
  OutcomeMeasuresStatus | null
> {
  const res = await fetch(`${API_BASE}/api/patient/outcome-measures/status`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      return null;
    }
    throw new Error(`Failed to fetch outcome measures status: ${res.status}`);
  }

  const json: OutcomeMeasuresStatusResponse = await res.json();
  if (!json.success || !json.data) {
    return null;
  }

  return json.data;
}
