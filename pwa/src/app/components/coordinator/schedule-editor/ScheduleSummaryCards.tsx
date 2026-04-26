import { AlertCircle, CheckCircle } from "lucide-react";
import type { ScheduleEditorShiftFixture } from "../../../../fixtures/schedules.fixture";

interface ScheduleSummaryCardsProps {
  shifts: ScheduleEditorShiftFixture[];
}

export function ScheduleSummaryCards({ shifts }: ScheduleSummaryCardsProps) {
  const validShifts = shifts.filter((shift) => shift.valid).length;
  const totalShifts = shifts.length;
  const unassignedCount = shifts.filter(({ shift }) => shift.status === "UNASSIGNED").length;
  const conflictCount = shifts.filter((shift) => shift.issues.length > 0).length;
  const allValid = validShifts === totalShifts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Zgodność</span>
          {allValid ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
        <p className="text-2xl font-semibold text-gray-900">
          {validShifts}/{totalShifts}
        </p>
        <p className="text-xs text-gray-600 mt-1">dyżurów bez konfliktów</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Nieobsadzone</span>
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <p className="text-2xl font-semibold text-gray-900">{unassignedCount}</p>
        <p className="text-xs text-gray-600 mt-1">dyżurów wymaga obsady</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Konflikty</span>
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>
        <p className="text-2xl font-semibold text-gray-900">{conflictCount}</p>
        <p className="text-xs text-gray-600 mt-1">naruszeń wymaga korekty</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Lekarze</span>
          <CheckCircle className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-2xl font-semibold text-gray-900">24</p>
        <p className="text-xs text-gray-600 mt-1">aktywnych w grafiku</p>
      </div>
    </div>
  );
}
