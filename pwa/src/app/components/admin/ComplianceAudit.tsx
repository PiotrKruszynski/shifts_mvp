import { useState } from "react";
import { Download, Shield } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { auditService } from "../../../services/auditService";
import {
  ComplianceFilters,
  type AuditCategoryFilter,
  type AuditSeverityFilter,
} from "./compliance/ComplianceFilters";
import { ComplianceEventList } from "./compliance/ComplianceEventList";
import { ComplianceStats } from "./compliance/ComplianceStats";

export function ComplianceAudit() {
  const [filterCategory, setFilterCategory] = useState<AuditCategoryFilter>("all");
  const [filterSeverity, setFilterSeverity] = useState<AuditSeverityFilter>("all");
  const auditState = useAsyncResource(() => auditService.listComplianceAuditEvents(), []);

  if (auditState.status === "loading") {
    return <div className="p-4 md:p-8 text-gray-600">Ładowanie logów audytowych...</div>;
  }

  if (auditState.status === "error") {
    return <div className="p-4 md:p-8 text-red-700">{auditState.error}</div>;
  }

  const events = auditState.data;
  const filteredEvents = events.filter((event) => {
    if (filterCategory !== "all" && event.category !== filterCategory) return false;
    if (filterSeverity !== "all" && event.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Logi audytowe i zgodność
          </h1>
          <p className="text-gray-600 mt-2">Przegląd operacji systemowych i bezpieczeństwa</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap">
          <Download className="w-5 h-5" />
          Eksportuj logi
        </button>
      </div>

      <ComplianceStats events={events} />
      <ComplianceFilters
        filterCategory={filterCategory}
        filterSeverity={filterSeverity}
        onCategoryChange={setFilterCategory}
        onSeverityChange={setFilterSeverity}
      />
      <ComplianceEventList events={filteredEvents} />

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Informacja o logach audytowych</h3>
            <p className="text-sm text-blue-700 mt-1">
              Wszystkie logi są przechowywane w sposób niezmienny i nie mogą być edytowane ani
              usuwane. Zapewnia to pełną audytowalność i zgodność z wymogami prawnymi. Logi są
              automatycznie archiwizowane po 365 dniach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
