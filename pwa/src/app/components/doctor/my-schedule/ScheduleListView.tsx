import type { DoctorScheduleShift } from "../../../../services/scheduleService";
import { ShiftCard } from "./ShiftCard";

interface ScheduleListViewProps {
  shifts: DoctorScheduleShift[];
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
