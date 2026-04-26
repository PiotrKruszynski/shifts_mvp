import { useNavigate, useParams } from "react-router";
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export function SwapApproval() {
  const navigate = useNavigate();
  const { id } = useParams();

  const swapRequest = {
    id: id || "1",
    fromDoctor: "Dr Jan Nowak",
    myShift: {
      date: "2026-05-15",
      day: "Środa",
      category: "Dzień powszedni",
    },
    theirShift: {
      date: "2026-05-18",
      day: "Sobota",
      category: "Weekend",
    },
    requestedAt: "2026-04-23",
    valid: true,
    issues: [],
  };

  const handleApprove = () => {
    navigate("/doctor");
  };

  const handleReject = () => {
    navigate("/doctor");
  };

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Propozycja zamiany</h2>
        <p className="text-gray-600 mt-1">Od: {swapRequest.fromDoctor}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">Zgłoszono: {swapRequest.requestedAt}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Przejmujesz</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900">{swapRequest.theirShift.day}</p>
              <p className="text-sm text-gray-600 mt-1">{swapRequest.theirShift.date}</p>
              <p className="text-xs text-gray-600 mt-1">{swapRequest.theirShift.category}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-blue-100 rounded-full p-3">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Oddajesz</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900">{swapRequest.myShift.day}</p>
              <p className="text-sm text-gray-600 mt-1">{swapRequest.myShift.date}</p>
              <p className="text-xs text-gray-600 mt-1">{swapRequest.myShift.category}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Wpływ na Twój grafik</h3>

        <div className="space-y-3">
          {swapRequest.valid ? (
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Zamiana zgodna z przepisami</p>
                <p className="text-sm text-green-700 mt-1">
                  Nie wykryto naruszeń odpoczynku ani limitów godzinowych
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Wykryto potencjalne problemy</p>
                <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                  {swapRequest.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-2">Ważne informacje</h4>
        <p className="text-sm text-blue-800">
          Akceptacja propozycji nie finalizuje zamiany automatycznie. Po Twojej akceptacji,
          propozycja zostanie przesłana do Koordynatora w celu ostatecznego zatwierdzenia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={handleApprove}
          className="py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Akceptuję zamianę
        </button>
        <button
          onClick={handleReject}
          className="py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <XCircle className="w-5 h-5" />
          Odrzucam zamianę
        </button>
      </div>
    </div>
  );
}
