# ADR 0003 — Use OpenAPI as the Contract Between PWA and API

Status: Accepted
Date: 2026-04-25

## Context

SHIFTS_MVP separates the frontend PWA in `pwa/` from the backend API in `api/`. The UI originates from a Figma Make React prototype, while backend implementation happens later through FastAPI. Without a stable contract, the frontend could invent endpoint shapes and the backend could implement incompatible behavior.

The project already includes `docs/architecture/openapi.yaml`. This contract must bridge the domain model, frontend service layer and backend implementation.

## Decision

Use `docs/architecture/openapi.yaml` as the API contract between the PWA and the FastAPI backend.

The project should follow these rules:

- `docs/architecture/openapi.yaml` is the source of truth for backend endpoint paths, request schemas, response schemas and error shapes after the OpenAPI alignment phase;
- backend agents must implement endpoints defined in `docs/architecture/openapi.yaml`, not invent additional MVP endpoints during implementation;
- frontend integration must call the backend through service functions aligned with `docs/architecture/openapi.yaml`;
- contract changes must be explicit, reviewed and documented in the relevant execution plan handoff;
- contract changes must not introduce non-MVP product scope;
- ambiguous or missing contract decisions must be recorded in `docs/open_questions.md` instead of guessed by an implementation agent.

## Consequences

Positive consequences:

- Frontend and backend work can proceed with a shared interface.
- Backend implementation is constrained and easier to validate.
- Frontend services can be reviewed against a concrete contract.
- QA can design tests around stable API behavior.
- Contract drift becomes visible during the OpenAPI alignment phase.

Negative consequences and trade-offs:

- Updating the contract adds process overhead.
- The contract may need iteration after the Figma UI and mock services expose missing flows.
- OpenAPI does not fully capture all business rules; domain constraints still need service-level tests and documentation.
- Prematurely over-specifying the contract could slow MVP delivery.

## Alternatives considered

### Code-first backend contract

The backend could define the API implicitly through FastAPI route code. This was not selected because the frontend and backend are developed by separate agents and need a contract before implementation is complete.

### Frontend-first inferred contract

The frontend service layer could become the de facto contract. This would speed up early UI work, but it would make backend implementation fragile unless formalized into OpenAPI.

### GraphQL

GraphQL would allow flexible client queries, but it adds complexity that is unnecessary for the MVP's workflow-oriented endpoints.

## Follow-up triggers

Create a new ADR or update this one if:

- the project introduces a generated API client from OpenAPI;
- the API style changes from REST to GraphQL or RPC;
- versioning rules become necessary;
- external integrations require a public API contract distinct from the internal MVP API.

## Related documents

- `docs/execution_plans/03_mock_api_plan.md`
- `docs/execution_plans/04_openapi_alignment_plan.md`
- `docs/execution_plans/05_backend_implementation_plan.md`
- `docs/execution_plans/06_frontend_backend_integration_plan.md`
- `docs/architecture/openapi.yaml`
- `docs/architecture/domain_model.md`
- `docs/architecture/user_flow.mmd`
