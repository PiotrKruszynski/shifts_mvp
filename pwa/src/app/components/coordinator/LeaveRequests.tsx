import { useEffect, useState } from "react";
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import {
  leaveRequestService,
  type LeaveRequestListItem,
} from "../../../services/leaveRequestService";

function leaveRequestDayCount(dateFrom: string, dateTo: string) {
  return (
    Math.ceil(
      (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24),
    ) + 1
  );
}

export function LeaveRequests() {
  const requestsState = useAsyncResource(() => leaveRequestService.listCoordinatorLeaveRequests(), []);
  const [requests, setRequests] = useState<LeaveRequestListItem[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequestListItem | null>(null);
  const [modalAction, setModalAction] = useState<"approve" | "reject">("approve");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (requestsState.status === "success" && requests === null) {
      setRequests(requestsState.data);
    }
  }, [requestsState, requests]);

  const handleAction = (request: LeaveRequestListItem, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setModalAction(action);
    setRejectionReason("");
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (selectedRequest && requests) {
      const updatedRequests = await leaveRequestService.decideLeaveRequest(
        requests,
        selectedRequest.request.id,
        modalAction,
        rejectionReason,
      );
      setRequests(updatedRequests);
    }
    setShowModal(false);
    setSelectedRequest(null);
  };

  if (requestsState.status === "error") {
    return <div className="p-8 text-red-700">{requestsState.error}</div>;
  }

  if (requestsState.status === "loading" || requests === null) {
    return <div className="p-8 text-gray-600">Ładowanie wniosków urlopowych...</div>;
  }

  const pendingRequests = requests.filter(({ request }) => request.status === "SUBMITTED");
  const approvedRequests = requests.filter(({ request }) => request.status === "APPROVED");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Wnioski urlopowe</h1>
        <p className="text-gray-600 mt-2">Rozpatrz wnioski o urlopy i nieobecności lekarzy</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Oczekujące</h3>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{pendingRequests.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Zaakceptowane</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{approvedRequests.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Dni urlopu</h3>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">14</p>
          <p className="text-sm text-gray-600 mt-1">w tym miesiącu</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Oczekujące wnioski</h2>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Brak oczekujących wniosków
            </h3>
            <p className="text-gray-600">Wszystkie wnioski zostały rozpatrzone</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingRequests.map((request) => (
              <div key={request.request.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.doctorName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Zgłoszono: {request.submittedAt}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
                    <Clock className="w-3 h-3" />
                    Oczekuje
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Typ</p>
                    <p className="text-sm text-gray-900 mt-1">{request.typeLabel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Okres</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {request.request.dateFrom} - {request.request.dateTo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Długość</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {leaveRequestDayCount(request.request.dateFrom, request.request.dateTo)} dni
                    </p>
                  </div>
                </div>

                {request.request.reason && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-1">Komentarz</p>
                    <p className="text-sm text-gray-900">{request.request.reason}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(request, "approve")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Zaakceptuj
                  </button>
                  <button
                    onClick={() => handleAction(request, "reject")}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    <XCircle className="w-4 h-4 inline mr-2" />
                    Odrzuć
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {modalAction === "approve" ? "Zaakceptuj wniosek" : "Odrzuć wniosek"}
            </h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{selectedRequest.doctorName}</p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedRequest.request.dateFrom} - {selectedRequest.request.dateTo}
              </p>
            </div>

            {modalAction === "reject" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Powód odrzucenia (opcjonalnie)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Wpisz powód..."
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  modalAction === "approve"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Potwierdź
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
