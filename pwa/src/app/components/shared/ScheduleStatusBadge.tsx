type ScheduleStatus = "Szkic" | "Wygenerowany" | "Opublikowany" | "Zarchiwizowany";

interface ScheduleStatusBadgeProps {
  status: ScheduleStatus;
}

export function ScheduleStatusBadge({ status }: ScheduleStatusBadgeProps) {
  const styles = {
    Szkic: "bg-gray-100 text-gray-800 border-gray-300",
    Wygenerowany: "bg-blue-100 text-blue-800 border-blue-300",
    Opublikowany: "bg-green-100 text-green-800 border-green-300",
    Zarchiwizowany: "bg-purple-100 text-purple-800 border-purple-300",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
}
