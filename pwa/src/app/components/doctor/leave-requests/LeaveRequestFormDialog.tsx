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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-request-dialog-title"
        aria-describedby="leave-request-dialog-description"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white"
      >
        <div className="p-6">
          <h3 id="leave-request-dialog-title" className="mb-2 text-xl font-semibold text-gray-900">
            Nowy wniosek urlopowy
          </h3>
          <p id="leave-request-dialog-description" className="mb-4 text-sm text-gray-600">
            Wybierz typ nieobecności i zakres dat, a potem dodaj komentarz, jeśli chcesz.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="leave-request-type" className="mb-2 block text-sm font-medium text-gray-700">
                Typ nieobecności
              </label>
              <select
                id="leave-request-type"
                value={formData.type}
                onChange={(event) => setFormData({ ...formData, type: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Urlop wypoczynkowy">Urlop wypoczynkowy</option>
                <option value="Urlop na żądanie">Urlop na żądanie</option>
                <option value="Urlop okolicznościowy">Urlop okolicznościowy</option>
                <option value="Zwolnienie lekarskie">Zwolnienie lekarskie</option>
              </select>
            </div>

            <div>
              <label htmlFor="leave-request-start-date" className="mb-2 block text-sm font-medium text-gray-700">
                Data początkowa
              </label>
              <input
                id="leave-request-start-date"
                type="date"
                value={formData.startDate}
                onChange={(event) => setFormData({ ...formData, startDate: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="leave-request-end-date" className="mb-2 block text-sm font-medium text-gray-700">
                Data końcowa
              </label>
              <input
                id="leave-request-end-date"
                type="date"
                value={formData.endDate}
                min={formData.startDate || undefined}
                onChange={(event) => setFormData({ ...formData, endDate: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="leave-request-comment" className="mb-2 block text-sm font-medium text-gray-700">
                Komentarz
              </label>
              <textarea
                id="leave-request-comment"
                value={formData.comment}
                onChange={(event) => setFormData({ ...formData, comment: event.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Dodatkowe informacje..."
              />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Złóż wniosek
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
