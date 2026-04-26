import { useState } from "react";
import { useParams, Link } from "react-router";
import { AlertCircle, CheckCircle, Calendar, Download, Save } from "lucide-react";
import { ScheduleStatusBadge } from "../shared/ScheduleStatusBadge";

interface Shift {
  date: string;
  doctor: string | null;
  category: "Weekday" | "Weekend" | "Holiday";
  valid: boolean;
  issues: string[];
}

export function ScheduleEditor() {
  const { id } = useParams();
  const [showPublish, setShowPublish] = useState(false);

  const shifts: Shift[] = [
    { date: "2026-05-01", doctor: "Dr Anna Kowalska", category: "Holiday", valid: true, issues: [] },
    { date: "2026-05-02", doctor: "Dr Jan Nowak", category: "Weekend", valid: true, issues: [] },
    { date: "2026-05-03", doctor: "Dr Maria Wiśniewska", category: "Weekend", valid: true, issues: [] },
    { date: "2026-05-04", doctor: null, category: "Weekday", valid: false, issues: ["Nieobsadzony dyżur"] },
    { date: "2026-05-05", doctor: "Dr Piotr Zieliński", category: "Weekday", valid: true, issues: [] },
    { date: "2026-05-06", doctor: "Dr Katarzyna Lewandowska", category: "Weekday", valid: false, issues: ["Naruszenie odpoczynku 11h"] },
    { date: "2026-05-07", doctor: "Dr Tomasz Kamiński", category: "Weekday", valid: true, issues: [] },
  ];

  const validShifts = shifts.filter((s) => s.valid).length;
  const totalShifts = shifts.length;
  const allValid = validShifts === totalShifts;

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link to="/coordinator/schedules" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Powrót do grafików
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Edytor grafiku</h1>
          <p className="text-gray-600 mt-2">Maj 2026 (01.05.2026 - 31.05.2026)</p>
        </div>
        <ScheduleStatusBadge status="Wygenerowany" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Zgodność</span>
            {allValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {validShifts}/{totalShifts}
          </p>
          <p className="text-xs text-gray-600 mt-1">dyżurów bez konfliktów</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Nieobsadzone</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">1</p>
          <p className="text-xs text-gray-600 mt-1">dyżurów wymaga obsady</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Konflikty</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">1</p>
          <p className="text-xs text-gray-600 mt-1">naruszeń wymaga korekty</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Lekarze</span>
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">24</p>
          <p className="text-xs text-gray-600 mt-1">aktywnych w grafiku</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Kalendarz dyżurów</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 inline mr-1" />
                Eksportuj
              </button>
              <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Save className="w-4 h-4 inline mr-1" />
                Zapisz korekty
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {shifts.map((shift) => {
              const date = new Date(shift.date);
              const dayOfWeek = date.getDay();
              const dayOfMonth = date.getDate();

              return (
                <div
                  key={shift.date}
                  className={`border rounded-lg p-3 min-h-[120px] ${
                    !shift.valid
                      ? "border-red-300 bg-red-50"
                      : shift.category === "Weekend" || shift.category === "Holiday"
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-white"
                  } hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-lg font-semibold text-gray-900">{dayOfMonth}</span>
                    {shift.category === "Holiday" && (
                      <span className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 rounded">
                        Święto
                      </span>
                    )}
                    {shift.category === "Weekend" && (
                      <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                        Weekend
                      </span>
                    )}
                  </div>

                  {shift.doctor ? (
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 truncate">{shift.doctor}</p>
                      <p className="text-xs text-gray-600 mt-1">00:00 - 23:59</p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">Nieobsadzony</div>
                  )}

                  {shift.issues.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      {shift.issues.map((issue, idx) => (
                        <p key={idx} className="text-xs text-red-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          {issue}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Panel walidacji</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Nieobsadzony dyżur</p>
              <p className="text-sm text-red-700">4 maja 2026 - wymaga przypisania lekarza</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">Naruszenie odpoczynku 11h</p>
              <p className="text-sm text-amber-700">
                Dr Katarzyna Lewandowska - 6 maja 2026 (mniej niż 11h od poprzedniego dyżuru)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setShowPublish(true)}
          disabled={!allValid}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            allValid
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Publikuj grafik
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          Uruchom ponownie generator
        </button>
      </div>

      {showPublish && (
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
                onClick={() => setShowPublish(false)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Publikuj
              </button>
              <button
                onClick={() => setShowPublish(false)}
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
