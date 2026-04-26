# Quality Report

Last updated: 2026-04-26 15:41Z
Branch: `agent/qa/07-quality-release`
Worktree: `/Users/piotr/projects/worktrees/shifts-07-quality-release`

## Summary

Release decision: `GO WITH KNOWN ISSUES`

Phase 07 validation found no blocking defects. Backend and frontend gates pass, mock mode still builds, seeded smoke/E2E checks pass for the required MVP flows, and Lighthouse scores meet MVP thresholds. Known non-blocking UX and polish issues are tracked in `docs/reports/defect_log.md`.

## Validation Results

### Backend

Commands run from `api/`:

```bash
uv run ruff check .
uv run ty check .
uv run pytest
```

Result:

- Ruff: passed.
- Ty: passed.
- Pytest: `30 passed`.
- Coverage: `100.00%`.
- Coverage gate: `100% reached`.

### Frontend API Mode

Commands run from `pwa/`:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm run typecheck
corepack pnpm run lint
corepack pnpm run build
```

Result:

- Install: passed from lockfile.
- Typecheck: passed.
- Lint: passed, `134 files`.
- Build: passed.
- Known warning: Vite main JS chunk exceeds 500 kB.

### Frontend Mock Mode

Command run from `pwa/`:

```bash
VITE_API_MODE=mock corepack pnpm run build
```

Result:

- Mock-mode build: passed.
- Known warning: Vite main JS chunk exceeds 500 kB.

## Smoke / E2E Results

Environment:

- SQLite reset: `uv run api-reset`.
- API: `APP_PORT=8001 uv run api`.
- PWA: production build with `VITE_API_BASE_URL=http://127.0.0.1:8001/api/v1`.
- Preview: `corepack pnpm exec vite preview --host 127.0.0.1 --port 4173 --strictPort`.
- Browser automation: Playwright Chromium, temporary runner outside the repo.

Critical flow results:

| Flow | Result | Notes |
|---|---|---|
| Admin user visibility | Passed | `/users` returned 5 users. |
| Admin department visibility | Passed | Departments and coordinator summaries returned seeded Kardiologia data. |
| Coordinator dashboard | Passed | Published schedule dashboard rendered and API returned 3 doctors. |
| Doctor availability submission | Passed | Draft schedule accepted 7 availability days. |
| Schedule generation | Passed | Draft schedule generation succeeded with 7 confirmed assignments. |
| Schedule publication | Passed | Generated draft published successfully. |
| Doctor schedule view | Passed | Doctor schedule endpoint returned published shifts after publication. |
| Swap request | Passed | Doctor created swap request on published schedule. |
| Doctor swap response | Passed | Target doctor accepted; request moved to Coordinator approval state. |
| Coordinator validation/approval path | Passed with known issue | Validation correctly blocked hard-rule violation and approval returned `422`; seeded data has no valid approval candidate. |
| Audit/log visibility | Passed | Audit log visible after smoke operations. |
| Admin UI smoke | Passed | Login and `/admin` rendered without console errors. |
| Coordinator UI smoke | Passed | Login and `/coordinator` rendered without console errors. |
| Doctor UI smoke | Passed | Login and `/doctor/schedule` rendered without console errors. |

## Lighthouse

Tooling:

- Lighthouse `13.1.0` via `corepack pnpm dlx lighthouse`.
- Chrome: Playwright Chromium / Google Chrome for Testing.
- Note: Lighthouse v13 no longer exposes the legacy `pwa` category through `--only-categories`; PWA status is treated as a manual/release-hardening note.

Scores:

| Page | Performance | Accessibility | Best Practices |
|---|---:|---:|---:|
| Coordinator dashboard | 98 | 98 | 96 |
| Doctor schedule, mobile | 98 | 100 | 96 |

MVP thresholds were met.

## UX Review

UX Gate B was accepted as `PASS WITH NON-BLOCKING ISSUES`. Phase 07 re-reviewed the known items and found no reason to escalate them to blocking:

- Conflict explanations remain visible but too technical and partly English.
- Minor visual/data drift remains.
- Accessibility polish remains for mobile menu labels and some settings/audit controls.
- Vite chunk-size warning remains non-blocking.

See `docs/reports/ux_review_report.md`.

## Domain Checks

- `PUBLISHED` schedule ordinary edits are guarded by backend tests and release smoke publication behavior.
- Swap is available only on published schedules in the Doctor flow.
- Swap approval is blocked by hard-rule violations.
- Generated shifts preserve 24-hour assignment semantics.
- Staffed generated shifts have confirmed assignments.
- Audit log entries are visible after generation, publication and swap workflow operations.
- Conflict reports and editor validation expose shift context, with copy polish tracked as QA-001.
- Doctor UI smoke did not expose unnecessary cross-doctor administrative data.

## Defects

No blocking defects.

Known issues are tracked in `docs/reports/defect_log.md`:

- QA-001: conflict copy too technical / partly English.
- QA-002: minor visual/data drift.
- QA-003: accessibility label polish.
- QA-004: Vite chunk-size warning.
- QA-005: seed lacks valid swap approval candidate for release smoke.

## Risks

- Valid swap approval is covered by backend tests but not by release smoke with current seed data.
- Lighthouse scores are local-environment measurements and should be repeated in CI/release infrastructure if introduced.
- MVP auth remains role-light by design from Phase 06 and should not be treated as production authorization.

## Recommended Next Iteration

- Accept release as `GO WITH KNOWN ISSUES`.
- Before production hardening, add a valid swap seed scenario for E2E, normalize API-backed labels/copy, add missing accessible names, and address or explicitly configure the Vite chunk threshold.
