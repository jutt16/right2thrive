# Outcome Measures API Documentation

Outcome measures are collected at 3 time points: **baseline**, **midpoint**, and **end** of treatment. This document describes the patient, therapist, and admin APIs.

---

## Base URL

All endpoints use the API base URL (e.g. `https://your-domain.com/api`).

---

## Authentication

All outcome measure endpoints require **Bearer token** authentication (Laravel Sanctum). Include the token in the request header:

```
Authorization: Bearer {your-token}
```

---

# Patient API

## Endpoints

### Get Outcome Measures Status

Returns the current treatment phase, what assessments are due, and what has been completed for the authenticated patient.

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Endpoint** | `/api/patient/outcome-measures/status` |
| **Auth** | Bearer Token (Patient) |

#### Response

```json
{
  "success": true,
  "message": "Outcome measures status retrieved successfully",
  "data": {
    "current_phase": "baseline",
    "session_count": 2,
    "phase_config": {
      "baseline_sessions": 0,
      "midpoint_sessions": 4,
      "end_sessions": 8
    },
    "assessments_due": ["gad7", "phq9", "pcl5", "goals_rating"],
    "assessments_done": {},
    "all_complete_for_phase": false
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `current_phase` | string | One of `baseline`, `midpoint`, or `end` |
| `session_count` | integer | Number of completed (attended) sessions |
| `phase_config` | object | Admin-configured session thresholds for each phase |
| `phase_config.baseline_sessions` | integer | Session count for baseline (typically 0) |
| `phase_config.midpoint_sessions` | integer | Session count at which midpoint phase starts (e.g. 4) |
| `phase_config.end_sessions` | integer | Session count at which end phase starts (e.g. 8) |
| `assessments_due` | array | List of assessment types not yet completed for current phase: `gad7`, `phq9`, `pcl5`, `goals_rating` |
| `assessments_done` | object | Map of completed assessments with `id` and `completed_at` |
| `all_complete_for_phase` | boolean | `true` when all four assessments are done for the current phase |

#### Example: Partial Completion

```json
{
  "success": true,
  "message": "Outcome measures status retrieved successfully",
  "data": {
    "current_phase": "midpoint",
    "session_count": 5,
    "phase_config": {
      "baseline_sessions": 0,
      "midpoint_sessions": 4,
      "end_sessions": 8
    },
    "assessments_due": ["pcl5", "goals_rating"],
    "assessments_done": {
      "gad7": {
        "id": 12,
        "completed_at": "2026-03-09T10:30:00.000000Z"
      },
      "phq9": {
        "id": 8,
        "completed_at": "2026-03-09T10:35:00.000000Z"
      }
    },
    "all_complete_for_phase": false
  }
}
```

#### Example: All Complete

```json
{
  "success": true,
  "message": "Outcome measures status retrieved successfully",
  "data": {
    "current_phase": "end",
    "session_count": 9,
    "phase_config": {
      "baseline_sessions": 0,
      "midpoint_sessions": 4,
      "end_sessions": 8
    },
    "assessments_due": [],
    "assessments_done": {
      "gad7": { "id": 15, "completed_at": "2026-03-09T14:00:00.000000Z" },
      "phq9": { "id": 11, "completed_at": "2026-03-09T14:05:00.000000Z" },
      "pcl5": { "id": 3, "completed_at": "2026-03-09T14:10:00.000000Z" },
      "goals_rating": { "id": 7 }
    },
    "all_complete_for_phase": true
  }
}
```

---

## Assessment Types

| Type | Description | Submit Via |
|------|-------------|------------|
| `gad7` | GAD-7 (Generalized Anxiety Disorder) | `POST /api/assessments/gad7` |
| `phq9` | PHQ-9 (Patient Health Questionnaire) | `POST /api/assessments/phq9` |
| `pcl5` | PCL-5 (PTSD Checklist) | `POST /api/pcl5/assessments` |
| `goals_rating` | Goal rating / progress | Therapist links via web UI |

---

## Phase Determination

The current phase is determined by:

1. **Manual override**: If a therapist has set the patient's phase (baseline/midpoint/end), that takes precedence.
2. **Session count**: Otherwise, phase is derived from completed session count vs. admin-configured thresholds:
   - **Baseline**: Before midpoint threshold (e.g. 0–3 sessions)
   - **Midpoint**: At or after midpoint threshold (e.g. 4–7 sessions)
   - **End**: At or after end threshold (e.g. 8+ sessions)

---

## Error Responses

| Status | Description |
|--------|-------------|
| `401` | Unauthenticated – missing or invalid Bearer token |
| `403` | Forbidden – user is not a patient |

---

## Related APIs

- **GAD-7**: `GET /api/questions/gad7`, `POST /api/assessments/gad7`, `GET /api/assessments/gad7`
- **PHQ-9**: `GET /api/questions/phq9`, `POST /api/assessments/phq9`, `GET /api/assessments/phq9`
- **PCL-5**: `GET /api/pcl5/questions`, `POST /api/pcl5/assessments`, `GET /api/pcl5/assessments`

---

# Therapist Outcome Measures API

All therapist endpoints require **Bearer token** (Laravel Sanctum) and **therapist** role.

## Get Patient Treatment Phase

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Endpoint** | `/api/therapist/patients/{id}/treatment-phase` |
| **Auth** | Bearer Token (Therapist) |

Returns the same structure as patient status (current phase, session count, assessments due/done). Patient must be assigned to the authenticated therapist.

**Response:** Same as `GET /api/patient/outcome-measures/status`.

---

## Set Patient Treatment Phase

| Property | Value |
|----------|-------|
| **Method** | `PUT` |
| **Endpoint** | `/api/therapist/patients/{id}/treatment-phase` |
| **Auth** | Bearer Token (Therapist) |

**Request Body:**
```json
{
  "phase": "baseline"
}
```
`phase` must be one of: `baseline`, `midpoint`, `end`.

**Response:**
```json
{
  "success": true,
  "message": "Treatment phase updated successfully",
  "data": { "phase": "midpoint" }
}
```

---

## Send Assessment Reminder

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Endpoint** | `/api/therapist/patients/{id}/send-assessment-reminder` |
| **Auth** | Bearer Token (Therapist) |

Sends an email reminder to the patient using the phase-specific template.

**Response:**
```json
{
  "success": true,
  "message": "Assessment reminder sent successfully",
  "data": { "sent_to": "patient@example.com" }
}
```

---

## List Outcome Measures Due

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Endpoint** | `/api/therapist/outcome-measures-due` |
| **Auth** | Bearer Token (Therapist) |

Returns all patients assigned to the therapist who have assessments due at their current phase.

**Response:**
```json
{
  "success": true,
  "message": "Outcome measures due retrieved successfully",
  "data": {
    "patients": [
      {
        "patient_id": 1,
        "patient_name": "John Doe",
        "patient_email": "john@example.com",
        "current_phase": "midpoint",
        "session_count": 5,
        "assessments_due": ["pcl5", "goals_rating"],
        "assessments_done": ["gad7", "phq9"]
      }
    ]
  }
}
```

---

# Admin Treatment Phase API

All admin endpoints require **Bearer token** (Laravel Sanctum) and **super-admin** or **admin** role.

## Get Phase Config

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Endpoint** | `/api/admin/treatment-phases/config` |
| **Auth** | Bearer Token (Admin) |

**Response:**
```json
{
  "success": true,
  "message": "Treatment phase config retrieved successfully",
  "data": {
    "baseline_sessions": 0,
    "midpoint_sessions": 4,
    "end_sessions": 8
  }
}
```

---

## Update Phase Config

| Property | Value |
|----------|-------|
| **Method** | `PUT` |
| **Endpoint** | `/api/admin/treatment-phases/config` |
| **Auth** | Bearer Token (Admin) |

**Request Body:**
```json
{
  "baseline_sessions": 0,
  "midpoint_sessions": 4,
  "end_sessions": 8
}
```

**Response:** Same structure as Get Phase Config.

---

# Scheduled Job

A daily job runs at **09:00** to send reminder emails to all patients with assessments due at their current phase. Ensure the scheduler is running:

```bash
php artisan schedule:work
```

Or add a cron entry:
```
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```
