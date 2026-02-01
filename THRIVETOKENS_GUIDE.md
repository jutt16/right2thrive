# ThriveTokens API Guide

Wellbeing-first token system. No gamification, no pressure mechanics.

All endpoints require `Authorization: Bearer {token}` (Sanctum) unless noted.

---

## Participant APIs

### GET /api/thrive-tokens/dashboard

Balance + recent activity for participant dashboard.

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
      },
      {
        "id": 2,
        "type": "earn",
        "amount": 5,
        "engagement_type": "reflection",
        "notes": null,
        "created_at": "2026-01-30T10:15:00.000000Z"
      }
    ]
  }
}
```

---

### GET /api/thrive-tokens/overview

Balance + transaction history.

**Query:** `?limit=20` (optional, max 50)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "balance": 45,
    "history": [
      {
        "id": 4,
        "type": "redemption",
        "amount": -25,
        "engagement_type": null,
        "notes": "Redeemed: Guided meditation session",
        "created_at": "2026-01-31T15:00:00.000000Z"
      },
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

---

### GET /api/thrive-tokens/rewards

List available rewards.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "rewards": [
      {
        "id": 1,
        "name": "Guided meditation session",
        "description": "Access to a calming 15-minute guided meditation",
        "cost": 25,
        "image_url": "http://localhost/storage/rewards/meditation.jpg",
        "icon": "meditation",
        "can_afford": true,
        "remaining": 98
      }
    ]
  }
}
```

---

### GET /api/thrive-tokens/rewards/{id}

Reward detail.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Guided meditation session",
    "description": "Access to a calming 15-minute guided meditation",
    "cost": 25,
    "image_url": "http://localhost/storage/rewards/meditation.jpg",
    "icon": "meditation",
    "can_afford": true,
    "remaining": 98,
    "balance": 45
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "message": "Reward not found"
}
```

---

### POST /api/thrive-tokens/rewards/{id}/redeem

Redeem a reward (transaction-safe).

**Response 200:**
```json
{
  "success": true,
  "data": {
    "redemption": {
      "id": 1,
      "reward_id": 1,
      "tokens_spent": 25,
      "created_at": "2026-01-31T15:00:00.000000Z"
    },
    "new_balance": 20
  }
}
```

**Response 422 (insufficient tokens / unavailable):**
```json
{
  "success": false,
  "message": "Insufficient tokens"
}
```

---

### POST /api/thrive-tokens/reflections

Submit reflection and earn tokens (idempotent).

**Request:**
```json
{
  "content": "Today I reflected on my progress and feel more grounded.",
  "idempotency_key": "uuid-or-unique-string"
}
```

**Response 200 (first submission):**
```json
{
  "success": true,
  "data": {
    "tokens_awarded": 5,
    "already_submitted": false,
    "balance": 50
  }
}
```

**Response 200 (duplicate – same idempotency_key):**
```json
{
  "success": true,
  "data": {
    "tokens_awarded": 5,
    "already_submitted": true,
    "balance": 50
  }
}
```

**Response 422 (validation):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "content": ["The content field is required."],
    "idempotency_key": ["The idempotency key field is required."]
  }
}
```

**Response 503 (rule not configured):**
```json
{
  "success": false,
  "message": "Reflection awards are not configured"
}
```

---

## Counsellor APIs (Therapist only)

### GET /api/counsellor/engagement-overview

Engagement icons + counts (no comparisons).

**Response 200:**
```json
{
  "success": true,
  "data": {
    "engagement": [
      {
        "engagement_type": "session",
        "label": "Attended session",
        "icon": "session",
        "count": 24
      },
      {
        "engagement_type": "check_in",
        "label": "Completed check-in",
        "icon": "check-in",
        "count": 18
      },
      {
        "engagement_type": "tool",
        "label": "Used a wellbeing tool",
        "icon": "tool",
        "count": 12
      },
      {
        "engagement_type": "reflection",
        "label": "Submitted reflection",
        "icon": "reflection",
        "count": 15
      }
    ]
  }
}
```

**Response 403:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Admin APIs

### GET /api/admin/thrive-tokens/rules

List token rules.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": 1,
        "engagement_type": "session",
        "label": "Attended session",
        "description": "Tokens for attending a counselling session",
        "tokens_awarded": 10,
        "is_active": true,
        "display_order": 1
      }
    ]
  }
}
```

---

### PUT /api/admin/thrive-tokens/rules/{id}

Update token rule.

**Request:**
```json
{
  "label": "Attended session",
  "tokens_awarded": 10,
  "is_active": true,
  "display_order": 1
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "engagement_type": "session",
    "label": "Attended session",
    "tokens_awarded": 10,
    "is_active": true
  }
}
```

---

### GET /api/admin/thrive-tokens/rewards

List all rewards (includes inactive).

**Response 200:**
```json
{
  "success": true,
  "data": {
    "rewards": [
      {
        "id": 1,
        "name": "Guided meditation session",
        "description": "Access to a calming 15-minute guided meditation",
        "cost": 25,
        "icon": "meditation",
        "is_active": true,
        "display_order": 1,
        "stock_limit": 100,
        "redemption_count": 2
      }
    ]
  }
}
```

---

### POST /api/admin/thrive-tokens/rewards

Create reward.

**Request:**
```json
{
  "name": "Guided meditation session",
  "description": "Access to a calming 15-minute guided meditation",
  "cost": 25,
  "icon": "meditation",
  "is_active": true,
  "display_order": 1,
  "stock_limit": 100
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "reward": {
      "id": 1,
      "name": "Guided meditation session",
      "description": "Access to a calming 15-minute guided meditation",
      "cost": 25,
      "icon": "meditation",
      "image_path": null,
      "is_active": true,
      "display_order": 1,
      "stock_limit": 100,
      "redemption_count": 0
    }
  }
}
```

---

### PUT /api/admin/thrive-tokens/rewards/{id}

Update reward.

**Request:**
```json
{
  "name": "Guided meditation session",
  "cost": 30,
  "is_active": true,
  "stock_limit": 50
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "reward": {
      "id": 1,
      "name": "Guided meditation session",
      "description": "Access to a calming 15-minute guided meditation",
      "cost": 30,
      "icon": "meditation",
      "image_path": null,
      "is_active": true,
      "display_order": 1,
      "stock_limit": 50,
      "redemption_count": 2
    }
  }
}
```

---

## Awarding Tokens (Integration)

Use `ThriveTokenAwarder` for idempotent awards:

```php
// When booking marked attended
$result = app(ThriveTokenAwarder::class)->awardForSession($user, $booking);

// When check-in completed
$result = app(ThriveTokenAwarder::class)->awardForCheckIn($user, $checkInId);
```

---

## Database Tables

- `thrive_token_rules` – engagement types and token amounts
- `thrive_tokens_balances` – user balances
- `thrive_tokens_transactions` – earn/redemption history (idempotency_key for earns)
- `rewards` – catalog
- `reward_redemptions` – redemption records
