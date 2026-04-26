import { useState } from "react";
import { useParams, Link } from "react-router";
import { Mail, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import { ScheduleStatusBadge } from "../shared/ScheduleStatusBadge";

export function AvailabilityCollection() {
  const { id } = useParams();
  const [showReminder, setShowReminder] = useState(false);

  const doctors = [
    { id: 1, name: "Dr Anna Kowalska", status: "Zaakceptowane" as const, submittedAt: "2026-04-20" },
    { id: 2, name: "Dr Jan Nowak", status: "Zaakceptowane" as const, submittedAt: "2026-04-19" },
    { id: 3, name: "Dr Maria Wiśniewska", status: "Oczekuje" as const, submittedAt: null },
    { id: 4, name: "Dr Piotr Zieliński", status: "Zaakceptowane" as const, submittedAt: "2026-04-21" },
    { id: 5, name: "Dr Katarzyna Lewandowska", status: "Oczekuje" as const, submittedAt: null },
    { id: 6, name: "Dr Tomasz Kamiński", status: "Zaakceptowane" as const, submittedAt: "2026-04-22" },
  ];

  const submitted = doctors.filter((d) => d.status === "Zaakceptowane").length;
  const total = doctors.length;
  const percentage = Math.round((submitted / total) * 100);

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link to="/coordinator/schedules" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Powrót do grafików
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Zbieranie dostępności</h1>
          <p className="text-gray-600 mt-2">Maj 2026 (01.05.2026 - 31.05.2026)</p>
        </div>
        <ScheduleStatusBadge status="Szkic" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Postęp zgłoszeń</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{percentage}%</p>
          <p className="text-sm text-gray-600 mt-2">
            {submitted} z {total} lekarzy
          </p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Deadline</h3>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">4 dni</p>
          <p className="text-sm text-gray-600 mt-2">28.04.2026</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Nieuzupełnione</h3>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{total - submitted}</p>
          <p className="text-sm text-gray-600 mt-2">lekarzy do uzupełnienia</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Lekarze</h2>
            <button
              onClick={() => setShowReminder(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              Wyślij przypomnienie
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Lekarz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Data zgłoszenia
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{doctor.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.status === "Zaakceptowane" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                        <CheckCircle className="w-3 h-3" />
                        Uzupełnione
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3 h-3" />
                        Oczekuje
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {doctor.submittedAt || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {doctor.status === "Zaakceptowane" ? (
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Zobacz dostępność
                      </button>
                    ) : (
                      <button className="text-gray-600 hover:text-gray-800 font-medium">
                        Wyślij przypomnienie
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to={`/coordinator/schedules/${id}/editor`}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Zamknij okno zgłoszeń i przejdź do generatora
        </Link>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Zapisz jako szkic
        </button>
      </div>

      {showReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Wyślij przypomnienie</h3>
            <p className="text-gray-600 mb-6">
              Czy chcesz wysłać przypomnienie do {total - submitted} lekarzy, którzy nie uzupełnili dostępności?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReminder(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Wyślij
              </button>
              <button
                onClick={() => setShowReminder(false)}
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
