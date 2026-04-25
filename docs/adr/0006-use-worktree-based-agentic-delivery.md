# ADR 0006 — Use Worktree-Based Agentic Delivery

Status: Accepted
Date: 2026-04-25

## Context

SHIFTS_MVP will be implemented through a multi-agent workflow. The expected agent family includes a Planning & Orchestration Agent, Frontend Developer Agent, Backend Developer Agent, UX Designer Agent and QA Agent. These agents may work on related but separate tasks, and uncontrolled edits would create scope drift, merge conflicts and unclear ownership.

The master execution plan is intended to coordinate the agents, not to replace phase-specific execution plans. Each implementation phase must remain reviewable and reversible.

## Decision

Use dedicated Git branches and dedicated `git worktree` directories for agent tasks.

The workflow should follow these rules:

- no agent works directly on `main`;
- each phase or agent task receives a dedicated branch;
- each branch is checked out into a dedicated worktree;
- the Orchestration Agent creates worktrees, assigns tasks, reviews handoffs and controls merges;
- agents may modify only files allowed by their phase plan;
- every agent must provide a handoff before merge;
- QA and UX reviews run as explicit gates, not as informal comments;
- failed validation or missing handoff blocks merge;
- architectural changes require an ADR or an update to an accepted ADR.

Recommended branch naming:

```text
agent/orchestrator/<task>
agent/frontend/<phase>-<task>
agent/backend/<phase>-<task>
agent/ux/<phase>-<task>
agent/qa/<phase>-<task>
```

Recommended worktree pattern:

```bash
git worktree add -b agent/frontend/01-figma-import \
  ../SHIFTS_MVP_worktrees/frontend-01-figma-import main
```

## Consequences

Positive consequences:

- Agent work is isolated and easier to review.
- Rollback is simpler because each phase has a branch boundary.
- Merge conflicts become visible before integration.
- The Orchestration Agent can enforce scope and validation gates.
- QA and UX feedback can be tied to specific diffs.

Negative consequences and trade-offs:

- Worktree management adds operational overhead.
- The Orchestration Agent must keep `main` current before creating new worktrees.
- Parallel work can still produce conflicts if phase boundaries are poorly defined.
- Agents need clear file ownership rules to avoid editing the same areas.

## Alternatives considered

### Single shared branch

A shared branch is simpler, but it is unsafe for a multi-agent workflow. It makes it difficult to isolate responsibility, review diffs and roll back bad changes.

### Separate cloned repositories

Separate clones would isolate work, but they are heavier to manage and make branch/handoff coordination less consistent than worktrees.

### Manual copy/paste between folders

Manual copying avoids Git complexity, but it destroys traceability and makes review unreliable.

## Follow-up triggers

Create a new ADR or update this one if:

- the project moves to a hosted pull request workflow;
- agents start working in parallel on overlapping phases;
- CI/CD becomes the primary merge gate;
- branch/worktree overhead becomes a blocker for small documentation-only tasks.

## Related documents

- `docs/execution_plans/master_execution_plan.md`
- `docs/execution_plans/01_figma_import_plan.md`
- `docs/execution_plans/02_frontend_refactor_plan.md`
- `docs/execution_plans/03_mock_api_plan.md`
- `docs/execution_plans/04_openapi_alignment_plan.md`
- `docs/execution_plans/05_backend_implementation_plan.md`
- `docs/execution_plans/06_frontend_backend_integration_plan.md`
- `docs/execution_plans/07_quality_release_plan.md`
