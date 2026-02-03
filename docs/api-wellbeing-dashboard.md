# API guide: My Wellbeing Dashboard

Short reference for backend developers. The dashboard at `/my-wellbeing/dashboard` uses the following.

---

## 1. ThriveTokens dashboard (required)

**Endpoint:** `GET /api/thrive-tokens/dashboard`  
**Auth:** `Authorization: Bearer {token}`

**Response 200:**

```json
{
  "success": true,
  "data": {
    "balance": 45,
    "recent_activity": [
      {
        "id": 3,
        "type": "earn",
        "amount": 10,
        "engagement_type": "session",
        "notes": null,
        "created_at": "2026-01-31T14:30:00.000000Z"
      }
    ]
  }
}
```

| Field | Type | Notes |
|-------|------|--------|
| `data.balance` | number | **Required.** Current ThriveTokens balance. Shown on the dashboard card. |
| `data.recent_activity` | array | Optional for dashboard (card only shows balance). Each item: `id`, `type` ("earn" \| "redemption"), `amount`, `engagement_type`, `notes`, `created_at`. |

The UI only uses `data.balance` for the dashboard card. Return `balance: 0` and `recent_activity: []` when the user has no tokens yet.

---

## 2. User object for greeting (optional)

The “Hi {firstName}” text comes from the **user object** stored in the frontend (e.g. after login). Ensure the auth/user response that the frontend stores includes at least one of:

- `first_name` (preferred), or  
- `name`  

The frontend uses the first word as the greeting (e.g. `"John Doe"` → “Hi John”). If both are missing, it falls back to “Hi there”.

---

## Summary

| Purpose | Endpoint | Required response |
|--------|----------|-------------------|
| Token balance & activity | `GET /api/thrive-tokens/dashboard` | `{ success: true, data: { balance: number, recent_activity: [] } }` |
| Greeting name | User object (login/user API) | `first_name` or `name` |

All dashboard requests send the same `Authorization: Bearer {token}` header. Use standard JSON error bodies (`success: false`, `message`, optional `errors`) for 4xx/5xx.
