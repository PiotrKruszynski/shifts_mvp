import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { settingsService, type SystemSettings } from "../../../services/settingsService";
import {
  AutomationSettingsSection,
  LegalLimitsSection,
  NotificationSettingsSection,
  PreferenceCategoriesSection,
  RegionalSettingsSection,
} from "./settings/SettingsSections";

export function SystemSettings() {
  const settingsState = useAsyncResource(
    async () => ({
      settings: await settingsService.getSystemSettings(),
      categories: await settingsService.listPreferenceCategories(),
    }),
    [],
  );
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    if (settingsState.status === "success" && settings === null) {
      setSettings(settingsState.data.settings);
    }
  }, [settingsState, settings]);

  const handleSave = async () => {
    if (!settings) return;

    await settingsService.saveSystemSettings(settings);
    alert("Ustawienia zostały zapisane");
  };

  if (settingsState.status === "error") {
    return <div className="p-4 md:p-8 text-red-700">{settingsState.error}</div>;
  }

  if (settingsState.status === "loading" || settings === null) {
    return <div className="p-4 md:p-8 text-gray-600">Ładowanie ustawień...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Konfiguracja systemu</h1>
        <p className="text-gray-600 mt-2">Zarządzaj parametrami globalnymi i oddziałowymi</p>
      </div>

      <div className="space-y-6">
        <RegionalSettingsSection settings={settings} onChange={setSettings} />
        <LegalLimitsSection settings={settings} onChange={setSettings} />
        <NotificationSettingsSection settings={settings} onChange={setSettings} />
        <AutomationSettingsSection settings={settings} onChange={setSettings} />
        <PreferenceCategoriesSection categories={settingsState.data.categories} />
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
