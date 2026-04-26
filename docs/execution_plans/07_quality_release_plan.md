# 07 — Quality, UX and Release Validation Plan

Status: Ready for QA
Owner: QA Agent
UX Reviewer: UX Designer Agent
Orchestrated by: Planning & Orchestration Agent
Worktree branch: `agent/qa/07-quality-release`
Recommended worktree: `../worktrees/shifts-07-quality-release`
Depends on: `06_frontend_backend_integration_plan.md` and UX Gate B notes
Last updated: 2026-04-26 15:30Z

## Objective

Validate the integrated SHIFTS_MVP application with backend tests, frontend checks, Playwright end-to-end tests, Lighthouse audits and UX review. Produce a clear release decision: `GO`, `GO WITH KNOWN ISSUES`, or `NO-GO`.

## Required inputs

- Completed handoff from phase 06.
- `docs/reports/integration_report.md`.
- UX Gate B notes, if available.
- Backend seed/reset instructions using SQLite.
- `docs/architecture/project_assumptions.md`.
- `docs/architecture/domain_model.md`.
- `docs/architecture/user_flow.mmd`.
- `docs/architecture/openapi.yaml`.
- Accepted ADRs in `docs/adr/**`.

## Non-goals

- Do not add new product features.
- Do not rewrite UI or backend.
- Do not change domain rules or API contract without returning to the proper phase.
- Do not silently fix unrelated implementation issues.
- Do not accept blocking failures as known issues.
- Do not attempt production hardening beyond MVP release validation.

## Allowed paths

- `pwa/tests/**`, `pwa/e2e/**`, `pwa/playwright.config.*`, if used for QA tests
- `api/tests/**`, only for QA coverage additions
- `docs/reports/quality_report.md`
- `docs/reports/defect_log.md`
- `docs/reports/ux_review_report.md`
- `docs/open_questions.md`
- Minimal code changes only for unambiguous test or configuration fixes approved by the Orchestration Agent
- `docs/execution_plans/07_quality_release_plan.md`

## Forbidden paths

- Large changes in `pwa/src/**`.
- Large changes in `api/src/**`.
- `docs/architecture/openapi.yaml`, except to report contract defects.
- `docs/architecture/domain_model.md`.
- `docs/architecture/er_diagram.md`.
- `docs/architecture/project_assumptions.md`.
- `docs/architecture/user_flow.mmd`.
- `docs/adr/**`, except for recommending updates in the handoff.

## Worktree setup

```bash
git fetch --all --prune
git worktree add ../worktrees/shifts-07-quality-release -b agent/qa/07-quality-release master
cd ../worktrees/shifts-07-quality-release
```

Use the integration branch that contains accepted phase 06 changes. If UX Designer performs a separate review, the Orchestration Agent should create:

```text
branch: agent/ux/07-release-ux-review
worktree: ../worktrees/shifts-07-ux-review
```

## Quality principles

- Backend tests must run against a deterministic SQLite seed/reset state.
- Playwright tests must cover critical product flows, not only page loads.
- Lighthouse must be run against a production build/preview whenever possible.
- UX review must check role clarity, mobile/desktop fit and critical decision points.
- Defects must be explicit, reproducible and assigned to an owner phase.

## Critical E2E flows

1. Admin manages users and assigns a Coordinator to a department.
2. Coordinator creates a new monthly schedule.
3. Doctor submits availability, category I–III preferences and a leave request.
4. System blocks availability editing after the deadline.
5. Coordinator generates a schedule.
6. System shows a conflict when coverage is impossible.
7. Coordinator corrects a schedule without violating hard rules.
8. Coordinator publishes the schedule.
9. Doctor sees the published schedule.
10. Doctor initiates a post-publication shift swap.
11. Second doctor accepts or rejects the swap.
12. System validates the swap against hard rules.
13. Coordinator approves a valid swap.
14. System updates assignments and writes audit log entries.
15. Coordinator archives the schedule after the period or after a new schedule is created.

## Domain checks

- `PUBLISHED` schedule does not allow ordinary assignment edits.
- Swap is not available before publication.
- Swap approval is blocked by hard-rule violations.
- Shift length is 24 hours.
- Each staffed shift has one active assignment.
- Assignment source after approved swap is `SWAP` for the replacement assignment.
- Old assignment after approved swap is `REPLACED`.
- Audit log contains entries for generation, publication and swap approval.
- Conflict report contains reason codes and shift context.
- Doctor views do not expose unnecessary data about other doctors.

## Step-by-step tasks

### A. Preflight

- [ ] (YYYY-MM-DD HH:MMZ) Confirm branch/worktree: `agent/qa/07-quality-release`.
- [ ] (YYYY-MM-DD HH:MMZ) Read phase 06 handoff and integration report.
- [ ] (YYYY-MM-DD HH:MMZ) Confirm backend SQLite seed/reset command.
- [ ] (YYYY-MM-DD HH:MMZ) Confirm frontend and backend run commands.
- [ ] (YYYY-MM-DD HH:MMZ) Confirm Playwright and Lighthouse availability or install local dev tooling if project policy allows.

### B. Backend quality

- [ ] (YYYY-MM-DD HH:MMZ) Reset SQLite database to deterministic seed.
- [ ] (YYYY-MM-DD HH:MMZ) Run backend lint/static checks.
- [ ] (YYYY-MM-DD HH:MMZ) Run backend tests.
- [ ] (YYYY-MM-DD HH:MMZ) Run backend coverage if configured.
- [ ] (YYYY-MM-DD HH:MMZ) Verify API startup against seeded SQLite state.

### C. Frontend quality

- [ ] (YYYY-MM-DD HH:MMZ) Run frontend build.
- [ ] (YYYY-MM-DD HH:MMZ) Run frontend typecheck if configured.
- [ ] (YYYY-MM-DD HH:MMZ) Run frontend lint if configured.
- [ ] (YYYY-MM-DD HH:MMZ) Run frontend unit/component tests if configured.
- [ ] (YYYY-MM-DD HH:MMZ) Verify no integrated screen still depends on stale hardcoded business data unless intentionally in mock mode.

### D. Playwright E2E

- [ ] (YYYY-MM-DD HH:MMZ) Create or update Playwright tests for the critical E2E flows.
- [ ] (YYYY-MM-DD HH:MMZ) Reset SQLite database before Playwright run.
- [ ] (YYYY-MM-DD HH:MMZ) Start backend and frontend preview/dev server for Playwright.
- [ ] (YYYY-MM-DD HH:MMZ) Run Playwright tests.
- [ ] (YYYY-MM-DD HH:MMZ) Save Playwright report path in `quality_report.md`.

### E. Lighthouse

- [ ] (YYYY-MM-DD HH:MMZ) Build frontend for production.
- [ ] (YYYY-MM-DD HH:MMZ) Start frontend preview server.
- [ ] (YYYY-MM-DD HH:MMZ) Run Lighthouse for Coordinator dashboard/schedule view.
- [ ] (YYYY-MM-DD HH:MMZ) Run Lighthouse for Doctor mobile-first schedule/availability view.
- [ ] (YYYY-MM-DD HH:MMZ) Record Performance, Accessibility, Best Practices and PWA findings.

### F. UX release review

- [ ] (YYYY-MM-DD HH:MMZ) UX Designer reviews Coordinator schedule generation, conflict resolution and publication flow.
- [ ] (YYYY-MM-DD HH:MMZ) UX Designer reviews Doctor availability, schedule and swap flow on mobile.
- [ ] (YYYY-MM-DD HH:MMZ) UX Designer reviews Admin account/department setup flow.
- [ ] (YYYY-MM-DD HH:MMZ) UX Designer checks copy clarity for hard-rule conflicts and swap validation.
- [ ] (YYYY-MM-DD HH:MMZ) UX Designer checks accessibility basics: focus order, keyboard navigation, labels, contrast and landmarks.
- [ ] (YYYY-MM-DD HH:MMZ) Create `docs/reports/ux_review_report.md`.

### G. Reports and release decision

- [ ] (YYYY-MM-DD HH:MMZ) Create `docs/reports/defect_log.md`.
- [ ] (YYYY-MM-DD HH:MMZ) Create `docs/reports/quality_report.md`.
- [ ] (YYYY-MM-DD HH:MMZ) Classify defects as `blocking`, `high`, `medium`, or `low`.
- [ ] (YYYY-MM-DD HH:MMZ) Assign each defect to an owner phase or agent.
- [ ] (YYYY-MM-DD HH:MMZ) Record release decision: `GO`, `GO WITH KNOWN ISSUES`, or `NO-GO`.
- [ ] (YYYY-MM-DD HH:MMZ) Complete final handoff for Orchestration Agent.

## Validation commands

Backend examples:

```bash
cd api
uv run ruff check .
uv run pytest
uv run coverage run -m pytest
uv run coverage report
```

Frontend examples:

```bash
cd pwa
pnpm run build
pnpm run typecheck
pnpm run lint
pnpm run test
```

Playwright examples:

```bash
cd pwa
npx playwright test
npx playwright show-report
```

Lighthouse examples:

```bash
cd pwa
pnpm run build
pnpm run preview
npx lighthouse http://localhost:4173 --view
```

Use the actual package manager and ports configured in the repository.

## Quality thresholds

MVP target thresholds:

- Backend tests: 100% pass.
- Frontend build/typecheck: 100% pass.
- Playwright critical flows: 100% pass.
- Lighthouse Performance: target >= 80.
- Lighthouse Accessibility: target >= 90.
- Lighthouse Best Practices: target >= 90.
- PWA: no blocking installability/offline issue if PWA is in MVP scope.
- No blocking defects in generation, publication, swap approval, hard-rule validation or audit logging.

## Defect log format

```md
# Defect Log

| ID | Severity | Area | Summary | Repro steps | Expected | Actual | Owner phase | Status |
|---|---|---|---|---|---|---|---|---|
```

## Quality report format

```md
# Quality Report

## Summary
Release decision: GO / GO WITH KNOWN ISSUES / NO-GO

## Validation results
- Backend:
- Frontend:
- Playwright:
- Lighthouse:
- UX review:

## Critical flows
## Domain checks
## Defects
## Risks
## Recommended next iteration
```

## Acceptance criteria

- Backend, frontend, Playwright and Lighthouse checks were run or explicitly blocked with reasons.
- SQLite reset/seed was used for deterministic QA runs.
- Critical E2E flows are covered by Playwright or listed as defects.
- UX review report exists.
- Defect log exists.
- Quality report exists and includes release decision.
- No blocking defect remains unresolved for a `GO` decision.

## Risks

- Lighthouse scores may vary by environment; record hardware/browser context.
- Playwright may reveal backend seed instability; this must be treated as a backend defect.
- UX issues may require returning to phase 02 or 06 rather than being fixed by QA.
- Mock mode may hide real API issues; QA should run against the real backend by default.

## Rollback plan

- QA should not perform broad fixes. Blocking defects return to the owning phase branch.
- If release is `NO-GO`, Orchestration Agent opens follow-up phase branches by defect owner.
- Keep reports even when release fails; they are the basis for the next iteration.

## Handoff

- Branch/worktree: `agent/qa/07-quality-release` / `/Users/piotr/projects/worktrees/shifts-07-quality-release`
- Completed: Phase 07 branch/worktree created from accepted `master` after UX Gate B merge; UX Gate B known non-blocking issues carried into QA scope.
- Validation: pending QA execution.
- Known issues:
  - Coordinator conflict messages are visible but too technical and partly English.
  - Minor visual/data drift: `Dr Anna Kowalska` vs API-backed `Dorota`; `May` / `Tuesday` / `Weekday`; `Oddzial Chirurgii` vs `Kardiologia`.
  - Accessibility polish: mobile menu button lacks an accessible name; some settings/audit controls lack programmatic labels.
  - Known Vite chunk-size warning.
- Open questions: none blocking for QA start.
- Files changed: `docs/execution_plans/07_quality_release_plan.md`
- Recommended next step: QA Agent performs final quality validation, E2E/smoke checks, Lighthouse/UX notes and records release decision.
- Release decision: pending; expected format is `GO`, `GO WITH KNOWN ISSUES`, or `NO-GO`.

## Change log

| Timestamp UTC | Agent | Change |
|---|---|---|
| YYYY-MM-DD HH:MMZ | QA Agent | Initial English quality, UX and release validation plan. |
| 2026-04-26 15:30Z | Planning & Orchestration Agent | Prepared Phase 07 handoff and carried forward accepted UX Gate B non-blocking issues. |
