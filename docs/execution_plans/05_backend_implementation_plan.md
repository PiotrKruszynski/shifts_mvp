# 05 — Backend Implementation Plan

Status: Living Draft
Owner: Backend Developer Agent
Orchestrated by: Planning & Orchestration Agent
Worktree branch: `agent/backend/05-backend-implementation`
Recommended worktree: `../worktrees/shifts-05-backend-implementation`
Depends on: `04_openapi_alignment_plan.md` and `docs/adr/0007-use-sqlite-for-mvp-local-persistence.md`
Next: `06_frontend_backend_integration_plan.md`
Last updated: YYYY-MM-DD HH:MMZ

## Objective

Implement the FastAPI backend in `api/` strictly from the aligned `docs/architecture/openapi.yaml`, using SQLite for MVP local persistence. The backend must provide deterministic seed data, API endpoints, validation logic and tests needed for frontend integration and QA.

## Required inputs

- Completed handoff from phase 04.
- Updated `docs/architecture/openapi.yaml`.
- `docs/reports/openapi_alignment_report.md`.
- `docs/architecture/project_assumptions.md`.
- `docs/architecture/domain_model.md`.
- `docs/architecture/er_diagram.md`.
- `docs/architecture/user_flow.mmd`.
- `docs/adr/0007-use-sqlite-for-mvp-local-persistence.md`.
- Existing `api/` template, including `pyproject.toml`, `uv.lock`, tests and configured tools.

## Database decision

The MVP backend must use SQLite for local persistence unless a newer accepted ADR supersedes `docs/adr/0007-use-sqlite-for-mvp-local-persistence.md`.

Rules:

- Use SQLite as the default database for local MVP development and QA.
- Prefer a documented database path such as `api/var/shifts_mvp.sqlite`.
- Provide a deterministic seed/reset mechanism for integration and Playwright tests.
- Keep persistence behind a repository/service layer so a future PostgreSQL migration remains feasible.
- Do not introduce PostgreSQL in this phase unless the ADR is explicitly changed.
- Do not expose SQLite-specific details in API responses.

## Non-goals

- Do not rewrite frontend.
- Do not change `docs/architecture/openapi.yaml` except for tiny contract bug fixes approved by the Orchestration Agent.
- Do not add endpoints outside `docs/architecture/openapi.yaml`.
- Do not build production-grade auth, hosting, monitoring or CI/CD unless already present in the template.
- Do not implement machine learning or nondeterministic optimization.
- Do not weaken hard legal constraints.

## Allowed paths

- `api/src/**`
- `api/tests/**`
- `api/pyproject.toml`, only when required for dependencies/scripts
- `api/.env.example`, only for backend configuration
- `api/var/**`, if used for local SQLite database files or documented placeholders
- `docs/reports/backend_implementation_report.md`
- `docs/open_questions.md`
- `docs/execution_plans/05_backend_implementation_plan.md`

## Forbidden paths

- `pwa/src/**`
- `pwa/package.json`
- `docs/architecture/openapi.yaml`, except tiny approved contract corrections
- `docs/architecture/domain_model.md`
- `docs/architecture/er_diagram.md`
- `docs/architecture/project_assumptions.md`
- `docs/architecture/user_flow.mmd`
- `docs/adr/**`, except for proposing ADR updates in the handoff

## Worktree setup

```bash
git fetch --all --prune
git worktree add ../worktrees/shifts-05-backend-implementation -b agent/backend/05-backend-implementation master
cd ../worktrees/shifts-05-backend-implementation
```

Use the integration branch that contains the accepted OpenAPI alignment.

## Backend implementation principles

- Implement the contract; do not make the frontend guess backend behavior.
- Keep routes thin and put domain behavior in services.
- Keep persistence logic isolated from route handlers.
- Use Pydantic schemas for request/response validation.
- Use existing API template conventions before introducing new structure.
- Deterministic schedule generation is acceptable for MVP; do not introduce ML.
- Hard-rule violations must block illegal changes.
- Audit log writes must be append-only.

## Suggested backend structure

Respect the existing template. If compatible, converge toward:

```text
api/src/
  main.py
  core/
    config.py
    security.py
  db/
    session.py
    models.py
    seed.py
    reset.py
  schemas/
    *.py
  repositories/
    *.py
  services/
    schedule_generation.py
    conflict_detection.py
    swap_validation.py
    audit_log.py
  routes/
    auth.py
    users.py
    departments.py
    doctors.py
    schedules.py
    availability.py
    generation.py
    validation.py
    swaps.py
    audit.py
```

If the template already has a different layout, use it and document the mapping in the report.

## Required backend behavior

- Auth/current-user behavior sufficient for MVP role testing.
- Admin can manage users and assign roles/departments according to OpenAPI.
- Coordinator can create schedules for a department.
- Doctors can submit availability and preferences before deadline.
- Availability edits are blocked after deadline/lock.
- Coordinator can generate deterministic schedules.
- Conflict reports are created when staffing is impossible.
- Coordinator can manually correct generated schedules if hard rules pass.
- Coordinator can publish schedules.
- Published schedules are immutable except through approved swaps.
- Doctors can initiate and respond to post-publication swaps.
- Swap validation blocks hard-rule violations.
- Coordinator can approve valid swaps.
- Assignments and audit logs are updated consistently after approved swaps.
- Schedule can be archived.

## Step-by-step tasks

### A. Preflight

- [ ] (YYYY-MM-DD HH:MMZ) Confirm branch/worktree: `agent/backend/05-backend-implementation`.
- [ ] (YYYY-MM-DD HH:MMZ) Inspect existing `api/` template, package tooling and tests.
- [ ] (YYYY-MM-DD HH:MMZ) Run current backend tests before implementation.
- [ ] (YYYY-MM-DD HH:MMZ) Read `docs/architecture/openapi.yaml` and alignment report.
- [ ] (YYYY-MM-DD HH:MMZ) Confirm SQLite ADR is accepted and referenced.

### B. SQLite persistence

- [ ] (YYYY-MM-DD HH:MMZ) Add backend configuration for SQLite database path.
- [ ] (YYYY-MM-DD HH:MMZ) Create or update database session/connection setup.
- [ ] (YYYY-MM-DD HH:MMZ) Implement persistence models based on `docs/architecture/er_diagram.md` and OpenAPI schemas.
- [ ] (YYYY-MM-DD HH:MMZ) Add deterministic seed data covering critical QA flows.
- [ ] (YYYY-MM-DD HH:MMZ) Add reset mechanism for tests and Playwright setup.
- [ ] (YYYY-MM-DD HH:MMZ) Document local database usage in the backend report.

### C. Schemas and routes

- [ ] (YYYY-MM-DD HH:MMZ) Implement Pydantic request/response schemas from `docs/architecture/openapi.yaml`.
- [ ] (YYYY-MM-DD HH:MMZ) Implement Auth and current user endpoints.
- [ ] (YYYY-MM-DD HH:MMZ) Implement Users, Departments, Doctors and Invitations endpoints.
- [ ] (YYYY-MM-DD HH:MMZ) Implement Schedules, Participants, Shifts and Assignments endpoints.
- [ ] (YYYY-MM-DD HH:MMZ) Implement Availability, Preference and Leave Request endpoints.
- [ ] (YYYY-MM-DD HH:MMZ) Implement Generation and Conflict/Validation endpoints.
- [ ] (YYYY-MM-DD HH:MMZ) Implement Publication, Archive and Metrics endpoints required by OpenAPI.
- [ ] (YYYY-MM-DD HH:MMZ) Implement Swap endpoints and state transitions.
- [ ] (YYYY-MM-DD HH:MMZ) Implement Audit endpoints or audit log retrieval required by OpenAPI.

### D. Domain services

- [ ] (YYYY-MM-DD HH:MMZ) Implement deterministic schedule generation for MVP scenarios.
- [ ] (YYYY-MM-DD HH:MMZ) Implement hard-rule conflict detection.
- [ ] (YYYY-MM-DD HH:MMZ) Implement availability deadline locking.
- [ ] (YYYY-MM-DD HH:MMZ) Implement publication immutability rules.
- [ ] (YYYY-MM-DD HH:MMZ) Implement swap validation and approval transaction.
- [ ] (YYYY-MM-DD HH:MMZ) Implement append-only audit log writes.

### E. Tests

- [ ] (YYYY-MM-DD HH:MMZ) Add route tests for all MVP endpoints.
- [ ] (YYYY-MM-DD HH:MMZ) Add service tests for schedule generation and conflict detection.
- [ ] (YYYY-MM-DD HH:MMZ) Add tests for deadline locking.
- [ ] (YYYY-MM-DD HH:MMZ) Add tests for publication immutability.
- [ ] (YYYY-MM-DD HH:MMZ) Add tests for swap validation and approval.
- [ ] (YYYY-MM-DD HH:MMZ) Add tests for audit log creation.
- [ ] (YYYY-MM-DD HH:MMZ) Add tests proving the SQLite seed/reset mechanism is deterministic.

### F. Report and handoff

- [ ] (YYYY-MM-DD HH:MMZ) Create `docs/reports/backend_implementation_report.md`.
- [ ] (YYYY-MM-DD HH:MMZ) Document implemented endpoints, seed accounts, database path and reset command.
- [ ] (YYYY-MM-DD HH:MMZ) Document deviations from OpenAPI, if any.
- [ ] (YYYY-MM-DD HH:MMZ) Document integration instructions for phase 06.

## Validation commands

Use actual backend tooling. Typical commands from the current template may include:

```bash
cd api
uv run ruff check .
uv run pytest
uv run coverage run -m pytest
uv run coverage report
```

If mypy is configured:

```bash
cd api
uv run mypy .
```

Also verify API startup:

```bash
cd api
uv run uvicorn src.main:app --reload
```

Adjust module path to the actual template.

## Acceptance criteria

- FastAPI backend implements the aligned `docs/architecture/openapi.yaml` MVP endpoints.
- SQLite persistence is configured and documented.
- Seed/reset works deterministically.
- Backend tests pass.
- Hard-rule violations block illegal actions.
- Published schedules cannot be directly edited.
- Swap approval updates assignments and audit log atomically enough for MVP.
- No frontend files were rewritten.
- `docs/reports/backend_implementation_report.md` exists.

## Risks

- Existing backend template may use a different package structure than expected.
- Full domain model may be broader than MVP; implement only contract-required scope.
- Auth may become overbuilt; keep it sufficient for role-based MVP testing.
- SQLite is not the final production database; keep migration path open.

## Rollback plan

- Keep persistence, routes and service implementation in separable commits.
- If SQLite setup breaks tests, rollback DB layer and keep schemas/routes stubs.
- If contract ambiguity blocks implementation, stop and return to phase 04.

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
| YYYY-MM-DD HH:MMZ | Backend Developer Agent | Initial English backend implementation plan with SQLite ADR dependency. |
