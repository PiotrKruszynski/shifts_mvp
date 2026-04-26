import { useState } from "react";
import { Plus, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  status: "Pending" | "Approved" | "Rejected";
  comment: string;
  submittedAt: string;
  rejectionReason?: string;
}

export function DoctorLeaveRequests() {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    type: "Urlop wypoczynkowy",
    comment: "",
  });

  const requests: LeaveRequest[] = [
    {
      id: "1",
      startDate: "2026-06-01",
      endDate: "2026-06-14",
      type: "Urlop wypoczynkowy",
      status: "Approved",
      comment: "Wakacje z rodziną",
      submittedAt: "2026-04-15",
    },
    {
      id: "2",
      startDate: "2026-05-10",
      endDate: "2026-05-12",
      type: "Urlop na żądanie",
      status: "Pending",
      comment: "",
      submittedAt: "2026-04-20",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNewRequest(false);
    setFormData({ startDate: "", endDate: "", type: "Urlop wypoczynkowy", comment: "" });
  };

  const statusIcons = {
    Pending: <Clock className="w-5 h-5 text-amber-600" />,
    Approved: <CheckCircle className="w-5 h-5 text-green-600" />,
    Rejected: <XCircle className="w-5 h-5 text-red-600" />,
  };

  const statusColors = {
    Pending: "bg-amber-100 text-amber-800 border-amber-300",
    Approved: "bg-green-100 text-green-800 border-green-300",
    Rejected: "bg-red-100 text-red-800 border-red-300",
  };

  const statusLabels = {
    Pending: "Oczekuje",
    Approved: "Zaakceptowany",
    Rejected: "Odrzucony",
  };

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
            {requests.filter((r) => r.status === "Pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-gray-600">Zaakceptowane</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {requests.filter((r) => r.status === "Approved").length}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {requests.map((request) => {
          const days = Math.ceil(
            (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1;

          return (
            <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{request.type}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Zgłoszono: {request.submittedAt}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                    statusColors[request.status]
                  }`}
                >
                  {statusIcons[request.status]}
                  {statusLabels[request.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Okres</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {request.startDate} - {request.endDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Długość</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{days} dni</p>
                </div>
              </div>

              {request.comment && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Komentarz</p>
                  <p className="text-sm text-gray-900 mt-1">{request.comment}</p>
                </div>
              )}

              {request.status === "Rejected" && request.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900">Powód odrzucenia</p>
                  <p className="text-sm text-red-700 mt-1">{request.rejectionReason}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showNewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Nowy wniosek urlopowy</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typ nieobecności
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Urlop wypoczynkowy">Urlop wypoczynkowy</option>
                    <option value="Urlop na żądanie">Urlop na żądanie</option>
                    <option value="Urlop okolicznościowy">Urlop okolicznościowy</option>
                    <option value="Zwolnienie lekarskie">Zwolnienie lekarskie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data początkowa
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data końcowa
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Komentarz (opcjonalnie)
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dodatkowe informacje..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Złóż wniosek
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewRequest(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
