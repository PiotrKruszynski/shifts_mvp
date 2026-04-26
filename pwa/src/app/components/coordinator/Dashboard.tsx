import { Link } from "react-router";
import { Calendar, AlertCircle, Clock, RefreshCw, TrendingUp, CheckCircle } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { scheduleService } from "../../../services/scheduleService";
import { ScheduleStatusBadge } from "../shared/ScheduleStatusBadge";
import { MetricCard } from "../shared/MetricCard";

export function Dashboard() {
  const scheduleState = useAsyncResource(() => scheduleService.getCoordinatorDashboardSchedule(), []);

  if (scheduleState.status === "loading") {
    return <div className="p-4 md:p-8 text-gray-600">Ładowanie pulpitu...</div>;
  }

  if (scheduleState.status === "error") {
    return <div className="p-4 md:p-8 text-red-700">{scheduleState.error}</div>;
  }

  const currentSchedule = scheduleState.data;

  const upcomingDeadline = new Date(currentSchedule.deadline).getTime() - Date.now();
  const daysUntilDeadline = Math.ceil(upcomingDeadline / (1000 * 60 * 60 * 24));

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Oddział Chirurgii</h1>
      </div>

      {daysUntilDeadline <= 3 && daysUntilDeadline > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900">Zbliżający się deadline</h3>
            <p className="text-sm text-amber-800 mt-1">
              Termin zgłoszeń dostępności mija za {daysUntilDeadline} dni ({currentSchedule.deadline})
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Nadchodzący grafik"
          value={currentSchedule.period}
          badge={<ScheduleStatusBadge status={currentSchedule.status} />}
          icon={Calendar}
          variant="normal"
        />

        <MetricCard
          title="Deadline dostępności"
          value={`${daysUntilDeadline} dni`}
          subtitle={currentSchedule.deadline}
          icon={Clock}
          variant={daysUntilDeadline <= 3 ? "warning" : "normal"}
        />

        <MetricCard
          title="Nieobsadzone dyżury"
          value={currentSchedule.unassignedShifts.toString()}
          icon={AlertCircle}
          variant={currentSchedule.unassignedShifts > 0 ? "critical" : "normal"}
        />

        <MetricCard
          title="Konflikty"
          value={currentSchedule.conflicts.toString()}
          icon={TrendingUp}
          variant={currentSchedule.conflicts > 0 ? "warning" : "normal"}
        />

        <MetricCard
          title="Zamiany do akceptacji"
          value={currentSchedule.pendingSwaps.toString()}
          icon={RefreshCw}
          variant="normal"
        />

        <MetricCard
          title="Lekarze w grafiku"
          value={currentSchedule.doctors.toString()}
          subtitle={`${currentSchedule.activeDoctors} aktywnych, ${currentSchedule.invitedDoctors} zaproszony`}
          icon={CheckCircle}
          variant="normal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktywne grafiki</h2>

          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{currentSchedule.period}</h3>
                  <p className="text-sm text-gray-600 mt-1">{currentSchedule.dateRange}</p>
                </div>
                <ScheduleStatusBadge status={currentSchedule.status} />
              </div>

              <div className="flex gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Lekarze:</span>
                  <span className="ml-1 font-medium text-gray-900">{currentSchedule.doctors}</span>
                </div>
                <div>
                  <span className="text-gray-600">Dyżury:</span>
                  <span className="ml-1 font-medium text-gray-900">{currentSchedule.shifts}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/coordinator/schedules/${currentSchedule.id}/editor`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                >
                  Przejdź do edytora
                </Link>
                <Link
                  to={`/coordinator/schedules/${currentSchedule.id}/availability`}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Dostępność
                </Link>
              </div>
            </div>
          </div>

          <Link
            to="/coordinator/schedules/create"
            className="mt-4 w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Calendar className="w-4 h-4" />
            Utwórz nowy grafik
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerty i powiadomienia</h2>

          <div className="space-y-3">
            {currentSchedule.unassignedShifts > 0 && (
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">Nieobsadzone dyżury</p>
                  <p className="text-sm text-red-700 mt-1">
                    {currentSchedule.unassignedShifts} dyżurów wymaga przypisania lekarza
                  </p>
                </div>
              </div>
            )}

            {currentSchedule.conflicts > 0 && (
              <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Konflikty w grafiku</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Wykryto {currentSchedule.conflicts} naruszenia odpoczynku lub limitów
                  </p>
                </div>
              </div>
            )}

            {currentSchedule.pendingSwaps > 0 && (
              <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Zamiany do akceptacji</p>
                  <p className="text-sm text-blue-700 mt-1">
                    {currentSchedule.pendingSwaps} propozycji zamian czeka na Twoją decyzję
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">Wysoka frekwencja zgłoszeń</p>
                <p className="text-sm text-green-700 mt-1">
                  {currentSchedule.availabilitySubmitted} z {currentSchedule.doctors} lekarzy uzupełniło dostępność
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
