# Right2Thrive – Remaining Features: Admin, Therapist & Backend Implementation

*Implementation guide for Admin panel, Therapist portal, and Laravel API based on [REMAINING_FEATURES.md](./REMAINING_FEATURES.md)*

---

## Overview

| Role | Scope |
|------|-------|
| **Admin** | Content management, configuration, user management, Thrive Tokens rules/rewards |
| **Therapist** | Patient view, assessments, treatment phase, outcome reminders, notes |
| **Backend (Laravel)** | API endpoints, database migrations, business logic, integrations |

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

### 1.4 APIs Needed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/journey-stages` | Public/Patient | List stages for onboarding |
| `GET` | `/api/user/journey-stage` | Patient | Current stage |
| `PUT` | `/api/user/journey-stage` | Patient | Self-set stage (e.g. during onboarding) |
| `GET` | `/api/therapist/patients/{id}/journey-stage` | Therapist | Patient stage |
| `PUT` | `/api/therapist/patients/{id}/journey-stage` | Therapist | Update patient stage |
| `GET` | `/api/admin/journey-stages` | Admin | List all stages |
| `POST` | `/api/admin/journey-stages` | Admin | Create stage |
| `PUT` | `/api/admin/journey-stages/{id}` | Admin | Update stage |

---

## 2. Strengths Assessment & SMART Goals

### 2.1 Admin

| Task | Description |
|------|-------------|
| **Strengths questions** | CRUD for strengths questionnaire (similar to GAD7/PHQ9) |
| **SMART goal templates** | Manage SMART prompts/templates for goals |
| **Display order** | Order questions and templates |

### 2.2 Therapist

| Task | Description |
|------|-------------|
| **View strengths** | See patient strengths assessment results |
| **View SMART goals** | See patient goals with SMART structure |
| **Add SMART prompts** | Optional: add notes/prompts for patient goals |

### 2.3 Backend (Laravel)

| Task | Description |
|------|-------------|
| **Migration** | `strengths_questions`, `strengths_assessments`, `strengths_answers` |
| **Migration** | Add `is_smart` or SMART fields to `weekly_goals` / wellbeing plan goals |
| **Models** | `StrengthsQuestion`, `StrengthsAssessment`, `StrengthsAnswer` |
| **Service** | Strengths scoring logic |

### 2.4 APIs Needed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/strengths/questions` | Patient | Get strengths questions |
| `POST` | `/api/strengths/assessments` | Patient | Submit strengths assessment |
| `GET` | `/api/strengths/assessments` | Patient | List own assessments |
| `GET` | `/api/therapist/patients/{id}/strengths` | Therapist | Patient strengths |
| `GET` | `/api/admin/strengths/questions` | Admin | List questions |
| `POST` | `/api/admin/strengths/questions` | Admin | Create question |
| `PUT` | `/api/admin/strengths/questions/{id}` | Admin | Update question |
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

### 3.4 APIs Needed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `PUT` | `/api/user` | Patient | Add `preferred_meeting_type`, `environment_notes` (extend existing) |
| `GET` | `/api/user` | Patient | Return preferences (extend existing) |
| `GET` | `/api/therapist/patients/{id}` | Therapist | Include patient preferences (extend existing) |
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

### 4.4 APIs Needed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/patient/outcome-measures/status` | Patient | Current phase, what's due, what's done |
| `GET` | `/api/therapist/patients/{id}/treatment-phase` | Therapist | Patient phase + completion status |
| `PUT` | `/api/therapist/patients/{id}/treatment-phase` | Therapist | Set phase (baseline/midpoint/end) |
| `POST` | `/api/therapist/patients/{id}/send-assessment-reminder` | Therapist | Send reminder |
| `GET` | `/api/therapist/outcome-measures-due` | Therapist | List patients with assessments due |
| `GET` | `/api/admin/treatment-phases/config` | Admin | Get phase config |
| `PUT` | `/api/admin/treatment-phases/config` | Admin | Update phase config (e.g. mid-point = session 4) |

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

### 5.4 APIs Needed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/relapse-prevention` | Patient | List sections (or single page content) |
| `GET` | `/api/admin/relapse-prevention` | Admin | List sections |
| `POST` | `/api/admin/relapse-prevention` | Admin | Create section |
| `PUT` | `/api/admin/relapse-prevention/{id}` | Admin | Update section |
| `DELETE` | `/api/admin/relapse-prevention/{id}` | Admin | Soft delete section |
| `GET` | `/api/patient/relapse-plan` | Patient | Own relapse plan (if custom) |
| `PUT` | `/api/patient/relapse-plan` | Patient | Save own relapse plan |
| `GET` | `/api/therapist/patients/{id}/relapse-plan` | Therapist | View patient plan |

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

### 6.4 APIs Needed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/social-prescribing` | Patient | List services (filter by category, area) |
| `GET` | `/api/social-prescribing/{id}` | Patient | Service detail |
| `GET` | `/api/admin/social-prescribing` | Admin | List all services |
| `POST` | `/api/admin/social-prescribing` | Admin | Create service |
| `PUT` | `/api/admin/social-prescribing/{id}` | Admin | Update service |
| `GET` | `/api/therapist/social-prescribing` | Therapist | List services |
| `POST` | `/api/therapist/patients/{id}/social-prescribing-referral` | Therapist | Create referral |
| `GET` | `/api/therapist/social-prescribing-referrals` | Therapist | List own referrals |

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
| **Extend** | Ensure `GET /api/thrive-tokens/rewards` returns category, featured flag |

### 7.4 APIs Needed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/thrive-tokens/rewards` | Patient | Add `category`, `is_featured` to response (extend existing) |
| `GET` | `/api/admin/thrive-tokens/rewards` | Admin | Add category filter (extend existing) |
| `POST` | `/api/admin/thrive-tokens/rewards` | Admin | Accept `category`, `is_featured` (extend existing) |
| `PUT` | `/api/admin/thrive-tokens/rewards/{id}` | Admin | Accept `category`, `is_featured` (extend existing) |

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

### 8.4 APIs Needed

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

### 9.4 APIs Needed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/assessments/gad7` | Patient | Add `source` in request/response (extend existing) |
| `POST` | `/api/assessments/phq9` | Patient | Add `source` (extend existing) |
| `POST` | `/api/pcl5/assessments` | Patient | Add `source` (extend existing) |
| `GET` | `/api/therapist/patients/{id}/assessments` | Therapist | Include `source` in assessment data |

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

### 10.4 APIs Needed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bookings/{id}` | Patient | Return `meeting_link` for copy (extend existing) |
| `GET` | `/api/pre-session-checklist` | Patient | Get checklist for upcoming booking |
| `POST` | `/api/pre-session-checklist` | Patient | Submit checklist |
| `GET` | `/api/symptom-journal` | Patient | List entries (with date filter) |
| `POST` | `/api/symptom-journal` | Patient | Create entry |
| `GET` | `/api/therapist/patients/{id}/pre-session-checklist` | Therapist | View patient checklist |
| `GET` | `/api/therapist/patients/{id}/symptom-journal` | Therapist | View patient journal |
| `GET` | `/api/admin/pre-session-checklist/config` | Admin | Get checklist items |
| `PUT` | `/api/admin/pre-session-checklist/config` | Admin | Update checklist items |

---

## Summary: New API Endpoints by Priority

### High Priority

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/register` | POST | Fix registration (existing) |
| `/api/patient/outcome-measures/status` | GET | Outcome measures status |
| `/api/therapist/patients/{id}/treatment-phase` | GET, PUT | Treatment phase |
| `/api/therapist/outcome-measures-due` | GET | Patients due assessments |
| `/api/relapse-prevention` | GET | Relapse prevention content |
| `/api/admin/relapse-prevention` | GET, POST, PUT, DELETE | Manage content |

### Medium Priority

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/journey-stages` | GET | Stages for onboarding |
| `/api/user/journey-stage` | GET, PUT | Patient stage |
| `/api/therapist/patients/{id}/journey-stage` | GET, PUT | Therapist sets stage |
| `/api/strengths/*` | Various | Strengths assessment |
| `/api/social-prescribing` | GET | Social prescribing services |
| `/api/admin/social-prescribing` | CRUD | Manage services |
| `/api/admin/thrive-tokens/rewards` | Extend | Add category, featured |

### Lower Priority

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/user` | PUT | Add meeting preferences (extend) |
| `/api/pre-session-checklist` | GET, POST | Pre-session checklist |
| `/api/symptom-journal` | GET, POST | Symptom journal |
| `/api/admin/journey-stages` | CRUD | Manage stages |

---

## Database Migrations Summary

| Migration | Tables |
|-----------|--------|
| Journey stages | `journey_stages`, `user_journey_stages` |
| Strengths | `strengths_questions`, `strengths_assessments`, `strengths_answers` |
| Meeting preferences | Add columns to `users` / `profiles` |
| Treatment phases | `patient_treatment_phases`, `outcome_measure_completions` |
| Relapse prevention | `relapse_prevention_sections`, `patient_relapse_plans` (optional) |
| Social prescribing | `social_prescribing_services`, `social_prescribing_referrals` |
| Rewards | Add `category`, `is_featured` to `rewards` |
| Assessments | Add `source` to GAD7, PHQ9, PCL5 tables |
| Pre-session / journal | `pre_session_checklists`, `symptom_journal_entries` |

---

## Implementation Order Suggestion

1. **Registration fix** – Unblock users  
2. **Outcome measures at 3 points** – Core clinical requirement  
3. **Relapse prevention** – Content + API  
4. **Rewards layout** – Admin + API extensions  
5. **Journey stages** – Onboarding personalisation  
6. **Social prescribing** – New feature  
7. **Strengths + SMART goals** – Enhance goals  
8. **Meeting preferences** – Small extension  
9. **Pre-session checklist + symptom journal** – UX improvements  
