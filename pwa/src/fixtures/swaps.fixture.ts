import type { Assignment, Shift, SwapRequest } from "../domain/types";

export interface SwapShiftOptionFixture {
  shift: Shift;
  assignment: Assignment;
  day: string;
  categoryLabel: string;
}

export interface SwapDoctorOptionFixture {
  id: string;
  name: string;
  shifts: SwapShiftOptionFixture[];
}

export const mySwapShiftOptionsFixture: SwapShiftOptionFixture[] = [
  {
    shift: {
      id: "shift-2026-05-01",
      scheduleId: "schedule-2026-05-surgery",
      date: "2026-05-01",
      startsAt: "2026-05-01T00:00:00+02:00",
      endsAt: "2026-05-01T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    assignment: {
      id: "assignment-2026-05-01",
      scheduleId: "schedule-2026-05-surgery",
      shiftId: "shift-2026-05-01",
      doctorProfileId: "doctor-anna",
      status: "CONFIRMED",
      source: "GENERATED",
      createdAt: "2026-04-24T10:00:00+02:00",
      confirmedAt: "2026-04-24T10:05:00+02:00",
    },
    day: "Czwartek",
    categoryLabel: "Święto Pracy",
  },
  {
    shift: {
      id: "shift-2026-05-08",
      scheduleId: "schedule-2026-05-surgery",
      date: "2026-05-08",
      startsAt: "2026-05-08T00:00:00+02:00",
      endsAt: "2026-05-08T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    assignment: {
      id: "assignment-2026-05-08",
      scheduleId: "schedule-2026-05-surgery",
      shiftId: "shift-2026-05-08",
      doctorProfileId: "doctor-anna",
      status: "CONFIRMED",
      source: "GENERATED",
      createdAt: "2026-04-24T10:00:00+02:00",
      confirmedAt: "2026-04-24T10:05:00+02:00",
    },
    day: "Piątek",
    categoryLabel: "Dzień powszedni",
  },
  {
    shift: {
      id: "shift-2026-05-16",
      scheduleId: "schedule-2026-05-surgery",
      date: "2026-05-16",
      startsAt: "2026-05-16T00:00:00+02:00",
      endsAt: "2026-05-16T23:59:00+02:00",
      requiredQualificationId: "qual-general-surgery",
      status: "ASSIGNED",
    },
    assignment: {
      id: "assignment-2026-05-16",
      scheduleId: "schedule-2026-05-surgery",
      shiftId: "shift-2026-05-16",
      doctorProfileId: "doctor-anna",
      status: "CONFIRMED",
      source: "GENERATED",
      createdAt: "2026-04-24T10:00:00+02:00",
      confirmedAt: "2026-04-24T10:05:00+02:00",
    },
    day: "Sobota",
    categoryLabel: "Weekend",
  },
];

export const swapDoctorOptionsFixture: SwapDoctorOptionFixture[] = [
  {
    id: "doctor-jan",
    name: "Dr Jan Nowak",
    shifts: [
      {
        shift: {
          id: "shift-2026-05-02",
          scheduleId: "schedule-2026-05-surgery",
          date: "2026-05-02",
          startsAt: "2026-05-02T00:00:00+02:00",
          endsAt: "2026-05-02T23:59:00+02:00",
          requiredQualificationId: "qual-general-surgery",
          status: "ASSIGNED",
        },
        assignment: {
          id: "assignment-2026-05-02",
          scheduleId: "schedule-2026-05-surgery",
          shiftId: "shift-2026-05-02",
          doctorProfileId: "doctor-jan",
          status: "CONFIRMED",
          source: "GENERATED",
          createdAt: "2026-04-24T10:00:00+02:00",
          confirmedAt: "2026-04-24T10:05:00+02:00",
        },
        day: "Piątek",
        categoryLabel: "Dzień powszedni",
      },
      {
        shift: {
          id: "shift-2026-05-18",
          scheduleId: "schedule-2026-05-surgery",
          date: "2026-05-18",
          startsAt: "2026-05-18T00:00:00+02:00",
          endsAt: "2026-05-18T23:59:00+02:00",
          requiredQualificationId: "qual-general-surgery",
          status: "ASSIGNED",
        },
        assignment: {
          id: "assignment-2026-05-18",
          scheduleId: "schedule-2026-05-surgery",
          shiftId: "shift-2026-05-18",
          doctorProfileId: "doctor-jan",
          status: "CONFIRMED",
          source: "GENERATED",
          createdAt: "2026-04-24T10:00:00+02:00",
          confirmedAt: "2026-04-24T10:05:00+02:00",
        },
        day: "Niedziela",
        categoryLabel: "Weekend",
      },
    ],
  },
  {
    id: "doctor-maria",
    name: "Dr Maria Wiśniewska",
    shifts: [
      {
        shift: {
          id: "shift-2026-05-05",
          scheduleId: "schedule-2026-05-surgery",
          date: "2026-05-05",
          startsAt: "2026-05-05T00:00:00+02:00",
          endsAt: "2026-05-05T23:59:00+02:00",
          requiredQualificationId: "qual-general-surgery",
          status: "ASSIGNED",
        },
        assignment: {
          id: "assignment-2026-05-05",
          scheduleId: "schedule-2026-05-surgery",
          shiftId: "shift-2026-05-05",
          doctorProfileId: "doctor-maria",
          status: "CONFIRMED",
          source: "GENERATED",
          createdAt: "2026-04-24T10:00:00+02:00",
          confirmedAt: "2026-04-24T10:05:00+02:00",
        },
        day: "Poniedziałek",
        categoryLabel: "Dzień powszedni",
      },
      {
        shift: {
          id: "shift-2026-05-12",
          scheduleId: "schedule-2026-05-surgery",
          date: "2026-05-12",
          startsAt: "2026-05-12T00:00:00+02:00",
          endsAt: "2026-05-12T23:59:00+02:00",
          requiredQualificationId: "qual-general-surgery",
          status: "ASSIGNED",
        },
        assignment: {
          id: "assignment-2026-05-12",
          scheduleId: "schedule-2026-05-surgery",
          shiftId: "shift-2026-05-12",
          doctorProfileId: "doctor-maria",
          status: "CONFIRMED",
          source: "GENERATED",
          createdAt: "2026-04-24T10:00:00+02:00",
          confirmedAt: "2026-04-24T10:05:00+02:00",
        },
        day: "Poniedziałek",
        categoryLabel: "Dzień powszedni",
      },
    ],
  },
];

export const pendingSwapFixture: SwapRequest = {
  id: "swap-2026-05-01",
  scheduleId: "schedule-2026-05-surgery",
  requestingDoctorId: "doctor-anna",
  sourceAssignmentId: "assignment-2026-05-01",
  targetDoctorId: "doctor-jan",
  targetAssignmentId: "assignment-2026-05-02",
  status: "PENDING_DOCTOR_ACCEPTANCE",
  candidates: [
    {
      id: "swap-candidate-jan",
      swapRequestId: "swap-2026-05-01",
      doctorProfileId: "doctor-jan",
      assignmentId: "assignment-2026-05-02",
      responseStatus: "PENDING",
    },
  ],
  createdAt: "2026-04-25T10:00:00+02:00",
  updatedAt: "2026-04-25T10:00:00+02:00",
};
