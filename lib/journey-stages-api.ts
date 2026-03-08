/**
 * Journey Stages API (Transtheoretical Model)
 * Stages of Change: pre-contemplation, contemplation, preparation, action, maintenance
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

export interface JourneyStage {
  id: number;
  name: string;
  slug: string;
  description: string;
  content?: string;
  display_order: number;
}

export interface UserJourneyStageData {
  id: number;
  stage: JourneyStage;
  set_at: string;
  set_by: "self" | "therapist";
}

export interface JourneyStagesResponse {
  success: boolean;
  data: { stages: JourneyStage[] };
}

export interface UserJourneyStageResponse {
  success: boolean;
  data: {
    journey_stage: UserJourneyStageData | null;
    message?: string;
  };
}

// --- API functions ---

/**
 * List active journey stages (public, no auth).
 * GET /api/journey-stages
 */
export async function getJourneyStages(): Promise<JourneyStage[]> {
  const res = await fetch(`${API_BASE}/api/journey-stages`);
  const json: JourneyStagesResponse = await res.json();
  if (!json.success || !json.data?.stages) {
    return [];
  }
  return json.data.stages;
}

/**
 * Get current journey stage for authenticated user.
 * GET /api/user/journey-stage
 */
export async function getCurrentJourneyStage(): Promise<UserJourneyStageData | null> {
  const res = await fetch(`${API_BASE}/api/user/journey-stage`, {
    headers: getAuthHeaders(),
  });
  const json: UserJourneyStageResponse = await res.json();
  if (!json.success) return null;
  return json.data.journey_stage ?? null;
}

/**
 * Set journey stage (patient self-set, e.g. during onboarding).
 * PUT /api/user/journey-stage
 */
export async function setJourneyStage(stageId: number): Promise<UserJourneyStageData | { error: string }> {
  const res = await fetch(`${API_BASE}/api/user/journey-stage`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ stage_id: stageId }),
  });
  const json = await res.json();
  if (!json.success) {
    return { error: json.message || "Failed to set journey stage." };
  }
  return json.data.journey_stage;
}
