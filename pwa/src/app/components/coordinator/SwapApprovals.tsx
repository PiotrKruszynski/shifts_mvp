import { useEffect, useState } from "react";
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import {
  swapRequestService,
  type CoordinatorSwapApprovalItem,
} from "../../../services/swapRequestService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export function SwapApprovals() {
  const requestsState = useAsyncResource(() => swapRequestService.listCoordinatorSwapApprovals(), []);
  const [requests, setRequests] = useState<CoordinatorSwapApprovalItem[] | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CoordinatorSwapApprovalItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject">("approve");
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (requestsState.status === "success" && requests === null) {
      setRequests(requestsState.data);
    }
  }, [requestsState, requests]);

  const handleAction = (request: CoordinatorSwapApprovalItem, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (selectedRequest && requests) {
      try {
        setActionError(null);
        const updatedRequests = await swapRequestService.decideCoordinatorSwap(
          requests,
          selectedRequest.id,
          modalAction,
        );
        setRequests(updatedRequests);
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Nie udało się rozpatrzyć zamiany.");
      }
    }
    setShowModal(false);
    setSelectedRequest(null);
  };

  if (requestsState.status === "error") {
    return <div className="p-8 text-red-700">{requestsState.error}</div>;
  }

  if (requestsState.status === "loading" || requests === null) {
    return <div className="p-8 text-gray-600">Ładowanie zamian...</div>;
  }

  const pendingRequests = requests.filter((r) => r.status === "Pending");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Zamiany do akceptacji</h1>
        <p className="text-gray-600 mt-2">
          Rozpatrz propozycje zamian dyżurów zaakceptowane przez lekarzy
        </p>
      </div>

      {actionError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>}

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Brak oczekujących zamian</h3>
          <p className="text-gray-600">
            Wszystkie propozycje zamian zostały rozpatrzone
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-lg border p-6 ${
                request.valid ? "border-gray-200" : "border-red-300 bg-red-50"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Zamiana dyżurów
                  </h3>
                  <p className="text-sm text-gray-600">
                    Zgłoszona: {request.requestedAt}
                  </p>
                </div>
                {request.valid ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                    <CheckCircle className="w-3 h-3" />
                    Zgodna
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                    <XCircle className="w-3 h-3" />
                    Niezgodna
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Lekarz A</p>
                  <p className="font-medium text-gray-900">{request.doctorA}</p>
                  <p className="text-sm text-gray-600 mt-1">Oddaje: {request.shiftA}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Lekarz B</p>
                  <p className="font-medium text-gray-900">{request.doctorB}</p>
                  <p className="text-sm text-gray-600 mt-1">Oddaje: {request.shiftB}</p>
                </div>
              </div>

              {request.issues.length > 0 && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Wykryte naruszenia
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {request.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-red-800">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(request, "approve")}
                  disabled={!request.valid}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    request.valid
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Zatwierdź
                </button>
                <button
                  onClick={() => handleAction(request, "reject")}
                  className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  <XCircle className="w-4 h-4 inline mr-2" />
                  Odrzuć
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Zobacz szczegóły
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        {selectedRequest && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {modalAction === "approve" ? "Zatwierdź zamianę" : "Odrzuć zamianę"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {modalAction === "approve"
                  ? `Czy na pewno chcesz zatwierdzić zamianę między ${selectedRequest.doctorA} i ${selectedRequest.doctorB}?`
                  : `Czy na pewno chcesz odrzucić propozycję zamiany między ${selectedRequest.doctorA} i ${selectedRequest.doctorB}?`}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                }}
              >
                Anuluj
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAction}
                className={
                  modalAction === "approve"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }
              >
                Potwierdź
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  );
}
