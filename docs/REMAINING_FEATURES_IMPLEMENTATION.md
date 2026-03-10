# Right2Thrive – Remaining Features: Admin, Therapist & Backend Implementation

*Implementation guide for Admin panel, Therapist portal, and Laravel backend based on [REMAINING_FEATURES.md](./REMAINING_FEATURES.md)*

---

## Overview

| Role | Scope | Stack |
|------|-------|-------|
| **Admin** | Content management, configuration, user management, Thrive Tokens rules/rewards | Laravel web routes + Blade views |
| **Therapist** | Patient view, assessments, treatment phase, outcome reminders, notes | Laravel web routes + Blade views |
| **Backend (Laravel)** | Database migrations, business logic, integrations; **web routes** for admin/therapist; **APIs** for patient only | Laravel |
| **Patient** | Patient-facing app (onboarding, assessments, goals, etc.) | Consumes **APIs only** (separate frontend) |

**Architecture:** Admin and Therapist are part of this Laravel project and use traditional web routes with Blade views. Only the patient-facing side uses REST APIs (consumed by a separate patient app).

---

## 1. Transtheoretical Model (Stages of Change)

### 1.1 Admin

| Task | Description |
|------|-------------|
| **Stage configuration** | Add CRUD for journey stages (pre-contemplation, contemplation, preparation, action, maintenance) |
| **Stage content** | Manage content/prompts shown per stage |
| **Display order** | Order stages for onboarding flow |

### 1.2 Therapist

| Task | Description |
|------|-------------|
| **View patient stage** | See patient's current stage on patient profile |
| **Update stage** | Manually set or update patient stage (e.g. after session) |
| **Stage history** | View stage change history |

### 1.3 Backend (Laravel)

| Task | Description |
|------|-------------|
| **Migration** | `journey_stages` table; `user_journey_stage` (user_id, stage_id, set_at, set_by) |
| **Models** | `JourneyStage`, `UserJourneyStage` |
| **Seeders** | Default stages (pre-contemplation, contemplation, etc.) |

### 1.4 Admin Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/admin/journey-stages` | `admin.journey-stages.index` | List all stages |
| `GET` | `/admin/journey-stages/create` | `admin.journey-stages.create` | Create stage form |
| `POST` | `/admin/journey-stages` | Redirect | Store stage |
| `GET` | `/admin/journey-stages/{id}/edit` | `admin.journey-stages.edit` | Edit stage form |
| `PUT` | `/admin/journey-stages/{id}` | Redirect | Update stage |

### 1.5 Therapist Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/therapist/patients/{id}` | Patient profile (extend) | Show patient stage on profile |
| `GET` | `/therapist/patients/{id}/journey-stage` | `therapist.patients.journey-stage` | View/update patient stage |
| `PUT` | `/therapist/patients/{id}/journey-stage` | Redirect | Update patient stage |

### 1.6 Patient APIs (REST – patient app only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/journey-stages` | Public/Patient | List stages for onboarding |
| `GET` | `/api/user/journey-stage` | Patient | Current stage |
| `PUT` | `/api/user/journey-stage` | Patient | Self-set stage (e.g. during onboarding) |

---

## 2. Strengths Assessment & SMART Goals

> **Note:** Strengths assessment is **already implemented** via the SDQ (Strengths and Difficulties Questionnaire). SDQ includes prosocial/strengths items (e.g. “I try to be nice to other people”, “I am helpful”, “I often volunteer to help others”) and is available at `/my-wellbeing/questionnaires`. Therapists can view SDQ results via the therapist portal. No separate strengths tables or APIs are needed.

### 2.1 Admin (SMART Goals only)

| Task | Description |
|------|-------------|
| **SMART goal templates** | Manage SMART prompts/templates for goals (Specific, Measurable, Achievable, Relevant, Time-bound) |
| **Display order** | Order templates |

### 2.2 Therapist (SMART Goals only)

| Task | Description |
|------|-------------|
| **View SMART goals** | See patient goals with SMART structure (if extended) |
| **Add SMART prompts** | Optional: add notes/prompts for patient goals |

### 2.3 Backend (Laravel) – SMART Goals only

| Task | Description |
|------|-------------|
| **Migration** | Add SMART fields to `weekly_goals` / wellbeing plan goals (`specific`, `measurable`, `achievable`, `relevant`, `time_bound` or similar) |
| **Optional** | `smart_goal_templates` table for admin-managed prompts |

### 2.4 Admin Web Routes (Blade) – SMART Goals only

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/admin/smart-goal-templates` | `admin.smart-goal-templates.index` | List templates (optional) |
| `GET` | `/admin/smart-goal-templates/create` | `admin.smart-goal-templates.create` | Create template form |
| `POST` | `/admin/smart-goal-templates` | Redirect | Store template |
| `GET` | `/admin/smart-goal-templates/{id}/edit` | `admin.smart-goal-templates.edit` | Edit template form |
| `PUT` | `/admin/smart-goal-templates/{id}` | Redirect | Update template |

### 2.5 Therapist Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/therapist/patients/{id}` | Patient profile (extend) | View patient SMART goals |

### 2.6 Patient APIs (REST – patient app only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `PATCH` | `/api/weekly-goals/{id}` | Patient | Update goal with SMART fields (extend existing) |
| `PATCH` | `/api/wellbeing-forms` | Patient | Add SMART fields to goals step |

---

## 3. Gaining Trust / Meeting Preferences

### 3.1 Admin

| Task | Description |
|------|-------------|
| **Meeting type options** | Manage options (online, in-person, phone) |
| **Environment options** | Optional: quiet space, group, etc. |

### 3.2 Therapist

| Task | Description |
|------|-------------|
| **View preferences** | See patient meeting preferences when booking |
| **Availability by type** | Set availability per meeting type (online vs in-person) |

### 3.3 Backend (Laravel)

| Task | Description |
|------|-------------|
| **Migration** | Add to `users` or `profiles`: `preferred_meeting_type`, `preferred_language`, `environment_notes` |
| **Migration** | Add to therapist availability: `meeting_type` (online/in-person) |

### 3.4 Admin Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/admin/meeting-types` | `admin.meeting-types.index` | Manage meeting type options |
| `GET` | `/admin/environment-options` | `admin.environment-options.index` | Manage environment options (optional) |

### 3.5 Therapist Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/therapist/patients/{id}` | Patient profile (extend) | Include patient meeting preferences when viewing |
| `GET` | `/therapist/availability` | `therapist.availability.index` | Set availability per meeting type (online vs in-person) |

### 3.6 Patient APIs (REST – patient app only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `PUT` | `/api/user` | Patient | Add `preferred_meeting_type`, `environment_notes` (extend existing) |
| `GET` | `/api/user` | Patient | Return preferences (extend existing) |
| `GET` | `/api/therapist/{id}/availability` | Patient | Support `?meeting_type=online` filter (extend existing) |

---

## 4. Outcome Measures at 3 Time Points

### 4.1 Admin

| Task | Description |
|------|-------------|
| **Treatment phase config** | Configure phases: baseline, mid-point, end (e.g. session counts) |
| **Reminder templates** | Email/in-app reminder content per phase |

### 4.2 Therapist

| Task | Description |
|------|-------------|
| **Set treatment phase** | Mark patient as baseline / mid-point / end |
| **Phase dashboard** | See which patients need assessments at each phase |
| **Remind patient** | Trigger reminder to complete assessments |
| **View completion** | See if GAD7, PHQ9, PCL-5, goal rating completed per phase |

### 4.3 Backend (Laravel)

| Task | Description |
|------|-------------|
| **Migration** | `patient_treatment_phases` (patient_id, phase: baseline|midpoint|end, set_at, set_by) |
| **Migration** | `outcome_measure_completions` (patient_id, phase, gad7_id, phq9_id, pcl5_id, goals_rating_id, completed_at) |
| **Service** | Determine phase from session count or manual set |
| **Jobs** | Scheduled job to send reminders for due assessments |
| **Logic** | Flag when assessments due at current phase |

### 4.4 Admin Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/admin/treatment-phases/config` | `admin.treatment-phases.config` | View/edit phase config (e.g. mid-point = session 4) |
| `PUT` | `/admin/treatment-phases/config` | Redirect | Update phase config |
| `GET` | `/admin/outcome-reminder-templates` | `admin.outcome-reminder-templates.index` | Manage reminder templates |

### 4.5 Therapist Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/therapist/outcome-measures-due` | `therapist.outcome-measures.index` | List patients with assessments due |
| `GET` | `/therapist/patients/{id}/treatment-phase` | `therapist.patients.treatment-phase` | View patient phase + completion status |
| `PUT` | `/therapist/patients/{id}/treatment-phase` | Redirect | Set phase (baseline/midpoint/end) |
| `POST` | `/therapist/patients/{id}/send-assessment-reminder` | Redirect | Send reminder |

### 4.6 Patient APIs (REST – patient app only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/patient/outcome-measures/status` | Patient | Current phase, what's due, what's done |

---

## 5. Relapse Prevention

### 5.1 Admin

| Task | Description |
|------|-------------|
| **Relapse prevention content** | CRUD for sections: early warning signs, coping strategies, when to seek help |
| **Crisis links** | Manage crisis support links (may already exist in Support) |
| **Display order** | Order sections |

### 5.2 Therapist

| Task | Description |
|------|-------------|
| **View content** | Access relapse prevention content for reference |
| **Patient-specific plan** | Optional: add patient relapse plan (custom early signs, contacts) |

### 5.3 Backend (Laravel)

| Task | Description |
|------|-------------|
| **Migration** | `relapse_prevention_sections` (title, content, display_order, is_active) |
| **Migration** | Optional: `patient_relapse_plans` (patient_id, early_signs, coping_strategies, emergency_contacts) |
| **Seeder** | Default content (early warning signs, coping strategies, crisis links) |

### 5.4 Admin Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/admin/relapse-prevention` | `admin.relapse-prevention.index` | List sections |
| `GET` | `/admin/relapse-prevention/create` | `admin.relapse-prevention.create` | Create section form |
| `POST` | `/admin/relapse-prevention` | Redirect | Store section |
| `GET` | `/admin/relapse-prevention/{id}/edit` | `admin.relapse-prevention.edit` | Edit section form |
| `PUT` | `/admin/relapse-prevention/{id}` | Redirect | Update section |
| `DELETE` | `/admin/relapse-prevention/{id}` | Redirect | Soft delete section |

### 5.5 Therapist Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/therapist/relapse-prevention` | `therapist.relapse-prevention.index` | View content for reference |
| `GET` | `/therapist/patients/{id}/relapse-plan` | `therapist.patients.relapse-plan` | View patient plan |

### 5.6 Patient APIs (REST – patient app only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/relapse-prevention` | Patient | List sections (or single page content) |
| `GET` | `/api/patient/relapse-plan` | Patient | Own relapse plan (if custom) |
| `PUT` | `/api/patient/relapse-plan` | Patient | Save own relapse plan |

---

## 6. Social Prescribing

### 6.1 Admin

| Task | Description |
|------|-------------|
| **Social prescribing services** | CRUD for services (name, description, category, link, contact) |
| **Categories** | Activities, groups, link workers, local services |
| **Link to events** | Link cultural activities/events to social prescribing |
| **Referral tracking** | Optional: track referrals to link workers |

### 6.2 Therapist

| Task | Description |
|------|-------------|
| **View services** | Browse social prescribing directory |
| **Refer patient** | Create referral to service/link worker |
| **View referrals** | See own referrals and status |

### 6.3 Backend (Laravel)

| Task | Description |
|------|-------------|
| **Migration** | `social_prescribing_services` (name, description, category, url, contact, area, is_active) |
| **Migration** | `social_prescribing_referrals` (patient_id, service_id, referred_by, status, notes) |
| **Models** | `SocialPrescribingService`, `SocialPrescribingReferral` |

### 6.4 Admin Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/admin/social-prescribing` | `admin.social-prescribing.index` | List all services |
| `GET` | `/admin/social-prescribing/create` | `admin.social-prescribing.create` | Create service form |
| `POST` | `/admin/social-prescribing` | Redirect | Store service |
| `GET` | `/admin/social-prescribing/{id}/edit` | `admin.social-prescribing.edit` | Edit service form |
| `PUT` | `/admin/social-prescribing/{id}` | Redirect | Update service |

### 6.5 Therapist Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/therapist/social-prescribing` | `therapist.social-prescribing.index` | Browse services directory |
| `GET` | `/therapist/social-prescribing-referrals` | `therapist.social-prescribing.referrals` | List own referrals |
| `GET` | `/therapist/patients/{id}/social-prescribing-referral` | `therapist.patients.social-prescribing-referral` | Create referral form |
| `POST` | `/therapist/patients/{id}/social-prescribing-referral` | Redirect | Create referral |

### 6.6 Patient APIs (REST – patient app only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/social-prescribing` | Patient | List services (filter by category, area) |
| `GET` | `/api/social-prescribing/{id}` | Patient | Service detail |

---

## 7. Rewards Layout Improvement

### 7.1 Admin

| Task | Description |
|------|-------------|
| **Rewards UI** | Improve rewards list/create/edit (categories, images, layout) |
| **Reward categories** | Add category field for grouping (e.g. experiences, vouchers) |
| **Display options** | Grid vs list, featured rewards |
| **Image upload** | Ensure image upload works; multiple images if needed |

### 7.2 Therapist

| Task | Description |
|------|-------------|
| *N/A* | Rewards are patient-facing |

### 7.3 Backend (Laravel)

| Task | Description |
|------|-------------|
| **Migration** | Add `category`, `display_order`, `is_featured` to `rewards` if not present |
| **Extend** | Ensure `GET /api/thrive-tokens/rewards` returns category, featured flag (patient API) |

### 7.4 Admin Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/admin/thrive-tokens/rewards` | `admin.thrive-tokens.rewards.index` | List rewards (with category filter, grid/list) |
| `GET` | `/admin/thrive-tokens/rewards/create` | `admin.thrive-tokens.rewards.create` | Create reward form |
| `POST` | `/admin/thrive-tokens/rewards` | Redirect | Store reward (accept `category`, `is_featured`) |
| `GET` | `/admin/thrive-tokens/rewards/{id}/edit` | `admin.thrive-tokens.rewards.edit` | Edit reward form |
| `PUT` | `/admin/thrive-tokens/rewards/{id}` | Redirect | Update reward (accept `category`, `is_featured`) |

### 7.5 Patient APIs (REST – patient app only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/thrive-tokens/rewards` | Patient | Add `category`, `is_featured` to response (extend existing) |

---

## 8. Registration Fix ("I AM UNABLE TO REGISTERED")

### 8.1 Admin

| Task | Description |
|------|-------------|
| *N/A* | Fix is backend/frontend |

### 8.2 Therapist

| Task | Description |
|------|-------------|
| *N/A* | Patient registration |

### 8.3 Backend (Laravel)

| Task | Description |
|------|-------------|
| **Debug** | Add logging to `AuthController::register` |
| **Validation** | Review validation rules; return clear error messages |
| **Email** | Verify email sending (queue, SMTP, OTP) |
| **Response** | Ensure API returns `{ success: false, message: "..." }` with specific reason |
| **CORS** | Verify CORS allows frontend origin |

### 8.4 Patient APIs (REST – patient app only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | Public | Fix validation, error messages, email flow (existing) |
| `POST` | `/api/verify-email` | Public | Ensure OTP flow works (existing) |
| `POST` | `/api/resend-otp` | Public | Ensure resend works (existing) |

---

## 9. AI-Generated Assessments (Clarification)

### 9.1 Admin

| Task | Description |
|------|-------------|
| **Config** | Toggle: AI-assisted vs clinician-led assessments |
| **AI prompts** | If AI: manage prompts for baseline generation |

### 9.2 Therapist

| Task | Description |
|------|-------------|
| **View source** | See if assessment was AI-generated or self-completed |
| **Override** | Optional: clinician can override/edit AI-generated baseline |

### 9.3 Backend (Laravel)

| Task | Description |
|------|-------------|
| **Migration** | Add `source` (self|ai|clinician) to GAD7, PHQ9, PCL5 assessment tables |
| **Integration** | If AI: integrate with OpenAI/other for baseline generation (future) |
| **Documentation** | Document current flow (self-completed vs AI) |

### 9.4 Admin Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/admin/assessments/config` | `admin.assessments.config` | Toggle AI-assisted vs clinician-led; manage AI prompts |

### 9.5 Therapist Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/therapist/patients/{id}/assessments` | `therapist.patients.assessments` | View assessments (include `source` in data) |

### 9.6 Patient APIs (REST – patient app only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/assessments/gad7` | Patient | Add `source` in request/response (extend existing) |
| `POST` | `/api/assessments/phq9` | Patient | Add `source` (extend existing) |
| `POST` | `/api/pcl5/assessments` | Patient | Add `source` (extend existing) |

---

## 10. Additional UX (Pre-session Checklist, Symptom Journal, Copy Link)

### 10.1 Admin

| Task | Description |
|------|-------------|
| **Checklist config** | Manage pre-session checklist items |
| **Symptom journal** | Optional: configure mood/symptom options |

### 10.2 Therapist

| Task | Description |
|------|-------------|
| **View checklist** | See if patient completed pre-session checklist |
| **View journal** | See patient symptom/mood journal entries |

### 10.3 Backend (Laravel)

| Task | Description |
|------|-------------|
| **Migration** | `pre_session_checklists` (patient_id, booking_id, items JSON, completed_at) |
| **Migration** | `symptom_journal_entries` (patient_id, date, mood, symptoms JSON, notes) |
| **Logic** | Copy link: frontend only (use `navigator.clipboard`); ensure booking has shareable link |

### 10.4 Admin Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/admin/pre-session-checklist/config` | `admin.pre-session-checklist.config` | Manage checklist items |
| `PUT` | `/admin/pre-session-checklist/config` | Redirect | Update checklist items |
| `GET` | `/admin/symptom-journal/config` | `admin.symptom-journal.config` | Configure mood/symptom options (optional) |

### 10.5 Therapist Web Routes (Blade)

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/therapist/patients/{id}/pre-session-checklist` | `therapist.patients.pre-session-checklist` | View patient checklist |
| `GET` | `/therapist/patients/{id}/symptom-journal` | `therapist.patients.symptom-journal` | View patient journal |

### 10.6 Patient APIs (REST – patient app only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bookings/{id}` | Patient | Return `meeting_link` for copy (extend existing) |
| `GET` | `/api/pre-session-checklist` | Patient | Get checklist for upcoming booking |
| `POST` | `/api/pre-session-checklist` | Patient | Submit checklist |
| `GET` | `/api/symptom-journal` | Patient | List entries (with date filter) |
| `POST` | `/api/symptom-journal` | Patient | Create entry |

---

## Summary: Routes by Role

### Patient APIs (REST – patient app only)

| Priority | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| High | `/api/register` | POST | Fix registration (existing) |
| High | `/api/patient/outcome-measures/status` | GET | Outcome measures status |
| High | `/api/relapse-prevention` | GET | Relapse prevention content |
| Medium | `/api/journey-stages` | GET | Stages for onboarding |
| Medium | `/api/user/journey-stage` | GET, PUT | Patient stage |
| Medium | `/api/social-prescribing` | GET | Social prescribing services |
| Medium | `/api/thrive-tokens/rewards` | GET | Add category, featured (extend) |
| Lower | `/api/user` | PUT | Add meeting preferences (extend) |
| Lower | `/api/pre-session-checklist` | GET, POST | Pre-session checklist |
| Lower | `/api/symptom-journal` | GET, POST | Symptom journal |

### Admin Web Routes (Blade views)

| Priority | Route | Purpose |
|----------|-------|---------|
| High | `/admin/relapse-prevention` | CRUD relapse prevention content |
| Medium | `/admin/journey-stages` | CRUD journey stages |
| Medium | `/admin/social-prescribing` | CRUD social prescribing services |
| Medium | `/admin/treatment-phases/config` | Phase config (baseline, mid-point, end) |
| Medium | `/admin/thrive-tokens/rewards` | Manage rewards (category, featured) |
| Lower | `/admin/smart-goal-templates` | Optional SMART prompts |
| Lower | `/admin/pre-session-checklist/config` | Checklist items |
| Lower | `/admin/meeting-types` | Meeting type options |
| Lower | `/admin/assessments/config` | AI vs clinician-led toggle |

### Therapist Web Routes (Blade views)

| Priority | Route | Purpose |
|----------|-------|---------|
| High | `/therapist/outcome-measures-due` | Patients with assessments due |
| High | `/therapist/patients/{id}/treatment-phase` | View/set treatment phase |
| Medium | `/therapist/patients/{id}/journey-stage` | View/update patient stage |
| Medium | `/therapist/patients/{id}/relapse-plan` | View patient relapse plan |
| Medium | `/therapist/social-prescribing` | Browse services, create referrals |
| Lower | `/therapist/patients/{id}/assessments` | View assessments (with source) |
| Lower | `/therapist/patients/{id}/pre-session-checklist` | View patient checklist |
| Lower | `/therapist/patients/{id}/symptom-journal` | View patient journal |

---

## Database Migrations Summary

| Migration | Tables |
|-----------|--------|
| Journey stages | `journey_stages`, `user_journey_stages` |
| SMART goals | Add columns to `weekly_goals`; optional `smart_goal_templates` (strengths = SDQ) |
| Meeting preferences | Add columns to `users` / `profiles` |
| Treatment phases | `patient_treatment_phases`, `outcome_measure_completions` |
| Relapse prevention | `relapse_prevention_sections`, `patient_relapse_plans` (optional) |
| Social prescribing | `social_prescribing_services`, `social_prescribing_referrals` |
| Rewards | Add `category`, `is_featured` to `rewards` |
| Assessments | Add `source` to GAD7, PHQ9, PCL5 tables |
| Pre-session / journal | `pre_session_checklists`, `symptom_journal_entries` |

---

## Implementation Order Suggestion

1. **Registration fix** – Unblock users (patient API)  
2. **Outcome measures at 3 points** – Core clinical requirement (admin/therapist Blade + patient API)  
3. **Relapse prevention** – Admin Blade CRUD + patient API  
4. **Rewards layout** – Admin Blade views + patient API extensions  
5. **Journey stages** – Admin/therapist Blade + patient API for onboarding  
6. **Social prescribing** – Admin/therapist Blade + patient API  
7. **SMART goals** – Admin Blade (optional) + patient API extensions  
8. **Meeting preferences** – Admin/therapist Blade + patient API extension  
9. **Pre-session checklist + symptom journal** – Admin/therapist Blade + patient API  
