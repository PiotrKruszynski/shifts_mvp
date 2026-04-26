# OpenAPI Alignment Report

Last updated: 2026-04-26 12:09Z
Agent: Backend Developer Agent
Reviewer: Frontend Reviewer / Frontend Developer Agent
Branch: `agent/backend/04-openapi-alignment`
Worktree: `/Users/piotr/projects/worktrees/shifts-04-openapi-alignment`

## Status

Phase 04 aligned `docs/architecture/openapi.yaml` with the MVP flows and the Phase 03 frontend mock service boundary. The change is contract-only: no backend implementation, no frontend code, and no Phase 05 work were started.

## OpenAPI Updates

- Added `requestPasswordReset` at `POST /auth/password-reset-requests`.
- Added `listDepartmentCoordinatorSummaries` at `GET /departments/coordinator-summaries`.
- Added `getCurrentDoctorContext` at `GET /doctor-profiles/me/context`.
- Added `getSystemSettings` and `saveSystemSettings` at `/system-settings`.
- Added `getCurrentSchedule` at `GET /schedules/current` for doctor/coordinator current-schedule discovery.
- Added `getCoordinatorDashboardSchedule`, `getDoctorDashboardData` and `getDoctorSchedule` as schedule-scoped MVP read models.
- Added `getScheduleEditorView` at `GET /schedules/{scheduleId}/editor-view`.
- Added `getAvailabilityCollection` at `GET /schedules/{scheduleId}/availability-collection-view`.
- Added `getDoctorSwapOptions` at `GET /schedules/{scheduleId}/swap-options`.
- Added `listCoordinatorSwapApprovals` and `getDoctorSwapApproval` swap approval read models.
- Added or expanded schemas for password reset, department coordinator summaries, current doctor context, system settings, schedule editor rows, swap options, doctor metrics and audit display metadata.
- Added leave request list display fields and kept creation schedule-scoped.
- Updated invitation acceptance to include the email submitted by the Phase 03 signup flow.

## Service-to-Operation Mapping

| Phase 03 service | Method | OpenAPI mapping | Notes |
|---|---|---|---|
| `authService` | `login` | `login` | Phase 06 derives `redirectPath` from returned user roles. |
| `authService` | `resetPassword` | `requestPasswordReset` | Added in Phase 04. |
| `authService` | `completeInvitationSignup` | `acceptDoctorInvitation` | `AcceptInvitationRequest` now carries email. |
| `userService` | `listUsers` | `listUsers` | Direct mapping. |
| `userService` | `listAdminUsers` | `listUsers` + `listDepartments` | Frontend service composes primary role and department label. |
| `userService` | `listAvailableCoordinators` | `listUsers?role=COORDINATOR&status=ACTIVE` | Direct filtered mapping. |
| `userService` | `inviteUser` | `createUser` | Service should include selected role before Phase 06 integration. |
| `departmentService` | `listDepartments` | `listDepartments` | Direct mapping. |
| `departmentService` | `listDepartmentCoordinatorSummaries` | `listDepartmentCoordinatorSummaries` | Added in Phase 04. |
| `departmentService` | `listAvailableCoordinators` | `listUsers?role=COORDINATOR&status=ACTIVE` | Shared mapping with `userService`. |
| `departmentService` | `createDepartment` | `createDepartment` | Refresh summary through `listDepartmentCoordinatorSummaries`. |
| `doctorService` | `listDoctorProfiles` | `listDoctorProfiles` | Direct mapping. |
| `doctorService` | `listDoctorDirectory` | `listDoctorProfiles` + `listUsers` + `getScheduleMetrics` | Frontend service composes names, qualification labels, shift counts and availability status. |
| `doctorService` | `getCurrentDoctorContext` | `getCurrentDoctorContext` | Added in Phase 04. |
| `scheduleService` | `listSchedules` | `listSchedules` | Direct mapping. |
| `scheduleService` | `listCoordinatorSchedules` | `listSchedules` + `listScheduleParticipants` + `listScheduleShifts` | Frontend service composes counts and labels. |
| `scheduleService` | `getCoordinatorDashboardSchedule` | `getCurrentSchedule` + `getCoordinatorDashboardSchedule` | Added in Phase 04. |
| `scheduleService` | `getScheduleEditorData` | `getScheduleEditorView` | Added in Phase 04. |
| `scheduleService` | `getDoctorDashboardData` | `getCurrentSchedule` + `getDoctorDashboardData` | Added in Phase 04. |
| `scheduleService` | `getDoctorSchedule` | `getCurrentSchedule` + `getDoctorSchedule` | Added in Phase 04. |
| `scheduleService` | `createMonthlySchedule` | `createSchedule` | Direct mapping. |
| `scheduleService` | `isDoctorSwapFlowEnabled` | `getSchedule` or `listSchedules` status check | No endpoint needed; swaps are enabled only for `PUBLISHED`. |
| `availabilityService` | `getAvailabilityCollection` | `getCurrentSchedule` + `getAvailabilityCollection` | Added in Phase 04. |
| `availabilityService` | `getMyAvailability` | `getMyAvailability` | Requires selected schedule ID from current schedule context. |
| `availabilityService` | `saveMyAvailability` | `submitMyAvailability` | Direct mapping. |
| `generationService` | `generateSchedule` | `generateSchedule` + `getGenerationRun` + `getGenerationConflictReport` + `getScheduleEditorView` | Phase 06 service can await generation then refresh editor view. |
| `validationService` | `validateSchedule` | `validateScheduleOrChange` | Direct mapping. |
| `validationService` | `validateSwapRequest` | `validateSwapRequest` | Direct mapping. |
| `leaveRequestService` | `listCoordinatorLeaveRequests` | `getCurrentSchedule` + `listScheduleLeaveRequests` | List response now returns `LeaveRequestListItem` display data. |
| `leaveRequestService` | `listDoctorLeaveRequests` | `getCurrentSchedule` + `getCurrentDoctorContext` + `listScheduleLeaveRequests?doctorProfileId=...` | Doctor profile comes from `getCurrentDoctorContext`. |
| `leaveRequestService` | `createDoctorLeaveRequest` | `getCurrentSchedule` + `createLeaveRequest` | `LeaveRequestCreateRequest` now includes `typeLabel`. |
| `leaveRequestService` | `decideLeaveRequest` | `approveLeaveRequest` / `rejectLeaveRequest` | Direct mapping. |
| `swapRequestService` | `listSwapRequests` | `listScheduleSwapRequests` | Direct mapping. |
| `swapRequestService` | `getDoctorSwapFormData` | `getDoctorSwapOptions` | Added in Phase 04. |
| `swapRequestService` | `createSwapRequest` | `createSwapRequest` | Direct mapping. |
| `swapRequestService` | `getDoctorSwapApproval` | `getDoctorSwapApproval` | Added in Phase 04. |
| `swapRequestService` | `answerDoctorSwapRequest` | `respondToSwapRequest` | Direct mapping. |
| `swapRequestService` | `listCoordinatorSwapApprovals` | `listCoordinatorSwapApprovals` | Added in Phase 04. |
| `swapRequestService` | `decideCoordinatorSwap` | `approveSwapRequest` / `rejectSwapRequest` | Direct mapping. |
| `auditService` | `listAuditLogEntries` | `listAuditLogEntries` | Direct mapping. |
| `auditService` | `listComplianceAuditEvents` | `listAuditLogEntries` | `AuditLogEntry` now supports category, severity and display metadata. |
| `auditService` | `listScheduleAuditEvents` | `listAuditLogEntries?entityType=Schedule` | Display labels come from enriched audit fields. |
| `metricsService` | `getDoctorMetrics` | `getScheduleMetrics` | `ScheduleMetricsResponse` now includes `periodLabel`; `DoctorScheduleMetric` includes doctor name, weekday/weekend/holiday counts and `totalHours`. |
| `settingsService` | `getSystemSettings` | `getSystemSettings` | Added in Phase 04. |
| `settingsService` | `saveSystemSettings` | `saveSystemSettings` | Added in Phase 04. |
| `settingsService` | `listPreferenceCategories` | `listPreferenceCategories` | Direct mapping. |

## OQ-006 Resolution

OQ-006 is resolved. The contract now treats department summaries, current doctor context, current schedule discovery, coordinator/doctor dashboards, schedule editor data, availability collection, leave request list items, swap options, swap approval views, system settings and password reset as MVP API concerns. Lower-level resource endpoints remain available for backend implementation and future composition.

## Validation

Commands executed:

```bash
ruby <<'RUBY'
require 'yaml'
data = YAML.load_file('docs/architecture/openapi.yaml')
puts "paths #{data.fetch('paths').length}"
puts "schemas #{data.fetch('components').fetch('schemas').length}"
RUBY
ruby <<'RUBY'
# Inline traversal checked that all local component $refs resolve and operationIds are unique.
RUBY
npx --yes @redocly/cli lint docs/architecture/openapi.yaml
```

Results:

- YAML parse passed: 63 paths and 126 schemas.
- Internal `$ref` check passed: 82 operation IDs are unique and all component refs resolve.
- Redocly lint passed with 66 warnings only. Warnings are style/completeness issues such as placeholder example.com servers, missing tag descriptions, missing license, existing operations without 4xx responses and unused components.

## Frontend Reviewer Notes

- Every Phase 03 service method has a direct operation mapping or an explicit frontend composition path in the table above.
- Reviewer gaps on dashboard/current-context composites, leave request list display data, swap approval display data, settings casing, schedule category casing, metrics units and preference-category `active` were resolved in the proposed contract.
- Final Frontend Reviewer re-check found no remaining blockers.
- No frontend code change is required in Phase 04.
- Before Phase 06, `userService.inviteUser` should pass the selected role from the Admin dialog so it can call `createUser` without weakening the OpenAPI contract.

## Open Questions

No Phase 04 blocker remains. OQ-006 is carried as resolved in `docs/open_questions.md`.

## Backend Readiness

Phase 04 contract alignment is ready for backend implementation after acceptance. Phase 05 can implement the documented operations without starting from UI guesses, but should preserve the frontend service method names until Phase 06 decides whether any service names need cleanup.
