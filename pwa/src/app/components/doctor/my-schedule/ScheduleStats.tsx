import type { DoctorScheduleShiftFixture } from "../../../../fixtures/schedules.fixture";

interface ScheduleStatsProps {
  shifts: DoctorScheduleShiftFixture[];
}

export function ScheduleStats({ shifts }: ScheduleStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-sm text-gray-600 mb-1">Łącznie dyżurów</p>
        <p className="text-2xl font-semibold text-gray-900">{shifts.length}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-sm text-gray-600 mb-1">Weekendy</p>
        <p className="text-2xl font-semibold text-gray-900">
          {shifts.filter((shift) => shift.category === "Weekend").length}
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-sm text-gray-600 mb-1">Święta</p>
        <p className="text-2xl font-semibold text-gray-900">
          {shifts.filter((shift) => shift.category === "Holiday").length}
        </p>
      </div>
    </div>
  );
}
