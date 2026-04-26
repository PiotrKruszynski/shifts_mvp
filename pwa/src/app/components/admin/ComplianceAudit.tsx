import { useState } from "react";
import { Shield, Download, Filter, Calendar, AlertCircle, CheckCircle } from "lucide-react";

interface AuditEvent {
  id: string;
  timestamp: string;
  category: "Access" | "Change" | "Security" | "Compliance";
  severity: "Info" | "Warning" | "Critical";
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
  details: string;
}

export function ComplianceAudit() {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const events: AuditEvent[] = [
    {
      id: "1",
      timestamp: "2026-04-24 15:32:18",
      category: "Change",
      severity: "Info",
      user: "Koordynator - Jan Kowalski",
      action: "Opublikował grafik",
      resource: "Grafik Maj 2026 - Oddział Chirurgii",
      ipAddress: "192.168.1.45",
      details: "Status zmieniony z Wygenerowany na Opublikowany. Powiadomienia wysłane do 24 lekarzy.",
    },
    {
      id: "2",
      timestamp: "2026-04-24 14:22:05",
      category: "Compliance",
      severity: "Warning",
      user: "Koordynator - Jan Kowalski",
      action: "Nadpisał miękką regułę",
      resource: "Grafik Maj 2026",
      ipAddress: "192.168.1.45",
      details:
        "Przypisał Dr Piotr Zieliński do dyżuru 10.05.2026 mimo preferencji 'Niepreferowany' (Kategoria II). Uzasadnienie: Brak alternatywnych lekarzy z wymaganymi kwalifikacjami.",
    },
    {
      id: "3",
      timestamp: "2026-04-24 10:15:33",
      category: "Access",
      severity: "Info",
      user: "Admin - Piotr Admin",
      action: "Zmienił rolę użytkownika",
      resource: "Użytkownik: Maria Nowak",
      ipAddress: "192.168.1.12",
      details: "Zmieniono rolę z 'Lekarz' na 'Koordynator' dla oddziału Neurologii.",
    },
    {
      id: "4",
      timestamp: "2026-04-23 16:45:22",
      category: "Security",
      severity: "Critical",
      user: "System",
      action: "Wykryto nieautoryzowaną próbę dostępu",
      resource: "API Endpoint: /admin/users",
      ipAddress: "203.0.113.42",
      details:
        "Zablokowano próbę dostępu do panelu administracyjnego z konta bez odpowiednich uprawnień. IP dodane do listy obserwowanych.",
    },
    {
      id: "5",
      timestamp: "2026-04-23 14:30:11",
      category: "Compliance",
      severity: "Warning",
      user: "Koordynator - Jan Kowalski",
      action: "Zatwierdził zamianę z ostrzeżeniem",
      resource: "Zamiana dyżurów",
      ipAddress: "192.168.1.45",
      details:
        "Zaakceptowano zamianę między Dr Anna Kowalska i Dr Jan Nowak. System wykrył zbliżenie do limitu tygodniowego dla Dr Kowalska (44h/48h).",
    },
  ];

  const severityColors = {
    Info: "bg-blue-100 text-blue-800 border-blue-300",
    Warning: "bg-amber-100 text-amber-800 border-amber-300",
    Critical: "bg-red-100 text-red-800 border-red-300",
  };

  const categoryColors = {
    Access: "bg-purple-100 text-purple-800",
    Change: "bg-blue-100 text-blue-800",
    Security: "bg-red-100 text-red-800",
    Compliance: "bg-amber-100 text-amber-800",
  };

  const filteredEvents = events.filter((event) => {
    if (filterCategory !== "all" && event.category !== filterCategory) return false;
    if (filterSeverity !== "all" && event.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Logi audytowe i zgodność</h1>
          <p className="text-gray-600 mt-2">Przegląd operacji systemowych i bezpieczeństwa</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap">
          <Download className="w-5 h-5" />
          Eksportuj logi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Wszystkie zdarzenia</h3>
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{events.length}</p>
          <p className="text-sm text-gray-600 mt-1">ostatnie 24h</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Krytyczne</h3>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {events.filter((e) => e.severity === "Critical").length}
          </p>
          <p className="text-sm text-gray-600 mt-1">wymaga uwagi</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Ostrzeżenia</h3>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {events.filter((e) => e.severity === "Warning").length}
          </p>
          <p className="text-sm text-gray-600 mt-1">do przeglądu</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Zgodność</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">98%</p>
          <p className="text-sm text-gray-600 mt-1">w tym miesiącu</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj w logach..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Wszystkie kategorie</option>
            <option value="Access">Dostęp</option>
            <option value="Change">Zmiany</option>
            <option value="Security">Bezpieczeństwo</option>
            <option value="Compliance">Zgodność</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Wszystkie poziomy</option>
            <option value="Info">Informacja</option>
            <option value="Warning">Ostrzeżenie</option>
            <option value="Critical">Krytyczne</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Historia zdarzeń</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{event.action}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          severityColors[event.severity]
                        }`}
                      >
                        {event.severity}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${categoryColors[event.category]}`}>
                        {event.category}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {event.timestamp}
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Użytkownik:</span> {event.user}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Zasób:</span> {event.resource}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">IP:</span> {event.ipAddress}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">{event.details}</p>
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
            <h3 className="text-sm font-medium text-blue-900">Informacja o logach audytowych</h3>
            <p className="text-sm text-blue-700 mt-1">
              Wszystkie logi są przechowywane w sposób niezmienny i nie mogą być edytowane ani
              usuwane. Zapewnia to pełną audytowalność i zgodność z wymogami prawnymi. Logi są
              automatycznie archiwizowane po 365 dniach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
