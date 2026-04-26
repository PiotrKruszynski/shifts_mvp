import { useState } from "react";

interface LeaveRequestFormDialogProps {
  onClose: () => void;
}

export function LeaveRequestFormDialog({ onClose }: LeaveRequestFormDialogProps) {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    type: "Urlop wypoczynkowy",
    comment: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormData({ startDate: "", endDate: "", type: "Urlop wypoczynkowy", comment: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Nowy wniosek urlopowy</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typ nieobecności
              </label>
              <select
                value={formData.type}
                onChange={(event) => setFormData({ ...formData, type: event.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Urlop wypoczynkowy">Urlop wypoczynkowy</option>
                <option value="Urlop na żądanie">Urlop na żądanie</option>
                <option value="Urlop okolicznościowy">Urlop okolicznościowy</option>
                <option value="Zwolnienie lekarskie">Zwolnienie lekarskie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data początkowa
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(event) => setFormData({ ...formData, startDate: event.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data końcowa</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(event) => setFormData({ ...formData, endDate: event.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Komentarz (opcjonalnie)
              </label>
              <textarea
                value={formData.comment}
                onChange={(event) => setFormData({ ...formData, comment: event.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dodatkowe informacje..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Złóż wniosek
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
