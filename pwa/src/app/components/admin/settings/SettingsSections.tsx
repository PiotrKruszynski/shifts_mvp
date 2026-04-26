import type { LucideIcon } from "lucide-react";
import { AlertCircle, Bell, Clock, Globe, Settings, Shield } from "lucide-react";
import type { PreferenceCategory } from "../../../../domain/types";
import type { SystemSettings } from "../../../../services/settingsService";

interface SettingsSectionHeaderProps {
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  description: string;
}

function SettingsSectionHeader({
  icon: Icon,
  iconClassName,
  title,
  description,
}: SettingsSectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClassName}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

interface SettingsSectionProps {
  settings: SystemSettings;
  onChange: (settings: SystemSettings) => void;
}

export function RegionalSettingsSection({ settings, onChange }: SettingsSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <SettingsSectionHeader
        icon={Globe}
        iconClassName="bg-blue-100 text-blue-600"
        title="Ustawienia regionalne"
        description="Język i strefa czasowa"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Język systemu</label>
          <select
            value={settings.language}
            onChange={(event) =>
              onChange({ ...settings, language: event.target.value as SystemSettings["language"] })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pl">Polski</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Strefa czasowa</label>
          <select
            value={settings.timezone}
            onChange={(event) => onChange({ ...settings, timezone: event.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Europe/Warsaw">Europe/Warsaw (UTC+1/+2)</option>
            <option value="Europe/London">Europe/London (UTC+0/+1)</option>
            <option value="America/New_York">America/New_York (UTC-5/-4)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function LegalLimitsSection({ settings, onChange }: SettingsSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <SettingsSectionHeader
        icon={Shield}
        iconClassName="bg-red-100 text-red-600"
        title="Limity prawne"
        description="Parametry zgodności z przepisami"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimalny odpoczynek (godziny)
          </label>
          <input
            type="number"
            value={settings.minRestHours}
            onChange={(event) =>
              onChange({ ...settings, minRestHours: Number.parseInt(event.target.value) })
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
            onChange={(event) =>
              onChange({ ...settings, maxWeeklyHours: Number.parseInt(event.target.value) })
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
            onChange={(event) =>
              onChange({ ...settings, maxMonthlyHours: Number.parseInt(event.target.value) })
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
  );
}

export function NotificationSettingsSection({ settings, onChange }: SettingsSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <SettingsSectionHeader
        icon={Bell}
        iconClassName="bg-green-100 text-green-600"
        title="Powiadomienia"
        description="Typy i kanały komunikacji"
      />

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
              onChange={(event) =>
                onChange({ ...settings, enableEmailNotifications: event.target.checked })
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
              onChange={(event) =>
                onChange({ ...settings, enableSMSNotifications: event.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

export function AutomationSettingsSection({ settings, onChange }: SettingsSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <SettingsSectionHeader
        icon={Clock}
        iconClassName="bg-purple-100 text-purple-600"
        title="Automatyzacja"
        description="Reguły i procesy automatyczne"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domyślny status grafiku
          </label>
          <select
            value={settings.defaultScheduleStatus}
            onChange={(event) =>
              onChange({
                ...settings,
                defaultScheduleStatus: event.target.value as SystemSettings["defaultScheduleStatus"],
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="DRAFT">Szkic</option>
            <option value="GENERATED">Wygenerowany</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Automatyczne archiwizowanie (dni)
          </label>
          <input
            type="number"
            value={settings.autoArchiveAfterDays}
            onChange={(event) =>
              onChange({ ...settings, autoArchiveAfterDays: Number.parseInt(event.target.value) })
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
  );
}

interface PreferenceCategoriesSectionProps {
  categories: PreferenceCategory[];
}

export function PreferenceCategoriesSection({ categories }: PreferenceCategoriesSectionProps) {
  const colorClasses = [
    "bg-blue-50 border-blue-200 text-blue-900 text-blue-700",
    "bg-green-50 border-green-200 text-green-900 text-green-700",
    "bg-amber-50 border-amber-200 text-amber-900 text-amber-700",
  ];

  return (
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
        {categories.map((category, index) => {
          const [containerBg, borderColor, titleColor, descriptionColor] =
            colorClasses[index].split(" ");

          return (
            <div
              key={category.id}
              className={`p-4 ${containerBg} border ${borderColor} rounded-lg`}
            >
              <p className={`font-medium ${titleColor}`}>{category.name}</p>
              <p className={`text-sm ${descriptionColor} mt-1`}>{category.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
