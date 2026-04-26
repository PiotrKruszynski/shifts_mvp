import { AlertCircle } from "lucide-react";
import type { ConflictItem } from "../../../../domain/types";

interface ScheduleValidationPanelProps {
  conflicts: ConflictItem[];
}

export function ScheduleValidationPanel({ conflicts }: ScheduleValidationPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Panel walidacji</h3>

      <div className="space-y-3">
        {conflicts.map((conflict) => {
          const isBlocking = conflict.reasonCode === "NO_AVAILABLE_DOCTOR";

          return (
            <div
              key={conflict.id}
              className={`flex items-start gap-3 p-3 border rounded-lg ${
                isBlocking ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
              }`}
            >
              <AlertCircle
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  isBlocking ? "text-red-600" : "text-amber-600"
                }`}
              />
              <div>
                <p
                  className={`text-sm font-medium ${
                    isBlocking ? "text-red-900" : "text-amber-900"
                  }`}
                >
                  {isBlocking ? "Nieobsadzony dyżur" : "Naruszenie odpoczynku 11h"}
                </p>
                <p className={`text-sm ${isBlocking ? "text-red-700" : "text-amber-700"}`}>
                  {conflict.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
