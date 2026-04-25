# ADR 0001 — Use React, TypeScript, Vite, Tailwind and PWA for the Frontend

Status: Accepted
Date: 2026-04-25

## Context

SHIFTS_MVP needs a browser-based interface for three roles: Doctor, Coordinator and Admin. The coordinator and admin flows are desktop-first, while the doctor flow must work well on mobile devices. The project already uses a `pwa/` frontend directory, and the initial UI source is expected to come from a Figma Make React prototype.

The MVP must move quickly from generated UI to a maintainable frontend without blocking on backend implementation. The frontend needs strong typing, component-based structure, fast local builds, responsive styling and later integration with the FastAPI backend through a service layer.

## Decision

Use React with TypeScript as the frontend application framework, Vite as the build tool, Tailwind CSS for styling and a PWA-capable frontend structure under `pwa/`.

The frontend implementation should:

- keep all application code inside `pwa/`;
- use React components for role-specific screens and reusable UI blocks;
- use TypeScript domain types derived from `docs/architecture/domain_model.md`;
- use Vite for local development and production builds;
- use Tailwind CSS for layout and styling, preserving the visual direction from Figma Make;
- keep PWA behavior available for the doctor mobile-first experience;
- avoid embedding backend assumptions directly in JSX;
- integrate with backend APIs through typed frontend services after the mock API phase.

## Consequences

Positive consequences:

- React aligns with the Figma Make generated output.
- TypeScript reduces integration drift between UI, mock services and backend schemas.
- Vite keeps the local development loop fast.
- Tailwind allows rapid implementation while preserving design consistency.
- PWA support fits the doctor mobile workflow without requiring a native app in the MVP.
- The frontend can be developed before the backend by using async mock services.

Negative consequences and trade-offs:

- Tailwind can lead to noisy component markup if not organized carefully.
- Generated Figma code may require refactoring before it becomes maintainable.
- PWA behavior requires explicit QA coverage, especially around mobile layout and caching.
- React/Vite does not provide backend or routing conventions automatically; the project must enforce structure through execution plans.

## Alternatives considered

### Next.js

Next.js would provide server-side rendering, routing conventions and production deployment patterns. It was not selected for the MVP because the project is primarily a client-side PWA with a separate FastAPI backend, and the initial Figma Make output is expected to be plain React.

### Native mobile application

A native mobile app could improve the doctor experience, but it would add platform complexity too early. The MVP should validate the workflow through a responsive PWA first.

### Plain React without TypeScript

Plain JavaScript would reduce initial friction, but the project needs stable contracts between frontend services, OpenAPI schemas and backend models. TypeScript is a better fit for preventing drift.

## Follow-up triggers

Create a new ADR to revisit this decision if:

- the doctor workflow requires native-only mobile features;
- server-side rendering becomes a business or performance requirement;
- the PWA needs offline-first behavior beyond basic caching;
- the frontend grows enough to require a formal component library or design system package.

## Related documents

- `docs/execution_plans/01_figma_import_plan.md`
- `docs/execution_plans/02_frontend_refactor_plan.md`
- `docs/execution_plans/03_mock_api_plan.md`
- `docs/execution_plans/06_frontend_backend_integration_plan.md`
- `pwa/`
- `docs/architecture/domain_model.md`
- `docs/architecture/user_flow.mmd`
