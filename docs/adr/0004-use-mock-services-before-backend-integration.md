# ADR 0004 — Use Mock Services Before Backend Integration

Status: Accepted
Date: 2026-04-25

## Context

The initial UI comes from Figma Make and must be stabilized before the backend is implemented. The project has separate frontend and backend areas, and multiple AI agents will work in phases. If React components consume hardcoded JSX data or the backend is implemented too early, the API shape will be guessed rather than derived from actual MVP flows.

The frontend needs an intermediate service layer that behaves like an API while still using local mock data. This lets the UI, state transitions and service function names stabilize before backend implementation.

## Decision

Build async mock services in the frontend before implementing or integrating the real backend.

The frontend should:

- expose service functions under `pwa/src/services/` or the project-equivalent frontend service directory;
- keep mock data under `pwa/src/mocks/` or a clearly named equivalent;
- make components call async service functions instead of reading hardcoded data directly from JSX;
- model service responses around real MVP flows: doctors, departments, schedules, availability, preferences, conflicts, publication, swap requests and audit entries;
- preserve service function names when replacing mocks with real API calls;
- keep backend implementation out of the mock service phase;
- use the mock service layer as input to OpenAPI alignment.

## Consequences

Positive consequences:

- Frontend development is not blocked by backend availability.
- The real API contract can be shaped by actual UI flows.
- Components become easier to test and integrate.
- Backend agents receive clearer expectations.
- Integration later requires changing service internals, not rewriting UI components.

Negative consequences and trade-offs:

- Mock data can diverge from backend behavior if not aligned through OpenAPI.
- Mock services can create false confidence unless QA later validates against the real API.
- There is some duplicate modeling effort before backend schemas exist.
- Agents must avoid implementing hidden business logic only in mocks.

## Alternatives considered

### Backend first

Implementing the backend before mock services would make persistence available earlier, but the API would likely be guessed before the Figma UI and frontend flows are stabilized.

### Hardcoded component data

Hardcoded JSX data is fast for visual prototypes, but it creates tight coupling and makes later backend integration expensive.

### MSW from the start

Mock Service Worker could simulate HTTP endpoints more realistically. It may be useful later, but the MVP first needs simple typed service functions and mock data. MSW can be introduced if tests require network-level mocking.

## Follow-up triggers

Create a new ADR or update this one if:

- the project adopts generated API clients;
- the QA strategy requires MSW or contract-level HTTP mocks;
- frontend and backend integration reaches a stable state and mocks become test fixtures only;
- mock services start duplicating complex backend business rules.

## Related documents

- `docs/execution_plans/02_frontend_refactor_plan.md`
- `docs/execution_plans/03_mock_api_plan.md`
- `docs/execution_plans/04_openapi_alignment_plan.md`
- `docs/execution_plans/06_frontend_backend_integration_plan.md`
- `pwa/`
- `docs/architecture/openapi.yaml`
- `docs/architecture/domain_model.md`
