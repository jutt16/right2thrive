# Right2Thrive UK — UX & Design Recommendations

A strategic document to improve user experience, design quality, and competitive positioning for the Right2Thrive wellbeing platform.

---

## 1. Navigation & Information Architecture

### Implemented ✅
- **Persistent sidebar** for authenticated users with all main options visible (Dashboard, Wellbeing Hub, Goals, Assessments, Bookings, etc.)

### Further Recommendations
- **Breadcrumbs**: Add breadcrumb navigation on deep pages (e.g. Wellbeing Hub → PHQ-9) for orientation.
- **Global search**: Allow users to search for assessments, resources, or actions from the header.
- **Quick actions**: Add a floating "Quick check-in" or "Risk assessment" shortcut for high-priority actions.
- **Recently visited**: Show last 3–5 visited sections in the sidebar for faster re-entry.

---

## 2. Visual Design & Branding

### Current strengths
- Green (#00990d) brand colour is recognisable.
- Clear focus on safety (Risk Assessment prominence).

### Recommendations
- **Colour system**: Define a consistent palette for success/warning/error states and use it across assessments (e.g. GAD-7, PHQ-9 severity colours).
- **Dark mode**: Add full dark mode support for comfort in low-light environments.
- **Cultural aesthetics**: Add optional theme variations or imagery that reflects different cultural backgrounds to strengthen “culturally responsive” positioning.
- **Illustration style**: Use a consistent illustration style (e.g. hand-drawn, inclusive characters) across onboarding and empty states.
- **Typography**: Consider a secondary font for headings (e.g. DM Sans, Nunito) to differentiate from body text and improve hierarchy.

---

## 3. Onboarding & First-Time Experience

### Recommendations
- **Progressive disclosure**: Show new users a short checklist (e.g. “Complete profile”, “Complete first check-in”, “Book first session”) to reduce overwhelm.
- **Contextual tooltips**: On first visit to each section, show brief contextual tips (dismissible).
- **Welcome tour**: Optional 60-second product tour for new users with clear “Skip” option.
- **Personalisation prompts**: Ask “What brings you here today?” or “How are you feeling right now?” to tailor the first view.
- **Coach/therapist selection**: Make “Choose Your Wellbeing Coach” more visible and engaging with photos, short bios, and availability.

---

## 4. Wellbeing Hub & Assessments

### Recommendations
- **Assessment summaries**: After completing an assessment, show a clear summary card with severity, trends, and “What this means” in plain language.
- **Progress visualisation**: Use charts and trends (e.g. PHQ-9 over time) with sensitivity; consider optional “show history” to avoid triggering.
- **Reminders**: Allow users to set optional reminders for follow-up assessments (e.g. “Remind me in 2 weeks”).
- **Export & sharing**: Let users export their progress (PDF) for their therapist or personal records.
- **Symptom journal**: Add a simple daily mood/ symptom log that feeds into dashboards.
- **Pre-session prep**: On the day of a booking, show a short “Before your session” checklist (check-in, goals, reflection) to maximise session value.

---

## 5. Engagement & Retention

### Recommendations
- **Thrive Tokens**: Make rewards more visible—leaderboards (opt-in), progress bars, and clear next reward.
- **Streaks**: Consider light gamification (e.g. “You’ve checked in 3 days in a row”) with opt-out.
- **Weekly digest**: Optional email or in-app summary: “This week you completed X assessments and earned Y tokens.”
- **Micro-celebrations**: Celebrate milestones (e.g. “First assessment completed”, “5 sessions attended”) with simple animations or badges.
- **Reflection prompts**: Rotate reflection questions after sessions to keep engagement fresh.

---

## 6. Mobile & Responsive Experience

### Recommendations
- **PWA**: Enable full Progressive Web App support (offline basics, “Add to Home Screen”) for app-like use.
- **Touch targets**: Audit all interactive elements to be ≥44×44px.
- **Bottom nav**: Consider a bottom navigation bar on mobile for primary actions (Dashboard, Hub, Bookings, Profile).
- **Swipe gestures**: Use swipe-to-go-back where appropriate.
- **Reduced motion**: Respect `prefers-reduced-motion` for animations.

---

## 7. Accessibility & Inclusion

### Recommendations
- **Screen reader labels**: Audit all interactive elements for clear `aria-label` and role.
- **Focus indicators**: Ensure visible focus rings on all focusable elements.
- **Contrast**: Run WCAG AA checks; ensure text/background contrast ≥4.5:1.
- **Language**: Prepare for multi-language support (e.g. BSL, community languages).
- **Cognitive load**: Keep forms short; use multi-step wizards for long assessments.
- **Plain language**: Replace jargon (e.g. “PHQ-9”) with user-friendly terms where possible, with “Learn more” for technical details.

---

## 8. Trust, Safety & Privacy

### Recommendations
- **Privacy reassurance**: Add clear “Your data is confidential” and “Only your therapist sees X” notes on sensitive screens.
- **Crisis support**: Keep crisis helpline (116 123, SHOUT 85258) always visible in sidebar or footer for authenticated users.
- **Session security**: Add short explanations for video/chat security (e.g. encrypted).
- **Data control**: Let users download all their data (GDPR-style export) from profile/settings.
- **Consent tracking**: Clearly show what data is used for and allow granular consent.

---

## 9. Performance & Technical UX

### Recommendations
- **Loading states**: Use skeletons or progressive loading instead of spinners where possible.
- **Offline handling**: Show a clear message when offline and queue actions for when back online.
- **Error messages**: Use friendly, actionable error messages with recovery steps.
- **Form persistence**: Save drafts of long forms (assessments) to localStorage to prevent loss on refresh.

---

## 10. Competitive Differentiation

### Recommendations
- **Cultural fit questionnaire**: Add an optional “Culture & identity” section for users to share what matters to them (language, traditions, values).
- **Therapist matching**: Use cultural preferences in therapist matching (when applicable).
- **Community feel**: Optional peer support or group activities (e.g. workshops, events) to reduce isolation.
- **Parent/carer portal**: Consider a read-only or limited view for parents/carers (with consent) to support young people.
- **Evidence base**: Highlight evidence-based tools (e.g. “GAD-7 is used by NHS”) to build trust.

---

## 11. Quick Wins (Low Effort, High Impact)

| Priority | Action |
|----------|--------|
| High | Add breadcrumbs to assessment and hub pages |
| High | Add “Crisis support” link in sidebar footer |
| Medium | Add empty-state illustrations for “No assessments yet” |
| Medium | Improve loading skeletons on dashboard |
| Medium | Add “Copy link” for session/booking details |
| Low | Add keyboard shortcut (e.g. `?`) for help/shortcuts |
| Low | Add “Was this helpful?” feedback on key actions |

---

## 12. Metrics to Track

- **Engagement**: Weekly active users, assessments completed per user, session attendance rate.
- **Onboarding**: % completing first assessment within 7 days of signup.
- **Retention**: Return rate at 7, 30, 90 days.
- **Satisfaction**: NPS or CSAT after sessions; optional in-app feedback.
- **Accessibility**: Automated axe/lighthouse scores in CI.

---

## Summary

Right2Thrive’s focus on cultural wellbeing and young people is a strong differentiator. To stay competitive:

1. **Simplify navigation** – Sidebar (done); add search and breadcrumbs.
2. **Strengthen trust** – Privacy, crisis support, and evidence-based messaging.
3. **Boost engagement** – Progress visualisation, gentle gamification, reflection prompts.
4. **Improve accessibility** – Contrast, labels, plain language.
5. **Optimise mobile** – PWA, bottom nav, touch targets.
6. **Differentiate** – Cultural questionnaire, therapist matching, community features.

Prioritise items that directly support safety (crisis support, Risk Assessment visibility) and engagement (first assessment completion, session prep) before advanced features.
