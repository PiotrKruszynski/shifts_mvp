# ADR 0002 — Use FastAPI for the Backend API

Status: Accepted
Date: 2026-04-25

## Context

SHIFTS_MVP needs a backend API for doctor shift scheduling workflows: schedule creation, availability submission, deterministic schedule generation, conflict reporting, publication, swap requests, audit entries and administrative configuration. The repository already contains an `api/` backend area and the project owner expects a Python backend.

The backend must implement the aligned `docs/architecture/openapi.yaml` contract, support deterministic local development, expose predictable request/response schemas and be testable by the QA agent. The MVP database decision is covered separately by ADR 0007.

## Decision

Use FastAPI as the backend framework for the SHIFTS_MVP API under `api/`.

The backend implementation should:

- implement only endpoints defined in `docs/architecture/openapi.yaml`;
- use Pydantic schemas for request and response validation;
- organize code into routes, schemas, services, repositories and database modules;
- keep domain rules out of route handlers where practical;
- expose deterministic seed/reset support for QA and Playwright tests;
- use SQLite for MVP persistence according to ADR 0007;
- add backend tests for endpoint behavior and critical service logic;
- avoid changing frontend code unless the integration phase explicitly requires it.

## Consequences

Positive consequences:

- FastAPI maps naturally to OpenAPI contracts.
- Pydantic gives strong runtime validation and schema clarity.
- Python is well suited for future scheduling and constraint logic.
- The backend can be tested independently from the frontend.
- The route/service/repository split helps prevent business rules from leaking into UI code.

Negative consequences and trade-offs:

- FastAPI requires explicit project conventions; the framework does not enforce architecture by itself.
- Async/sync database choices must be handled consistently.
- The MVP backend may need later hardening for production authentication, authorization, observability and deployment.
- Scheduling logic can become complex; it must remain deterministic and testable.

## Alternatives considered

### Node.js / Express or NestJS

A Node backend would align with the frontend ecosystem, but the project already expects Python backend work and future scheduling logic is a good fit for Python. FastAPI also provides stronger OpenAPI support out of the box than a minimal Express setup.

### Django / Django REST Framework

Django would provide a larger batteries-included stack, but it adds framework weight before the MVP contract is validated. FastAPI is lighter for contract-first API development.

### Backendless prototype only

Keeping the MVP fully frontend-only would speed up UI exploration, but it would not validate persistence, auditability, schedule state transitions or integration behavior.

## Follow-up triggers

Create a new ADR to revisit this decision if:

- the backend needs production-grade multi-tenant SaaS features beyond the MVP;
- the scheduling algorithm requires a specialized solver or service boundary;
- deployment constraints strongly favor a different backend runtime;
- authentication, authorization or compliance requirements require a broader backend architecture decision.

## Related documents

- `docs/execution_plans/04_openapi_alignment_plan.md`
- `docs/execution_plans/05_backend_implementation_plan.md`
- `docs/execution_plans/06_frontend_backend_integration_plan.md`
- `docs/adr/0007-use-sqlite-for-mvp-local-persistence.md`
- `api/`
- `docs/architecture/openapi.yaml`
- `docs/architecture/domain_model.md`
- `docs/architecture/er_diagram.md`
