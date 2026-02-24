# CORS & "Failed to Fetch" Troubleshooting Guide

## Overview

When the frontend (`right2thriveuk.com`) calls the backend API (`admin.right2thriveuk.com`) directly from the browser, **CORS (Cross-Origin Resource Sharing)** can block the request. APIs may work in Postman (no CORS) but fail in the browser with "Failed to fetch" or empty status codes.

## Solution: API Proxy

This project uses a **Next.js rewrite** to proxy API calls through the same origin, avoiding CORS entirely.

### How It Works

1. **Browser** → `fetch("/api/backend/login")` (same origin)
2. **Next.js** → rewrites to `https://admin.right2thriveuk.com/api/login`
3. **Backend** → responds; browser sees it as same-origin

### Implementation

- **`lib/api-client.ts`** – `getApiUrl(path)` returns:
  - **In browser:** `/api/backend/{path}` (proxied)
  - **On server:** `https://admin.right2thriveuk.com{path}` (direct)

- **`next.config.mjs`** – Rewrite rule:
  ```js
  source: "/api/backend/:path*",
  destination: "${NEXT_PUBLIC_API_URL}/api/:path*"
  ```

### Usage

Always use `getApiUrl()` for client-side API calls:

```ts
import { getApiUrl } from "@/lib/api-client";

// ✅ Correct
const res = await fetch(getApiUrl("/api/login"), { ... });

// ❌ Wrong – causes CORS
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, { ... });
```

## Common Issues

### 1. "Failed to fetch" in browser, works in Postman

**Cause:** Request is going directly to the backend (different origin) and CORS blocks it.

**Fix:** Ensure the fetch uses `getApiUrl()`, not `process.env.NEXT_PUBLIC_API_URL` directly.

### 2. Preflight (OPTIONS) request fails

**Cause:** Same as above – direct cross-origin request triggers CORS preflight.

**Fix:** Use the proxy via `getApiUrl()` so the request is same-origin.

### 3. 404 on `/api/backend/...`

**Cause:** Rewrite may not be applied (e.g. wrong Next.js config, build cache).

**Fix:**
- Restart dev server: `npm run dev`
- Clear `.next` and rebuild: `rm -rf .next && npm run build`
- Verify `next.config.mjs` has the `rewrites()` function

### 4. Backend returns 500 / 502

**Cause:** Backend error or unreachable. The proxy forwards the request; the backend must be up and reachable from the Next.js server.

**Fix:** Check backend logs, ensure `NEXT_PUBLIC_API_URL` is correct and the backend is running.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://admin.right2thriveuk.com
```

- Used by the **rewrite destination** (server-side)
- Used by `getApiUrl()` when running on the **server** (SSR, API routes)
- In the **browser**, `getApiUrl()` returns relative paths (`/api/backend/...`) so this env is not used for the URL

## Alternative: Backend CORS Configuration

If you prefer not to use the proxy, configure CORS on the Laravel backend:

**`config/cors.php`** (Laravel):

```php
'allowed_origins' => [
    'https://right2thriveuk.com',
    'http://localhost:3000',
],
'supports_credentials' => true,
```

Then you could use `NEXT_PUBLIC_API_URL` directly. The proxy approach is often simpler and avoids backend changes.

## Files Updated for Proxy

All client-side API calls now use `getApiUrl()`:

- Auth: login, signup, forgot-password, reset-password, verify-email
- Chat, profile, bookings, wellbeing-hub
- Assessments: GAD-7, PHQ-9, PCL-5, SDQ, risk
- Cultural activities, contact, complaints
- Thrive tokens, questionnaires, weekly goals, etc.

See `lib/api-client.ts` for the implementation.
