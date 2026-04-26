interface SwapStepProgressProps {
  step: number;
}

export function SwapStepProgress({ step }: SwapStepProgressProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center flex-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div
              className={`flex-1 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
