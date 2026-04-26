import { CheckCircle, User } from "lucide-react";
import type { SwapDoctorOptionFixture } from "../../../../fixtures/swaps.fixture";

interface DoctorShiftStepProps {
  doctors: SwapDoctorOptionFixture[];
  selectedShiftId: string | null;
  onSelectShift: (doctorId: string, shiftId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DoctorShiftStep({
  doctors,
  selectedShiftId,
  onSelectShift,
  onBack,
  onNext,
}: DoctorShiftStepProps) {
  if (doctors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Brak dostępnych lekarzy</h3>
        <p className="mt-2 text-sm text-gray-600">
          W tym momencie nie ma lekarza z pasującym dyżurem do zamiany w opublikowanym grafiku.
        </p>
        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Wstecz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 font-semibold text-gray-900">Krok 2: wybierz lekarza i dyżur</h3>
      <p className="mb-4 text-sm text-gray-600">
        Wybierz jednego lekarza i konkretny dyżur, który chcesz przejąć.
      </p>

      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
            </div>

            <div className="space-y-2">
              {doctor.shifts.map((shift) => (
                <button
                  key={shift.shift.id}
                  type="button"
                  onClick={() => onSelectShift(doctor.id, shift.shift.id)}
                  aria-pressed={selectedShiftId === shift.shift.id}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedShiftId === shift.shift.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {shift.day}, {shift.shift.date}
                      </p>
                      <p className="text-sm text-gray-600">{shift.categoryLabel}</p>
                    </div>
                    {selectedShiftId === shift.shift.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
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
