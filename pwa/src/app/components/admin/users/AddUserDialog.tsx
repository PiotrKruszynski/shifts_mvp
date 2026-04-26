interface AddUserDialogProps {
  onClose: () => void;
}

export function AddUserDialog({ onClose }: AddUserDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-dialog-title"
        aria-describedby="add-user-dialog-description"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        <h3 id="add-user-dialog-title" className="mb-2 text-lg font-semibold text-gray-900">
          Dodaj użytkownika
        </h3>
        <p id="add-user-dialog-description" className="mb-4 text-sm text-gray-600">
          Utwórz konto i przypisz podstawową rolę w systemie.
        </p>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onClose();
          }}
        >
          <div>
            <label htmlFor="new-user-name" className="mb-2 block text-sm font-medium text-gray-700">
              Imię i nazwisko
            </label>
            <input
              id="new-user-name"
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Jan Kowalski"
            />
          </div>

          <div>
            <label htmlFor="new-user-email" className="mb-2 block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="new-user-email"
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="j.kowalski@hospital.pl"
            />
          </div>

          <div>
            <label htmlFor="new-user-role" className="mb-2 block text-sm font-medium text-gray-700">
              Rola
            </label>
            <select
              id="new-user-role"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                Wybierz rolę
              </option>
              <option value="Admin">Admin</option>
              <option value="Koordynator">Koordynator</option>
              <option value="Lekarz">Lekarz</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Dodaj użytkownika
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
