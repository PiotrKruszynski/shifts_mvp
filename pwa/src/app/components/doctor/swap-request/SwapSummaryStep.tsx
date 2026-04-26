import { RefreshCw } from "lucide-react";
import type {
  SwapDoctorOptionFixture,
  SwapShiftOptionFixture,
} from "../../../../fixtures/swaps.fixture";

interface SwapSummaryStepProps {
  myShift: SwapShiftOptionFixture;
  doctor: SwapDoctorOptionFixture;
  theirShift: SwapShiftOptionFixture;
  onBack: () => void;
  onSubmit: () => void;
}

export function SwapSummaryStep({
  myShift,
  doctor,
  theirShift,
  onBack,
  onSubmit,
}: SwapSummaryStepProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">Krok 3: Podsumowanie zamiany</h3>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Oddajesz</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900">{myShift.day}</p>
              <p className="text-sm text-gray-600 mt-1">{myShift.shift.date}</p>
              <p className="text-xs text-gray-600 mt-1">{myShift.categoryLabel}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-blue-100 rounded-full p-3">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Przejmujesz od {doctor.name}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900">{theirShift.day}</p>
              <p className="text-sm text-gray-600 mt-1">{theirShift.shift.date}</p>
              <p className="text-xs text-gray-600 mt-1">{theirShift.categoryLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-2">Następne kroki</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Propozycja zostanie wysłana do {doctor.name}</li>
          <li>Po akceptacji przez lekarza, zamiana trafi do Koordynatora</li>
          <li>Koordynator dokona końcowej weryfikacji i zatwierdzenia</li>
        </ol>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Wstecz
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Wyślij propozycję
        </button>
      </div>
    </div>
  );
}
