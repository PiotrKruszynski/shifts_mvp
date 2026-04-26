import { BarChart3, TrendingUp, Download } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { metricsService } from "../../../services/metricsService";

export function Metrics() {
  const metricsState = useAsyncResource(() => metricsService.getDoctorMetrics(), []);

  if (metricsState.status === "loading") {
    return <div className="p-8 text-gray-600">Ładowanie metryk...</div>;
  }

  if (metricsState.status === "error") {
    return <div className="p-8 text-red-700">{metricsState.error}</div>;
  }

  const { doctorMetrics, periodLabel } = metricsState.data;
  const maxHours = Math.max(...doctorMetrics.map((d) => d.totalHours));
  const totalShifts = doctorMetrics.reduce(
    (sum, doctor) => sum + doctor.weekdayShifts + doctor.weekendShifts + doctor.holidayShifts,
    0,
  );
  const averageShifts = doctorMetrics.length > 0 ? totalShifts / doctorMetrics.length : 0;
  const totalHours = doctorMetrics.reduce((sum, doctor) => sum + doctor.totalHours, 0);
  const averageHours = doctorMetrics.length > 0 ? totalHours / doctorMetrics.length : 0;
  const weekendShifts = doctorMetrics.reduce((sum, doctor) => sum + doctor.weekendShifts, 0);
  const holidayShifts = doctorMetrics.reduce((sum, doctor) => sum + doctor.holidayShifts, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Raporty i metryki</h1>
          <p className="text-gray-600 mt-2">
            Monitorowanie obciążeń i zgodności dla {periodLabel}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          <Download className="w-5 h-5" />
          Eksportuj CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Średnia dyżurów</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{averageShifts.toFixed(1)}</p>
          <p className="text-sm text-gray-600 mt-1">na lekarza</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Średnie godziny</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{averageHours.toFixed(1)}</p>
          <p className="text-sm text-gray-600 mt-1">godz./miesiąc</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Dyżury weekendowe</h3>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{weekendShifts}</p>
          <p className="text-sm text-gray-600 mt-1">w sumie</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Święta</h3>
            <BarChart3 className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{holidayShifts}</p>
          <p className="text-sm text-gray-600 mt-1">w miesiącu</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Rozkład dyżurów na lekarza
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {doctorMetrics.map((doctor, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{doctor.name}</span>
                  <span className="text-sm text-gray-600">
                    {doctor.totalHours}h ({doctor.weekdayShifts + doctor.weekendShifts + doctor.holidayShifts} dyżurów)
                  </span>
                </div>

                <div className="flex gap-1 h-8">
                  <div
                    className="bg-blue-500 rounded-l flex items-center justify-center text-white text-xs font-medium"
                    style={{
                      width: `${(doctor.weekdayShifts / (doctor.weekdayShifts + doctor.weekendShifts + doctor.holidayShifts)) * 100}%`,
                    }}
                  >
                    {doctor.weekdayShifts > 0 && `${doctor.weekdayShifts}`}
                  </div>
                  <div
                    className="bg-purple-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{
                      width: `${(doctor.weekendShifts / (doctor.weekdayShifts + doctor.weekendShifts + doctor.holidayShifts)) * 100}%`,
                    }}
                  >
                    {doctor.weekendShifts > 0 && `${doctor.weekendShifts}`}
                  </div>
                  <div
                    className="bg-amber-500 rounded-r flex items-center justify-center text-white text-xs font-medium"
                    style={{
                      width: `${(doctor.holidayShifts / (doctor.weekdayShifts + doctor.weekendShifts + doctor.holidayShifts)) * 100}%`,
                    }}
                  >
                    {doctor.holidayShifts > 0 && `${doctor.holidayShifts}`}
                  </div>
                </div>

                <div className="flex gap-4 mt-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Tydzień: {doctor.weekdayShifts}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Weekend: {doctor.weekendShifts}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                    <span>Święta: {doctor.holidayShifts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Łączne godziny pracy</h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {doctorMetrics.map((doctor, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{doctor.name}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {doctor.totalHours}h
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      doctor.totalHours > 200
                        ? "bg-red-500"
                        : doctor.totalHours > 180
                        ? "bg-amber-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${(doctor.totalHours / maxHours) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600">Norma (&lt;180h)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span className="text-gray-600">Ostrzeżenie (180-200h)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600">Przekroczenie (&gt;200h)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
