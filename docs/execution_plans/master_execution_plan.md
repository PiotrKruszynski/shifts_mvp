# Master Execution Plan — SHIFTS_MVP

Status: Living Draft
Owner: Planning & Orchestration Agent
Last updated: 2026-04-26 10:57Z

## Purpose

This document coordinates the agent family delivering SHIFTS_MVP.
It defines:

- source-of-truth hierarchy,
- agent responsibilities,
- phase sequencing,
- worktree/branch expectations,
- merge gates,
- stop conditions,
- handoff requirements.

Detailed implementation belongs strictly to phase plans `01`–`07`.

## Source of truth

1. `docs/architecture/project_assumptions.md`
2. `docs/architecture/domain_model.md`
3. `docs/architecture/er_diagram.md`
4. `docs/architecture/user_flow.mmd`
5. `docs/architecture/openapi.yaml`
6. `docs/adr/**`
7. Current phase plan
8. Previous phase report/handoff
9. Repository state

### Critical rule

**Git state is authoritative.**

- Reports are evidence, not authority.
- If Git does not confirm completion → phase is NOT complete.
- Work that exists only as:
  - untracked files
  - local changes
  - unstashed work
  **does not count as done.**

If filenames differ from this list, agents must use the files that actually exist in the repository and record the mismatch in `docs/open_questions.md`.

## Agent family

| Agent | Primary role | Must not do |
|---|---|---|
| Planning & Orchestration Agent | Own sequencing, branch/worktree setup, handoffs, merge gates and scope control. | Implement product code directly. |
| Frontend Developer Agent | Import Figma Make React, refactor PWA, create mock services and integrate frontend with API. | Implement backend persistence or change domain scope. |
| Backend Developer Agent | Align and implement FastAPI backend from `docs/architecture/openapi.yaml`, using SQLite per ADR. | Rewrite frontend or invent non-contract endpoints. |
| UX Designer Agent | Review flows, usability, accessibility basics and role-specific UX. | Add product scope or rewrite architecture. |
| QA Agent | Validate with tests, Playwright and Lighthouse; produce release-quality reports. | Silently accept failing critical flows or make unrelated rewrites. |
| Git Integrator | Ensure branch contains current `master`, resolve merge state, eliminate untracked deliverables. | Lose, overwrite or discard local work without preserving it. |
| Gatekeeper | Decide if phase can proceed based on Git state, validation and handoff completeness. | Allow progression when merge gate conditions are not satisfied. |

## Worktree and branch model

Each phase:

- runs in its own worktree
- runs on its own branch
- must be based on current `master`
- must have a matching remote branch on `origin`
- must keep phase work on the phase branch until the phase is accepted

Phase branch visibility rules:

- create the local phase branch from current `master` before work starts;
- push the phase branch to `origin` so it is visible on GitHub;
- do phase work on the phase branch, not directly on `master`;
- do not push only `master` as the record of phase work;
- after phase acceptance, merge the phase branch into `master`;
- push `master` after the accepted merge;
- do not delete remote phase branches without a separate explicit decision.

### Naming

`branch: agent/<role>/<phase>-<task>`

`worktree: ../worktrees/shifts-<phase>-<task>`

## Phase sequence

| Phase | Plan | Exit condition |
|---|---|---|
| 01        | Figma import      | UI builds and renders       |
| 02        | Frontend refactor | Structure + types stable    |
| UX Gate A | UX review         | Blocking UX issues resolved |
| 03        | Mock API          | UI uses services            |
| 04        | OpenAPI alignment | Contract stable             |
| 05        | Backend           | API + SQLite + tests        |
| 06        | Integration       | UI works with real API      |
| UX Gate B | UX review         | Final UX issues resolved    |
| 07        | QA/Release        | GO / NO-GO decision         |

## Global rules

- Do not invent requirements.
- Do not cross phase boundaries.
- Do not implement backend before phase 04.
- Do not modify frontend during backend phase.
- SQLite is required by ADR.
- Schedule lifecycle is fixed: DRAFT → GENERATED → PUBLISHED → ARCHIVED.
- Published schedule is immutable except through swap.
- Swap is the only mutation after publish.
- Audit log is append-only.
- Shift = 24h.
- Hard constraints cannot be violated.
- Missing or ambiguous requirements go to `docs/open_questions.md`, not into guessed implementation.

## Merge gate

A phase may be merged ONLY if:

- branch contains current `master`;
- branch has been pushed to `origin`;
- `git status` is clean;
- no untracked deliverables exist;
- all work is committed;
- report is committed;
- validation was executed after sync with `master`;
- validation passes or failures are classified;
- scope matches phase;
- no ADR/architecture violations exist.

## Handoff protocol

Each phase must end with this section completed in the relevant phase plan:

```md
## Handoff
- Branch/worktree:
- Remote branch:
- Base branch:
- Current HEAD:
- Contains master: yes/no
- Completed:
- Validation:
- Files changed:
- Known issues:
- Open questions:
- Gate decision:
- Recommended next step:
```

## Stop conditions

Stop immediately if:

- branch is not based on `master`;
- untracked deliverables exist;
- validation fails and failures are not classified;
- work crosses phase scope;
- an architecture conflict is discovered;
- required inputs are missing;
- a required UX gate is skipped;
- API is implemented before contract;
- phase is marked complete without Git proof.

## Change log

| Timestamp UTC | Agent | Change |
|---|---|---|
| 2026-04-26 10:57Z | Planning & Orchestration Agent | Promoted stashed master execution plan update and clarified Git-authoritative merge gates before Phase 03. |
| YYYY-MM-DD HH:MMZ | Planning & Orchestration Agent | Initial English orchestration plan with worktree-based agent isolation. |
