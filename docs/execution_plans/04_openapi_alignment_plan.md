# 04 — OpenAPI Alignment Plan

Status: Complete - ready for acceptance
Owner: Backend Developer Agent
Reviewers: Frontend Developer Agent, Planning & Orchestration Agent
Worktree branch: `agent/backend/04-openapi-alignment`
Recommended worktree: `../worktrees/shifts-04-openapi-alignment`
Depends on: `03_mock_api_plan.md`
Next: `05_backend_implementation_plan.md`
Last updated: 2026-04-26 12:09Z

## Objective

Align `docs/architecture/openapi.yaml` with the MVP product scope, domain model, user flow and frontend mock service layer before backend implementation starts. This phase produces a stable API contract for FastAPI implementation and frontend integration.

## Required inputs

- Completed handoff from phase 03.
- `docs/reports/mock_api_report.md`.
- `pwa/src/services/**` and frontend domain types.
- `docs/architecture/project_assumptions.md`.
- `docs/architecture/domain_model.md`.
- `docs/architecture/er_diagram.md`.
- `docs/architecture/user_flow.mmd`.
- Current `docs/architecture/openapi.yaml`.
- Accepted ADRs in `docs/adr/**`, especially SQLite persistence ADR for backend context.

## Non-goals

- Do not implement backend code.
- Do not modify `api/` except for optional generated contract validation artifacts if the repository already uses them.
- Do not modify frontend code.
- Do not add non-MVP endpoints.
- Do not encode storage-engine details into the public API.
- Do not replace product assumptions or domain decisions.

## Allowed paths

- `docs/architecture/openapi.yaml`
- `docs/reports/openapi_alignment_report.md`
- `docs/open_questions.md`
- `docs/execution_plans/04_openapi_alignment_plan.md`

## Forbidden paths

- `pwa/src/**`, except read-only inspection.
- `api/src/**`
- `api/tests/**`
- `docs/architecture/domain_model.md`
- `docs/architecture/er_diagram.md`
- `docs/architecture/project_assumptions.md`
- `docs/architecture/user_flow.mmd`
- `docs/adr/**`, except for recommending ADR updates in the handoff

## Worktree setup

```bash
git fetch --all --prune
git worktree add ../worktrees/shifts-04-openapi-alignment -b agent/backend/04-openapi-alignment master
cd ../worktrees/shifts-04-openapi-alignment
```

Use the integration branch that contains accepted phase 03 changes.

## Alignment principles

- `docs/architecture/openapi.yaml` is the contract the backend must implement and the frontend must consume.
- The contract should represent MVP flows, not every future SaaS feature.
- Request and response schemas must be explicit.
- Operation IDs should be stable because frontend integration may use them later.
- Error responses must cover validation errors, authorization failures, not-found cases and hard-rule violations.
- Storage decisions such as SQLite are internal backend concerns and must not leak into API semantics.

## Required API coverage

Confirm that the contract supports these areas:

- Auth and current user.
- Users, roles and Admin-managed accounts.
- Departments and Coordinator assignment.
- Doctors, qualifications and invitations.
- Schedules with statuses `DRAFT`, `GENERATED`, `PUBLISHED`, `ARCHIVED`.
- Schedule participants.
- 24-hour shifts.
- Assignments with source `GENERATED`, `MANUAL`, `SWAP`.
- Availability declarations, availability days and deadline locking.
- Preference categories I, II, III.
- Leave requests.
- Schedule generation.
- Conflict reports and validation errors.
- Publication and archive actions.
- Swap request lifecycle after publication.
- Metrics needed by MVP dashboards.
- Notifications and calendar export if present in MVP UI.
- Audit log entries.

## Step-by-step tasks

### A. Preflight

- [x] (2026-04-26 12:09Z) Confirm branch/worktree: `agent/backend/04-openapi-alignment`.
- [x] (2026-04-26 12:09Z) Read phase 03 handoff and mock API report.
- [x] (2026-04-26 12:09Z) Parse current `docs/architecture/openapi.yaml` and list all paths, schemas and operation IDs.
- [x] (2026-04-26 12:09Z) Identify frontend service functions that have no matching endpoint.
- [x] (2026-04-26 12:09Z) Identify endpoints that are not required by MVP flows.

### B. Domain and flow alignment

- [x] (2026-04-26 12:09Z) Verify role codes match the product documents.
- [x] (2026-04-26 12:09Z) Verify schedule state transitions match `docs/architecture/domain_model.md` and `docs/architecture/user_flow.mmd`.
- [x] (2026-04-26 12:09Z) Verify published schedules are immutable except through swaps.
- [x] (2026-04-26 12:09Z) Verify hard-rule validation responses cannot be represented as accepted violations.
- [x] (2026-04-26 12:09Z) Verify audit log schemas support append-only generation, publication and swap events.

### C. Contract updates

- [x] (2026-04-26 12:09Z) Add missing MVP endpoints required by frontend services.
- [x] (2026-04-26 12:09Z) Remove or mark non-MVP operations only if they create implementation ambiguity.
- [x] (2026-04-26 12:09Z) Ensure request/response schemas are explicit and typed.
- [x] (2026-04-26 12:09Z) Ensure list endpoints have pagination or a documented MVP simplification.
- [x] (2026-04-26 12:09Z) Ensure action endpoints are clear for generation, publication, archive and swap approval.
- [x] (2026-04-26 12:09Z) Ensure validation error payloads include reason codes and context.
- [x] (2026-04-26 12:09Z) Ensure auth/authorization expectations are documented without overbuilding production auth.

### D. Frontend service mapping

- [x] (2026-04-26 12:09Z) Create a service-to-operation mapping in `docs/reports/openapi_alignment_report.md`.
- [x] (2026-04-26 12:09Z) Identify service functions that should be renamed before phase 06.
- [x] (2026-04-26 12:09Z) Identify endpoints that require backend seed data to support QA flows.
- [x] (2026-04-26 12:09Z) Record unresolved differences in `docs/open_questions.md`.

## Validation commands

Use available validation tooling. Examples:

```bash
python - <<'PY'
import pathlib, yaml
path = pathlib.Path('docs/architecture/openapi.yaml')
with path.open() as f:
    yaml.safe_load(f)
print('docs/architecture/openapi.yaml parses')
PY
```

If OpenAPI linters are available:

```bash
npx @redocly/cli lint docs/architecture/openapi.yaml
```

or:

```bash
npx swagger-cli validate docs/architecture/openapi.yaml
```

Do not install new global tools unless the project already uses them; local temporary tooling is acceptable only if documented.

## Acceptance criteria

- `docs/architecture/openapi.yaml` parses and validates with available tooling.
- Every MVP frontend service has a clear endpoint mapping or a documented open question.
- Contract states, roles and payloads align with `docs/architecture/domain_model.md`.
- Contract supports the critical flow from `docs/architecture/user_flow.mmd`.
- No backend implementation was started.
- No frontend implementation was changed.
- `docs/reports/openapi_alignment_report.md` exists.

## Risks

- The current OpenAPI file may already include broader future scope; avoid expanding implementation obligations unnecessarily.
- Frontend service shapes may be UI-convenient but not API-appropriate.
- Overfitting the API to generated Figma UI may hurt backend clarity.
- Under-specifying error payloads will make QA and integration harder.

## Rollback plan

- Keep OpenAPI changes in small commits by API area.
- If alignment becomes too broad, revert non-MVP sections and keep only critical flow operations.
- If contract disputes arise, stop and request Orchestration Agent review.

## Handoff

- Branch/worktree: `agent/backend/04-openapi-alignment` at `/Users/piotr/projects/worktrees/shifts-04-openapi-alignment`.
- Remote branch: `origin/agent/backend/04-openapi-alignment`.
- Base branch: `master`.
- Current HEAD: Phase 04 branch HEAD after this handoff commit.
- Contains master: yes.
- Completed: aligned `docs/architecture/openapi.yaml` with Phase 03 service boundary; added MVP read models for current schedule discovery, dashboards, availability collection, schedule editor, leave request list display, swap options and swap approval views; resolved OQ-006; created service-to-operation mapping report.
- Validation: YAML parse passed; internal `$ref` and operation ID uniqueness check passed; Redocly lint reported warnings only.
- Known issues: `userService.inviteUser` must pass the selected role before Phase 06 integration so it can call `createUser` without weakening the contract.
- Open questions: none blocking Phase 05; OQ-006 is resolved.
- Files changed: `docs/architecture/openapi.yaml`, `docs/reports/openapi_alignment_report.md`, `docs/open_questions.md`, `docs/execution_plans/04_openapi_alignment_plan.md`.
- Gate decision: ready for Orchestrator/Gatekeeper acceptance.
- Recommended next step: after acceptance, merge Phase 04 to `master`, then start Phase 05 backend implementation from the accepted contract.

## Change log

| Timestamp UTC | Agent | Change |
|---|---|---|
| YYYY-MM-DD HH:MMZ | Backend Developer Agent | Initial English OpenAPI alignment plan. |
| 2026-04-26 12:09Z | Backend Developer Agent + Frontend Reviewer | Aligned OpenAPI with Phase 03 service boundary, resolved OQ-006, and recorded service-to-operation mapping. |
