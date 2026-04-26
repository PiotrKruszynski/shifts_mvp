import { Calendar, CheckCircle, Clock } from "lucide-react";
import type { LeaveRequestListItem } from "../../../../services/leaveRequestService";

interface LeaveRequestStatsProps {
  requests: LeaveRequestListItem[];
}

export function LeaveRequestStats({ requests }: LeaveRequestStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm text-gray-600">Wszystkie wnioski</p>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-2xl font-semibold text-gray-900">{requests.length}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm text-gray-600">Oczekujące</p>
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <p className="text-2xl font-semibold text-gray-900">
          {requests.filter(({ request }) => request.status === "SUBMITTED").length}
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm text-gray-600">Zaakceptowane</p>
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-2xl font-semibold text-gray-900">
          {requests.filter(({ request }) => request.status === "APPROVED").length}
        </p>
      </div>
    </div>
  );
}
