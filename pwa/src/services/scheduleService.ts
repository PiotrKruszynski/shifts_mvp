import type { ConflictItem, Schedule, ScheduleStatus } from "../domain/types";
import type {
  DoctorScheduleShiftFixture,
  ScheduleEditorShiftFixture,
  ShiftCalendarCategory,
} from "../fixtures/schedules.fixture";
import { doctorPublishedScheduleStatus } from "../fixtures/schedules.fixture";
import { mockSeed } from "../mocks/seed";
import { mockResolve } from "./mockTransport";

export type { ShiftCalendarCategory };

export type ScheduleStatusLabel = "Szkic" | "Wygenerowany" | "Opublikowany" | "Zarchiwizowany";
export type ScheduleEditorShift = ScheduleEditorShiftFixture;
export type DoctorScheduleShift = DoctorScheduleShiftFixture;

export const scheduleStatusLabels: Record<ScheduleStatus, ScheduleStatusLabel> = {
  DRAFT: "Szkic",
  GENERATED: "Wygenerowany",
  PUBLISHED: "Opublikowany",
  ARCHIVED: "Zarchiwizowany",
};

export interface ScheduleListItem {
  id: string;
  period: string;
  dateRange: string;
  status: ScheduleStatusLabel;
  doctors: number;
  shifts: number;
  deadline: string;
}

export interface CoordinatorDashboardSchedule {
  id: string;
  period: string;
  dateRange: string;
  status: ScheduleStatusLabel;
  deadline: string;
  unassignedShifts: number;
  conflicts: number;
  pendingSwaps: number;
  doctors: number;
  activeDoctors: number;
  invitedDoctors: number;
  shifts: number;
  availabilitySubmitted: number;
}

export interface ScheduleEditorData {
  schedule: Schedule;
  periodLabel: string;
  dateRangeLabel: string;
  shifts: ScheduleEditorShift[];
  conflicts: ConflictItem[];
}

export interface DoctorDashboardData {
  doctorFirstName: string;
  departmentName: string;
  schedule: Schedule;
  scheduleStatusLabel: ScheduleStatusLabel;
  periodLabel: string;
  availabilityDeadline: string;
  upcomingShift: {
    date: string;
    day: string;
    category: string;
    hours: string;
  };
  canRequestSwap: boolean;
  pendingSwap: {
    status: string;
    title: string;
    shiftLabel: string;
    updatedLabel: string;
  } | null;
}

export interface DoctorScheduleData {
  periodLabel: string;
  shifts: DoctorScheduleShift[];
}

export interface CreateMonthlyScheduleInput {
  month: string;
  availabilityDeadline: string;
}

const coordinatorSchedules: ScheduleListItem[] = [
  {
    id: "1",
    period: "Maj 2026",
    dateRange: "01.05.2026 - 31.05.2026",
    status: "Wygenerowany",
    doctors: 24,
    shifts: 31,
    deadline: "2026-04-28",
  },
  {
    id: "2",
    period: "Kwiecień 2026",
    dateRange: "01.04.2026 - 30.04.2026",
    status: "Opublikowany",
    doctors: 24,
    shifts: 30,
    deadline: "2026-03-25",
  },
  {
    id: "3",
    period: "Marzec 2026",
    dateRange: "01.03.2026 - 31.03.2026",
    status: "Zarchiwizowany",
    doctors: 23,
    shifts: 31,
    deadline: "2026-02-25",
  },
];

const coordinatorDashboardSchedule: CoordinatorDashboardSchedule = {
  id: "1",
  period: "Maj 2026",
  dateRange: "01.05.2026 - 31.05.2026",
  status: "Wygenerowany",
  deadline: "2026-04-28",
  unassignedShifts: 3,
  conflicts: 2,
  pendingSwaps: 5,
  doctors: 24,
  activeDoctors: 23,
  invitedDoctors: 1,
  shifts: 31,
  availabilitySubmitted: 21,
};

const doctorDashboardData: DoctorDashboardData = {
  doctorFirstName: "Anna",
  departmentName: "Oddział Chirurgii",
  schedule: mockSeed.doctorCurrentSchedule,
  scheduleStatusLabel: scheduleStatusLabels[mockSeed.doctorCurrentSchedule.status],
  periodLabel: "Maj 2026",
  availabilityDeadline: "2026-04-28",
  upcomingShift: {
    date: "2026-05-01",
    day: "Czwartek",
    category: "Święto - Święto Pracy",
    hours: "00:00 - 23:59",
  },
  canRequestSwap:
    mockSeed.doctorCurrentSchedule.status === doctorPublishedScheduleStatus &&
    mockSeed.doctorScheduleShifts.some((shift) => shift.canSwap && shift.scheduleStatus === "PUBLISHED"),
  pendingSwap: {
    status:
      mockSeed.pendingSwap.status === "PENDING_DOCTOR_ACCEPTANCE"
        ? "oczekuje na akceptację lekarza"
        : "w toku",
    title: "Oczekuje na Dr Jan Nowak",
    shiftLabel: "01.05.2026 ↔ 02.05.2026",
    updatedLabel: "2 dni temu",
  },
};

export const scheduleService = {
  listSchedules(): Promise<Schedule[]> {
    return mockResolve(mockSeed.schedules);
  },

  listCoordinatorSchedules(): Promise<ScheduleListItem[]> {
    return mockResolve(coordinatorSchedules);
  },

  getCoordinatorDashboardSchedule(): Promise<CoordinatorDashboardSchedule> {
    return mockResolve(coordinatorDashboardSchedule);
  },

  getScheduleEditorData(_scheduleId?: string): Promise<ScheduleEditorData> {
    return mockResolve({
      schedule: mockSeed.currentSchedule,
      periodLabel: "Maj 2026",
      dateRangeLabel: "01.05.2026 - 31.05.2026",
      shifts: mockSeed.generatedScheduleShifts,
      conflicts: mockSeed.generatedScheduleConflicts,
    });
  },

  getDoctorDashboardData(): Promise<DoctorDashboardData> {
    return mockResolve(doctorDashboardData);
  },

  getDoctorSchedule(): Promise<DoctorScheduleData> {
    return mockResolve({
      periodLabel: "Maj 2026",
      shifts: mockSeed.doctorScheduleShifts,
    });
  },

  createMonthlySchedule(input: CreateMonthlyScheduleInput): Promise<Schedule> {
    const [year, month] = input.month.split("-");
    const periodStart = `${input.month}-01`;
    const lastDay = new Date(Number(year), Number(month), 0).getDate().toString().padStart(2, "0");
    const periodEnd = `${input.month}-${lastDay}`;

    return mockResolve({
      id: "1",
      departmentId: "dep-surgery",
      coordinatorUserId: "user-coordinator-jan",
      periodStart,
      periodEnd,
      availabilityDeadline: `${input.availabilityDeadline}T23:59:00+02:00`,
      status: "DRAFT",
      createdAt: "2026-04-26T10:00:00+02:00",
    });
  },

  isDoctorSwapFlowEnabled(): Promise<boolean> {
    return mockResolve(doctorDashboardData.canRequestSwap);
  },
};
