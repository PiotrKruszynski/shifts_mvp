import type { ConflictReport } from "../domain/types";
import { mockSeed } from "../mocks/seed";
import { mockResolve } from "./mockTransport";
import type { ScheduleEditorData } from "./scheduleService";

export interface GenerationRunResult {
  generationRunId: string;
  editorData: ScheduleEditorData;
  conflictReport: ConflictReport;
}

export const generationService = {
  generateSchedule(_scheduleId: string): Promise<GenerationRunResult> {
    return mockResolve({
      generationRunId: "generation-run-2026-04-24",
      editorData: {
        schedule: mockSeed.currentSchedule,
        periodLabel: "Maj 2026",
        dateRangeLabel: "01.05.2026 - 31.05.2026",
        shifts: mockSeed.generatedScheduleShifts,
        conflicts: mockSeed.generatedScheduleConflicts,
      },
      conflictReport: mockSeed.conflictReports[0],
    });
  },
};
