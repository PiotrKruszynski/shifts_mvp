# 06 — Frontend / Backend Integration Plan

Status: Living Draft
Owner: Frontend Developer Agent
Support: Backend Developer Agent
Orchestrated by: Planning & Orchestration Agent
Worktree branch: `agent/frontend/06-api-integration`
Recommended worktree: `../worktrees/shifts-06-api-integration`
Depends on: `05_backend_implementation_plan.md`
Next: `07_quality_release_plan.md`
Last updated: YYYY-MM-DD HH:MMZ

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
- `docs/architecture/project_asumptions.md`
- `docs/architecture/user_flow.mmd`
- `docs/adr/**`, except for recommending updates in the handoff

## Worktree setup

```bash
git fetch --all --prune
git worktree add ../worktrees/shifts-06-api-integration -b agent/frontend/06-api-integration main
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

- [ ] (YYYY-MM-DD HH:MMZ) Confirm branch/worktree: `agent/frontend/06-api-integration`.
- [ ] (YYYY-MM-DD HH:MMZ) Read phase 05 handoff and backend implementation report.
- [ ] (YYYY-MM-DD HH:MMZ) Start backend locally using documented command.
- [ ] (YYYY-MM-DD HH:MMZ) Reset and seed SQLite database using documented command.
- [ ] (YYYY-MM-DD HH:MMZ) Confirm backend health/current-user endpoint works.
- [ ] (YYYY-MM-DD HH:MMZ) Run frontend build before integration to establish baseline.

### B. API client

- [ ] (YYYY-MM-DD HH:MMZ) Add or update API base URL configuration.
- [ ] (YYYY-MM-DD HH:MMZ) Implement shared HTTP client with JSON parsing and typed errors.
- [ ] (YYYY-MM-DD HH:MMZ) Add auth token handling if required by backend MVP auth.
- [ ] (YYYY-MM-DD HH:MMZ) Add consistent handling for `401`, `403`, `404`, `409`, `422` and hard-rule validation errors.
- [ ] (YYYY-MM-DD HH:MMZ) Configure CORS or proxy only if required and approved.

### C. Replace service implementations

- [ ] (YYYY-MM-DD HH:MMZ) Replace Auth service mock implementation with API calls.
- [ ] (YYYY-MM-DD HH:MMZ) Replace Users/Departments/Doctors services with API calls.
- [ ] (YYYY-MM-DD HH:MMZ) Replace Schedules/Shifts/Assignments services with API calls.
- [ ] (YYYY-MM-DD HH:MMZ) Replace Availability/Leave Request services with API calls.
- [ ] (YYYY-MM-DD HH:MMZ) Replace Generation/Validation services with API calls.
- [ ] (YYYY-MM-DD HH:MMZ) Replace Swap service with API calls.
- [ ] (YYYY-MM-DD HH:MMZ) Replace Audit/Metrics services with API calls if used by UI.
- [ ] (YYYY-MM-DD HH:MMZ) Preserve public service function names where possible.

### D. UI integration

- [ ] (YYYY-MM-DD HH:MMZ) Verify loading states during API calls.
- [ ] (YYYY-MM-DD HH:MMZ) Verify error states for backend validation failures.
- [ ] (YYYY-MM-DD HH:MMZ) Verify conflict panel displays backend conflict reason codes and context.
- [ ] (YYYY-MM-DD HH:MMZ) Verify published schedule UI remains immutable except swap flow.
- [ ] (YYYY-MM-DD HH:MMZ) Verify swap approval updates UI after backend response.
- [ ] (YYYY-MM-DD HH:MMZ) Remove stale hardcoded business data from integrated screens.

### E. Deterministic integration checks

- [ ] (YYYY-MM-DD HH:MMZ) Reset SQLite database before manual integration checks.
- [ ] (YYYY-MM-DD HH:MMZ) Verify Doctor submits availability.
- [ ] (YYYY-MM-DD HH:MMZ) Verify Coordinator generates schedule.
- [ ] (YYYY-MM-DD HH:MMZ) Verify conflict report appears for impossible staffing scenario.
- [ ] (YYYY-MM-DD HH:MMZ) Verify Coordinator publishes schedule.
- [ ] (YYYY-MM-DD HH:MMZ) Verify Doctor sees published schedule.
- [ ] (YYYY-MM-DD HH:MMZ) Verify Doctor swap request flow.
- [ ] (YYYY-MM-DD HH:MMZ) Verify Coordinator swap approval and audit log update.

### F. Report and UX handoff

- [ ] (YYYY-MM-DD HH:MMZ) Create `docs/reports/integration_report.md`.
- [ ] (YYYY-MM-DD HH:MMZ) Document API base URL, backend run command and DB reset command.
- [ ] (YYYY-MM-DD HH:MMZ) Document remaining mock-only screens, if any.
- [ ] (YYYY-MM-DD HH:MMZ) Prepare UX Gate B handoff notes.

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

- Branch/worktree:
- Completed:
- Validation:
- Known issues:
- Open questions:
- Files changed:
- Recommended next step:

## Change log

| Timestamp UTC | Agent | Change |
|---|---|---|
| YYYY-MM-DD HH:MMZ | Frontend Developer Agent | Initial English frontend/backend integration plan. |
