import type { LeaveRequest } from "../domain/types";

export interface LeaveRequestFixture {
  request: LeaveRequest;
  doctorName: string;
  typeLabel: string;
  submittedAt: string;
  rejectionReason?: string;
}

export const leaveRequestsFixture: LeaveRequestFixture[] = [
  {
    request: {
      id: "leave-anna-2026-05-10",
      scheduleId: "schedule-2026-05-surgery",
      doctorProfileId: "doctor-anna",
      dateFrom: "2026-05-10",
      dateTo: "2026-05-15",
      status: "SUBMITTED",
      reason: "Planowany urlop rodzinny",
    },
    doctorName: "Dr Anna Kowalska",
    typeLabel: "Urlop wypoczynkowy",
    submittedAt: "2026-04-20",
  },
  {
    request: {
      id: "leave-jan-2026-05-20",
      scheduleId: "schedule-2026-05-surgery",
      doctorProfileId: "doctor-jan",
      dateFrom: "2026-05-20",
      dateTo: "2026-05-22",
      status: "SUBMITTED",
      reason: "",
    },
    doctorName: "Dr Jan Nowak",
    typeLabel: "Urlop na żądanie",
    submittedAt: "2026-04-22",
  },
  {
    request: {
      id: "leave-maria-2026-06-01",
      scheduleId: "schedule-2026-05-surgery",
      doctorProfileId: "doctor-maria",
      dateFrom: "2026-06-01",
      dateTo: "2026-06-14",
      status: "APPROVED",
      reason: "Urlop wakacyjny",
      reviewedByUserId: "user-coordinator-jan",
      reviewedAt: "2026-04-16T10:00:00+02:00",
    },
    doctorName: "Dr Maria Wiśniewska",
    typeLabel: "Urlop wypoczynkowy",
    submittedAt: "2026-04-15",
  },
];

export const myLeaveRequestsFixture: LeaveRequestFixture[] = [
  {
    request: {
      id: "leave-my-2026-06-01",
      scheduleId: "schedule-2026-05-surgery",
      doctorProfileId: "doctor-anna",
      dateFrom: "2026-06-01",
      dateTo: "2026-06-14",
      status: "APPROVED",
      reason: "Wakacje z rodziną",
      reviewedByUserId: "user-coordinator-jan",
      reviewedAt: "2026-04-16T10:00:00+02:00",
    },
    doctorName: "Dr Anna Kowalska",
    typeLabel: "Urlop wypoczynkowy",
    submittedAt: "2026-04-15",
  },
  {
    request: {
      id: "leave-my-2026-05-10",
      scheduleId: "schedule-2026-05-surgery",
      doctorProfileId: "doctor-anna",
      dateFrom: "2026-05-10",
      dateTo: "2026-05-12",
      status: "SUBMITTED",
      reason: "",
    },
    doctorName: "Dr Anna Kowalska",
    typeLabel: "Urlop na żądanie",
    submittedAt: "2026-04-20",
  },
];
