# Right2Thrive – Remaining Features & Improvements

*Based on the Service Flow Chart and codebase analysis (March 2025)*

---

## 1. From the Service Flow Chart

### 1.1 Transtheoretical Model (Stages of Change)

| Item | Description | Status |
|------|-------------|--------|
| **Contemplation stage** | Explicit stage in user journey (Prochaska et al.) | ❌ Not implemented |
| **Pre-contemplation stage** | Explicit stage in user journey | ❌ Not implemented |

**Suggestion:** Add onboarding or journey steps that reflect contemplation vs pre-contemplation (e.g. “Exploring support” vs “Ready to engage”) to personalise content and prompts.

---

### 1.2 Initial Assessment & Strengths

| Item | Description | Status |
|------|-------------|--------|
| **Strengths assessment** | Strengths-based assessment | ✅ Done via SDQ (Strengths and Difficulties Questionnaire) at `/my-wellbeing/questionnaires` |
| **SMART Goals** | Explicit SMART goal framing in wellbeing plan | ⚠️ Goals exist but SMART structure not explicit |

**Suggestion:** Integrate SMART prompts (Specific, Measurable, Achievable, Relevant, Time-bound) into goal-setting flows. No separate strengths assessment needed—SDQ covers this.

---

### 1.3 Gaining Trust / Environment

| Item | Description | Status |
|------|-------------|--------|
| **Comfortable meeting place** | UX to support trust (e.g. meeting preferences) | ❌ Not implemented |

**Suggestion:** Add preferences for meeting type (online vs in-person), language, or environment in profile or booking flow.

---

### 1.4 AI-Generated Assessments

| Item | Description | Status |
|------|-------------|--------|
| **AI Generated GAD7, PHQ9, PCL (Baseline)** | AI-assisted or automated baseline assessments | ⚠️ Unclear if AI is used |

**Suggestion:** Confirm whether assessments are AI-generated or clinician-led; document and align with flow chart if AI is intended.

---

### 1.5 Outcome Measures at 3 Time Points

| Item | Description | Status |
|------|-------------|--------|
| **3-time completion** | GAD7, PHQ9, PCL-5, Rating of goals at: (1) assessment, (2) mid-point, (3) end of treatment | ❌ Not explicitly enforced |

**Suggestion:** Add reminders or scheduling for:
- Baseline (assessment)
- Mid-point
- End of treatment

Could be driven by booking/session count or manual “treatment phase” selection.

---

### 1.6 Relapse Prevention

| Item | Description | Status |
|------|-------------|--------|
| **Relapse prevention** | Dedicated relapse prevention content or module | ❌ Not implemented |

**Suggestion:** Add a Relapse Prevention section (e.g. in Wellbeing Hub or Resources) with:
- Early warning signs
- Coping strategies
- When and how to seek help
- Links to crisis support

---

## 2. From Tasks Document (6th March)

### 2.1 Rewards Layout

| Item | Description | Status |
|------|-------------|--------|
| **Rewards layout improvement** | Reference: [apprenticenation.co.uk/rewards](https://apprenticenation.co.uk/rewards/) | ❌ Pending |

**Suggestion:** Review Apprentice Nation rewards layout and update Thrive Tokens rewards page for clearer structure and UX.

---

### 2.2 Registration Issues

| Item | Description | Status |
|------|-------------|--------|
| **“I AM UNABLE TO REGISTERED”** | User-reported registration problem | ❌ Needs investigation |

**Suggestion:** Investigate signup flow (validation, API errors, email verification) and fix blocking issues.

---

## 3. Additional UX / Feature Gaps (from codebase)

| Item | Source | Status |
|------|--------|--------|
| **Pre-session checklist** | UX recommendations | ❌ Not implemented |
| **Symptom / mood journal** | UX recommendations | ❌ Not implemented |
| **Copy link for session/booking** | UX recommendations | ❌ Not implemented |
| **Bottom nav on mobile** | UX recommendations | ❌ Not implemented |

---

## Priority Summary

| Priority | Items |
|----------|-------|
| **High** | Registration fix, Outcome measures at 3 points, Relapse prevention |
| **Medium** | Rewards layout, SMART goals, Transtheoretical stages |
| **Lower** | AI-generated assessments clarification, Gaining trust/environment, Pre-session checklist |

---

## Next Steps

1. Fix registration issues and test signup end-to-end.
2. Add outcome measure reminders (baseline, mid-point, end).
3. Create Relapse Prevention content and link from Wellbeing Hub.
4. Redesign rewards page using Apprentice Nation as reference.
5. Add explicit SMART goal prompts to wellbeing plan and weekly goals.
