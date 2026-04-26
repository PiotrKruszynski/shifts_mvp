# Frontend / Backend Integration Report

Last updated: 2026-04-26 14:55Z
Agent: Frontend Developer Agent
Branch: `agent/frontend/06-api-integration`
Worktree: `/Users/piotr/projects/worktrees/shifts-06-api-integration`

## Status

Phase 06 connected the PWA service layer to the FastAPI backend while preserving public service names and keeping mock mode available through `VITE_API_MODE=mock`.

## API Configuration

- Default real API mode:
  - `VITE_API_MODE=api`
  - `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1`
- Mock fallback:
  - `VITE_API_MODE=mock`

The shared client lives under `pwa/src/api/` and centralizes:

- API base URL configuration.
- Bearer token storage.
- JSON request/response handling.
- `401`, `403`, `404`, `409` and `422` error mapping.
- Service-boundary adapters for backend payloads that differ from UI view models.

## Backend Commands

```bash
cd api
uv run api-reset
uv run api
```

Seed users all use `password123`:

- `admin@shifts.test`
- `koordynator@shifts.test`
- `lekarz1@shifts.test`
- `lekarz2@shifts.test`
- `lekarz3@shifts.test`

The login service also maps the Phase 02 demo labels to seed accounts:

- `admin@hospital.pl` -> `admin@shifts.test`
- `coordinator@hospital.pl` -> `koordynator@shifts.test`
- `doctor@hospital.pl` -> `lekarz1@shifts.test`

## Integrated Services

- `authService`
- `userService`
- `departmentService`
- `doctorService`
- `scheduleService`
- `availabilityService`
- `generationService`
- `validationService`
- `leaveRequestService`
- `swapRequestService`
- `auditService`
- `metricsService`
- `settingsService`

## UI Integration

The existing UI structure was preserved. Changes were limited to service-boundary integration and small action wiring:

- Schedule generation button now calls the backend generation endpoint.
- Publish dialog now calls the backend publish endpoint.
- Doctor swap creation now sends the selected source and target assignment IDs.

No large UI rewrite, layout rebuild or redesign was introduced.

## Smoke Checks

Backend was reset and started locally. The following checks passed:

- CORS preflight from `http://localhost:4173`.
- Doctor login and current doctor context.
- Coordinator login and coordinator dashboard endpoint.
- Doctor availability submission on the draft schedule.
- Coordinator generation and publication on the draft schedule.
- Doctor swap request and doctor acceptance on the published schedule.
- Backend validation response for a blocking swap approval scenario.
- Built PWA served with `vite preview` on `http://127.0.0.1:4173/`.

## Validation

Commands run from `pwa/`:

```bash
corepack pnpm run typecheck
corepack pnpm run lint
corepack pnpm run build
```

Results:

- Typecheck: passed.
- Lint: passed.
- Build: passed.
- Vite emitted the existing chunk-size warning for the main JS bundle.

## Visual Baseline

- Phase 02 / UX Gate A visual baseline checked against current component structure and generated production bundle.
- Visual drift: `none`.
- Reason: service-boundary adapters preserve existing view models; only data plumbing and small action handlers changed.

## Mock Mode

Mock mode remains available for offline development and tests through `VITE_API_MODE=mock`. Existing mock seed data and public service method names were retained.

## Known Issues

- Real API seed data is intentionally smaller than Phase 02 mock data, so some lists have fewer rows.
- Backend currently uses MVP role-light auth; UI respects returned seed roles but does not add a separate frontend authorization layer in this phase.
- A Vite dev server already occupied `localhost:5173` during smoke checks, so the production preview check used `localhost:4173`, which is already allowed by backend CORS defaults.

## Gate Notes

- Service-boundary adapters used: `yes`.
- Visual drift: `none`.
- Recommended next step: UX Gate B after API integration.
