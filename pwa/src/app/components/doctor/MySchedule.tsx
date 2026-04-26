import { useState } from "react";
import { Calendar, List, RefreshCw, AlertCircle } from "lucide-react";
import { Link } from "react-router";

interface Shift {
  id: string;
  date: string;
  day: string;
  hours: string;
  department: string;
  category: "Weekday" | "Weekend" | "Holiday";
  categoryDay: string;
  status: "Published";
  canSwap: boolean;
}

export function MySchedule() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const shifts: Shift[] = [
    {
      id: "1",
      date: "2026-05-01",
      day: "Czwartek",
      hours: "00:00 - 23:59",
      department: "Oddział Chirurgii",
      category: "Holiday",
      categoryDay: "Święto Pracy",
      status: "Published",
      canSwap: true,
    },
    {
      id: "2",
      date: "2026-05-08",
      day: "Piątek",
      hours: "00:00 - 23:59",
      department: "Oddział Chirurgii",
      category: "Weekday",
      categoryDay: "Dzień powszedni",
      status: "Published",
      canSwap: true,
    },
    {
      id: "3",
      date: "2026-05-16",
      day: "Sobota",
      hours: "00:00 - 23:59",
      department: "Oddział Chirurgii",
      category: "Weekend",
      categoryDay: "Weekend",
      status: "Published",
      canSwap: true,
    },
    {
      id: "4",
      date: "2026-05-23",
      day: "Sobota",
      hours: "00:00 - 23:59",
      department: "Oddział Chirurgii",
      category: "Weekend",
      categoryDay: "Weekend",
      status: "Published",
      canSwap: true,
    },
  ];

  const categoryColors = {
    Weekday: "bg-gray-100 text-gray-800",
    Weekend: "bg-blue-100 text-blue-800",
    Holiday: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Mój grafik</h2>
        <p className="text-gray-600 mt-1">Maj 2026 - Przypisane dyżury</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Lista
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "calendar"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Kalendarz
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Łącznie dyżurów</p>
          <p className="text-2xl font-semibold text-gray-900">{shifts.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Weekendy</p>
          <p className="text-2xl font-semibold text-gray-900">
            {shifts.filter((s) => s.category === "Weekend").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Święta</p>
          <p className="text-2xl font-semibold text-gray-900">
            {shifts.filter((s) => s.category === "Holiday").length}
          </p>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="space-y-3">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{shift.day}</h3>
                  <p className="text-sm text-gray-600">{shift.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[shift.category]}`}>
                  {shift.categoryDay}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{shift.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="font-medium">{shift.department}</span>
                </div>
              </div>

              {shift.canSwap && (
                <Link
                  to="/doctor/swap-request"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Zaproponuj zamianę
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const dateStr = `2026-05-${day.toString().padStart(2, "0")}`;
                const shift = shifts.find((s) => s.date === dateStr);
                const dayOfWeek = new Date(2026, 4, day).getDay();

                return (
                  <div
                    key={day}
                    className={`aspect-square p-2 rounded-lg border-2 ${
                      shift
                        ? `border-transparent ${categoryColors[shift.category]}`
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{day}</div>
                    {shift && (
                      <div className="text-[10px] mt-1 leading-tight">
                        Dyżur
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{shift.day}</h3>
                    <p className="text-sm text-gray-600">{shift.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[shift.category]}`}>
                    {shift.categoryDay}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{shift.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-medium">{shift.department}</span>
                  </div>
                </div>

                {shift.canSwap && (
                  <Link
                    to="/doctor/swap-request"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Zaproponuj zamianę
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Informacja</h3>
            <p className="text-sm text-blue-700 mt-1">
              Akcja zamiany jest dostępna tylko dla opublikowanych grafików. Po zaakceptowaniu przez drugiego lekarza, zamiana wymaga zatwierdzenia przez Koordynatora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
