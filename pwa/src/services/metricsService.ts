import { toDoctorMetric } from "../api/adapters";
import { apiRequest } from "../api/client";
import { shouldUseMockApi } from "../api/config";
import { mockResolve } from "./mockTransport";

export interface DoctorMetric {
  name: string;
  weekdayShifts: number;
  weekendShifts: number;
  holidayShifts: number;
  totalHours: number;
}

export interface MetricsData {
  periodLabel: string;
  doctorMetrics: DoctorMetric[];
}

const doctorMetrics: DoctorMetric[] = [
  { name: "Dr Anna Kowalska", weekdayShifts: 5, weekendShifts: 2, holidayShifts: 1, totalHours: 192 },
  { name: "Dr Jan Nowak", weekdayShifts: 4, weekendShifts: 2, holidayShifts: 1, totalHours: 168 },
  { name: "Dr Maria Wiśniewska", weekdayShifts: 6, weekendShifts: 1, holidayShifts: 0, totalHours: 168 },
  { name: "Dr Piotr Zieliński", weekdayShifts: 5, weekendShifts: 3, holidayShifts: 1, totalHours: 216 },
  { name: "Dr Katarzyna Lewandowska", weekdayShifts: 4, weekendShifts: 2, holidayShifts: 0, totalHours: 144 },
];

export const metricsService = {
  async getDoctorMetrics(): Promise<MetricsData> {
    if (!shouldUseMockApi()) {
      const schedule = await apiRequest<{ id: string }>("/schedules/current");
      const metrics = await apiRequest<{
        periodLabel: string;
        doctorMetrics: {
          doctorName: string;
          weekdayShiftCount: number;
          weekendShiftCount: number;
          holidayShiftCount: number;
          totalHours: number;
        }[];
      }>(`/schedules/${schedule.id}/metrics`);
      return {
        periodLabel: metrics.periodLabel,
        doctorMetrics: metrics.doctorMetrics.map(toDoctorMetric),
      };
    }

    return mockResolve({
      periodLabel: "Maj 2026",
      doctorMetrics,
    });
  },
};
