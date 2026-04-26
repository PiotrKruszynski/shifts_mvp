import { useState } from "react";
import { Calendar, Save, Info } from "lucide-react";

type AvailabilityStatus = "available" | "unavailable" | "preferred" | "not-preferred" | "leave-pending" | "leave-approved";

interface DayAvailability {
  date: string;
  status: AvailabilityStatus;
  category: "I" | "II" | "III" | null;
  comment: string;
}

export function MyAvailability() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({
    "2026-05-01": { date: "2026-05-01", status: "preferred", category: "I", comment: "" },
    "2026-05-10": { date: "2026-05-10", status: "unavailable", category: null, comment: "Wizyta lekarska" },
    "2026-05-15": { date: "2026-05-15", status: "leave-approved", category: null, comment: "" },
  });
  const [pendingChanges, setPendingChanges] = useState<Record<string, DayAvailability>>({});

  const deadlineDate = new Date("2026-04-28");
  const deadlinePassed = Date.now() > deadlineDate.getTime();

  const statusColors: Record<AvailabilityStatus, string> = {
    available: "bg-green-100 border-green-300 text-green-800",
    unavailable: "bg-red-100 border-red-300 text-red-800",
    preferred: "bg-blue-100 border-blue-300 text-blue-800",
    "not-preferred": "bg-amber-100 border-amber-300 text-amber-800",
    "leave-pending": "bg-purple-100 border-purple-300 text-purple-800",
    "leave-approved": "bg-green-100 border-green-300 text-green-800",
  };

  const statusLabels: Record<AvailabilityStatus, string> = {
    available: "Dostępny",
    unavailable: "Niedostępny",
    preferred: "Preferowany",
    "not-preferred": "Niepreferowany",
    "leave-pending": "Urlop oczekujący",
    "leave-approved": "Urlop zaakceptowany",
  };

  const generateCalendarDays = () => {
    const days = [];
    const year = 2026;
    const month = 4; // May (0-indexed)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${year}-0${month + 1}-${day.toString().padStart(2, "0")}`;
      days.push({ date: dateStr, dayOfWeek: date.getDay(), dayOfMonth: day });
    }

    return days;
  };

  const days = generateCalendarDays();
  const selectedDay = selectedDate ? (pendingChanges[selectedDate] || availability[selectedDate]) : null;

  const handleDayClick = (dateStr: string) => {
    if (deadlinePassed) return;
    setSelectedDate(dateStr);
    if (!availability[dateStr] && !pendingChanges[dateStr]) {
      setPendingChanges({
        ...pendingChanges,
        [dateStr]: { date: dateStr, status: "available", category: null, comment: "" },
      });
    }
  };

  const updateSelectedDay = (updates: Partial<DayAvailability>) => {
    if (!selectedDate || deadlinePassed) return;
    const currentData = pendingChanges[selectedDate] || availability[selectedDate];
    setPendingChanges({
      ...pendingChanges,
      [selectedDate]: { ...currentData, ...updates },
    });
  };

  const handleSave = () => {
    if (deadlinePassed) return;
    setAvailability((prev) => ({
      ...prev,
      ...pendingChanges,
    }));
    setPendingChanges({});
  };

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Moja dostępność</h2>
        <p className="text-gray-600 mt-1">Maj 2026</p>
      </div>

      {deadlinePassed ? (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Termin zgłoszeń minął</h3>
              <p className="text-sm text-red-700 mt-1">
                Deadline upłynął {deadlineDate.toLocaleDateString("pl-PL")}. Nie można już edytować dostępności.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Deadline: {deadlineDate.toLocaleDateString("pl-PL")}</h3>
              <p className="text-sm text-blue-700 mt-1">
                Uzupełnij swoją dostępność przed tym terminem
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Kalendarz</h3>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map(({ date, dayOfWeek, dayOfMonth }) => {
              const dayData = availability[date];
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const isSelected = selectedDate === date;

              return (
                <button
                  key={date}
                  onClick={() => handleDayClick(date)}
                  disabled={deadlinePassed}
                  className={`aspect-square p-1 rounded-lg border-2 text-sm transition-all ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : dayData
                      ? `border-transparent ${statusColors[dayData.status]}`
                      : isWeekend
                      ? "border-gray-200 bg-gray-50 text-gray-900"
                      : "border-gray-200 hover:border-gray-300 text-gray-900"
                  } ${deadlinePassed ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                >
                  <div className="font-medium">{dayOfMonth}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Legenda</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(statusLabels).map(([status, label]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 ${statusColors[status as AvailabilityStatus]}`}></div>
              <span className="text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedDay && !deadlinePassed && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Szczegóły dnia: {selectedDate}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status dostępności
              </label>
              <select
                value={selectedDay.status}
                onChange={(e) => updateSelectedDay({ status: e.target.value as AvailabilityStatus })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="available">Dostępny</option>
                <option value="unavailable">Niedostępny</option>
                <option value="preferred">Preferowany</option>
                <option value="not-preferred">Niepreferowany</option>
              </select>
            </div>

            {(selectedDay.status === "preferred" || selectedDay.status === "not-preferred") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoria preferencji
                </label>
                <select
                  value={selectedDay.category || ""}
                  onChange={(e) => updateSelectedDay({ category: (e.target.value || null) as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Wybierz kategorię</option>
                  <option value="I">I - Wysoki priorytet</option>
                  <option value="II">II - Średni priorytet</option>
                  <option value="III">III - Niski priorytet</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Komentarz (opcjonalnie)
              </label>
              <textarea
                value={selectedDay.comment}
                onChange={(e) => updateSelectedDay({ comment: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dodaj notatkę..."
              />
            </div>
          </div>
        </div>
      )}

      {!deadlinePassed && (
        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Zapisz dostępność
        </button>
      )}
    </div>
  );
}
