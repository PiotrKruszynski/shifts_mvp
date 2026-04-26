import { Shield, Filter, Download, User, FileText } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { auditService } from "../../../services/auditService";

export function Audit() {
  const auditState = useAsyncResource(() => auditService.listScheduleAuditEvents(), []);

  const typeColors = {
    Create: "bg-blue-100 text-blue-800 border-blue-300",
    Update: "bg-gray-100 text-gray-800 border-gray-300",
    Generate: "bg-purple-100 text-purple-800 border-purple-300",
    Publish: "bg-green-100 text-green-800 border-green-300",
    Swap: "bg-amber-100 text-amber-800 border-amber-300",
    Override: "bg-red-100 text-red-800 border-red-300",
  };

  const typeLabels = {
    Create: "Utworzenie",
    Update: "Aktualizacja",
    Generate: "Generowanie",
    Publish: "Publikacja",
    Swap: "Zamiana",
    Override: "Nadpisanie",
  };

  if (auditState.status === "loading") {
    return <div className="p-8 text-gray-600">Ładowanie audytu grafiku...</div>;
  }

  if (auditState.status === "error") {
    return <div className="p-8 text-red-700">{auditState.error}</div>;
  }

  const events = auditState.data;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Audyt grafiku</h1>
          <p className="text-gray-600 mt-2">Historia zmian i operacji systemowych</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          <Download className="w-5 h-5" />
          Eksportuj logi
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj w logach..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Wszystkie typy</option>
            <option value="Create">Utworzenie</option>
            <option value="Update">Aktualizacja</option>
            <option value="Generate">Generowanie</option>
            <option value="Publish">Publikacja</option>
            <option value="Swap">Zamiana</option>
            <option value="Override">Nadpisanie</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Wszyscy użytkownicy</option>
            <option value="coordinator">Koordynator</option>
            <option value="doctor">Lekarze</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Timeline zdarzeń</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {events.map((event) => (
            <div key={event.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{event.action}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          typeColors[event.type]
                        }`}
                      >
                        {typeLabels[event.type]}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{event.timestamp}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{event.user}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{event.entity}</span>
                    </div>

                    {event.details && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900">{event.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Informacja o audycie</h3>
            <p className="text-sm text-blue-700 mt-1">
              Logi audytowe są tylko do odczytu i nie mogą być edytowane ani usuwane.
              Wszystkie operacje są automatycznie rejestrowane w systemie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
