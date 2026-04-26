import type { ShiftCalendarCategory } from "../../../../fixtures/schedules.fixture";

export const categoryColors: Record<ShiftCalendarCategory, string> = {
  Weekday: "bg-gray-100 text-gray-800",
  Weekend: "bg-blue-100 text-blue-800",
  Holiday: "bg-purple-100 text-purple-800",
};
