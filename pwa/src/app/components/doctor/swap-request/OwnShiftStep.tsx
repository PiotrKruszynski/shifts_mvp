import { ArrowLeft, CheckCircle } from "lucide-react";
import type { SwapShiftOptionFixture } from "../../../../fixtures/swaps.fixture";

interface OwnShiftStepProps {
  shifts: SwapShiftOptionFixture[];
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
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">Krok 1: Wybierz swój dyżur do zamiany</h3>

      <div className="space-y-3">
        {shifts.map((shift) => (
          <button
            key={shift.shift.id}
            onClick={() => onSelectShift(shift.shift.id)}
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

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Wstecz
        </button>
        <button
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
