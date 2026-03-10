/**
 * Social Prescribing API (Patient)
 * GET /api/social-prescribing – list services (query: category, area)
 * GET /api/social-prescribing/{id} – service detail
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

export interface SocialPrescribingService {
  id: number;
  name: string;
  description: string;
  category: string;
  url?: string | null;
  contact?: string | null;
  area?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SocialPrescribingListResponse {
  success: boolean;
  data: { services: SocialPrescribingService[] };
}

export interface SocialPrescribingDetailResponse {
  success: boolean;
  data: { service: SocialPrescribingService };
}

export interface ListParams {
  category?: string;
  area?: string;
}

// --- API functions ---

/**
 * List social prescribing services with optional filters.
 * GET /api/social-prescribing?category=...&area=...
 */
export async function getSocialPrescribingServices(
  params?: ListParams
): Promise<SocialPrescribingService[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.area) search.set("area", params.area);
  const query = search.toString();
  const url = `${API_BASE}/api/social-prescribing${query ? `?${query}` : ""}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  const json = await res.json();
  if (!json.success || !json.data) return [];
  const list = Array.isArray(json.data) ? json.data : json.data.services;
  return Array.isArray(list) ? list : [];
}

/**
 * Get a single social prescribing service by id.
 * GET /api/social-prescribing/{id}
 */
export async function getSocialPrescribingService(
  id: number | string
): Promise<SocialPrescribingService | null> {
  const res = await fetch(`${API_BASE}/api/social-prescribing/${id}`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!json.success || !json.data) return null;
  const service = json.data.service ?? json.data;
  return service && typeof service === "object" && "id" in service ? service : null;
}
