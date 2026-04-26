import { useState } from "react";
import { Link, useParams } from "react-router";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { scheduleService, scheduleStatusLabels } from "../../../services/scheduleService";
import { ScheduleStatusBadge } from "../shared/ScheduleStatusBadge";
import { PublishScheduleDialog } from "./schedule-editor/PublishScheduleDialog";
import { ScheduleSummaryCards } from "./schedule-editor/ScheduleSummaryCards";
import { ScheduleValidationPanel } from "./schedule-editor/ScheduleValidationPanel";
import { ShiftGrid } from "./schedule-editor/ShiftGrid";

export function ScheduleEditor() {
  const { id } = useParams();
  const [showPublish, setShowPublish] = useState(false);
  const editorState = useAsyncResource(() => scheduleService.getScheduleEditorData(id), [id]);

  if (editorState.status === "loading") {
    return <div className="p-8 text-gray-600">Ładowanie edytora grafiku...</div>;
  }

  if (editorState.status === "error") {
    return <div className="p-8 text-red-700">{editorState.error}</div>;
  }

  const editorData = editorState.data;
  const allValid = editorData.shifts.every((shift) => shift.valid);

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link to="/coordinator/schedules" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Powrót do grafików
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Edytor grafiku</h1>
          <p className="text-gray-600 mt-2">
            {editorData.periodLabel} ({editorData.dateRangeLabel})
          </p>
        </div>
        <ScheduleStatusBadge status={scheduleStatusLabels[editorData.schedule.status]} />
      </div>

      <ScheduleSummaryCards shifts={editorData.shifts} />
      <ShiftGrid shifts={editorData.shifts} />
      <ScheduleValidationPanel conflicts={editorData.conflicts} />

      <div className="flex gap-3">
        <button
          onClick={() => setShowPublish(true)}
          disabled={!allValid}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            allValid
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Publikuj grafik
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Uruchom ponownie generator
        </button>
      </div>

      {showPublish && <PublishScheduleDialog onClose={() => setShowPublish(false)} />}
    </div>
  );
}
