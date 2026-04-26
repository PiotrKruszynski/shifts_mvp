import type { DoctorScheduleShift } from "../../../../services/scheduleService";
import { ShiftCard } from "./ShiftCard";
import { categoryColors } from "./scheduleDisplay";

interface ScheduleCalendarViewProps {
  shifts: DoctorScheduleShift[];
}

export function ScheduleCalendarView({ shifts }: ScheduleCalendarViewProps) {
  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 31 }, (_, index) => {
            const day = index + 1;
            const dateStr = `2026-05-${day.toString().padStart(2, "0")}`;
            const shift = shifts.find((item) => item.shift.date === dateStr);

            return (
              <div
                key={day}
                className={`aspect-square p-2 rounded-lg border-2 ${
                  shift
                    ? `border-transparent ${categoryColors[shift.category]}`
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="text-sm font-medium text-gray-900">{day}</div>
                {shift && <div className="text-[10px] mt-1 leading-tight">Dyżur</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {shifts.map((shift) => (
          <ShiftCard key={shift.assignment.id} shift={shift} />
        ))}
      </div>
    </div>
  );
}
