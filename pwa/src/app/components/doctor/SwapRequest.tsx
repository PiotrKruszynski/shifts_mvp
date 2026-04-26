import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, RefreshCw } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { swapRequestService } from "../../../services/swapRequestService";
import { DoctorShiftStep } from "./swap-request/DoctorShiftStep";
import { OwnShiftStep } from "./swap-request/OwnShiftStep";
import { SwapStepProgress } from "./swap-request/SwapStepProgress";
import { SwapSummaryStep } from "./swap-request/SwapSummaryStep";

interface SwapRequestLocationState {
  selectedShiftId?: string;
  from?: string;
}

export function SwapRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as SwapRequestLocationState | null) ?? null;
  const formState = useAsyncResource(() => swapRequestService.getDoctorSwapFormData(), []);

  const [step, setStep] = useState(1);
  const [selectedMyShift, setSelectedMyShift] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedTheirShift, setSelectedTheirShift] = useState<string | null>(null);

  useEffect(() => {
    if (formState.status !== "success" || selectedMyShift !== null || !locationState?.selectedShiftId) {
      return;
    }

    const initialShiftId = formState.data.myShifts.some(
      (shift) => shift.shift.id === locationState.selectedShiftId,
    )
      ? locationState.selectedShiftId
      : null;

    if (initialShiftId) {
      setSelectedMyShift(initialShiftId);
      setStep(2);
    }
  }, [formState, locationState, selectedMyShift]);

  const handleSubmit = async () => {
    await swapRequestService.createSwapRequest(myShift?.assignment.id, doctor?.id, theirShift?.assignment.id);
    navigate("/doctor");
  };

  const handleBackToSource = () => {
    navigate(locationState?.from ?? "/doctor/schedule");
  };

  if (formState.status === "loading") {
    return <div className="p-4 pb-20 md:pb-4 text-gray-600">Ładowanie formularza zamiany...</div>;
  }

  if (formState.status === "error") {
    return <div className="p-4 pb-20 md:pb-4 text-red-700">{formState.error}</div>;
  }

  const { myShifts, doctors, enabled, scheduleStatus } = formState.data;
  const myShift = myShifts.find((shift) => shift.shift.id === selectedMyShift);
  const doctor = doctors.find((item) => item.id === selectedDoctor);
  const theirShift = doctor?.shifts.find((shift) => shift.shift.id === selectedTheirShift);

  if (!enabled || scheduleStatus !== "PUBLISHED") {
    return (
      <div className="p-4 pb-20 md:pb-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Zamiana niedostępna</h2>
              <p className="mt-2 text-sm text-gray-700">
                Zgodnie z architekturą produktu zamiany dyżurów są dostępne dopiero po publikacji grafiku.
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
              <ArrowLeft className="h-4 w-4" />
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
          <h2 className="text-2xl font-semibold text-gray-900">Zamiana dyżuru</h2>
          <p className="mt-1 text-gray-600">Zaproponuj zamianę z innym lekarzem po publikacji grafiku.</p>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <RefreshCw className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="min-w-0">
              <h3 className="font-medium text-blue-900">Jak działa ten proces</h3>
              <p className="mt-1 text-sm text-blue-800">
                Najpierw wybierasz swój dyżur, potem dyżur drugiego lekarza. Po akceptacji drugiego lekarza zamiana trafia do Koordynatora.
              </p>
              {locationState?.selectedShiftId && (
                <p className="mt-2 text-sm font-medium text-blue-900">
                  Dyżur został wstępnie wybrany z listy w "Moim grafiku".
                </p>
              )}
            </div>
          </div>
        </div>

        <SwapStepProgress step={step} />

        {myShifts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Brak dyżurów do zamiany</h3>
            <p className="mt-2 text-sm text-gray-600">
              W tym grafiku nie masz jeszcze dyżuru, który można zgłosić do zamiany.
            </p>
            <button
              type="button"
              onClick={handleBackToSource}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Wróć
            </button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <OwnShiftStep
                shifts={myShifts}
                selectedShiftId={selectedMyShift}
                onSelectShift={(shiftId) => {
                  setSelectedMyShift(shiftId);
                  setSelectedDoctor(null);
                  setSelectedTheirShift(null);
                }}
                onBack={handleBackToSource}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <DoctorShiftStep
                doctors={doctors}
                selectedShiftId={selectedTheirShift}
                onSelectShift={(doctorId, shiftId) => {
                  setSelectedDoctor(doctorId);
                  setSelectedTheirShift(shiftId);
                }}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && myShift && theirShift && doctor ? (
              <SwapSummaryStep
                myShift={myShift}
                doctor={doctor}
                theirShift={theirShift}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
              />
            ) : null}

            {step === 2 && doctors.length > 0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Pamiętaj o zgodności</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Koordynator zatwierdzi tylko zamianę zgodną z twardymi ograniczeniami: odpoczynkiem, limitami godzin i urlopami.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
