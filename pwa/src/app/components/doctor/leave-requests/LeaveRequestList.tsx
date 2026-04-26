import type { LeaveRequestListItem } from "../../../../services/leaveRequestService";
import {
  leaveRequestDayCount,
  leaveStatusColors,
  leaveStatusIcon,
  leaveStatusLabels,
} from "./leaveRequestDisplay";

interface LeaveRequestListProps {
  requests: LeaveRequestListItem[];
}

export function LeaveRequestList({ requests }: LeaveRequestListProps) {
  return (
    <div className="space-y-3">
      {requests.map(({ request, typeLabel, submittedAt, rejectionReason }) => {
        const days = leaveRequestDayCount(request.dateFrom, request.dateTo);

        return (
          <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{typeLabel}</h3>
                <p className="text-sm text-gray-600 mt-1">Zgłoszono: {submittedAt}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                  leaveStatusColors[request.status]
                }`}
              >
                {leaveStatusIcon(request.status)}
                {leaveStatusLabels[request.status]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-600">Okres</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {request.dateFrom} - {request.dateTo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Długość</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{days} dni</p>
              </div>
            </div>

            {request.reason && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Komentarz</p>
                <p className="text-sm text-gray-900 mt-1">{request.reason}</p>
              </div>
            )}

            {request.status === "REJECTED" && rejectionReason && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900">Powód odrzucenia</p>
                <p className="text-sm text-red-700 mt-1">{rejectionReason}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
