# Master Execution Plan — SHIFTS_MVP

Status: Living Draft
Owner: Planning & Orchestration Agent
Last updated: YYYY-MM-DD HH:MMZ

## Purpose

Coordinate the agent family that delivers the SHIFTS_MVP doctor duty scheduling MVP. This document is intentionally short and orchestration-focused. Detailed implementation work belongs in the phase plans `01`–`07`.

## Source of truth

1. `docs/architecture/project_asumptions.md` — MVP scope, roles, workflow and constraints.
2. `docs/architecture/domain_model.md` — domain entities, states and invariants.
3. `docs/architecture/er_diagram.md` — data relationships.
4. `docs/architecture/user_flow.mmd` — end-to-end workflow.
5. `docs/architecture/openapi.yaml` — API contract between `pwa/` and `api/`.
6. `docs/adr/**` — accepted architecture decisions, including SQLite for MVP persistence.

If filenames differ from this list, agents must use the files that actually exist in the repository and record the mismatch in `docs/open_questions.md`.

## Agent family

| Agent | Primary role | Must not do |
|---|---|---|
| Planning & Orchestration Agent | Own sequencing, branch/worktree setup, handoffs, merge gates and scope control. | Implement product code directly. |
| Frontend Developer Agent | Import Figma Make React, refactor PWA, create mock services and integrate frontend with API. | Implement backend persistence or change domain scope. |
| Backend Developer Agent | Align and implement FastAPI backend from `docs/architecture/openapi.yaml`, using SQLite per ADR. | Rewrite frontend or invent non-contract endpoints. |
| UX Designer Agent | Review flows, usability, accessibility basics and role-specific UX. | Add product scope or rewrite architecture. |
| QA Agent | Validate with tests, Playwright and Lighthouse; produce release-quality reports. | Silently accept failing critical flows or make unrelated rewrites. |

## Worktree and branch model

Every agent task runs in its own `git worktree` and on its own branch. The Orchestration Agent creates worktrees, assigns tasks, reviews handoffs and merges only after the phase gate passes.

Branch naming convention:

```text
agent/orchestrator/<task>
agent/frontend/<phase>-<task>
agent/backend/<phase>-<task>
agent/ux/<phase>-<task>
agent/qa/<phase>-<task>
```

Recommended worktree convention:

```bash
git status --short
git fetch --all --prune
mkdir -p ../worktrees

git worktree add ../worktrees/shifts-01-figma-import -b agent/frontend/01-figma-import main
git worktree add ../worktrees/shifts-02-frontend-refactor -b agent/frontend/02-frontend-refactor main
git worktree add ../worktrees/shifts-05-backend-implementation -b agent/backend/05-backend-implementation main
git worktree add ../worktrees/shifts-07-quality-release -b agent/qa/07-quality-release main
```

If `main` is not the integration branch, the Orchestration Agent must replace it with the repository's actual integration branch.

## Phase sequence

| Phase | Plan | Owner agent | Output | Merge gate |
|---|---|---|---|---|
| 1 | `01_figma_import_plan.md` | Frontend Developer | Figma Make React code imported into `pwa/` as a controlled snapshot. | PWA renders imported UI and builds. |
| 2 | `02_frontend_refactor_plan.md` | Frontend Developer | React structure, feature components and domain types are maintainable. | Build/typecheck pass; UX review can start. |
| UX Gate A | Orchestrator-created UX worktree | UX Designer | UX review of imported/refactored role flows. | Blocking UX issues are logged before phase 3. |
| 3 | `03_mock_api_plan.md` | Frontend Developer | Async mock service layer replaces inline business data. | UI consumes services, not JSX-level data. |
| 4 | `04_openapi_alignment_plan.md` | Backend Developer with Frontend review | `docs/architecture/openapi.yaml` matches MVP flows and service contracts. | Contract validates and maps to services. |
| 5 | `05_backend_implementation_plan.md` | Backend Developer | FastAPI backend implemented with SQLite persistence. | Backend tests pass and seed/reset works. |
| 6 | `06_frontend_backend_integration_plan.md` | Frontend Developer with Backend support | PWA services use real API while preserving optional mock mode. | Critical flows work through backend. |
| UX Gate B | Orchestrator-created UX worktree | UX Designer | Final UX/accessibility review before QA release gate. | Blocking UX issues are assigned. |
| 7 | `07_quality_release_plan.md` | QA Agent | Playwright, Lighthouse, test reports and release decision. | No blocking defects in critical flows. |

## Global rules

- Do not invent product requirements.
- Do not change files outside the assigned phase scope.
- Do not implement backend before mock services and OpenAPI alignment are complete.
- Figma import must not modify `api/`.
- Backend implementation must not rewrite `pwa/`.
- Backend persistence must follow `docs/adr/0007-use-sqlite-for-mvp-local-persistence.md` unless a newer accepted ADR supersedes it.
- `Schedule.status` guards behavior: `DRAFT`, `GENERATED`, `PUBLISHED`, `ARCHIVED`.
- A duty shift is 24 hours.
- Hard legal constraints cannot be approved as violated.
- A published schedule is immutable except through the approved shift swap process.
- Audit log entries are append-only.
- Missing or ambiguous requirements go to `docs/open_questions.md`, not into guessed implementation.

## Handoff protocol

Each phase must end with this section completed in the relevant phase plan:

```md
## Handoff
- Branch/worktree:
- Completed:
- Validation:
- Known issues:
- Open questions:
- Files changed:
- Recommended next step:
```

The next agent starts by reading the previous handoff, checking the merge gate and confirming that its own worktree is based on the current integration branch.

## Stop conditions

The Orchestration Agent must pause or reject a merge when:

- the agent worked outside its assigned scope;
- the worktree is not based on the expected integration branch;
- validation commands fail and the defect is outside the current phase scope;
- implementation contradicts `docs/architecture/project_asumptions.md`, `docs/architecture/domain_model.md`, `docs/architecture/user_flow.mmd` or accepted ADRs;
- a required architecture decision is missing;
- API behavior is implemented before or against `docs/architecture/openapi.yaml`;
- QA reports a blocking defect in schedule generation, publication, swap approval, hard-rule validation or audit logging.

## Change log

| Timestamp UTC | Agent | Change |
|---|---|---|
| YYYY-MM-DD HH:MMZ | Planning & Orchestration Agent | Initial English orchestration plan with worktree-based agent isolation. |
