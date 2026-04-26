import { apiRequest } from "../api/client";
import { shouldUseMockApi } from "../api/config";
import type { ValidationResult } from "../domain/types";
import { mockSeed } from "../mocks/seed";
import { mockResolve } from "./mockTransport";

export const validationService = {
  validateSchedule(scheduleId: string): Promise<ValidationResult | null> {
    if (!shouldUseMockApi()) {
      return apiRequest(`/schedules/${scheduleId}/validate`, { method: "POST", body: {} });
    }

    return mockResolve(
      mockSeed.validationResults.find(
        (result) => result.targetType === "SCHEDULE" && result.targetId === scheduleId,
      ) ?? null,
    );
  },

  validateSwapRequest(swapRequestId: string): Promise<ValidationResult | null> {
    if (!shouldUseMockApi()) {
      return apiRequest(`/swap-requests/${swapRequestId}/validate`, { method: "POST" });
    }

    return mockResolve(
      mockSeed.validationResults.find(
        (result) => result.targetType === "SWAP_REQUEST" && result.targetId === swapRequestId,
      ) ?? null,
    );
  },
};
