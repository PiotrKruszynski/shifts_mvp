# 04 — OpenAPI Alignment Plan

Status: Living Draft
Owner: Backend Developer Agent
Reviewers: Frontend Developer Agent, Planning & Orchestration Agent
Worktree branch: `agent/backend/04-openapi-alignment`
Recommended worktree: `../worktrees/shifts-04-openapi-alignment`
Depends on: `03_mock_api_plan.md`
Next: `05_backend_implementation_plan.md`
Last updated: YYYY-MM-DD HH:MMZ

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
git worktree add ../worktrees/shifts-04-openapi-alignment -b agent/backend/04-openapi-alignment main
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

- [ ] (YYYY-MM-DD HH:MMZ) Confirm branch/worktree: `agent/backend/04-openapi-alignment`.
- [ ] (YYYY-MM-DD HH:MMZ) Read phase 03 handoff and mock API report.
- [ ] (YYYY-MM-DD HH:MMZ) Parse current `docs/architecture/openapi.yaml` and list all paths, schemas and operation IDs.
- [ ] (YYYY-MM-DD HH:MMZ) Identify frontend service functions that have no matching endpoint.
- [ ] (YYYY-MM-DD HH:MMZ) Identify endpoints that are not required by MVP flows.

### B. Domain and flow alignment

- [ ] (YYYY-MM-DD HH:MMZ) Verify role codes match the product documents.
- [ ] (YYYY-MM-DD HH:MMZ) Verify schedule state transitions match `docs/architecture/domain_model.md` and `docs/architecture/user_flow.mmd`.
- [ ] (YYYY-MM-DD HH:MMZ) Verify published schedules are immutable except through swaps.
- [ ] (YYYY-MM-DD HH:MMZ) Verify hard-rule validation responses cannot be represented as accepted violations.
- [ ] (YYYY-MM-DD HH:MMZ) Verify audit log schemas support append-only generation, publication and swap events.

### C. Contract updates

- [ ] (YYYY-MM-DD HH:MMZ) Add missing MVP endpoints required by frontend services.
- [ ] (YYYY-MM-DD HH:MMZ) Remove or mark non-MVP operations only if they create implementation ambiguity.
- [ ] (YYYY-MM-DD HH:MMZ) Ensure request/response schemas are explicit and typed.
- [ ] (YYYY-MM-DD HH:MMZ) Ensure list endpoints have pagination or a documented MVP simplification.
- [ ] (YYYY-MM-DD HH:MMZ) Ensure action endpoints are clear for generation, publication, archive and swap approval.
- [ ] (YYYY-MM-DD HH:MMZ) Ensure validation error payloads include reason codes and context.
- [ ] (YYYY-MM-DD HH:MMZ) Ensure auth/authorization expectations are documented without overbuilding production auth.

### D. Frontend service mapping

- [ ] (YYYY-MM-DD HH:MMZ) Create a service-to-operation mapping in `docs/reports/openapi_alignment_report.md`.
- [ ] (YYYY-MM-DD HH:MMZ) Identify service functions that should be renamed before phase 06.
- [ ] (YYYY-MM-DD HH:MMZ) Identify endpoints that require backend seed data to support QA flows.
- [ ] (YYYY-MM-DD HH:MMZ) Record unresolved differences in `docs/open_questions.md`.

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
| YYYY-MM-DD HH:MMZ | Backend Developer Agent | Initial English OpenAPI alignment plan. |
