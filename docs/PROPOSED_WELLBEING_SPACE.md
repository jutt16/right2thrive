# Proposed: Wellbeing Space consolidation (`/my-wellbeing`)

| | |
|---|---|
| **Document** | Product / UX proposal |
| **Created** | 2026-03-23 |
| **Status** | Not implemented — for review |

**Goal:** Fewer sidebar items, less technical navigation, and one clear home for personal wellbeing tools.

---

## 1. Problem

- **Two mental models:** “My Wellbeing Space” (`/my-wellbeing`) and “Wellbeing Hub” (`/wellbeing-hub`) both surface questionnaires, risk tools, and resources. Users must choose between similar destinations.
- **Busy sidebar:** Hub-specific items (and duplicates already reachable from `/my-wellbeing`) increase cognitive load.
- **Clinical labels:** GAD-7, PHQ-9, PCL-5, etc. read as clinical/admin rather than supportive.

---

## 2. Direction

1. **Make `/my-wellbeing` the single hub** for everything that is “my tools, my care, my progress.”
2. **Remove the standalone Wellbeing Hub entry** from the sidebar (and avoid treating `/wellbeing-hub` as a second top-level product in nav).
3. **Organise `/my-wellbeing` in clear sections** (cards or accordions) so users browse by intent, not by route name.
4. **Keep or migrate URLs** so bookmarks, emails, and external links keep working (see §5).

---

## 3. Information architecture on `/my-wellbeing`

Suggested **on-page sections** (plain-language titles; clinical codes optional as subtitle):

| Section (user-facing) | Typical contents |
|----------------------|------------------|
| **This week** | Dashboard link, weekly goals, weekly progress |
| **Check-ins** | Anxiety / low mood / SDQ / trauma-related questionnaires (with friendly names) |
| **Safety & support** | Risk assessment (prominent), support, crisis info |
| **Sessions** | My bookings, pre-session checklist, reflect after session, voice call |
| **Your plan & journal** | Wellbeing plan, symptom journal, relapse prevention |
| **Rewards & profile** | Thrive tokens, profile, complaints |
| **Learn more** | Resources (and any hub “insights/history” if retained — see §4) |

The current grid on `/my-wellbeing` can evolve into **grouped blocks** with short intros, instead of one long flat list.

---

## 4. What to do with `/wellbeing-hub` today

**Important:** In the codebase, `/wellbeing-hub` is not only a simple index — it includes substantial UI (e.g. assessment flows, charts/history patterns, navigation back to “hub”). Consolidation is a **product + engineering** decision:

| Approach | Pros | Cons |
|----------|------|------|
| **A. Redirect hub root → `/my-wellbeing`** | Simple; one front door | Large hub dashboard content must move or be dropped |
| **B. Embed hub dashboard as a section/tab on `/my-wellbeing`** (e.g. “My progress & history”) | Preserves power-user features in one place | More layout work |
| **C. Keep `/wellbeing-hub/*` routes for tools only; redirect `/wellbeing-hub` → `/my-wellbeing`** | Minimal breakage; sidebar still simplified | Two URL prefixes until a later rename |

**Recommendation for phased delivery:** **C** first (remove duplicate nav + redirect landing), then **B** if the hub dashboard must stay visible.

---

## 5. URL and routing strategy

- **Bookmarks:** Add **permanent redirects** (301 or 308) from `/wellbeing-hub` → `/my-wellbeing` when the hub landing is retired.
- **Child routes:** Either:
  - **Keep** `/wellbeing-hub/gad7`, `phq9`, etc. and only update **in-app links** to point from `/my-wellbeing` sections (no user-facing “Hub” name), or
  - **Move** to `/my-wellbeing/...` and redirect old paths (cleaner long term, more file moves).

**Files that reference `/wellbeing-hub` today** (non-exhaustive; grep before implementation):

- `components/app-sidebar.tsx`
- `components/navbar.tsx`, `components/footer.tsx`, `components/conditional-footer.tsx`, `components/app-shell.tsx`
- `app/my-wellbeing/page.tsx`
- `app/my-wellbeing/dashboard/page.tsx`
- `app/wellbeing-hub/*` (internal `router.push` / `Link` back to hub)
- Marketing: `app/about/page.tsx`

---

## 6. Sidebar changes (proposal)

**Remove or fold into `/my-wellbeing` only (not duplicated in sidebar):**

- Top-level **“Wellbeing Hub”** link.
- Individual duplicates that are already grouped on `/my-wellbeing`, **if** the space page becomes the primary entry — e.g. assessments and hub resources could disappear as separate sidebar groups and appear only under **one** item: **“My Wellbeing Space”** (and optionally **“My Dashboard”**).

**Keep in sidebar (minimal set example):**

- **Site** block (if required for your product).
- **My Dashboard** (`/my-wellbeing/dashboard`).
- **My Wellbeing Space** (`/my-wellbeing`) — primary door to all tools.
- **My Bookings** (high intent; many users expect it visible).
- **Account** (profile, complaints, logout).

Exact cuts depend on whether you still want **direct** sidebar access to bookings, voice call, etc., or **only** via `/my-wellbeing`.

---

## 7. Implementation checklist (high level)

1. **UX copy:** Friendly labels + optional “Also known as GAD-7” tooltips.
2. **`/my-wellbeing` layout:** Sectioned UI; internal links to existing tool routes.
3. **Redirect:** `/wellbeing-hub` → `/my-wellbeing` (and update “back” targets in hub subpages to `/my-wellbeing` or dashboard).
4. **Sidebar + nav + footer:** Drop Hub entry; align links with new IA.
5. **QA:** Logged-in flows, therapist-assigned vs not, deep links, mobile sidebar.
6. **Optional later:** Move routes under `/my-wellbeing/*` + redirects from `/wellbeing-hub/*`.

---

## 8. Success criteria

- Users can complete common tasks **without** understanding “Hub” vs “Space.”
- Sidebar **noticeably shorter** for typical wellbeing journeys.
- No broken bookmarks after redirects and link updates.
- Language feels **supportive**, not like a clinical admin panel.

---

## 9. Open questions

- Should **public/marketing** links to “Wellbeing Hub” on About / Press point to `/my-wellbeing` (login required) or a **public** landing page?
- Is the **large hub dashboard** (`app/wellbeing-hub/page.tsx`) still required for clinicians/patients, or can its features move to **My Dashboard** only?

---

## 10. Further suggestions (same spirit)

Ideas that also reduce “technical / admin” feel and support one clear journey. Pick what fits your roadmap.

### Navigation & structure

- **Split “public site” vs “my app”** in the sidebar: collapse **Site** (Home, About, Blog, etc.) behind a single **“Visit website”** or accordion so logged-in wellbeing tasks stay on top.
- **Align navbar + sidebar:** If both repeat the same links, keep **one** primary pattern (e.g. sidebar for app, navbar minimal: logo, notifications, profile).
- **“What should I do today?” block** at the top of `/my-wellbeing` or dashboard: 1–3 suggested actions (from journey stage, bookings, incomplete check-ins) instead of a flat tool list.
- **Optional “All tools” drawer or page** for users who want the full alphabetical list — default view stays short and grouped.

### Language & tone

- **One vocabulary:** Choose **coach / therapist / practitioner** and use it consistently in UI and emails.
- **Soften system language:** Replace “Submit”, “Execute”, “Validate” with “Save”, “Send”, “Continue” where possible.
- **Short reassurance lines** on sensitive screens (questionnaires, risk): time estimate (“About 3 minutes”), privacy one-liner, “You can pause and come back” if true.

### Dashboard & empty states

- **Dashboard as story, not directory:** Lead with next session, progress snippet, or one highlighted goal; link “See all tools” to `/my-wellbeing`.
- **Friendly empty states:** e.g. “No bookings yet” + one button **Book a session** instead of only an empty table.
- **Celebrate small wins** (completed check-in, goal logged) with low-key confirmation copy, not alert banners unless urgent.

### Mobile & accessibility

- **Sticky safe actions on small screens:** e.g. **Book** / **Get support** in a bottom bar or header on key routes.
- **Touch targets** at least ~44px for primary actions; avoid dense rows of small text links.
- **Reading level:** Shorter sentences on forms; avoid nested clinical terms in the same sentence as instructions.

### Power users without cluttering defaults

- **“Find a tool” search** on `/my-wellbeing` once you have many links — helps without showing everything at once.
- **Deep links preserved:** Any consolidation should keep working URLs or redirects (already in §5); document renamed paths for support staff.

### Trust & safety UX

- **Crisis / urgent support** always visible in the same place (footer + sidebar you already use — keep consistent across new layouts).
- **After high-risk flows:** Clear “what happens next” (e.g. “Someone may reach out” / “These answers are only seen by…”) aligned with your actual process.

### Technical debt that shows up as “confusing product”

- **Remove dead or duplicate routes** from nav if features are retired (stops “which one is real?”).
- **Loading states:** Prefer skeletons or short “Loading…” over blank screens on dashboard/hub data.

---

*End of proposal.*
