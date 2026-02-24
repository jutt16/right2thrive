/**
 * API base URL for client-side fetch calls.
 * Uses /api/backend proxy in browser to avoid CORS (same-origin request).
 * Uses direct backend URL in server context.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return ""; // Relative to current origin - proxy via rewrites
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://admin.right2thriveuk.com";
}

/**
 * Build full API URL for a path.
 * In browser: /api/backend/login (proxied to backend)
 * On server: https://admin.right2thriveuk.com/api/login
 */
export function getApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (base) {
    return `${base.replace(/\/$/, "")}${cleanPath}`;
  }
  // Client: use proxy path
  const apiPath = cleanPath.startsWith("/api/") ? cleanPath.replace("/api/", "") : cleanPath.replace(/^\//, "");
  return `/api/backend/${apiPath}`;
}
