import type {
  AvailabilityDeclaration,
  ConflictReport,
  Department,
  Schedule,
  ScheduleParticipant,
  ValidationResult,
} from "../domain/types";
import { complianceAuditEventsFixture } from "../fixtures/audit.fixture";
import { leaveRequestsFixture, myLeaveRequestsFixture } from "../fixtures/leave-requests.fixture";
import {
  currentScheduleFixture,
  doctorCurrentScheduleFixture,
  doctorScheduleShiftsFixture,
  generatedScheduleConflictItemsFixture,
  generatedScheduleShiftsFixture,
} from "../fixtures/schedules.fixture";
import { preferenceCategoriesFixture, systemSettingsFixture } from "../fixtures/settings.fixture";
import {
  mySwapShiftOptionsFixture,
  pendingSwapFixture,
  swapDoctorOptionsFixture,
} from "../fixtures/swaps.fixture";
import {
  adminUsersFixture,
  departmentsFixture,
  doctorDirectoryFixture,
  doctorProfilesFixture,
  qualificationsFixture,
  usersFixture,
} from "../fixtures/users.fixture";

const cardiologyDepartment: Department = {
  id: "dep-cardiology",
  name: "Oddział Kardiologii",
  hospitalName: "Szpital Wojewodzki",
  timezone: "Europe/Warsaw",
  active: true,
  createdAt: "2026-02-01T09:00:00+01:00",
};

const draftSchedule: Schedule = {
  id: "schedule-2026-06-surgery-draft",
  departmentId: "dep-surgery",
  coordinatorUserId: "user-coordinator-jan",
  periodStart: "2026-06-01",
  periodEnd: "2026-06-30",
  availabilityDeadline: "2026-05-24T23:59:00+02:00",
  status: "DRAFT",
  createdAt: "2026-04-25T09:00:00+02:00",
};

const archivedSchedule: Schedule = {
  id: "schedule-2026-03-surgery-archived",
  departmentId: "dep-surgery",
  coordinatorUserId: "user-coordinator-jan",
  periodStart: "2026-03-01",
  periodEnd: "2026-03-31",
  availabilityDeadline: "2026-02-25T23:59:00+01:00",
  status: "ARCHIVED",
  publishedAt: "2026-02-28T12:00:00+01:00",
  archivedAt: "2026-04-01T00:10:00+02:00",
  createdAt: "2026-02-01T09:00:00+01:00",
};

export const departmentsSeed: Department[] = [...departmentsFixture, cardiologyDepartment];

export const schedulesSeed: Schedule[] = [
  draftSchedule,
  currentScheduleFixture,
  doctorCurrentScheduleFixture,
  archivedSchedule,
];

export const scheduleParticipantsSeed: ScheduleParticipant[] = doctorProfilesFixture.map((profile, index) => ({
  id: `participant-2026-05-${profile.id}`,
  scheduleId: currentScheduleFixture.id,
  doctorProfileId: profile.id,
  status: index === 2 ? "REMOVED" : "ACTIVE",
  addedAt: "2026-04-01T10:00:00+02:00",
  removedAt: index === 2 ? "2026-04-18T10:00:00+02:00" : undefined,
}));

export const availabilityDeclarationsSeed: AvailabilityDeclaration[] = [
  {
    id: "availability-anna-2026-05",
    scheduleId: currentScheduleFixture.id,
    doctorProfileId: "doctor-anna",
    status: "LOCKED",
    submittedAt: "2026-04-20T18:30:00+02:00",
    lockedAt: "2026-04-21T00:00:00+02:00",
    days: [
      {
        id: "availability-anna-2026-05-01",
        date: "2026-05-01",
        availabilityType: "PREFERRED",
        preferenceCategoryId: "preference-category-i",
      },
      {
        id: "availability-anna-2026-05-10",
        date: "2026-05-10",
        availabilityType: "UNAVAILABLE",
        comment: "Wizyta lekarska",
      },
    ],
  },
  {
    id: "availability-jan-2026-05",
    scheduleId: currentScheduleFixture.id,
    doctorProfileId: "doctor-jan",
    status: "SUBMITTED",
    submittedAt: "2026-04-19T12:10:00+02:00",
    days: [
      {
        id: "availability-jan-2026-05-02",
        date: "2026-05-02",
        availabilityType: "PREFERRED",
        preferenceCategoryId: "preference-category-ii",
      },
    ],
  },
  {
    id: "availability-maria-2026-05",
    scheduleId: currentScheduleFixture.id,
    doctorProfileId: "doctor-maria",
    status: "DRAFT",
    days: [
      {
        id: "availability-maria-2026-05-06",
        date: "2026-05-06",
        availabilityType: "NOT_PREFERRED",
        preferenceCategoryId: "preference-category-iii",
      },
    ],
  },
];

export const conflictReportsSeed: ConflictReport[] = [
  {
    id: "conflict-report-2026-05-surgery",
    scheduleId: currentScheduleFixture.id,
    generationRunId: "generation-run-2026-04-24",
    createdAt: "2026-04-24T10:07:00+02:00",
    summary: "Generator znalazł 2 problemy wymagające ręcznej korekty przed publikacją.",
    items: generatedScheduleConflictItemsFixture,
  },
];

export const validationResultsSeed: ValidationResult[] = [
  {
    id: "validation-schedule-2026-05-surgery",
    targetType: "SCHEDULE",
    targetId: currentScheduleFixture.id,
    isCompliant: false,
    validatedAt: "2026-04-24T10:08:00+02:00",
    violations: [
      {
        id: "violation-unassigned-2026-05-04",
        constraintRuleId: "rule-shift-must-be-assigned",
        severity: "BLOCKING",
        message: "Dyżur 04.05.2026 wymaga obsady.",
        shiftId: "shift-2026-05-04",
      },
      {
        id: "violation-rest-2026-05-06",
        constraintRuleId: "rule-min-rest-11h",
        severity: "WARNING",
        message: "Potencjalne naruszenie 11 godzin odpoczynku.",
        shiftId: "shift-2026-05-06",
      },
    ],
  },
  {
    id: "validation-swap-2026-05-01",
    targetType: "SWAP_REQUEST",
    targetId: pendingSwapFixture.id,
    isCompliant: true,
    validatedAt: "2026-04-25T10:01:00+02:00",
    violations: [],
  },
];

export const mockSeed = {
  users: usersFixture,
  adminUsers: adminUsersFixture,
  departments: departmentsSeed,
  qualifications: qualificationsFixture,
  doctors: doctorDirectoryFixture,
  doctorProfiles: doctorProfilesFixture,
  schedules: schedulesSeed,
  scheduleParticipants: scheduleParticipantsSeed,
  currentSchedule: currentScheduleFixture,
  doctorCurrentSchedule: doctorCurrentScheduleFixture,
  generatedScheduleShifts: generatedScheduleShiftsFixture,
  generatedScheduleConflicts: generatedScheduleConflictItemsFixture,
  doctorScheduleShifts: doctorScheduleShiftsFixture,
  availabilityDeclarations: availabilityDeclarationsSeed,
  conflictReports: conflictReportsSeed,
  validationResults: validationResultsSeed,
  leaveRequests: leaveRequestsFixture,
  myLeaveRequests: myLeaveRequestsFixture,
  mySwapShiftOptions: mySwapShiftOptionsFixture,
  swapDoctorOptions: swapDoctorOptionsFixture,
  pendingSwap: pendingSwapFixture,
  complianceAuditEvents: complianceAuditEventsFixture,
  preferenceCategories: preferenceCategoriesFixture,
  systemSettings: systemSettingsFixture,
};
