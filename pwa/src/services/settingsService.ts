import { apiRequest } from "../api/client";
import { shouldUseMockApi } from "../api/config";
import type { PreferenceCategory } from "../domain/types";
import type { SystemSettingsFixture } from "../fixtures/settings.fixture";
import { mockSeed } from "../mocks/seed";
import { mockMutate, mockResolve } from "./mockTransport";

export type SystemSettings = SystemSettingsFixture;

export const settingsService = {
  getSystemSettings(): Promise<SystemSettings> {
    if (!shouldUseMockApi()) {
      return apiRequest("/system-settings");
    }

    return mockResolve(mockSeed.systemSettings);
  },

  saveSystemSettings(settings: SystemSettings): Promise<SystemSettings> {
    if (!shouldUseMockApi()) {
      return apiRequest("/system-settings", { method: "PUT", body: settings });
    }

    return mockMutate(() => settings);
  },

  listPreferenceCategories(): Promise<PreferenceCategory[]> {
    if (!shouldUseMockApi()) {
      return apiRequest<{ data: PreferenceCategory[] }>("/preference-categories").then((response) => response.data);
    }

    return mockResolve(mockSeed.preferenceCategories);
  },
};
