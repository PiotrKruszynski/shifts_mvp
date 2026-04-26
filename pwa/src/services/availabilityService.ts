import { formatPeriod } from "../api/adapters";
import { apiRequest, type PageResponse } from "../api/client";
import { shouldUseMockApi } from "../api/config";
import type { AvailabilityDeclaration, PreferenceCategory, Schedule } from "../domain/types";
import { mockSeed } from "../mocks/seed";
import { mockMutate, mockResolve } from "./mockTransport";

export type AvailabilityStatus =
  | "available"
  | "unavailable"
  | "preferred"
  | "not-preferred"
  | "leave-pending"
  | "leave-approved";

export interface DayAvailability {
  date: string;
  status: AvailabilityStatus;
  category: "I" | "II" | "III" | null;
  comment: string;
}

export interface AvailabilityCollectionDoctor {
  id: string;
  name: string;
  status: "Zaakceptowane" | "Oczekuje";
  submittedAt: string | null;
}

export interface AvailabilityCollectionData {
  scheduleId: string;
  periodLabel: string;
  dateRangeLabel: string;
  deadlineDate: string;
  statusLabel: "Szkic";
  doctors: AvailabilityCollectionDoctor[];
}

export interface MyAvailabilityData {
  scheduleId: string;
  periodLabel: string;
  deadlineDate: string;
  days: Record<string, DayAvailability>;
}

const availabilityCollectionDoctors: AvailabilityCollectionDoctor[] = [
  { id: "doctor-anna", name: "Dr Anna Kowalska", status: "Zaakceptowane", submittedAt: "2026-04-20" },
  { id: "doctor-jan", name: "Dr Jan Nowak", status: "Zaakceptowane", submittedAt: "2026-04-19" },
  { id: "doctor-maria", name: "Dr Maria Wiśniewska", status: "Oczekuje", submittedAt: null },
  { id: "doctor-piotr", name: "Dr Piotr Zieliński", status: "Zaakceptowane", submittedAt: "2026-04-21" },
  { id: "doctor-katarzyna", name: "Dr Katarzyna Lewandowska", status: "Oczekuje", submittedAt: null },
  { id: "doctor-tomasz", name: "Dr Tomasz Kamiński", status: "Zaakceptowane", submittedAt: "2026-04-22" },
];

const myAvailabilityDays: Record<string, DayAvailability> = {
  "2026-05-01": { date: "2026-05-01", status: "preferred", category: "I", comment: "" },
  "2026-05-10": { date: "2026-05-10", status: "unavailable", category: null, comment: "Wizyta lekarska" },
  "2026-05-15": { date: "2026-05-15", status: "leave-approved", category: null, comment: "" },
};

const toAvailabilityStatus = (value: string): AvailabilityStatus => {
  if (value === "UNAVAILABLE") return "unavailable";
  if (value === "PREFERRED") return "preferred";
  if (value === "NOT_PREFERRED") return "not-preferred";
  return "available";
};

const toBackendAvailabilityType = (value: AvailabilityStatus) => {
  if (value === "unavailable") return "UNAVAILABLE";
  if (value === "preferred") return "PREFERRED";
  if (value === "not-preferred") return "NOT_PREFERRED";
  return "AVAILABLE";
};

const toDayMap = (declaration: AvailabilityDeclaration, categories: PreferenceCategory[]) =>
  Object.fromEntries(
    declaration.days.map((day) => [
      day.date,
      {
        date: day.date,
        status: toAvailabilityStatus(day.availabilityType),
        category: categories.find((category) => category.id === day.preferenceCategoryId)?.code ?? null,
        comment: day.comment ?? "",
      } satisfies DayAvailability,
    ]),
  );

const getDraftSchedule = async () => {
  const draft = await apiRequest<PageResponse<Schedule>>("/schedules?status=DRAFT").then((response) => response.data[0]);
  return draft ?? apiRequest<Schedule>("/schedules/current");
};

export const availabilityService = {
  getAvailabilityCollection(scheduleId = "1"): Promise<AvailabilityCollectionData> {
    if (!shouldUseMockApi()) {
      return apiRequest(`/schedules/${scheduleId}/availability-collection-view`);
    }

    return mockResolve({
      scheduleId,
      periodLabel: "Maj 2026",
      dateRangeLabel: "01.05.2026 - 31.05.2026",
      deadlineDate: "2026-04-28",
      statusLabel: "Szkic",
      doctors: availabilityCollectionDoctors,
    });
  },

  async getMyAvailability(): Promise<MyAvailabilityData> {
    if (!shouldUseMockApi()) {
      const [schedule, categories] = await Promise.all([
        getDraftSchedule(),
        apiRequest<{ data: PreferenceCategory[] }>("/preference-categories").then((response) => response.data),
      ]);
      const declaration = await apiRequest<AvailabilityDeclaration>(`/schedules/${schedule.id}/availability/me`);
      return {
        scheduleId: schedule.id,
        periodLabel: formatPeriod(schedule),
        deadlineDate: schedule.availabilityDeadline.slice(0, 10),
        days: toDayMap(declaration, categories),
      };
    }

    return mockResolve({
      scheduleId: mockSeed.doctorCurrentSchedule.id,
      periodLabel: "Maj 2026",
      deadlineDate: "2026-04-28",
      days: myAvailabilityDays,
    });
  },

  async saveMyAvailability(days: Record<string, DayAvailability>): Promise<Record<string, DayAvailability>> {
    if (!shouldUseMockApi()) {
      const [schedule, categories] = await Promise.all([
        getDraftSchedule(),
        apiRequest<{ data: PreferenceCategory[] }>("/preference-categories").then((response) => response.data),
      ]);
      const declaration = await apiRequest<AvailabilityDeclaration>(`/schedules/${schedule.id}/availability/me`, {
        method: "PUT",
        body: {
          days: Object.values(days)
            .filter((day) => !day.status.startsWith("leave-"))
            .map((day) => ({
              date: day.date,
              availabilityType: toBackendAvailabilityType(day.status),
              preferenceCategoryId: categories.find((category) => category.code === day.category)?.id,
              comment: day.comment || undefined,
            })),
        },
      });
      return toDayMap(declaration, categories);
    }

    return mockMutate(() => days);
  },
};
