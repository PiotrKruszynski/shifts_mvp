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

export const availabilityService = {
  getAvailabilityCollection(scheduleId = "1"): Promise<AvailabilityCollectionData> {
    return mockResolve({
      scheduleId,
      periodLabel: "Maj 2026",
      dateRangeLabel: "01.05.2026 - 31.05.2026",
      deadlineDate: "2026-04-28",
      statusLabel: "Szkic",
      doctors: availabilityCollectionDoctors,
    });
  },

  getMyAvailability(): Promise<MyAvailabilityData> {
    return mockResolve({
      scheduleId: mockSeed.doctorCurrentSchedule.id,
      periodLabel: "Maj 2026",
      deadlineDate: "2026-04-28",
      days: myAvailabilityDays,
    });
  },

  saveMyAvailability(days: Record<string, DayAvailability>): Promise<Record<string, DayAvailability>> {
    return mockMutate(() => days);
  },
};
