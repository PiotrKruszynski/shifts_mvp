import type { PreferenceCategory, ScheduleStatus } from "../domain/types";

export interface SystemSettingsFixture {
  language: "pl" | "en";
  timezone: string;
  minRestHours: number;
  maxWeeklyHours: number;
  maxMonthlyHours: number;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  defaultScheduleStatus: Extract<ScheduleStatus, "DRAFT" | "GENERATED">;
  autoArchiveAfterDays: number;
}

export const systemSettingsFixture: SystemSettingsFixture = {
  language: "pl",
  timezone: "Europe/Warsaw",
  minRestHours: 11,
  maxWeeklyHours: 48,
  maxMonthlyHours: 220,
  enableEmailNotifications: true,
  enableSMSNotifications: false,
  defaultScheduleStatus: "DRAFT",
  autoArchiveAfterDays: 90,
};

export const preferenceCategoriesFixture: PreferenceCategory[] = [
  {
    id: "preference-category-i",
    code: "I",
    name: "Kategoria I - Wysoki priorytet",
    priority: 1,
    description: "Generator będzie maksymalizować spełnienie tych preferencji",
  },
  {
    id: "preference-category-ii",
    code: "II",
    name: "Kategoria II - Średni priorytet",
    priority: 2,
    description: "Preferencje uwzględniane po spełnieniu kategorii I",
  },
  {
    id: "preference-category-iii",
    code: "III",
    name: "Kategoria III - Niski priorytet",
    priority: 3,
    description: "Uwzględniane tylko jeśli nie kolidują z wyższymi priorytetami",
  },
];
