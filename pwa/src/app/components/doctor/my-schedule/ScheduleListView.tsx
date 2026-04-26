import type { DoctorScheduleShiftFixture } from "../../../../fixtures/schedules.fixture";
import { ShiftCard } from "./ShiftCard";

interface ScheduleListViewProps {
  shifts: DoctorScheduleShiftFixture[];
}

export function ScheduleListView({ shifts }: ScheduleListViewProps) {
  return (
    <div className="space-y-3">
      {shifts.map((shift) => (
        <ShiftCard key={shift.assignment.id} shift={shift} />
      ))}
    </div>
  );
}
