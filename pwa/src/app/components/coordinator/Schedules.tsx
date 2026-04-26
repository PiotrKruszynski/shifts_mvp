import { Link } from "react-router";
import { Calendar, Plus } from "lucide-react";
import { ScheduleStatusBadge } from "../shared/ScheduleStatusBadge";

type ScheduleStatusLabel = "Szkic" | "Wygenerowany" | "Opublikowany" | "Zarchiwizowany";

interface ScheduleRow {
  id: string;
  period: string;
  dateRange: string;
  status: ScheduleStatusLabel;
  doctors: number;
  shifts: number;
  deadline: string;
}

export function Schedules() {
  const schedules: ScheduleRow[] = [
    {
      id: "1",
      period: "Maj 2026",
      dateRange: "01.05.2026 - 31.05.2026",
      status: "Wygenerowany",
      doctors: 24,
      shifts: 31,
      deadline: "2026-04-28",
    },
    {
      id: "2",
      period: "Kwiecień 2026",
      dateRange: "01.04.2026 - 30.04.2026",
      status: "Opublikowany",
      doctors: 24,
      shifts: 30,
      deadline: "2026-03-25",
    },
    {
      id: "3",
      period: "Marzec 2026",
      dateRange: "01.03.2026 - 31.03.2026",
      status: "Zarchiwizowany",
      doctors: 23,
      shifts: 31,
      deadline: "2026-02-25",
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Grafiki</h1>
          <p className="text-gray-600 mt-2">Zarządzaj grafikami dyżurów dla oddziału</p>
        </div>
        <Link
          to="/coordinator/schedules/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Utwórz grafik
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Okres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Zakres dat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Lekarze
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Dyżury
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{schedule.period}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {schedule.dateRange}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ScheduleStatusBadge status={schedule.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.doctors}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.shifts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {schedule.deadline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {schedule.status === "Wygenerowany" && (
                      <Link
                        to={`/coordinator/schedules/${schedule.id}/editor`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edytuj
                      </Link>
                    )}
                    {schedule.status === "Szkic" && (
                      <Link
                        to={`/coordinator/schedules/${schedule.id}/availability`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Zbieraj dostępność
                      </Link>
                    )}
                    {(schedule.status === "Opublikowany" || schedule.status === "Zarchiwizowany") && (
                      <button className="text-gray-600 hover:text-gray-800 font-medium">
                        Podgląd
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
