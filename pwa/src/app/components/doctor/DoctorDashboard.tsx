import { Link } from "react-router";
import { Calendar, Clock, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { ScheduleStatusBadge } from "../shared/ScheduleStatusBadge";

export function DoctorDashboard() {
  const upcomingShift = {
    date: "2026-05-01",
    day: "Czwartek",
    category: "Święto - Święto Pracy",
    hours: "00:00 - 23:59",
  };

  const deadlineDate = new Date("2026-04-28");
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const deadlinePassed = daysUntilDeadline < 0;

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Witaj, Anna!</h2>
        <p className="text-gray-600 mt-1">Oddział Chirurgii</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Najbliższy dyżur</p>
            <h3 className="text-2xl font-bold">{upcomingShift.day}</h3>
            <p className="text-blue-100 mt-1">{upcomingShift.date}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          <span>{upcomingShift.hours}</span>
        </div>
        <div className="mt-2 text-sm text-blue-100">
          {upcomingShift.category}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {!deadlinePassed ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <h3 className="font-medium text-amber-900">Deadline dostępności</h3>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Pozostało {daysUntilDeadline} dni do zgłoszenia dostępności ({deadlineDate.toLocaleDateString("pl-PL")})
            </p>
            <Link
              to="/doctor/availability"
              className="inline-block mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
            >
              Uzupełnij dostępność
            </Link>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900">Dostępność zgłoszona</h3>
                <p className="text-sm text-green-700 mt-1">
                  Twoja dostępność została przyjęta. Czekaj na wygenerowanie grafiku.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <h3 className="font-medium text-blue-900">Status grafiku</h3>
              </div>
              <p className="text-sm text-blue-700">Maj 2026</p>
            </div>
            <ScheduleStatusBadge status="Opublikowany" />
          </div>
          <Link
            to="/doctor/schedule"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Zobacz mój grafik
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Szybkie akcje</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <Link
            to="/doctor/availability"
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Moja dostępność</p>
              <p className="text-sm text-gray-600">Zgłoś preferencje i urlopy</p>
            </div>
          </Link>

          <Link
            to="/doctor/swap-request"
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Zaproponuj zamianę</p>
              <p className="text-sm text-gray-600">Wymień się dyżurem z kolegą</p>
            </div>
          </Link>

          <Link
            to="/doctor/leave-requests"
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Złóż wniosek urlopowy</p>
              <p className="text-sm text-gray-600">Zaplanuj urlop lub nieobecność</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Aktywne zamiany</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <RefreshCw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-900">Oczekuje na Dr Jan Nowak</p>
              <p className="text-sm text-amber-700 mt-1">
                15.05.2026 ↔ 18.05.2026
              </p>
            </div>
            <span className="text-xs text-amber-700 whitespace-nowrap">2 dni temu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
