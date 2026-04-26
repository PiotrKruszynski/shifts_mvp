import { useState } from "react";
import { useNavigate } from "react-router";
import {
  mySwapShiftOptionsFixture,
  swapDoctorOptionsFixture,
} from "../../../fixtures/swaps.fixture";
import { DoctorShiftStep } from "./swap-request/DoctorShiftStep";
import { OwnShiftStep } from "./swap-request/OwnShiftStep";
import { SwapStepProgress } from "./swap-request/SwapStepProgress";
import { SwapSummaryStep } from "./swap-request/SwapSummaryStep";

export function SwapRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedMyShift, setSelectedMyShift] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedTheirShift, setSelectedTheirShift] = useState<string | null>(null);

  const handleSubmit = () => {
    navigate("/doctor");
  };

  const myShift = mySwapShiftOptionsFixture.find((shift) => shift.shift.id === selectedMyShift);
  const doctor = swapDoctorOptionsFixture.find((item) => item.id === selectedDoctor);
  const theirShift = doctor?.shifts.find((shift) => shift.shift.id === selectedTheirShift);

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Zamiana dyżuru</h2>
        <p className="text-gray-600 mt-1">Zaproponuj zamianę z innym lekarzem</p>
      </div>

      <SwapStepProgress step={step} />

      {step === 1 && (
        <OwnShiftStep
          shifts={mySwapShiftOptionsFixture}
          selectedShiftId={selectedMyShift}
          onSelectShift={setSelectedMyShift}
          onBack={() => navigate("/doctor")}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <DoctorShiftStep
          doctors={swapDoctorOptionsFixture}
          selectedShiftId={selectedTheirShift}
          onSelectShift={(doctorId, shiftId) => {
            setSelectedDoctor(doctorId);
            setSelectedTheirShift(shiftId);
          }}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && myShift && theirShift && doctor && (
        <SwapSummaryStep
          myShift={myShift}
          doctor={doctor}
          theirShift={theirShift}
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
