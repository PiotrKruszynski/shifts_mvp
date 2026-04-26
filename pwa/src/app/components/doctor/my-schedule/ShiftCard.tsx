import { Calendar, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import type { DoctorScheduleShiftFixture } from "../../../../fixtures/schedules.fixture";
import { categoryColors } from "./scheduleDisplay";

interface ShiftCardProps {
  shift: DoctorScheduleShiftFixture;
}

export function ShiftCard({ shift }: ShiftCardProps) {
  const canRequestSwap = shift.canSwap && shift.scheduleStatus === "PUBLISHED";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{shift.day}</h3>
          <p className="text-sm text-gray-600">{shift.shift.date}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[shift.category]}`}>
          {shift.categoryDay}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>00:00 - 23:59</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">{shift.department}</span>
        </div>
      </div>

      {canRequestSwap && (
        <Link
          to="/doctor/swap-request"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Zaproponuj zamianę
        </Link>
      )}
    </div>
  );
}
