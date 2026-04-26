import { useState } from "react";
import { AlertCircle, Calendar, List } from "lucide-react";
import { doctorScheduleShiftsFixture } from "../../../fixtures/schedules.fixture";
import { ScheduleCalendarView } from "./my-schedule/ScheduleCalendarView";
import { ScheduleListView } from "./my-schedule/ScheduleListView";
import { ScheduleStats } from "./my-schedule/ScheduleStats";

export function MySchedule() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const hasShifts = doctorScheduleShiftsFixture.length > 0;

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Mój grafik</h2>
        <p className="text-gray-600 mt-1">Maj 2026 - Przypisane dyżury</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            aria-pressed={viewMode === "list"}
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
            type="button"
            aria-pressed={viewMode === "calendar"}
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

      {!hasShifts ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Brak opublikowanych dyżurów</h3>
          <p className="mt-2 text-sm text-gray-600">
            Gdy Koordynator opublikuje grafik, zobaczysz go tutaj i wtedy pojawi się też możliwość zamiany.
          </p>
        </div>
      ) : (
        <>
          <ScheduleStats shifts={doctorScheduleShiftsFixture} />

          {viewMode === "list" ? (
            <ScheduleListView shifts={doctorScheduleShiftsFixture} />
          ) : (
            <ScheduleCalendarView shifts={doctorScheduleShiftsFixture} />
          )}
        </>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Informacja</h3>
            <p className="text-sm text-blue-700 mt-1">
              Akcja zamiany jest dostępna tylko dla opublikowanych grafików. Po zaakceptowaniu przez
              drugiego lekarza, zamiana wymaga zatwierdzenia przez Koordynatora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
