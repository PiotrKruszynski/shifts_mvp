# UX Gate B Report After API Integration

Last updated: 2026-04-26 15:22Z
Agent: UX Designer Agent
Branch: `agent/ux/ux-gate-b-after-api-integration`
Worktree: `/Users/piotr/projects/worktrees/shifts-ux-gate-b`

## Handoff

- Branch/worktree: `agent/ux/ux-gate-b-after-api-integration` / `/Users/piotr/projects/worktrees/shifts-ux-gate-b`
- Base branch: `master`
- Current HEAD: `74c9624b8f712d1d0ee9c8b80c90927689dc777e`
- Contains master: yes
- Completed: UX Gate B review of integrated PWA against real FastAPI backend and accepted Phase 02 / UX Gate A baseline.
- Validation/review method: documentation review; seeded backend reset; local API at `http://127.0.0.1:8000/api/v1`; PWA at allowed CORS origin `http://127.0.0.1:4173`; Playwright-driven desktop and mobile review for Admin, Coordinator and Doctor routes; direct API sanity checks for doctor seed accounts.
- Visual drift: minor
- Blocking UX issues: none
- Non-blocking UX issues: see below
- Accessibility notes: see below
- Files changed: `docs/reports/ux_gate_b_report.md`
- Open questions: none blocking
- Gate decision: PASS WITH NON-BLOCKING ISSUES
- Recommended next step: proceed to Phase 07 quality/release validation and track the non-blocking UX polish items there.

## Review Scope

Reviewed against the Phase 02 / UX Gate A baseline expectations:

- no redesign or layout rebuild after API integration;
- role routes preserved for Admin, Coordinator and Doctor;
- Doctor mobile availability and swap flows remain simple;
- published-only swap behavior remains visible;
- Coordinator conflict and validation information remains discoverable;
- API-driven loading and error states are visible;
- accessibility basics continue to hold at the level established by UX Gate A.

## Completed

- Read the master execution plan, Phase 06 integration plan, integration report, domain model and user flow.
- Checked current Git state: branch contains `origin/master` at `74c9624`.
- Reset backend seed data and reviewed the integrated app against the local backend.
- Reviewed Admin users, departments, settings and audit flows on desktop and mobile.
- Reviewed Coordinator dashboard, schedules, draft editor conflict state, swaps, metrics and audit flows on desktop and mobile.
- Reviewed Doctor dashboard, availability, schedule, swap request and leave request flows on desktop and mobile.
- Captured browser evidence under `/tmp/shifts-ux-b-screens-final/` for the reviewed states.

## API-Driven Loading And Error States

Pass with notes.

- Route-level loading states are present for integrated service calls, for example Doctor availability and swap form loading messages.
- When API calls fail, the UI shows an error surface instead of a blank page.
- The raw fallback `Failed to fetch` remains possible when the frontend is served from a non-allowed local origin. This was observed on `5175`; the documented and reviewed origin `4173` works. This is a local setup sharp edge rather than a product blocker.
- Error copy is functional but plain. Phase 07 can improve user-facing API failure text if release polish allows it.

## Coordinator Conflict Explanations

Pass with non-blocking issue.

- The draft schedule editor clearly surfaces unresolved conflicts through summary cards and a validation panel.
- The Coordinator can see affected dates and that the schedule cannot be published while blocking issues remain.
- Current conflict descriptions are too technical and partially English: for example `Shift 2026-05-01 has no doctor`.
- Recommended Phase 07 polish: translate conflict messages and add one action hint, such as "Brak dostępnego lekarza na ten dyżur. Dodaj dostępność, przypisz ręcznie albo uruchom generator ponownie po korekcie danych."

## Doctor Availability Flow On Mobile

Pass.

- The mobile layout remains simple: header, deadline notice, calendar grid, legend, day details and sticky save action.
- Selecting a day reveals status and comment controls without requiring navigation away from the calendar.
- Disabled save state is understandable before any change.
- Labels are present for status and comment fields after day selection.
- No horizontal page overflow was detected at `390px` width.

## Doctor Schedule And Swap Flows On Mobile

Pass with non-blocking issue.

- Published schedule cards show swap actions and explain that swaps are available only after publication.
- The swap flow remains a clear three-step process: own shift, other doctor shift, summary.
- Step guidance is understandable on mobile and preserves the Phase 02 / UX Gate A intent.
- A data-label drift remains in the Doctor header: the layout still says `Dr Anna Kowalska`, while backend seed data greets `Dorota`. This is confusing but does not block the flow.

## Published Schedule Immutability

Pass.

- Doctor schedule copy explains that swap is the post-publication change path.
- Coordinator published schedules expose a read-oriented action (`Podglad`) rather than direct editing.
- Draft schedule publication is blocked while conflicts exist.
- Audit copy reinforces append-only history.

## Admin Users, Departments And Settings

Pass with non-blocking accessibility notes.

- Admin users and departments render correctly from API-backed data.
- Settings and audit remain usable on mobile and desktop.
- Real seed data is smaller than mock data but does not break the flows.
- Some form controls in settings/audit are visually labeled but not programmatically associated with labels.

## Accessibility Notes

Non-blocking issues:

- Mobile role layout menu buttons have no accessible name in the reviewed Admin surfaces.
- Several Admin settings and audit form controls are visually labeled but not connected through `htmlFor`/`id`, `aria-label` or `aria-labelledby`.
- Core landmarks are present: reviewed role shells expose `main` and navigation regions.
- Focusable controls remain keyboard-reachable in the reviewed flows.
- No obvious contrast regression was observed in the reviewed browser screenshots.

## Visual Drift

Minor.

- No large redesign, layout rewrite or backend-driven UI restructuring was observed.
- The accepted Phase 02 / UX Gate A visual direction is preserved.
- Minor drift comes from real seed data and adapter labels:
  - mixed English/Polish labels such as `May 2026`, `Tuesday`, `Weekday` and `Unassigned shift`;
  - static role-shell name `Dr Anna Kowalska` does not match the API-backed doctor greeting `Dorota`;
  - Coordinator dashboard says `Oddzial Chirurgii` while API-backed department data elsewhere is `Kardiologia`;
  - the draft editor summary reports `24 aktywnych w grafiku` with only three backend seed doctors, which reads like an adapter/count label issue.

These are noticeable but not blocking for entering Phase 07, where release-quality copy and data consistency can be hardened.

## Gate Decision

PASS WITH NON-BLOCKING ISSUES.

Phase 07 is allowed. The app is ready for quality/release validation, with the expectation that Phase 07 tracks the non-blocking UX polish items around translated conflict explanations, API-backed identity labels, settings/audit labels and mobile menu accessible names.
