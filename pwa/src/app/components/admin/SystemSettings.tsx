import { useState } from "react";
import { Settings, Save, Globe, Bell, Clock, Shield, AlertCircle } from "lucide-react";

export function SystemSettings() {
  const [settings, setSettings] = useState({
    language: "pl",
    timezone: "Europe/Warsaw",
    minRestHours: 11,
    maxWeeklyHours: 48,
    maxMonthlyHours: 220,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    defaultScheduleStatus: "Szkic",
    autoArchiveAfterDays: 90,
  });

  const handleSave = () => {
    alert("Ustawienia zostały zapisane");
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Konfiguracja systemu</h1>
        <p className="text-gray-600 mt-2">Zarządzaj parametrami globalnymi i oddziałowymi</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ustawienia regionalne</h2>
              <p className="text-sm text-gray-600">Język i strefa czasowa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Język systemu
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pl">Polski</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strefa czasowa
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Europe/Warsaw">Europe/Warsaw (UTC+1/+2)</option>
                <option value="Europe/London">Europe/London (UTC+0/+1)</option>
                <option value="America/New_York">America/New_York (UTC-5/-4)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Limity prawne</h2>
              <p className="text-sm text-gray-600">Parametry zgodności z przepisami</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimalny odpoczynek (godziny)
              </label>
              <input
                type="number"
                value={settings.minRestHours}
                onChange={(e) =>
                  setSettings({ ...settings, minRestHours: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="8"
                max="24"
              />
              <p className="text-xs text-gray-500 mt-1">Między dyżurami (domyślnie: 11h)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksymalnie godzin tygodniowo
              </label>
              <input
                type="number"
                value={settings.maxWeeklyHours}
                onChange={(e) =>
                  setSettings({ ...settings, maxWeeklyHours: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="24"
                max="80"
              />
              <p className="text-xs text-gray-500 mt-1">Limit tygodniowy (domyślnie: 48h)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksymalnie godzin miesięcznie
              </label>
              <input
                type="number"
                value={settings.maxMonthlyHours}
                onChange={(e) =>
                  setSettings({ ...settings, maxMonthlyHours: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="100"
                max="300"
              />
              <p className="text-xs text-gray-500 mt-1">Limit miesięczny (domyślnie: 220h)</p>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">Uwaga</p>
                <p className="text-sm text-amber-800 mt-1">
                  Zmiana limitów prawnych wpłynie na walidację wszystkich przyszłych grafików.
                  Upewnij się, że wartości są zgodne z obowiązującymi przepisami.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Powiadomienia</h2>
              <p className="text-sm text-gray-600">Typy i kanały komunikacji</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Powiadomienia email</p>
                <p className="text-sm text-gray-600">
                  Wysyłaj powiadomienia o grafiku, zamianach i deadlinach
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableEmailNotifications}
                  onChange={(e) =>
                    setSettings({ ...settings, enableEmailNotifications: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Powiadomienia SMS</p>
                <p className="text-sm text-gray-600">Pilne powiadomienia przez SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableSMSNotifications}
                  onChange={(e) =>
                    setSettings({ ...settings, enableSMSNotifications: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Automatyzacja</h2>
              <p className="text-sm text-gray-600">Reguły i procesy automatyczne</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domyślny status grafiku
              </label>
              <select
                value={settings.defaultScheduleStatus}
                onChange={(e) =>
                  setSettings({ ...settings, defaultScheduleStatus: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Szkic">Szkic</option>
                <option value="Wygenerowany">Wygenerowany</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automatyczne archiwizowanie (dni)
              </label>
              <input
                type="number"
                value={settings.autoArchiveAfterDays}
                onChange={(e) =>
                  setSettings({ ...settings, autoArchiveAfterDays: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="30"
                max="365"
              />
              <p className="text-xs text-gray-500 mt-1">
                Grafiki starsze niż X dni zostaną zarchiwizowane
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Kategorie preferencji</h2>
              <p className="text-sm text-gray-600">Definicje priorytetów dla generatora</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-900">Kategoria I - Wysoki priorytet</p>
              <p className="text-sm text-blue-700 mt-1">
                Generator będzie maksymalizować spełnienie tych preferencji
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-green-900">Kategoria II - Średni priorytet</p>
              <p className="text-sm text-green-700 mt-1">
                Preferencje uwzględniane po spełnieniu kategorii I
              </p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Kategoria III - Niski priorytet</p>
              <p className="text-sm text-amber-700 mt-1">
                Uwzględniane tylko jeśli nie kolidują z wyższymi priorytetami
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Save className="w-5 h-5" />
          Zapisz ustawienia
        </button>
      </div>
    </div>
  );
}
