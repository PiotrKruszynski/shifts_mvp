import type { ValidationResult } from "../domain/types";
import { mockSeed } from "../mocks/seed";
import { mockResolve } from "./mockTransport";

export const validationService = {
  validateSchedule(scheduleId: string): Promise<ValidationResult | null> {
    return mockResolve(
      mockSeed.validationResults.find(
        (result) => result.targetType === "SCHEDULE" && result.targetId === scheduleId,
      ) ?? null,
    );
  },

  validateSwapRequest(swapRequestId: string): Promise<ValidationResult | null> {
    return mockResolve(
      mockSeed.validationResults.find(
        (result) => result.targetType === "SWAP_REQUEST" && result.targetId === swapRequestId,
      ) ?? null,
    );
  },
};
