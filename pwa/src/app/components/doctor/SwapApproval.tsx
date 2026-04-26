import { Link, useNavigate, useParams } from "react-router";
import { AlertCircle, Calendar, CheckCircle, RefreshCw, XCircle } from "lucide-react";
import { doctorCurrentScheduleFixture, doctorSwapFlowEnabledFixture } from "../../../fixtures/schedules.fixture";
import { pendingSwapFixture } from "../../../fixtures/swaps.fixture";

export function SwapApproval() {
  const navigate = useNavigate();
  const { id } = useParams();

  const swapRequest =
    id === pendingSwapFixture.id
      ? {
          id: pendingSwapFixture.id,
          fromDoctor: "Dr Jan Nowak",
          myShift: {
            date: "2026-05-01",
            day: "Czwartek",
            category: "Święto Pracy",
          },
          theirShift: {
            date: "2026-05-02",
            day: "Piątek",
            category: "Dzień powszedni",
          },
          requestedAt: "2026-04-25",
          valid: true,
          issues: [] as string[],
        }
      : null;

  const isPublishedFlow =
    doctorSwapFlowEnabledFixture &&
    doctorCurrentScheduleFixture.status === "PUBLISHED" &&
    swapRequest !== null &&
    pendingSwapFixture.scheduleId === doctorCurrentScheduleFixture.id;

  const handleApprove = () => {
    if (!isPublishedFlow) {
      return;
    }

    navigate("/doctor");
  };

  const handleReject = () => {
    if (!isPublishedFlow) {
      return;
    }

    navigate("/doctor");
  };

  if (!isPublishedFlow) {
    return (
      <div className="p-4 pb-20 md:pb-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Ta odpowiedź nie jest dostępna</h2>
              <p className="mt-2 text-sm text-gray-700">
                Odpowiedź na propozycję zamiany działa tylko dla opublikowanego harmonogramu i aktywnego wniosku zamiany.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/doctor/schedule"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Calendar className="h-4 w-4" />
              Zobacz mój grafik
            </Link>
            <Link
              to="/doctor"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Wróć do pulpitu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Propozycja zamiany</h2>
          <p className="mt-1 text-gray-600">Od: {swapRequest.fromDoctor}</p>
        </div>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">Zgłoszono: {swapRequest.requestedAt}</p>
          </div>

          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="mb-2 text-sm text-gray-600">Przejmujesz</p>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="font-semibold text-gray-900">{swapRequest.theirShift.day}</p>
                <p className="mt-1 text-sm text-gray-600">{swapRequest.theirShift.date}</p>
                <p className="mt-1 text-xs text-gray-600">{swapRequest.theirShift.category}</p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="rounded-full bg-blue-100 p-3">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            <div className="text-center">
              <p className="mb-2 text-sm text-gray-600">Oddajesz</p>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="font-semibold text-gray-900">{swapRequest.myShift.day}</p>
                <p className="mt-1 text-sm text-gray-600">{swapRequest.myShift.date}</p>
                <p className="mt-1 text-xs text-gray-600">{swapRequest.myShift.category}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-gray-900">Wpływ na Twój grafik</h3>

          <div className="space-y-3">
            {swapRequest.valid ? (
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Zamiana zgodna z przepisami</p>
                  <p className="mt-1 text-sm text-green-700">
                    Nie wykryto naruszeń odpoczynku ani limitów godzinowych.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">Wykryto potencjalne problemy</p>
                  <ul className="mt-1 list-disc list-inside text-sm text-red-700">
                    {swapRequest.issues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 font-medium text-blue-900">Ważne informacje</h4>
          <p className="text-sm text-blue-800">
            Akceptacja propozycji nie finalizuje zamiany automatycznie. Po Twojej akceptacji propozycja zostanie przesłana do Koordynatora do ostatecznego zatwierdzenia.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={handleApprove}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-700"
          >
            <CheckCircle className="h-5 w-5" />
            Akceptuję zamianę
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-red-600 py-3 font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <XCircle className="h-5 w-5" />
            Odrzucam zamianę
          </button>
        </div>
      </div>
    </div>
  );
}
