/**
 * ThriveTokens API client
 * Wellbeing-first token system. No gamification, no pressure.
 * Uses getApiUrl for CORS-safe proxy in browser.
 */

import { getApiUrl } from "./api-client";

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

export interface DashboardActivity {
  id: number;
  type: "earn" | "redemption";
  amount: number;
  engagement_type: string | null;
  notes: string | null;
  created_at: string;
}

export interface DashboardData {
  balance: number;
  recent_activity: DashboardActivity[];
}

export interface OverviewHistoryItem {
  id: number;
  type: "earn" | "redemption";
  amount: number;
  engagement_type: string | null;
  notes: string | null;
  created_at: string;
}

export interface OverviewData {
  balance: number;
  history: OverviewHistoryItem[];
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  cost: number;
  image_url: string | null;
  icon: string | null;
  can_afford: boolean;
  remaining: number;
}

export interface RewardDetail extends Reward {
  balance: number;
}

export interface RedemptionResponse {
  id: number;
  reward_id: number;
  tokens_spent: number;
  created_at: string;
}

export interface ReflectionResponse {
  tokens_awarded: number;
  already_submitted: boolean;
  balance: number;
}

// --- API responses ---

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// --- API functions ---

export async function getThriveDashboard(): Promise<DashboardData | null> {
  try {
    const res = await fetch(getApiUrl("/api/thrive-tokens/dashboard"), {
      headers: getAuthHeaders(),
    });
    const json: ApiResponse<DashboardData> = await res.json();
    if (json.success && json.data) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function getThriveOverview(limit = 20): Promise<OverviewData | null> {
  try {
    const res = await fetch(
      getApiUrl(`/api/thrive-tokens/overview?limit=${Math.min(limit, 50)}`),
      { headers: getAuthHeaders() }
    );
    const json: ApiResponse<OverviewData> = await res.json();
    if (json.success && json.data) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function getRewards(): Promise<Reward[]> {
  try {
    const res = await fetch(getApiUrl("/api/thrive-tokens/rewards"), {
      headers: getAuthHeaders(),
    });
    const json: ApiResponse<{ rewards: Reward[] }> = await res.json();
    if (json.success && json.data?.rewards) return json.data.rewards;
    return [];
  } catch {
    return [];
  }
}

export type GetRewardResult =
  | { ok: true; reward: RewardDetail }
  | { ok: false; error: string; code: "not_found" | "error" };

export async function getReward(id: number | string): Promise<GetRewardResult> {
  try {
    const res = await fetch(getApiUrl(`/api/thrive-tokens/rewards/${id}`), {
      headers: getAuthHeaders(),
    });
    const json: ApiResponse<RewardDetail> = await res.json();

    if (json.success && json.data) {
      return { ok: true, reward: json.data };
    }

    if (res.status === 404 || json.message?.toLowerCase().includes("not found")) {
      return { ok: false, error: json.message || "Reward not found", code: "not_found" };
    }

    return {
      ok: false,
      error: json.message || "Could not load reward",
      code: "error",
    };
  } catch (e) {
    return {
      ok: false,
      error: "We couldn't load this reward. Please check your connection and try again.",
      code: "error",
    };
  }
}

export async function redeemReward(
  id: number | string
): Promise<{ redemption: RedemptionResponse; new_balance: number } | { error: string }> {
  try {
    const res = await fetch(getApiUrl(`/api/thrive-tokens/rewards/${id}/redeem`), {
      method: "POST",
      headers: getAuthHeaders(),
    });
    const json: ApiResponse<{ redemption: RedemptionResponse; new_balance: number }> =
      await res.json();

    if (json.success && json.data) {
      return json.data;
    }
    return { error: json.message || "Something went wrong. Please try again." };
  } catch {
    return { error: "We couldn't complete your request. Please try again." };
  }
}

export async function submitReflection(params: {
  content: string;
  idempotency_key: string;
}): Promise<ReflectionResponse | { error: string }> {
  try {
    const res = await fetch(getApiUrl("/api/thrive-tokens/reflections"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    const json: ApiResponse<ReflectionResponse> = await res.json();

    if (json.success && json.data) {
      return json.data;
    }
    return { error: json.message || "We couldn't save your reflection. Please try again." };
  } catch {
    return { error: "We couldn't save your reflection. Please try again." };
  }
}
