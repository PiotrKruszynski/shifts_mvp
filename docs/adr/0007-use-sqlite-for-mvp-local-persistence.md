# ADR 0007 — Use SQLite for MVP Local Persistence

Status: Accepted
Date: 2026-04-25

## Context

SHIFTS_MVP needs persistent backend state for local development, API integration, deterministic QA runs and Playwright end-to-end tests. The current MVP does not yet require production-scale concurrency, managed database hosting, replication, multi-tenant database operations or advanced operational features.

The backend lives in `api/` and is expected to implement the aligned `docs/architecture/openapi.yaml` contract. The frontend lives in `pwa/` and will integrate with the backend after the mock service layer is completed. QA must be able to reset the database to a deterministic state before automated tests.

## Decision

Use SQLite as the default database for MVP local persistence.

The backend should:

- use SQLite for local development and MVP validation;
- keep the database file in a documented local path, preferably `api/var/shifts_mvp.sqlite`;
- provide deterministic seed and reset commands for integration and QA;
- keep persistence behind repositories/services so a future migration to PostgreSQL is feasible;
- avoid exposing SQLite-specific behavior in the public API.

## Consequences

Positive consequences:

- Local setup is simpler.
- Agents can implement and validate the backend faster.
- QA can reset state reliably before Playwright runs.
- The MVP can avoid premature infrastructure work.

Negative consequences and trade-offs:

- SQLite is not the intended production database for a scaled SaaS deployment.
- Concurrency and operational behavior will differ from PostgreSQL.
- A later production-readiness phase may need a migration ADR.
- Persistence code must avoid SQLite-specific shortcuts that would block migration.

## Alternatives considered

### PostgreSQL from the start

PostgreSQL would better approximate a production SaaS backend and support stronger operational patterns. It was not selected for this MVP phase because it adds setup and orchestration overhead before the frontend/backend contract is validated.

### In-memory mocks only

In-memory storage would be fastest to implement, but it is insufficient for realistic API integration, repeatable Playwright tests, audit log validation and swap workflow state transitions.

### File-based JSON storage

JSON files would be simple, but they would not represent relational constraints, transactional updates or future migration paths as well as SQLite.

## Follow-up triggers

Create a new ADR to reconsider this decision when any of the following becomes true:

- the application moves from local MVP validation to production deployment;
- multiple concurrent coordinators or departments must be tested realistically;
- performance, locking or transaction behavior becomes a blocker;
- deployment target requires a managed database;
- the backend needs production-grade migrations, backup and observability.

## Related documents

- `docs/execution_plans/05_backend_implementation_plan.md`
- `docs/execution_plans/07_quality_release_plan.md`
- `docs/architecture/openapi.yaml`
- `docs/architecture/domain_model.md`
- `docs/architecture/er_diagram.md`
