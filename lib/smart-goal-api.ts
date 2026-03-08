/**
 * SMART Goal Templates API
 * Prompts for Specific, Measurable, Achievable, Relevant, Time-bound goals
 */

const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
    : process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export interface SmartGoalTemplate {
  id: number;
  category: string;
  prompt: string;
  display_order: number;
}

/**
 * Get active SMART goal templates (prompts for goal creation).
 * GET /api/smart-goal-templates
 */
export async function getSmartGoalTemplates(): Promise<SmartGoalTemplate[]> {
  const res = await fetch(`${API_BASE}/api/smart-goal-templates`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!json.success || !json.data?.templates) return [];
  return json.data.templates;
}
