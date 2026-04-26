# 03 — Frontend Mock API / Service Layer Plan

Status: Complete
Owner: Frontend Developer Agent
Orchestrated by: Planning & Orchestration Agent
Worktree branch: `agent/frontend/03-mock-api`
Recommended worktree: `../worktrees/shifts-03-mock-api`
Depends on: `02_frontend_refactor_plan.md` and UX Gate A notes
Next: `04_openapi_alignment_plan.md`
Last updated: 2026-04-26 11:24Z

## Objective

Create an asynchronous frontend service layer that lets the PWA behave as if a backend exists while still using deterministic local mock data. This phase separates UI from data access and prepares the project for OpenAPI alignment and backend implementation.

## Required inputs

- Completed handoff from phase 02.
- UX Gate A notes, if available.
- Frontend domain types created in phase 02.
- `docs/architecture/project_assumptions.md`.
- `docs/architecture/domain_model.md`.
- `docs/architecture/user_flow.mmd`.
- `docs/architecture/openapi.yaml` as read-only context.

## Non-goals

- Do not implement backend.
- Do not modify `api/`.
- Do not modify `docs/architecture/openapi.yaml`; record gaps for phase 04.
- Do not create real HTTP calls.
- Do not add non-MVP features.
- Do not rewrite UI except where needed to consume services.
- Do not choose final database design.

## Allowed paths

- `pwa/src/services/**`
- `pwa/src/mocks/**`
- `pwa/src/fixtures/**`, if already used
- `pwa/src/domain/**` or `pwa/src/types/**`, only for small type corrections
- `pwa/src/app/**` and role components, only to replace inline data access with services
- `docs/reports/mock_api_report.md`
- `docs/open_questions.md`
- `docs/execution_plans/03_mock_api_plan.md`

## Forbidden paths

- `api/**`
- `docs/architecture/openapi.yaml`
- `docs/architecture/er_diagram.md`
- `docs/architecture/domain_model.md`
- `docs/architecture/project_assumptions.md`
- `docs/architecture/user_flow.mmd`
- `docs/adr/**`, except for recommending ADR needs in the handoff

## Worktree setup

```bash
git fetch --all --prune
git worktree add ../worktrees/shifts-03-mock-api -b agent/frontend/03-mock-api main
cd ../worktrees/shifts-03-mock-api
```

Use the integration branch that contains accepted phase 02 and UX Gate A changes.

## Service layer principle

Components must call service functions, not read business data directly from JSX or feature constants. For now, services return mock data asynchronously:

```ts
const schedule = await scheduleService.getMonthlySchedule(scheduleId);
```

Later, phase 06 replaces the implementation of these service functions with real API calls while preserving public service names and return types.

## Target service structure

Use repository conventions, but the target should be close to:

```text
pwa/src/services/
  authService.ts
  userService.ts
  departmentService.ts
  doctorService.ts
  scheduleService.ts
  availabilityService.ts
  generationService.ts
  validationService.ts
  leaveRequestService.ts
  swapRequestService.ts
  auditService.ts
  metricsService.ts

pwa/src/mocks/
  seed.ts
  users.mock.ts
  departments.mock.ts
  doctors.mock.ts
  schedules.mock.ts
  shifts.mock.ts
  assignments.mock.ts
  availability.mock.ts
  leaveRequests.mock.ts
  swaps.mock.ts
  conflicts.mock.ts
  audit.mock.ts
```

## Required mock scenarios

Mock data must cover the MVP-critical scenarios:

- Admin creates users and assigns a Coordinator to a department.
- Coordinator creates a monthly schedule.
- Doctor submits availability and category I–III preferences.
- Availability becomes locked after deadline.
- Coordinator generates a schedule.
- Conflict report appears when staffing is impossible.
- Coordinator manually corrects assignments without hard-rule violations.
- Coordinator publishes the schedule.
- Doctor sees own published schedule.
- Doctor initiates a post-publication swap.
- Second doctor accepts or rejects the swap.
- System validates swap against hard constraints.
- Coordinator approves a valid swap.
- Audit log records generation, publication and swap approval.

## Step-by-step tasks

### A. Preflight

- [x] (2026-04-26 11:24Z) Confirm branch/worktree: `agent/frontend/03-mock-api`.
- [x] (2026-04-26 11:24Z) Read phase 02 handoff and UX Gate A notes.
- [x] (2026-04-26 11:24Z) Identify all components still consuming inline business data.
- [x] (2026-04-26 11:24Z) Identify domain types that service functions should return.

### B. Mock data seed

- [x] (2026-04-26 11:24Z) Create deterministic mock seed data for users, roles, department and doctors.
- [x] (2026-04-26 11:24Z) Create schedule examples for `DRAFT`, `GENERATED`, `PUBLISHED` and `ARCHIVED` states.
- [x] (2026-04-26 11:24Z) Create 24-hour shifts and assignments with realistic statuses.
- [x] (2026-04-26 11:24Z) Create availability declarations, preference category data and leave requests.
- [x] (2026-04-26 11:24Z) Create valid and invalid swap scenarios.
- [x] (2026-04-26 11:24Z) Create conflict reports with explicit reason codes and shift context.
- [x] (2026-04-26 11:24Z) Create audit log entries for generation, publication and swap approval.

### C. Service functions

- [x] (2026-04-26 11:24Z) Implement async service functions for Auth, Users, Departments and Doctors.
- [x] (2026-04-26 11:24Z) Implement async service functions for Schedules, Shifts and Assignments.
- [x] (2026-04-26 11:24Z) Implement async service functions for Availability and Leave Requests.
- [x] (2026-04-26 11:24Z) Implement async service functions for Generation and Validation.
- [x] (2026-04-26 11:24Z) Implement async service functions for Swaps.
- [x] (2026-04-26 11:24Z) Implement async service functions for Audit and Metrics if used by the UI.
- [x] (2026-04-26 11:24Z) Add small artificial latency only if it helps loading-state validation; keep it configurable.

### D. UI consumption

- [x] (2026-04-26 11:24Z) Replace direct mock imports in components with service calls.
- [x] (2026-04-26 11:24Z) Add or preserve loading states for async service calls.
- [x] (2026-04-26 11:24Z) Add or preserve error states for failed service calls.
- [x] (2026-04-26 11:24Z) Preserve visual behavior from phase 02.
- [x] (2026-04-26 11:24Z) Do not introduce real network calls.

### E. Contract gap report

- [x] (2026-04-26 11:24Z) Compare service names and payload shapes with `docs/architecture/openapi.yaml` at a high level.
- [x] (2026-04-26 11:24Z) Create `docs/reports/mock_api_report.md` with service inventory and OpenAPI gaps.
- [x] (2026-04-26 11:24Z) Record any ambiguous endpoint or schema requirement for phase 04.

## Validation commands

Use actual frontend scripts. Typical examples:

```bash
cd pwa
pnpm run build
pnpm run typecheck
pnpm run lint
```

If unit tests exist:

```bash
cd pwa
pnpm run test
```

## Acceptance criteria

- UI components consume async service functions instead of inline business data.
- Mock data covers MVP-critical flows.
- Service return types are explicit and aligned with frontend domain types.
- No real API calls are introduced.
- No backend files are modified.
- OpenAPI gaps are reported for phase 04.
- Frontend build and available checks pass.
- `docs/reports/mock_api_report.md` exists.

## Risks

- Services may drift from `docs/architecture/openapi.yaml`; phase 04 must reconcile this.
- Mock data may overfit happy paths; include conflict and error scenarios.
- Too much service abstraction may hide UI defects; keep service functions simple.

## Rollback plan

- Revert service integration commits if UI becomes unstable.
- Keep mock data separate from UI so components can be reconnected incrementally.
- If service naming proves wrong during phase 04, preserve data models and rename only public service methods.

## Handoff

- Branch/worktree: `agent/frontend/03-mock-api` in `/Users/piotr/projects/worktrees/shifts-03-mock-api`
- Completed: async frontend mock services, deterministic seed data, app component service consumption, report and Phase 04 open question.
- Validation: `corepack pnpm install`, `corepack pnpm run typecheck`, `corepack pnpm run lint`, and `corepack pnpm run build` passed. Vite emitted the main-bundle size warning.
- Known issues: service method names and composite payloads are frontend-oriented and require Phase 04 OpenAPI alignment.
- Open questions: OQ-006 in `docs/open_questions.md`.
- Files changed: `pwa/src/services/**`, `pwa/src/mocks/seed.ts`, service-consuming `pwa/src/app/**`, `docs/reports/mock_api_report.md`, `docs/open_questions.md`.
- Recommended next step: run Phase 04 OpenAPI alignment after frontend mock-service acceptance.

## Change log

| Timestamp UTC | Agent | Change |
|---|---|---|
| YYYY-MM-DD HH:MMZ | Frontend Developer Agent | Initial English mock API/service layer plan. |
| 2026-04-26 11:24Z | Frontend Mock API / Service Layer Agent | Implemented Phase 03 async mock service layer and UI consumption handoff. |
