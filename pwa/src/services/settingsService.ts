import type { PreferenceCategory } from "../domain/types";
import type { SystemSettingsFixture } from "../fixtures/settings.fixture";
import { mockSeed } from "../mocks/seed";
import { mockMutate, mockResolve } from "./mockTransport";

export type SystemSettings = SystemSettingsFixture;

export const settingsService = {
  getSystemSettings(): Promise<SystemSettings> {
    return mockResolve(mockSeed.systemSettings);
  },

  saveSystemSettings(settings: SystemSettings): Promise<SystemSettings> {
    return mockMutate(() => settings);
  },

  listPreferenceCategories(): Promise<PreferenceCategory[]> {
    return mockResolve(mockSeed.preferenceCategories);
  },
};
