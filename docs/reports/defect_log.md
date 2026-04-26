# Defect Log

Last updated: 2026-04-26 15:41Z
Branch: `agent/qa/07-quality-release`

No blocking defects were found during Phase 07 release validation.

| ID | Severity | Area | Summary | Repro steps | Expected | Actual | Owner phase | Status |
|---|---|---|---|---|---|---|---|---|
| QA-001 | Low | Coordinator UX | Conflict messages are visible but too technical and partly English. | Open `/coordinator/schedules/65aadaac-dc0e-50e0-8546-8180eeec25f1/editor` on a seeded draft schedule with unassigned shifts. | Coordinator sees clear Polish explanation and next action. | Panel shows messages such as `Shift 2026-05-01 has no doctor`. | Frontend polish / UX copy | Known non-blocking |
| QA-002 | Low | Visual/data consistency | Minor API-backed data drift from accepted UI labels. | Review Doctor shell and Coordinator dashboard after API integration. | Role shell and page data use one source of truth and consistent locale. | Examples: `Dr Anna Kowalska` vs API-backed `Dorota`; `May` / `Tuesday` / `Weekday`; `Oddzial Chirurgii` vs `Kardiologia`. | Frontend integration polish | Known non-blocking |
| QA-003 | Low | Accessibility | Some controls need programmatic labels. | Review mobile role menu buttons and Admin settings/audit controls. | Icon buttons and form controls expose accessible names/labels. | Mobile menu button lacks an accessible name; some settings/audit controls have visual labels only. | Frontend accessibility polish | Known non-blocking |
| QA-004 | Low | Frontend build | Main Vite bundle exceeds default chunk warning threshold. | Run `corepack pnpm run build` in `pwa/`. | Build passes without release-blocking warnings or documents intentional warning. | Build passes; Vite warns that one chunk is larger than 500 kB. | Frontend performance polish | Known non-blocking |
| QA-005 | Medium | QA seed / E2E coverage | Seeded published schedule has no valid swap approval candidate. | On seeded backend, create a swap request from `lekarz1@shifts.test`, accept as the target doctor, validate as Coordinator, then approve. | Release smoke can exercise both invalid validation and valid approval through seed data. | All available seeded swap combinations violate adjacent 24-hour shift hard rules; Coordinator approval correctly returns `422`. Valid swap approval remains covered by backend tests, not release smoke. | Backend seed / QA fixture polish | Open non-blocking |
