# 01 — Figma Make React Import Plan

Status: Ready - Figma MCP source access confirmed
Owner: Frontend Developer Agent
Orchestrated by: Planning & Orchestration Agent
Worktree branch: `agent/frontend/01-figma-import`
Recommended worktree: `../worktrees/shifts-01-figma-import`
Depends on: `master_execution_plan.md`
Next: `02_frontend_refactor_plan.md`
Last updated: 2026-04-25 21:15Z

## Objective

Import the actual React code structure generated in Figma Make into the existing `pwa/` project as a controlled frontend snapshot. This phase is about bringing the Figma Make UI into the repository and making it render/build. It is not a refactor phase and it is not a backend phase.

## Important context

The Figma Make code is **not yet implemented in the repository**. The visible structure from Figma Make is the source that will be imported.

Expected Figma Make structure:

```text
guidelines/
src/
  app/
    components/
      admin/
      auth/
      coordinator/
      doctor/
      figma/
      shared/
      ui/
      NotFound.tsx
      TestComponent.tsx
    App.tsx
    routes.tsx
  imports/
    ui_spec_figma.md
  styles/
    fonts.css
    index.css
    tailwind.css
    theme.css
ATTRIBUTIONS.md
default_shadcn_theme.css
package.json
pnpm-workspace.yaml
postcss.config.mjs
vite.config.ts
```

The import should preserve this structure inside `pwa/` where possible, but must be merged carefully with any existing `pwa/` files instead of blindly overwriting them.

## Required inputs

- Figma Make React output, accessible through Figma Make export, Figma MCP Server, or copied local files.
- `pwa/` current frontend project structure.
- `docs/architecture/project_assumptions.md` for MVP scope.
- `docs/architecture/domain_model.md` for role/state terminology.
- `docs/architecture/user_flow.mmd` for flow context.
- `docs/architecture/openapi.yaml` for read-only awareness only.
- `pwa/package.json`, if it already exists.
- `pwa/vite.config.ts`, if it already exists.

## Non-goals

- Do not implement backend.
- Do not modify `api/`.
- Do not modify `docs/architecture/openapi.yaml`.
- Do not create real HTTP calls.
- Do not build the final mock API/service layer; that is phase 03.
- Do not deeply refactor Figma Make components; that is phase 02.
- Do not implement missing screens from imagination.
- Do not add new product requirements.
- Do not decide final UX; UX review happens after import/refactor.

## Allowed paths

- `pwa/src/app/**`
- `pwa/src/imports/**`
- `pwa/src/styles/**`
- `pwa/guidelines/**`
- `pwa/public/**`, only for required assets
- `pwa/ATTRIBUTIONS.md`
- `pwa/default_shadcn_theme.css`
- `pwa/package.json`, only for required dependency reconciliation
- `pwa/pnpm-workspace.yaml`, `pwa/postcss.config.mjs`, `pwa/vite.config.ts`, only if needed for imported UI to run
- `docs/open_questions.md`
- `docs/reports/figma_import_inventory.md`
- `docs/execution_plans/01_figma_import_plan.md`

## Forbidden paths

- `api/**`
- `docs/architecture/openapi.yaml`
- `docs/architecture/domain_model.md`
- `docs/architecture/er_diagram.md`
- `docs/architecture/project_assumptions.md`
- `docs/architecture/user_flow.mmd`
- `docs/adr/**`, except for recommending ADR needs in the handoff

## Worktree setup

The Orchestration Agent should create the isolated frontend worktree before assigning this plan:

```bash
git fetch --all --prune
git worktree add ../worktrees/shifts-01-figma-import -b agent/frontend/01-figma-import main
cd ../worktrees/shifts-01-figma-import
```

If the integration branch is not `main`, replace `main` with the actual integration branch.

## Dynamic update protocol

This is a living plan. The agent may update it during execution, but only to record facts discovered during work.

- Update `Status`, `Last updated` and `Change log` after material scope changes.
- Check off tasks only after validation.
- Do not delete previous conclusions; append corrections.
- Missing information goes to `docs/open_questions.md`.
- Architectural decisions go to ADR proposals, not ad hoc implementation.

## Step-by-step tasks

### A. Preflight

- [x] (2026-04-25 20:46Z) Confirm the worktree and branch: `agent/frontend/01-figma-import`.
- [x] (2026-04-25 20:46Z) Run `git status --short` and confirm the worktree is clean.
- [x] (2026-04-25 20:46Z) Inspect current `pwa/` structure and package manager lockfiles.
- [x] (2026-04-25 20:46Z) Identify whether `pwa/` already has `src/app`, routing, styles or Tailwind configuration.
- [x] (2026-04-25 20:46Z) Record existing frontend scripts from `pwa/package.json`.

Preflight result: `pwa/` is absent/empty for bootstrap purposes, no frontend lockfile was found within the inspected worktree depth, and no existing `pwa/package.json` scripts are available.

### B. Figma Make source capture

- [ ] (YYYY-MM-DD HH:MMZ) Use Figma MCP Server or Figma Make export to capture the generated React code.
- [ ] (YYYY-MM-DD HH:MMZ) Confirm the generated structure includes `src/app/App.tsx`, `src/app/routes.tsx`, role folders and styles.
- [ ] (YYYY-MM-DD HH:MMZ) Copy `src/imports/ui_spec_figma.md` into `pwa/src/imports/ui_spec_figma.md`.
- [ ] (YYYY-MM-DD HH:MMZ) Copy `guidelines/` into `pwa/guidelines/` if present.
- [ ] (YYYY-MM-DD HH:MMZ) Copy `ATTRIBUTIONS.md` and asset references if present.
- [x] (2026-04-25 20:46Z) If Figma MCP/export is unavailable, stop and write the missing access details to `docs/open_questions.md`.

Source capture result: blocked. The current Codex execution session does not expose a callable Figma MCP source retrieval tool. Public Figma metadata, unauthenticated REST endpoints, Make preview probes and local runtime cache inspection did not provide the complete canonical 89-file source tree. See `docs/open_questions.md` OQ-004 and `docs/reports/figma_import_inventory.md`.

### C. Controlled merge into `pwa/`

- [ ] (YYYY-MM-DD HH:MMZ) Import Figma `src/app/**` into `pwa/src/app/**`.
- [ ] (YYYY-MM-DD HH:MMZ) Import Figma `src/styles/**` into `pwa/src/styles/**`.
- [ ] (YYYY-MM-DD HH:MMZ) Import `default_shadcn_theme.css` if the Figma UI references it.
- [ ] (YYYY-MM-DD HH:MMZ) Reconcile `package.json` dependencies without blindly replacing existing scripts.
- [ ] (YYYY-MM-DD HH:MMZ) Reconcile `vite.config.ts`, `postcss.config.mjs` and Tailwind-related files only when required for build/runtime.
- [ ] (YYYY-MM-DD HH:MMZ) Preserve any existing repository-specific configuration that does not conflict with Figma UI.
- [ ] (YYYY-MM-DD HH:MMZ) Do not create a separate `pwa/src/figma-import/` dump unless direct merge is impossible; if used, explain why in the handoff.

### D. Runtime wiring

- [ ] (YYYY-MM-DD HH:MMZ) Verify `pwa/src/app/App.tsx` is the actual application entry point or is imported by the existing entry point.
- [ ] (YYYY-MM-DD HH:MMZ) Verify `pwa/src/app/routes.tsx` is wired correctly, if the app uses routing.
- [ ] (YYYY-MM-DD HH:MMZ) Provide a safe preview route or default route for the imported Figma UI.
- [ ] (YYYY-MM-DD HH:MMZ) Keep `TestComponent.tsx` only as a temporary preview helper if required; mark it for phase 02 cleanup.
- [ ] (YYYY-MM-DD HH:MMZ) Confirm the imported UI does not send real network requests.

### E. Minimal fixes only

- [ ] (YYYY-MM-DD HH:MMZ) Fix import paths created by the move into `pwa/`.
- [ ] (YYYY-MM-DD HH:MMZ) Fix missing CSS imports required for visual rendering.
- [ ] (YYYY-MM-DD HH:MMZ) Fix missing package dependencies required by the generated code.
- [ ] (YYYY-MM-DD HH:MMZ) Do not normalize domain models, service layers or component architecture in this phase.
- [ ] (YYYY-MM-DD HH:MMZ) Keep generated local data as local/static data unless it prevents build readability.

### F. Import inventory

- [ ] (YYYY-MM-DD HH:MMZ) Create or update `docs/reports/figma_import_inventory.md`.
- [ ] (YYYY-MM-DD HH:MMZ) Map Figma UI areas to imported files: Auth, Doctor, Coordinator, Admin, Shared, UI, Figma wrappers.
- [ ] (YYYY-MM-DD HH:MMZ) Mark each item as `imported`, `partial`, `missing from export`, or `blocked`.
- [ ] (YYYY-MM-DD HH:MMZ) List large generated components that should be split in phase 02.
- [ ] (YYYY-MM-DD HH:MMZ) List temporary preview files and cleanup candidates.

## Validation commands

Detect actual package manager first:

```bash
cd pwa
ls
cat package.json
find .. -maxdepth 2 -name pnpm-lock.yaml -o -name package-lock.json -o -name yarn.lock
```

Run the commands that exist in `package.json`. Typical examples:

```bash
cd pwa
pnpm install
pnpm run build
pnpm run lint
pnpm run typecheck
```

If the repository uses npm instead of pnpm, use `npm install` / `npm run ...`. Do not invent scripts that are not present; record missing scripts in the handoff.

## Acceptance criteria

- Figma Make React code is imported into `pwa/` using the expected `src/app` structure.
- The imported UI renders through a known route or entry point.
- `pwa` builds successfully, or failures are documented with exact blocking errors.
- No backend files were modified.
- No real API calls were introduced.
- `docs/reports/figma_import_inventory.md` exists and identifies the imported scope.
- Handoff gives phase 02 a clear list of refactor targets.

## Risks

- Figma Make may generate a monolithic `App.tsx` or deeply coupled role views.
- Generated dependencies may conflict with existing `pwa/` tooling.
- CSS and Tailwind assumptions may differ between Figma Make and the repository.
- Figma MCP may expose UI context but not a clean project export.
- Imported mock data may be unrealistic; this is acceptable in phase 01 and will be handled in phases 02–03.

## Rollback plan

- Revert the phase branch if the import corrupts the frontend structure.
- Keep a list of overwritten files in the handoff.
- If dependency reconciliation breaks the project, restore the original package/config files and re-import only `src/app`, `src/imports` and `src/styles`.

## Handoff

- Branch/worktree: `agent/frontend/01-figma-import` at `/Users/piotr/projects/worktrees/shifts-01-figma-import`
- Completed: preflight, source access investigation, blocker documentation, import inventory report.
- Validation: no frontend validation commands were run because no complete source was imported and `pwa/package.json` is unavailable.
- Known issues: Figma MCP source retrieval is unavailable in the current execution session; local/runtime cache is incomplete and transformed.
- Open questions: OQ-004 in `docs/open_questions.md`.
- Files changed: `docs/open_questions.md`, `docs/reports/figma_import_inventory.md`, `docs/execution_plans/01_figma_import_plan.md`.
- Recommended next step: re-run phase 01 with Figma MCP `get_design_context` available, or provide a complete Figma Make export/local source snapshot.

## Change log

| Timestamp UTC | Agent | Change |
|---|---|---|
| YYYY-MM-DD HH:MMZ | Frontend Developer Agent | Initial English Figma Make import plan. |
| 2026-04-25 20:46Z | Frontend Developer Agent | Recorded phase 01 blocker because complete Figma Make source retrieval is unavailable in the current execution session. |
