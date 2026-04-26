import type {
  Assignment,
  ConflictItem,
  Schedule,
  ScheduleStatus,
  Shift,
} from "../domain/types";

export type ShiftCalendarCategory = "Weekday" | "Weekend" | "Holiday";

export interface ScheduleEditorShiftFixture {
  shift: Shift;
  assignment?: Assignment;
  doctorName: string | null;
  category: ShiftCalendarCategory;
  valid: boolean;
  issues: string[];
}

export interface DoctorScheduleShiftFixture {
  shift: Shift;
  assignment: Assignment;
  day: string;
  department: string;
  category: ShiftCalendarCategory;
  categoryDay: string;
  scheduleStatus: Extract<ScheduleStatus, "PUBLISHED">;
  canSwap: boolean;
}

export const currentScheduleFixture: Schedule = {
  id: "schedule-2026-05-surgery",
  departmentId: "dep-surgery",
  coordinatorUserId: "user-coordinator-jan",
  periodStart: "2026-05-01",
  periodEnd: "2026-05-31",
  availabilityDeadline: "2026-04-20T23:59:00+02:00",
  status: "GENERATED",
  createdAt: "2026-04-01T09:00:00+02:00",
};

export const generatedScheduleShiftsFixture: ScheduleEditorShiftFixture[] = [
  {
    shift: {
      id: "shift-2026-05-01",
      scheduleId: currentScheduleFixture.id,
      date: "2026-05-01",
      startsAt: "2026-05-01T00:00:00+02:00",
      endsAt: "2026-05-01T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    assignment: {
      id: "assignment-2026-05-01",
      scheduleId: currentScheduleFixture.id,
      shiftId: "shift-2026-05-01",
      doctorProfileId: "doctor-anna",
      status: "CONFIRMED",
      source: "GENERATED",
      createdAt: "2026-04-24T10:00:00+02:00",
      confirmedAt: "2026-04-24T10:05:00+02:00",
    },
    doctorName: "Dr Anna Kowalska",
    category: "Holiday",
    valid: true,
    issues: [],
  },
  {
    shift: {
      id: "shift-2026-05-02",
      scheduleId: currentScheduleFixture.id,
      date: "2026-05-02",
      startsAt: "2026-05-02T00:00:00+02:00",
      endsAt: "2026-05-02T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    assignment: {
      id: "assignment-2026-05-02",
      scheduleId: currentScheduleFixture.id,
      shiftId: "shift-2026-05-02",
      doctorProfileId: "doctor-jan",
      status: "CONFIRMED",
      source: "GENERATED",
      createdAt: "2026-04-24T10:00:00+02:00",
      confirmedAt: "2026-04-24T10:05:00+02:00",
    },
    doctorName: "Dr Jan Nowak",
    category: "Weekend",
    valid: true,
    issues: [],
  },
  {
    shift: {
      id: "shift-2026-05-03",
      scheduleId: currentScheduleFixture.id,
      date: "2026-05-03",
      startsAt: "2026-05-03T00:00:00+02:00",
      endsAt: "2026-05-03T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    doctorName: "Dr Maria Wiśniewska",
    category: "Weekend",
    valid: true,
    issues: [],
  },
  {
    shift: {
      id: "shift-2026-05-04",
      scheduleId: currentScheduleFixture.id,
      date: "2026-05-04",
      startsAt: "2026-05-04T00:00:00+02:00",
      endsAt: "2026-05-04T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "UNASSIGNED",
    },
    doctorName: null,
    category: "Weekday",
    valid: false,
    issues: ["Nieobsadzony dyżur"],
  },
  {
    shift: {
      id: "shift-2026-05-05",
      scheduleId: currentScheduleFixture.id,
      date: "2026-05-05",
      startsAt: "2026-05-05T00:00:00+02:00",
      endsAt: "2026-05-05T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    doctorName: "Dr Piotr Zieliński",
    category: "Weekday",
    valid: true,
    issues: [],
  },
  {
    shift: {
      id: "shift-2026-05-06",
      scheduleId: currentScheduleFixture.id,
      date: "2026-05-06",
      startsAt: "2026-05-06T00:00:00+02:00",
      endsAt: "2026-05-06T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "CONFLICTED",
    },
    doctorName: "Dr Katarzyna Lewandowska",
    category: "Weekday",
    valid: false,
    issues: ["Naruszenie odpoczynku 11h"],
  },
  {
    shift: {
      id: "shift-2026-05-07",
      scheduleId: currentScheduleFixture.id,
      date: "2026-05-07",
      startsAt: "2026-05-07T00:00:00+02:00",
      endsAt: "2026-05-07T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    doctorName: "Dr Tomasz Kaminski",
    category: "Weekday",
    valid: true,
    issues: [],
  },
];

export const generatedScheduleConflictItemsFixture: ConflictItem[] = [
  {
    id: "conflict-unassigned-2026-05-04",
    shiftId: "shift-2026-05-04",
    reasonCode: "NO_AVAILABLE_DOCTOR",
    description: "4 maja 2026 - wymaga przypisania lekarza",
  },
  {
    id: "conflict-rest-2026-05-06",
    shiftId: "shift-2026-05-06",
    reasonCode: "MIN_REST_VIOLATION",
    description: "Dr Katarzyna Lewandowska - 6 maja 2026 (mniej niż 11h od poprzedniego dyżuru)",
  },
];

export const doctorScheduleShiftsFixture: DoctorScheduleShiftFixture[] = [
  {
    shift: generatedScheduleShiftsFixture[0].shift,
    assignment: generatedScheduleShiftsFixture[0].assignment!,
    day: "Czwartek",
    department: "Oddział Chirurgii",
    category: "Holiday",
    categoryDay: "Święto Pracy",
    scheduleStatus: "PUBLISHED",
    canSwap: true,
  },
  {
    shift: {
      id: "shift-2026-05-08",
      scheduleId: currentScheduleFixture.id,
      date: "2026-05-08",
      startsAt: "2026-05-08T00:00:00+02:00",
      endsAt: "2026-05-08T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    assignment: {
      id: "assignment-2026-05-08",
      scheduleId: currentScheduleFixture.id,
      shiftId: "shift-2026-05-08",
      doctorProfileId: "doctor-anna",
      status: "CONFIRMED",
      source: "GENERATED",
      createdAt: "2026-04-24T10:00:00+02:00",
      confirmedAt: "2026-04-24T10:05:00+02:00",
    },
    day: "Piątek",
    department: "Oddział Chirurgii",
    category: "Weekday",
    categoryDay: "Dzień powszedni",
    scheduleStatus: "PUBLISHED",
    canSwap: true,
  },
  {
    shift: {
      id: "shift-2026-05-16",
      scheduleId: currentScheduleFixture.id,
      date: "2026-05-16",
      startsAt: "2026-05-16T00:00:00+02:00",
      endsAt: "2026-05-16T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    assignment: {
      id: "assignment-2026-05-16",
      scheduleId: currentScheduleFixture.id,
      shiftId: "shift-2026-05-16",
      doctorProfileId: "doctor-anna",
      status: "CONFIRMED",
      source: "GENERATED",
      createdAt: "2026-04-24T10:00:00+02:00",
      confirmedAt: "2026-04-24T10:05:00+02:00",
    },
    day: "Sobota",
    department: "Oddział Chirurgii",
    category: "Weekend",
    categoryDay: "Weekend",
    scheduleStatus: "PUBLISHED",
    canSwap: true,
  },
  {
    shift: {
      id: "shift-2026-05-23",
      scheduleId: currentScheduleFixture.id,
      date: "2026-05-23",
      startsAt: "2026-05-23T00:00:00+02:00",
      endsAt: "2026-05-23T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    assignment: {
      id: "assignment-2026-05-23",
      scheduleId: currentScheduleFixture.id,
      shiftId: "shift-2026-05-23",
      doctorProfileId: "doctor-anna",
      status: "CONFIRMED",
      source: "GENERATED",
      createdAt: "2026-04-24T10:00:00+02:00",
      confirmedAt: "2026-04-24T10:05:00+02:00",
    },
    day: "Sobota",
    department: "Oddział Chirurgii",
    category: "Weekend",
    categoryDay: "Weekend",
    scheduleStatus: "PUBLISHED",
    canSwap: true,
  },
];
