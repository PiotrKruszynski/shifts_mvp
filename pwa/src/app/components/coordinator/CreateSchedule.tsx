import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Users } from "lucide-react";

export function CreateSchedule() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    month: "",
    deadline: "",
  });

  const generateUpcomingMonths = () => {
    const months = [];
    const monthNames = [
      "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
      "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"
    ];

    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i + 1, 1);
      const monthName = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const value = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      months.push({ label: `${monthName} ${year}`, value });
    }
    return months;
  };

  const upcomingMonths = generateUpcomingMonths();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/coordinator/schedules/1/availability");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Utwórz grafik</h1>
        <p className="text-gray-600 mt-2">Oddział Chirurgii</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grafik na miesiąc
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  required
                >
                  <option value="">Wybierz miesiąc</option>
                  {upcomingMonths.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Grafik obejmie cały wybrany miesiąc
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline zgłoszeń dostępności
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Lekarze będą mogli zgłaszać dostępność do tej daty
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Lista lekarzy</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Po utworzeniu szkicu będziesz mógł zarządzać listą lekarzy uczestniczących w grafiku
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Utwórz szkic
            </button>
            <button
              type="button"
              onClick={() => navigate("/coordinator")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
