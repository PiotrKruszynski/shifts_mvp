import { AlertCircle, Download, Save } from "lucide-react";
import type { ScheduleEditorShift } from "../../../../services/scheduleService";

interface ShiftGridProps {
  shifts: ScheduleEditorShift[];
}

export function ShiftGrid({ shifts }: ShiftGridProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Kalendarz dyżurów</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 inline mr-1" />
              Eksportuj
            </button>
            <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Save className="w-4 h-4 inline mr-1" />
              Zapisz korekty
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {shifts.map((shift) => {
            const date = new Date(shift.shift.date);
            const dayOfMonth = date.getDate();

            return (
              <div
                key={shift.shift.id}
                className={`border rounded-lg p-3 min-h-[120px] ${
                  !shift.valid
                    ? "border-red-300 bg-red-50"
                    : shift.category === "Weekend" || shift.category === "Holiday"
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-white"
                } hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-900">{dayOfMonth}</span>
                  {shift.category === "Holiday" && (
                    <span className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 rounded">
                      Święto
                    </span>
                  )}
                  {shift.category === "Weekend" && (
                    <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                      Weekend
                    </span>
                  )}
                </div>

                {shift.doctorName ? (
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 truncate">{shift.doctorName}</p>
                    <p className="text-xs text-gray-600 mt-1">00:00 - 23:59</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">Nieobsadzony</div>
                )}

                {shift.issues.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-red-200">
                    {shift.issues.map((issue) => (
                      <p key={issue} className="text-xs text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {issue}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
