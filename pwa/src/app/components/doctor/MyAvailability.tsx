import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, Info, Save } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import {
  availabilityService,
  type AvailabilityStatus,
  type DayAvailability,
} from "../../../services/availabilityService";

export function MyAvailability() {
  const availabilityState = useAsyncResource(() => availabilityService.getMyAvailability(), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<string, DayAvailability> | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, DayAvailability>>({});
  const [saveFeedbackVisible, setSaveFeedbackVisible] = useState(false);

  useEffect(() => {
    if (availabilityState.status === "success" && availability === null) {
      setAvailability(availabilityState.data.days);
    }
  }, [availabilityState, availability]);

  if (availabilityState.status === "error") {
    return <div className="p-4 pb-20 md:pb-4 text-red-700">{availabilityState.error}</div>;
  }

  if (availabilityState.status === "loading" || availability === null) {
    return <div className="p-4 pb-20 md:pb-4 text-gray-600">Ładowanie dostępności...</div>;
  }

  const { periodLabel, deadlineDate: deadlineDateString } = availabilityState.data;
  const deadlineDate = new Date(deadlineDateString);
  const deadlinePassed = Date.now() > deadlineDate.getTime();

  const statusColors: Record<AvailabilityStatus, string> = {
    available: "bg-gray-50 border-gray-200 text-gray-600",
    unavailable: "bg-red-100 border-red-300 text-red-800",
    preferred: "bg-green-100 border-green-300 text-green-800",
    "not-preferred": "bg-amber-100 border-amber-300 text-amber-800",
    "leave-pending": "bg-purple-100 border-purple-300 text-purple-800",
    "leave-approved": "bg-purple-200 border-purple-400 text-purple-900",
  };

  const statusLabels: Record<AvailabilityStatus, string> = {
    available: "Dostępny (domyślnie)",
    unavailable: "Nie mogę",
    preferred: "Chętnie",
    "not-preferred": "Niechętnie",
    "leave-pending": "Urlop (oczekuje)",
    "leave-approved": "Urlop (zatwierdzony)",
  };

  const generateCalendarDays = () => {
    const days = [];
    const year = 2026;
    const month = 4;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${year}-0${month + 1}-${day.toString().padStart(2, "0")}`;
      days.push({ date: dateStr, dayOfWeek: date.getDay(), dayOfMonth: day });
    }

    return days;
  };

  const days = generateCalendarDays();
  const selectedDay = selectedDate ? (pendingChanges[selectedDate] ?? availability[selectedDate]) : null;
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;
  const selectedDateLabel = selectedDate
    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString("pl-PL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const isSelectedDayManagedByLeave =
    selectedDay?.status === "leave-approved" || selectedDay?.status === "leave-pending";

  const handleDayClick = (dateStr: string) => {
    if (deadlinePassed) return;

    setSelectedDate(dateStr);
    setSaveFeedbackVisible(false);

    if (!availability[dateStr] && !pendingChanges[dateStr]) {
      setPendingChanges({
        ...pendingChanges,
        [dateStr]: { date: dateStr, status: "preferred", category: null, comment: "" },
      });
    }
  };

  const updateSelectedDay = (updates: Partial<DayAvailability>) => {
    if (!selectedDate || deadlinePassed || isSelectedDayManagedByLeave) return;

    const currentData = pendingChanges[selectedDate] ?? availability[selectedDate] ?? {
      date: selectedDate,
      status: "available" as const,
      category: null,
      comment: "",
    };

    setPendingChanges({
      ...pendingChanges,
      [selectedDate]: { ...currentData, ...updates },
    });
    setSaveFeedbackVisible(false);
  };

  const handleSave = async () => {
    if (deadlinePassed || !hasPendingChanges) return;

    const savedAvailability = await availabilityService.saveMyAvailability({
      ...availability,
      ...pendingChanges,
    });
    setAvailability(savedAvailability);
    setPendingChanges({});
    setSaveFeedbackVisible(true);
  };

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Moja dostępność</h2>
          <p className="mt-1 text-gray-600">{periodLabel}</p>
        </div>

        {deadlinePassed ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <h3 className="font-medium text-red-900">Termin zgłoszeń minął</h3>
                <p className="mt-1 text-sm text-red-700">
                  Deadline upłynął {deadlineDate.toLocaleDateString("pl-PL")}. Nie można już edytować dostępności.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex gap-3">
              <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Deadline: {deadlineDate.toLocaleDateString("pl-PL")}</h3>
                <p className="mt-1 text-sm text-blue-700">Wybierz dzień w kalendarzu i uzupełnij status lub preferencję.</p>
              </div>
            </div>
          </div>
        )}

        {saveFeedbackVisible && (
          <div aria-live="polite" className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Dostępność zapisana</h3>
                <p className="mt-1 text-sm text-green-700">Zmiany zostały zapisane dla wybranych dni.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
          <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Kalendarz</h3>
            </div>

            <div className="p-3 sm:p-4">
              <div className="mb-2 grid grid-cols-7 gap-1">
                {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"].map((day) => (
                  <div key={day} className="py-2 text-center text-[11px] font-medium text-gray-600 sm:text-xs">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map(({ date, dayOfWeek, dayOfMonth }) => {
                  const dayData = pendingChanges[date] ?? availability[date];
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const isSelected = selectedDate === date;
                  const label = dayData ? statusLabels[dayData.status] : "Brak ustawionego statusu";

                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => handleDayClick(date)}
                      disabled={deadlinePassed}
                      aria-pressed={isSelected}
                      aria-label={`${new Date(`${date}T12:00:00`).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "long",
                      })}, ${label}`}
                      className={`aspect-square min-h-11 rounded-lg border-2 p-1 text-sm transition-all sm:min-h-12 ${
                        isSelected
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : dayData
                            ? `border-transparent ${statusColors[dayData.status]}`
                            : isWeekend
                              ? "border-gray-200 bg-gray-50 text-gray-900"
                              : "border-gray-200 text-gray-900 hover:border-gray-300"
                      } ${deadlinePassed ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    >
                      <div className="font-medium">{dayOfMonth}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="space-y-4">
            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="mb-3 font-semibold text-gray-900">Legenda</h3>
              <div className="space-y-2 text-xs">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Twój wybór</p>
                {(["preferred", "not-preferred", "unavailable", "available"] as const).map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded border-2 ${statusColors[status]}`} />
                    <span className="text-gray-700">{statusLabels[status]}</span>
                  </div>
                ))}
                <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-gray-500">Systemowe</p>
                {(["leave-pending", "leave-approved"] as const).map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded border-2 ${statusColors[status]}`} />
                    <span className="text-gray-700">{statusLabels[status]}</span>
                  </div>
                ))}
              </div>
            </section>

            {!selectedDay && !deadlinePassed && (
              <section className="rounded-xl border border-dashed border-gray-300 bg-white p-4">
                <h3 className="font-semibold text-gray-900">Wybierz dzień</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Dotknij dzień w kalendarzu, aby ustawić dostępność, preferencję albo komentarz.
                </p>
              </section>
            )}

            {selectedDay && (
              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-1 font-semibold text-gray-900">Szczegóły dnia</h3>
                <p className="mb-4 text-sm text-gray-600 capitalize">{selectedDateLabel}</p>

                {isSelectedDayManagedByLeave ? (
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <div className="flex gap-3">
                      <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-purple-900">{statusLabels[selectedDay.status]}</h4>
                        <p className="mt-1 text-sm text-purple-800">
                          Ten dzień jest powiązany z wnioskiem urlopowym i nie edytujesz go z poziomu dostępności.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : deadlinePassed ? (
                  <p className="text-sm text-gray-600">Okno edycji zostało już zamknięte.</p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="availability-status" className="mb-2 block text-sm font-medium text-gray-700">
                        Moja dyspozycyjność
                      </label>
                      <select
                        id="availability-status"
                        value={selectedDay.status}
                        onChange={(event) => updateSelectedDay({ status: event.target.value as AvailabilityStatus, ...(event.target.value === "available" ? { category: null } : {}) })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="available">— Wyczyść (dostępny domyślnie)</option>
                        <option value="preferred">Chętnie</option>
                        <option value="not-preferred">Niechętnie</option>
                        <option value="unavailable">Nie mogę</option>
                      </select>
                    </div>

                    {selectedDay.status === "preferred" && (
                      <div>
                        <label htmlFor="availability-category" className="mb-2 block text-sm font-medium text-gray-700">
                          Kategoria preferencji
                        </label>
                        <select
                          id="availability-category"
                          value={selectedDay.category ?? ""}
                          onChange={(event) =>
                            updateSelectedDay({
                              category: (event.target.value || null) as DayAvailability["category"],
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Wybierz kategorię</option>
                          <option value="I">I - wysoki priorytet</option>
                          <option value="II">II - średni priorytet</option>
                          <option value="III">III - niski priorytet</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label htmlFor="availability-comment" className="mb-2 block text-sm font-medium text-gray-700">
                        Komentarz
                      </label>
                      <textarea
                        id="availability-comment"
                        value={selectedDay.comment}
                        onChange={(event) => updateSelectedDay({ comment: event.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Dodaj notatkę, jeśli chcesz wyjaśnić wybór."
                      />
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>

        {!deadlinePassed && (
          <div className="sticky bottom-20 mt-6 border-t border-gray-200 bg-gray-50/95 px-1 py-4 backdrop-blur md:bottom-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasPendingChanges}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Save className="h-5 w-5" />
              {hasPendingChanges ? "Zapisz dostępność" : "Brak zmian do zapisania"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
