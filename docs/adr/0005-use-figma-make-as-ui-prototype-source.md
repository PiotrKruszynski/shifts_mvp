# ADR 0005 — Use Figma Make as the UI Prototype Source

Status: Accepted
Date: 2026-04-25

## Context

SHIFTS_MVP has a Figma Make generated React prototype and a UI specification describing role-specific screens for Doctor, Coordinator and Admin. The prototype is intended to accelerate frontend creation, but generated code should not be treated as final application architecture or as a source of backend truth.

The project also has a Figma MCP Server available. The import phase must move the selected Figma Make React output into the existing `pwa/` project in a controlled way.

## Decision

Use the Figma Make React prototype as the primary source for initial UI structure and visual direction, while treating the imported code as prototype material that must later be refactored.

The Figma import phase should:

- inspect the selected Figma Make output and any exported code structure;
- import or recreate the selected React UI inside `pwa/`;
- preserve the generated role-oriented UI structure where useful;
- include the Figma UI specification, guidelines and attribution files when present;
- avoid blind overwrites of existing project configuration;
- fix only import paths, dependency issues and build blockers required for the UI snapshot to run;
- avoid backend implementation, OpenAPI changes and domain refactoring during the import phase;
- record missing, partial or ambiguous Figma scope in the phase handoff or `docs/open_questions.md`.

## Consequences

Positive consequences:

- The frontend starts from a concrete visual prototype instead of a blank implementation.
- UX review can evaluate actual screens early.
- The team can preserve visual intent while still refactoring generated code later.
- Figma MCP can help verify design/code alignment when available.

Negative consequences and trade-offs:

- Generated code may contain large components, hardcoded data and weak separation of concerns.
- Visual fidelity can conflict with maintainable frontend architecture until refactoring occurs.
- Figma output may not cover all MVP flows or edge states.
- Agents must not infer backend requirements from generated UI alone.

## Alternatives considered

### Hand-build the UI from documentation only

This would produce cleaner code from the start, but it would waste the already generated prototype and delay UX validation.

### Treat Figma Make output as production-ready

This would be faster initially, but it risks locking the application into generated structure, hardcoded data and unclear ownership of domain logic.

### Use Figma only as visual reference

Using Figma only as reference would reduce code import risk, but the project explicitly has generated React output that can accelerate the MVP when imported carefully.

## Follow-up triggers

Create a new ADR or update this one if:

- the team adopts a formal design system package or Code Connect mapping;
- Figma output is replaced by a hand-built component library;
- Figma Make code becomes too divergent from the actual product;
- another design source becomes the primary UI source of truth.

## Related documents

- `docs/execution_plans/01_figma_import_plan.md`
- `docs/execution_plans/02_frontend_refactor_plan.md`
- `pwa/src/imports/ui_spec_figma.md`
- `ui_spec_figma.md`
- `pwa/`
