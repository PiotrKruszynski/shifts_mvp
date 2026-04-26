import { ArrowLeft, CheckCircle } from "lucide-react";
import type { SwapShiftOption } from "../../../../services/swapRequestService";

interface OwnShiftStepProps {
  shifts: SwapShiftOption[];
  selectedShiftId: string | null;
  onSelectShift: (shiftId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function OwnShiftStep({
  shifts,
  selectedShiftId,
  onSelectShift,
  onBack,
  onNext,
}: OwnShiftStepProps) {
  if (shifts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Brak dyżurów do zamiany</h3>
        <p className="mt-2 text-sm text-gray-600">
          W opublikowanym grafiku nie ma teraz dyżuru, który możesz zgłosić do zamiany.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 font-semibold text-gray-900">Krok 1: wybierz swój dyżur</h3>
      <p className="mb-4 text-sm text-gray-600">
        Zaznacz dyżur, którego chcesz się zamienić. Na telefonie najlepiej zacząć od pozycji z listy w "Moim grafiku".
      </p>

      <div className="space-y-3" role="list" aria-label="Dyżury lekarza do zamiany">
        {shifts.map((shift) => (
          <button
            key={shift.shift.id}
            type="button"
            onClick={() => onSelectShift(shift.shift.id)}
            aria-pressed={selectedShiftId === shift.shift.id}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedShiftId === shift.shift.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{shift.day}</h4>
                <p className="text-sm text-gray-600 mt-1">{shift.shift.date}</p>
                <p className="text-sm text-gray-600">{shift.categoryLabel}</p>
              </div>
              {selectedShiftId === shift.shift.id && <CheckCircle className="w-6 h-6 text-blue-600" />}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Wstecz
        </button>
        <button
          type="button"
          disabled={!selectedShiftId}
          onClick={onNext}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Dalej
        </button>
      </div>
    </div>
  );
}
