interface SwapStepProgressProps {
  step: number;
}

export function SwapStepProgress({ step }: SwapStepProgressProps) {
  const steps = [
    { number: 1, label: "Twój dyżur" },
    { number: 2, label: "Drugi lekarz" },
    { number: 3, label: "Podsumowanie" },
  ];

  return (
    <ol aria-label="Postęp zgłoszenia zamiany" className="mb-6 grid grid-cols-3 gap-2">
      {steps.map(({ number, label }, index) => {
        const completed = step > number;
        const current = step === number;

        return (
          <li key={number} className="relative">
            {index < steps.length - 1 && (
              <div
                aria-hidden="true"
                className={`absolute left-[calc(50%+1.5rem)] top-5 hidden h-1 w-[calc(100%-2rem)] rounded-full sm:block ${
                  completed ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}

            <div className="flex flex-col items-center gap-2 text-center">
              <div
                aria-current={current ? "step" : undefined}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  current || completed ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {number}
              </div>
              <span className={`text-xs sm:text-sm ${current ? "font-medium text-gray-900" : "text-gray-600"}`}>
                {label}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
