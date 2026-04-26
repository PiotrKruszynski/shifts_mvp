import { useState } from "react";
import { Plus } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { leaveRequestService } from "../../../services/leaveRequestService";
import { LeaveRequestFormDialog } from "./leave-requests/LeaveRequestFormDialog";
import { LeaveRequestList } from "./leave-requests/LeaveRequestList";
import { LeaveRequestStats } from "./leave-requests/LeaveRequestStats";

export function DoctorLeaveRequests() {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const requestsState = useAsyncResource(() => leaveRequestService.listDoctorLeaveRequests(), []);

  if (requestsState.status === "loading") {
    return <div className="p-4 pb-20 md:pb-4 text-gray-600">Ładowanie wniosków...</div>;
  }

  if (requestsState.status === "error") {
    return <div className="p-4 pb-20 md:pb-4 text-red-700">{requestsState.error}</div>;
  }

  const requests = requestsState.data;

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Wnioski urlopowe</h2>
          <p className="text-gray-600 mt-1">Zarządzaj swoimi wnioskami</p>
        </div>
        <button
          onClick={() => setShowNewRequest(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Nowy wniosek
        </button>
      </div>

      <LeaveRequestStats requests={requests} />
      <LeaveRequestList requests={requests} />

      {showNewRequest && <LeaveRequestFormDialog onClose={() => setShowNewRequest(false)} />}
    </div>
  );
}
