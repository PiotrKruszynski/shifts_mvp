import { CheckCircle } from "lucide-react";

interface PublishScheduleDialogProps {
  onClose: () => void;
}

export function PublishScheduleDialog({ onClose }: PublishScheduleDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Publikuj grafik</h3>

        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-900">Wszystkie dyżury obsadzone</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-900">Brak konfliktów walidacji</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-900">Zgodność z limitami prawnymi</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-900 font-medium">Uwaga</p>
          <p className="text-sm text-amber-800 mt-1">
            Po publikacji zmiany będą możliwe tylko przez procedurę zamiany dyżurów
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Publikuj
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
