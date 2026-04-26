import { Calendar } from "lucide-react";
import type { AuditCategory, AuditSeverity } from "../../../../fixtures/audit.fixture";

export type AuditCategoryFilter = AuditCategory | "all";
export type AuditSeverityFilter = AuditSeverity | "all";

interface ComplianceFiltersProps {
  filterCategory: AuditCategoryFilter;
  filterSeverity: AuditSeverityFilter;
  onCategoryChange: (category: AuditCategoryFilter) => void;
  onSeverityChange: (severity: AuditSeverityFilter) => void;
}

export function ComplianceFilters({
  filterCategory,
  filterSeverity,
  onCategoryChange,
  onSeverityChange,
}: ComplianceFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj w logach..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <select
          value={filterCategory}
          onChange={(event) => onCategoryChange(event.target.value as AuditCategoryFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Wszystkie kategorie</option>
          <option value="Access">Dostęp</option>
          <option value="Change">Zmiany</option>
          <option value="Security">Bezpieczeństwo</option>
          <option value="Compliance">Zgodność</option>
        </select>

        <select
          value={filterSeverity}
          onChange={(event) => onSeverityChange(event.target.value as AuditSeverityFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Wszystkie poziomy</option>
          <option value="Info">Informacja</option>
          <option value="Warning">Ostrzeżenie</option>
          <option value="Critical">Krytyczne</option>
        </select>
      </div>
    </div>
  );
}
