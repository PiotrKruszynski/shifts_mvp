import { useState } from "react";
import { Building2, Plus, User, History } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { departmentService } from "../../../services/departmentService";

export function Departments() {
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAssignCoordinator, setShowAssignCoordinator] = useState<string | null>(null);
  const departmentsState = useAsyncResource(
    async () => ({
      departments: await departmentService.listDepartmentCoordinatorSummaries(),
      availableCoordinators: await departmentService.listAvailableCoordinators(),
    }),
    [],
  );

  if (departmentsState.status === "loading") {
    return <div className="p-4 md:p-8 text-gray-600">Ładowanie oddziałów...</div>;
  }

  if (departmentsState.status === "error") {
    return <div className="p-4 md:p-8 text-red-700">{departmentsState.error}</div>;
  }

  const { departments, availableCoordinators } = departmentsState.data;

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Oddziały i Koordynatorzy</h1>
          <p className="text-gray-600 mt-2">Zarządzaj oddziałami i przypisaniami koordynatorów</p>
        </div>
        <button
          onClick={() => setShowAddDepartment(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Dodaj oddział
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Wszystkie oddziały</h3>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{departments.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Z koordynatorami</h3>
            <User className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {departments.filter((d) => d.coordinator).length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Bez koordynatorów</h3>
            <User className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {departments.filter((d) => !d.coordinator).length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  {dept.name}
                </h3>
              </div>
              <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                Edytuj
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aktywny koordynator</p>
                {dept.coordinator ? (
                  <div>
                    <p className="font-medium text-gray-900">{dept.coordinator}</p>
                    <p className="text-sm text-gray-600">{dept.coordinatorEmail}</p>
                    {dept.assignedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Przypisany: {dept.assignedAt}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-600 font-medium">Brak przypisania</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Lekarze</p>
                <p className="text-2xl font-semibold text-gray-900">{dept.doctorsCount}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Aktywne grafiki</p>
                <p className="text-2xl font-semibold text-gray-900">{dept.activeSchedules}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignCoordinator(dept.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <User className="w-4 h-4 inline mr-2" />
                {dept.coordinator ? "Zmień koordynatora" : "Przypisz koordynatora"}
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                <History className="w-4 h-4 inline mr-2" />
                Historia przypisań
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Ważna informacja</h3>
        <p className="text-sm text-blue-800">
          Tylko jeden aktywny koordynator może edytować grafiki danego oddziału. Zmiana koordynatora
          spowoduje przeniesienie uprawnień do nowego użytkownika, a poprzedni koordynator utraci dostęp
          do edycji grafików tego oddziału.
        </p>
      </div>

      {showAddDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodaj oddział</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nazwa oddziału
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Oddział Pediatrii"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Dodaj oddział
              </button>
              <button
                onClick={() => setShowAddDepartment(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignCoordinator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Przypisz koordynatora</h3>

            <div className="space-y-3 mb-6">
              {availableCoordinators.map((coord) => (
                <button
                  key={coord.id}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <p className="font-medium text-gray-900">{coord.name}</p>
                  <p className="text-sm text-gray-600">{coord.email}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Zatwierdź
              </button>
              <button
                onClick={() => setShowAssignCoordinator(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
