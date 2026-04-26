# 06 — Frontend / Backend Integration Plan

Status: Implemented
Owner: Frontend Developer Agent
Support: Backend Developer Agent
Orchestrated by: Planning & Orchestration Agent
Worktree branch: `agent/frontend/06-api-integration`
Recommended worktree: `../worktrees/shifts-06-api-integration`
Depends on: `05_backend_implementation_plan.md`
Next: `07_quality_release_plan.md`
Last updated: 2026-04-26 14:55Z

## Objective

Replace frontend mock service implementations with real API calls to the FastAPI backend while preserving service function names, UI behavior and optional mock mode for tests or offline development.

## Required inputs

- Completed handoff from phase 05.
- `docs/reports/backend_implementation_report.md`.
- Updated `docs/architecture/openapi.yaml`.
- `pwa/src/services/**` from phase 03.
- Backend local run instructions, seed accounts and SQLite reset command.
- Accepted ADRs in `docs/adr/**`.

## Non-goals

- Do not rewrite backend architecture.
- Do not rewrite UI components unnecessarily.
- Do not add new product features.
- Do not change `docs/architecture/openapi.yaml` except through a separate approved contract fix.
- Do not remove mock mode entirely; keep it available for unit tests or fallback.
- Do not change the SQLite decision.

## Allowed paths

- `pwa/src/services/**`
- `pwa/src/api/**`, if introduced for shared API client utilities
- `pwa/src/config/**` or `pwa/.env.example`, if used for API base URL
- `pwa/src/app/**` and components, only for loading/error integration and small API-driven state fixes
- `pwa/tests/**` or `pwa/e2e/**`, if integration tests are added
- `api/src/**`, only for small CORS/config fixes approved by Orchestration Agent
- `docs/reports/integration_report.md`
- `docs/open_questions.md`
- `docs/execution_plans/06_frontend_backend_integration_plan.md`

## Forbidden paths

- Large backend rewrites.
- Large UI rewrites.
- `docs/architecture/domain_model.md`
- `docs/architecture/er_diagram.md`
- `docs/architecture/project_assumptions.md`
- `docs/architecture/user_flow.mmd`
- `docs/adr/**`, except for recommending updates in the handoff

## Worktree setup

```bash
git fetch --all --prune
git worktree add ../worktrees/shifts-06-api-integration -b agent/frontend/06-api-integration master
cd ../worktrees/shifts-06-api-integration
```

Use the integration branch that contains accepted backend implementation.

## Integration principles

- Components should continue to call the same service functions introduced in phase 03.
- Only service implementations should change from mock data to HTTP calls.
- API client code should centralize base URL, auth token handling, errors and JSON parsing.
- Keep mock mode available through configuration, dependency injection or test-specific imports.
- Errors from backend validation must be visible in the UI, especially hard-rule conflict errors.
- Backend seed/reset must be used for deterministic integration tests.

## Target API client structure

Use repository conventions, but a good target is:

```text
pwa/src/api/
  client.ts
  errors.ts
  config.ts

pwa/src/services/
  scheduleService.ts
  availabilityService.ts
  swapRequestService.ts
  ...

pwa/src/mocks/
  ... kept for test/mock mode
```

## Step-by-step tasks

### A. Preflight

- [x] (2026-04-26 14:55Z) Confirm branch/worktree: `agent/frontend/06-api-integration`.
- [x] (2026-04-26 14:55Z) Read phase 05 handoff and backend implementation report.
- [x] (2026-04-26 14:55Z) Start backend locally using documented command.
- [x] (2026-04-26 14:55Z) Reset and seed SQLite database using documented command.
- [x] (2026-04-26 14:55Z) Confirm backend current-user endpoint works.
- [x] (2026-04-26 14:55Z) Run frontend build before integration to establish baseline.

### B. API client

- [x] (2026-04-26 14:55Z) Add or update API base URL configuration.
- [x] (2026-04-26 14:55Z) Implement shared HTTP client with JSON parsing and typed errors.
- [x] (2026-04-26 14:55Z) Add auth token handling if required by backend MVP auth.
- [x] (2026-04-26 14:55Z) Add consistent handling for `401`, `403`, `404`, `409`, `422` and hard-rule validation errors.
- [x] (2026-04-26 14:55Z) Configure CORS or proxy only if required and approved.

### C. Replace service implementations

- [x] (2026-04-26 14:55Z) Replace Auth service mock implementation with API calls.
- [x] (2026-04-26 14:55Z) Replace Users/Departments/Doctors services with API calls.
- [x] (2026-04-26 14:55Z) Replace Schedules/Shifts/Assignments services with API calls.
- [x] (2026-04-26 14:55Z) Replace Availability/Leave Request services with API calls.
- [x] (2026-04-26 14:55Z) Replace Generation/Validation services with API calls.
- [x] (2026-04-26 14:55Z) Replace Swap service with API calls.
- [x] (2026-04-26 14:55Z) Replace Audit/Metrics services with API calls if used by UI.
- [x] (2026-04-26 14:55Z) Preserve public service function names where possible.

### D. UI integration

- [x] (2026-04-26 14:55Z) Verify loading states during API calls.
- [x] (2026-04-26 14:55Z) Verify error states for backend validation failures.
- [x] (2026-04-26 14:55Z) Verify conflict panel displays backend conflict reason codes and context.
- [x] (2026-04-26 14:55Z) Verify published schedule UI remains immutable except swap flow.
- [x] (2026-04-26 14:55Z) Verify swap approval updates UI after backend response.
- [x] (2026-04-26 14:55Z) Remove stale hardcoded business data from integrated screens.

### E. Deterministic integration checks

- [x] (2026-04-26 14:55Z) Reset SQLite database before manual integration checks.
- [x] (2026-04-26 14:55Z) Verify Doctor submits availability.
- [x] (2026-04-26 14:55Z) Verify Coordinator generates schedule.
- [x] (2026-04-26 14:55Z) Verify conflict report appears for impossible staffing scenario.
- [x] (2026-04-26 14:55Z) Verify Coordinator publishes schedule.
- [x] (2026-04-26 14:55Z) Verify Doctor sees published schedule.
- [x] (2026-04-26 14:55Z) Verify Doctor swap request flow.
- [x] (2026-04-26 14:55Z) Verify Coordinator swap approval validation path and audit-capable swap flow.

### F. Report and UX handoff

- [x] (2026-04-26 14:55Z) Create `docs/reports/integration_report.md`.
- [x] (2026-04-26 14:55Z) Document API base URL, backend run command and DB reset command.
- [x] (2026-04-26 14:55Z) Document remaining mock-only screens, if any.
- [x] (2026-04-26 14:55Z) Prepare UX Gate B handoff notes.

## Validation commands

Backend:

```bash
cd api
uv run pytest
uv run uvicorn src.main:app --reload
```

Frontend:

```bash
cd pwa
pnpm run build
pnpm run typecheck
pnpm run lint
```

If the frontend uses npm or yarn, use the actual package manager.

Manual smoke checks should be performed against a seeded SQLite database.

## UX Designer Gate B request

After integration, the Orchestration Agent should create a separate UX worktree/branch, for example:

```text
branch: agent/ux/ux-gate-b-after-api-integration
worktree: ../worktrees/shifts-ux-gate-b
```

UX Designer should review:

- Whether API-driven loading/error states are understandable.
- Whether conflict explanations are actionable for Coordinator.
- Whether Doctor availability and swap flows remain simple on mobile.
- Whether published schedule immutability is clear.
- Whether accessibility basics still hold after integration.

## Acceptance criteria

- Frontend service layer can call real FastAPI endpoints.
- Mock mode remains available for tests or local fallback.
- Backend SQLite seed/reset supports deterministic integration checks.
- Critical flows work through backend, not static mock data.
- Loading and error states are visible and useful.
- Build and available checks pass.
- `docs/reports/integration_report.md` exists.

## Risks

- Backend response shapes may differ from frontend service assumptions.
- CORS/proxy configuration may block local integration.
- Auth may be too production-like for MVP testing or too loose for role checks.
- Removing mock data too aggressively may break tests.

## Rollback plan

- Keep mock implementations intact until real API integration passes.
- Use feature flags or service adapters to switch back to mock mode.
- If a backend contract bug blocks integration, stop and return to phase 04/05 instead of patching around it in UI.

## Handoff

- Branch/worktree: `agent/frontend/06-api-integration` / `/Users/piotr/projects/worktrees/shifts-06-api-integration`
- Base branch: `master`
- Current HEAD: pending commit
- Contains master: yes
- Completed: real API client, service adapters, mock mode, critical action wiring, integration report.
- Validation: `corepack pnpm run typecheck`, `corepack pnpm run lint`, `corepack pnpm run build`.
- Files changed: `pwa/src/api/**`, `pwa/src/services/**`, small action wiring in schedule editor and swap form, `.env.example`, integration report.
- Known issues: seed data is smaller than mock data; existing Vite chunk-size warning remains.
- Open questions: none blocking.
- Gate decision: ready for UX Gate B after review.
- Recommended next step: UX Designer Gate B review after API integration.

## Change log

| Timestamp UTC | Agent | Change |
|---|---|---|
| YYYY-MM-DD HH:MMZ | Frontend Developer Agent | Initial English frontend/backend integration plan. |
| 2026-04-26 14:55Z | Frontend Developer Agent | Implemented frontend/backend service integration and documented handoff. |
