# 02 — Frontend Refactor and Domain Typing Plan

Status: Complete
Owner: Frontend Developer Agent
Orchestrated by: Planning & Orchestration Agent
Worktree branch: `agent/frontend/02-frontend-refactor`
Recommended worktree: `../worktrees/shifts-02-frontend-refactor`
Depends on: `01_figma_import_plan.md`
Next: `03_mock_api_plan.md`
Last updated: 2026-04-26 09:11Z

## Objective

Turn the imported Figma Make React snapshot into a maintainable React/PWA frontend without changing product scope or backend behavior. The goal is cleaner structure, explicit TypeScript domain types and role-oriented components while preserving the imported visual design.

## Required inputs

- Completed handoff from `01_figma_import_plan.md`.
- `docs/reports/figma_import_inventory.md`.
- Imported `pwa/src/app/**` from Figma Make.
- `docs/architecture/project_assumptions.md`.
- `docs/architecture/domain_model.md`.
- `docs/architecture/user_flow.mmd`.
- `docs/architecture/openapi.yaml` as read-only context.
- Accepted ADRs in `docs/adr/**`.

## Non-goals

- Do not implement backend.
- Do not modify `api/`.
- Do not modify `docs/architecture/openapi.yaml`.
- Do not replace mock data with real HTTP calls.
- Do not create the final service layer; that is phase 03.
- Do not redesign the product or add new screens beyond imported/MVP scope.
- Do not optimize the duty generation algorithm.

## Allowed paths

- `pwa/src/app/**`
- `pwa/src/components/**`, if the repository uses this path
- `pwa/src/domain/**` or `pwa/src/types/**`
- `pwa/src/features/**`, if introduced as the chosen structure
- `pwa/src/fixtures/**` or feature-local mock fixtures, only as a temporary pre-service step
- `pwa/src/styles/**`, only for small compatibility fixes
- `docs/reports/frontend_refactor_report.md`
- `docs/open_questions.md`
- `docs/execution_plans/02_frontend_refactor_plan.md`

## Forbidden paths

- `api/**`
- `docs/architecture/openapi.yaml`
- `docs/architecture/domain_model.md`
- `docs/architecture/er_diagram.md`
- `docs/architecture/project_assumptions.md`
- `docs/architecture/user_flow.mmd`
- `docs/adr/**`, except for recommending needed ADRs in the handoff

## Worktree setup

```bash
git fetch --all --prune
git worktree add ../worktrees/shifts-02-frontend-refactor -b agent/frontend/02-frontend-refactor main
cd ../worktrees/shifts-02-frontend-refactor
```

Use the integration branch that contains the merged phase 01 result.

Execution note, 2026-04-26 07:41Z: Phase 02 was executed in
`/Users/piotr/projects/worktrees/shifts-02-frontend-refactor` on
`agent/frontend/02-frontend-refactor`. The local Phase 01 branch did not yet
contain the imported `pwa/` snapshot in a commit, so the current Phase 01
snapshot was copied into this worktree before refactoring.

Integration note, 2026-04-26 09:11Z: current local `master` at `8517c65`
(`feat(pwa): import Figma Make frontend snapshot`) was merged into this branch.
Add/add conflicts across the imported `pwa/` files were resolved in favor of
the Phase 02 refactored versions, while the updated Phase 01 documentation from
`master` was retained. Temporary import-only files
`pwa/src/app/components/TestComponent.tsx` and
`pwa/src/app/components/figma/ImageWithFallback.tsx` were removed again after
the merge because they are not part of the refactored frontend structure.

## Dynamic update protocol

- Update this plan only to record discovered scope changes, validation results and handoff status.
- Do not remove prior notes; append corrections.
- Requirements gaps go to `docs/open_questions.md`.
- Architecture decisions go to ADR proposals.

## Target frontend structure

The exact layout may follow the repository conventions, but the final structure should be role- and domain-oriented. A good target is:

```text
pwa/src/
  app/
    App.tsx
    routes.tsx
  components/
    ui/
    shared/
  features/
    auth/
    admin/
    doctor/
    coordinator/
    schedules/
    availability/
    swaps/
    conflicts/
  domain/
    types.ts
    schedule.ts
    doctor.ts
    availability.ts
    swap.ts
    audit.ts
  fixtures/
    *.fixture.ts
```

If the imported Figma structure already uses `pwa/src/app/components/{admin,auth,coordinator,doctor,figma,shared,ui}`, preserve it unless moving to `features/` clearly reduces complexity.

## Domain typing requirements

Create explicit TypeScript types or interfaces for at least:

- `Role`: `ADMIN`, `COORDINATOR`, `DOCTOR`.
- `ScheduleStatus`: `DRAFT`, `GENERATED`, `PUBLISHED`, `ARCHIVED`.
- `Department`.
- `User`.
- `DoctorProfile`.
- `Qualification`.
- `Schedule`.
- `ScheduleParticipant`.
- `Shift` with 24-hour semantics.
- `Assignment` with source `GENERATED`, `MANUAL`, `SWAP`.
- `AvailabilityDeclaration` and `AvailabilityDay`.
- `PreferenceCategory`: category I, II, III.
- `LeaveRequest`.
- `SwapRequest`.
- `ConflictReport` / `ConflictItem`.
- `AuditLogEntry`.

Types must reflect `docs/architecture/domain_model.md`; do not invent new domain states without recording an open question.

## Step-by-step tasks

### A. Preflight

- [x] (2026-04-26 07:41Z) Confirm branch/worktree: `agent/frontend/02-frontend-refactor`.
- [x] (2026-04-26 07:41Z) Read phase 01 handoff and import inventory.
- [x] (2026-04-26 07:41Z) Inspect imported components and identify monoliths, duplicated UI and role-specific views.
- [x] (2026-04-26 07:41Z) Run the current frontend build before refactoring to establish baseline behavior.

### B. Structure cleanup

- [x] (2026-04-26 07:41Z) Split oversized Figma-generated components into smaller role or feature components.
- [x] (2026-04-26 07:41Z) Keep visual behavior close to the imported Figma design.
- [x] (2026-04-26 07:41Z) Remove temporary preview wrappers only if routing can render the same UI cleanly.
- [x] (2026-04-26 07:41Z) Consolidate repeated simple visual elements into `shared/` or `ui/` components without overengineering.
- [x] (2026-04-26 07:41Z) Keep design-system-level changes minimal and documented.

### C. TypeScript domain types

- [x] (2026-04-26 07:41Z) Create the frontend domain type module.
- [x] (2026-04-26 07:41Z) Replace untyped object literals in component props with typed props.
- [x] (2026-04-26 07:41Z) Align status and enum strings with `docs/architecture/domain_model.md` and `docs/architecture/openapi.yaml`.
- [x] (2026-04-26 07:41Z) Add helper types only when they reduce duplication.
- [x] (2026-04-26 07:41Z) Record any mismatch between Figma labels and domain terminology.

### D. Temporary data cleanup

- [x] (2026-04-26 07:41Z) Move large inline arrays/objects out of JSX into feature-local fixtures.
- [x] (2026-04-26 07:41Z) Do not create final `services/` yet unless the repository already requires it.
- [x] (2026-04-26 07:41Z) Keep data deterministic and representative of MVP flows.
- [x] (2026-04-26 07:41Z) Mark any unrealistic Figma sample data for replacement in phase 03.

### E. Role flow sanity check

- [x] (2026-04-26 07:41Z) Confirm Admin, Coordinator and Doctor views are separated at component/routing level.
- [x] (2026-04-26 07:41Z) Confirm Coordinator views are desktop-first and Doctor views are mobile-first where applicable.
- [x] (2026-04-26 07:41Z) Confirm published schedule UI does not suggest ordinary assignment editing.
- [x] (2026-04-26 07:41Z) Confirm shift swap UI appears only as a post-publication flow.
- [x] (2026-04-26 07:41Z) Prepare UX handoff notes for UX Designer Gate A.

### F. Validation and report

- [x] (2026-04-26 07:41Z) Run frontend build.
- [x] (2026-04-26 07:41Z) Run typecheck if configured.
- [x] (2026-04-26 07:41Z) Run lint if configured.
- [x] (2026-04-26 07:41Z) Create `docs/reports/frontend_refactor_report.md` with changed structure, remaining risks and phase 03 recommendations.

## Validation commands

Use actual scripts from `pwa/package.json`. Typical examples:

```bash
cd pwa
pnpm run build
pnpm run typecheck
pnpm run lint
```

If the project uses npm or yarn, use the matching package manager.

## UX Designer Gate A request

After this phase, the Orchestration Agent should create a separate UX worktree/branch, for example:

```text
branch: agent/ux/ux-gate-a-after-frontend-refactor
worktree: ../worktrees/shifts-ux-gate-a
```

UX Designer should review:

- Role separation: Admin, Coordinator, Doctor.
- Coordinator schedule editing usability.
- Doctor availability and swap flow clarity.
- Empty, loading, conflict and error states.
- Basic accessibility: labels, keyboard flow, focus states, contrast and landmarks.

## Acceptance criteria

- Imported Figma code is refactored into maintainable components.
- UI remains visually close to the Figma Make snapshot.
- Frontend domain types exist and match the MVP domain.
- Large inline business data no longer lives directly in JSX.
- No backend files were modified.
- No real API calls were introduced.
- Build and available static checks pass, or blocking failures are documented.
- `docs/reports/frontend_refactor_report.md` exists.

## Risks

- Refactoring may accidentally change visual layout.
- Figma-generated components may contain hidden coupling between routes, state and data.
- Type definitions may diverge from `docs/architecture/openapi.yaml`; phase 04 must reconcile this.
- Moving too much into abstractions may slow future integration.

## Rollback plan

- Revert this branch if visual behavior regresses materially.
- Keep refactor commits small enough to cherry-pick individual improvements.
- If the new structure fails, preserve only the domain types and return components to the imported structure.

## Handoff

- Branch/worktree: `agent/frontend/02-frontend-refactor` at `/Users/piotr/projects/worktrees/shifts-02-frontend-refactor`.
- Completed: package hygiene, strict TypeScript setup, Biome lint setup, canonical frontend domain types, typed fixtures, oversized component split, cleanup of unused Figma files, role-flow sanity check, and integration of local `master` commit `8517c65`.
- Validation: after integrating `master`, `corepack pnpm run typecheck`, `corepack pnpm run lint`, and `corepack pnpm run build` all passed from `pwa/`. Vite build transformed 1,672 modules.
- Known issues: no screenshot-level browser comparison was run; UX Gate A should perform formal visual review. The Phase 02 implementation began from a copied Phase 01 snapshot because the import was not yet committed in the source worktree at execution start, but this branch now also contains the committed Phase 01 import from `master`.
- Open questions: none added in this phase.
- UX Gate A readiness: ready. Review mixed PL/EN labels preserved from the Figma import and responsive behavior for doctor mobile views.
- Files changed: `pwa/**`, `docs/reports/frontend_refactor_report.md`, `docs/reports/figma_import_inventory.md`, `docs/open_questions.md`, `docs/execution_plans/01_figma_import_plan.md`, `docs/execution_plans/02_frontend_refactor_plan.md`.
- Recommended next step: Phase 03 mock API.

## Change log

| Timestamp UTC | Agent | Change |
|---|---|---|
| YYYY-MM-DD HH:MMZ | Frontend Developer Agent | Initial English frontend refactor plan. |
| 2026-04-26 07:41Z | Frontend Developer Agent | Recorded the completed Phase 02 refactor and validation handoff. |
| 2026-04-26 09:11Z | Git Integrator Agent | Integrated local `master` into the Phase 02 branch, kept the refactored frontend versions for add/add conflicts, and refreshed the handoff after post-merge validation. |
