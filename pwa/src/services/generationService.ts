import { apiRequest } from "../api/client";
import { shouldUseMockApi } from "../api/config";
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
  async generateSchedule(scheduleId: string): Promise<GenerationRunResult> {
    if (!shouldUseMockApi()) {
      const run = await apiRequest<{ id: string }>(`/schedules/${scheduleId}/generate`, {
        method: "POST",
        body: {},
      });
      const [editorData, conflictReport] = await Promise.all([
        apiRequest<ScheduleEditorData>(`/schedules/${scheduleId}/editor-view`),
        apiRequest<ConflictReport>(`/generation-runs/${run.id}/conflict-report`).catch(() => ({
          id: `empty-conflict-report-${run.id}`,
          scheduleId,
          generationRunId: run.id,
          createdAt: new Date().toISOString(),
          summary: "Brak konfliktów po generowaniu.",
          items: [],
        })),
      ]);
      return {
        generationRunId: run.id,
        editorData,
        conflictReport,
      };
    }

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
