# Frontend Mock API Report

Last updated: 2026-04-26 11:24Z
Agent: Frontend Mock API / Service Layer Agent
Branch: `agent/frontend/03-mock-api`
Worktree: `/Users/piotr/projects/worktrees/shifts-03-mock-api`

## Status

Phase 03 created an asynchronous frontend mock service layer for the PWA and moved role views away from direct fixture consumption. The implementation remains frontend-only: no backend files, no real HTTP calls, and no OpenAPI edits were introduced.

## Service Layer

All mock services return `Promise` values through `pwa/src/services/mockTransport.ts`, with configurable latency through `mockApiConfig.latencyMs`.

- `authService`: login, reset password, invitation signup session resolution.
- `userService`: user list, admin user list, coordinator candidates, invite user.
- `departmentService`: department list, coordinator assignment summaries, available coordinators, create department.
- `doctorService`: doctor profiles, doctor directory, current doctor context.
- `scheduleService`: schedule lists, coordinator dashboard schedule, schedule editor data, doctor dashboard/schedule, create monthly schedule, swap-flow availability.
- `availabilityService`: coordinator availability collection, doctor availability, save doctor availability.
- `generationService`: deterministic generated schedule result with conflict report.
- `validationService`: schedule and swap validation results.
- `leaveRequestService`: coordinator/doctor leave request lists, create request, approve/reject decision.
- `swapRequestService`: doctor swap form data, swap creation, doctor response, coordinator approval list and decisions.
- `auditService`: immutable audit entries, compliance audit view, schedule timeline view.
- `metricsService`: schedule workload metrics.
- `settingsService`: system settings, preference categories, settings save.

## Mock Data Coverage

`pwa/src/mocks/seed.ts` centralizes deterministic seed data while reusing Phase 02 typed fixtures where possible.

- Users, roles, departments, qualifications and doctor profiles.
- Department coordinator summary including assigned and unassigned departments.
- Schedule lifecycle examples for `DRAFT`, `GENERATED`, `PUBLISHED` and `ARCHIVED`.
- 24-hour shift examples, assignments, unassigned shifts and conflicted shifts.
- Availability declarations with submitted and locked examples plus category I-III preference data.
- Leave requests for coordinator review and doctor self-service.
- Valid and invalid swap scenarios across doctor response and coordinator approval flows.
- Conflict report and validation results with explicit reason codes.
- Audit events for generation, publication, soft-rule override and swap approval.
- Metrics data for workload and weekend/holiday distribution.

## UI Consumption

The app layer no longer imports `pwa/src/fixtures/**`. Components now call service functions through `useAsyncResource` or explicit async form/action handlers. Loading and error states were added to role pages that fetch data on mount.

Notable converted views:

- Auth: login, reset password, invitation signup.
- Admin: users, departments, settings, compliance audit.
- Coordinator: dashboard, schedules, create schedule, availability collection, editor, doctors, leave requests, swap approvals, metrics, audit.
- Doctor: dashboard, availability, schedule, swap request, swap approval, leave requests.

## OpenAPI Alignment Notes

The current mock service boundary is intentionally frontend-friendly and should be reconciled in Phase 04 with `docs/architecture/openapi.yaml`.

- Dashboard-style services return composite view models that likely need to be derived from multiple OpenAPI operations, especially schedules, availability, swaps, audit and metrics.
- `settingsService.getSystemSettings` / `saveSystemSettings` has no direct OpenAPI equivalent; existing contract coverage appears split across preference categories and constraint rules.
- Auth reset password is represented in the UI mock service, but the current OpenAPI Auth section only exposes login, refresh and current-user operations.
- Doctor swap form data is a composite of own assignments and candidate doctor assignments; OpenAPI has swap request operations but no explicit candidate-discovery endpoint.
- Department coordinator summaries include counts and coordinator display labels; OpenAPI department operations may need either expanded schemas or companion metrics.
- Leave request creation in the UI is doctor-contextual, while OpenAPI creation is schedule-scoped via `/schedules/{scheduleId}/leave-requests`.
- Service method names use frontend domain language and should be mapped to operationIds during Phase 04 rather than treated as final API names.

## Validation

Commands run from `pwa/`:

```bash
corepack pnpm install
corepack pnpm run typecheck
corepack pnpm run lint
corepack pnpm run build
```

Results:

- `pnpm install`: completed from existing lockfile.
- `pnpm run typecheck`: passed.
- `pnpm run lint`: passed with Biome.
- `pnpm run build`: passed with Vite 6.3.5. Vite emitted the existing large chunk warning for the main JS bundle.
