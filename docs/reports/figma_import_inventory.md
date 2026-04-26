# Figma Import Inventory

Last updated: 2026-04-26 07:53Z
Agent: Frontend Developer Agent
Branch: `agent/frontend/01-figma-import`
Worktree: `/Users/piotr/projects/worktrees/shifts-01-figma-import`

## Status

Imported, build-validated, and ready to commit.

The Figma Make frontend source snapshot is now present under `pwa/`. The imported app builds with Vite after one minimal runtime wiring fix: `App.tsx` now uses the shared `routes.tsx` router, and `routes.tsx` owns the existing `NotFound` fallback route.

## Source Target

- Figma Make URL: `https://www.figma.com/make/Q7pAncZlZf56UpeF3w1IQq/shifts_med_mvp_front`
- fileKey: `Q7pAncZlZf56UpeF3w1IQq`
- Target directory: `pwa/`
- Imported source snapshot count: 96 files excluding `node_modules/` and `dist/`

## Imported Shape

Root/config files:

- `pwa/ATTRIBUTIONS.md`
- `pwa/README.md`
- `pwa/default_shadcn_theme.css`
- `pwa/guidelines/Guidelines.md`
- `pwa/index.html`
- `pwa/package.json`
- `pwa/pnpm-workspace.yaml`
- `pwa/postcss.config.mjs`
- `pwa/vite.config.ts`

Application and styles:

- `pwa/src/main.tsx`
- `pwa/src/app/App.tsx`
- `pwa/src/app/routes.tsx`
- `pwa/src/imports/ui_spec_figma.md`
- `pwa/src/styles/fonts.css`
- `pwa/src/styles/index.css`
- `pwa/src/styles/tailwind.css`
- `pwa/src/styles/theme.css`

Component counts:

| Area | Files |
|---|---:|
| Admin | 5 |
| Auth | 3 |
| Coordinator | 11 |
| Doctor | 7 |
| Figma wrappers | 1 |
| Shared | 2 |
| UI | 48 |
| Top-level app components | 2 |

## Import Inventory

| Area | Status | Notes |
|---|---|---|
| Auth | imported | `InvitationSignup`, `Login`, `ResetPassword`. |
| Doctor | imported | Dashboard, schedule, availability, swaps and leave-request views. |
| Coordinator | imported | Dashboard, schedules, editor, availability collection, swaps, leave requests, doctors, metrics and audit. |
| Admin | imported | Layout, users, departments, settings and compliance audit. |
| Shared | imported | `MetricCard`, `ScheduleStatusBadge`. |
| UI | imported | 48 shadcn/Radix-style UI primitives. |
| Figma wrappers | imported | `ImageWithFallback`. |
| Styles | imported | Split Figma Make style files are present. |
| Guidelines/import docs | imported | `guidelines/Guidelines.md` and `src/imports/ui_spec_figma.md`. |
| Package/config | imported | `package.json`, `pnpm-workspace.yaml`, `postcss.config.mjs`, `vite.config.ts`. |
| Entry shell | present | `index.html`, `src/main.tsx`, and `README.md` came with the local snapshot; Codex did not modify them. |

## Minimal Fixes Applied

- `pwa/src/app/App.tsx`: removed duplicate inline router and now renders `RouterProvider` with `router` from `./routes`.
- `pwa/src/app/routes.tsx`: added the existing `NotFound` component as the wildcard route.

## Validation

Commands run from `pwa/`:

```bash
npm install --package-lock=false
npm run build
```

Build result:

- Vite 6.3.5 production build passed.
- 1,638 modules transformed.
- Output bundle generated under `pwa/dist/` during validation; the generated build artifact was not retained as source.
- Orchestrator closeout re-ran the same validation on 2026-04-26 07:53Z after removing stale `node_modules/` and `dist/` artifacts.

Notes:

- `pnpm` is not installed in this execution session, so validation used npm without creating a root package lock.
- `npm install` reported one high-severity vulnerability in the dependency tree, but `npm audit --omit=dev --audit-level=high` requires a lockfile and could not produce a detailed audit report without creating one.
- No lint or typecheck scripts exist in `pwa/package.json`.

## Phase 02 Cleanup Candidates

Large generated components that should be considered for splitting/refactor:

- `src/app/components/ui/sidebar.tsx` - 726 lines
- `src/app/components/ui/chart.tsx` - 353 lines
- `src/app/components/admin/Users.tsx` - 297 lines
- `src/app/components/admin/SystemSettings.tsx` - 296 lines
- `src/app/components/ui/menubar.tsx` - 276 lines
- `src/app/components/admin/ComplianceAudit.tsx` - 265 lines
- `src/app/components/coordinator/ScheduleEditor.tsx` - 262 lines
- `src/app/components/doctor/MySchedule.tsx` - 258 lines
- `src/app/components/ui/dropdown-menu.tsx` - 257 lines
- `src/app/components/doctor/DoctorLeaveRequests.tsx` - 254 lines
- `src/app/components/ui/context-menu.tsx` - 252 lines
- `src/app/components/doctor/SwapRequest.tsx` - 251 lines
- `src/app/components/coordinator/Doctors.tsx` - 250 lines

Temporary/cleanup candidates:

- `src/app/components/TestComponent.tsx` is present and currently not routed.
- The package name remains the Figma-generated `@figma/my-make-file`.
- `react` and `react-dom` are declared as optional peer dependencies by the generated package; npm still installs them for this app, and build succeeds.
