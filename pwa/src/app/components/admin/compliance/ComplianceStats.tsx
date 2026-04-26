import { AlertCircle, CheckCircle, Shield } from "lucide-react";
import type { ComplianceAuditEvent } from "../../../../services/auditService";

interface ComplianceStatsProps {
  events: ComplianceAuditEvent[];
}

export function ComplianceStats({ events }: ComplianceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Wszystkie zdarzenia</h3>
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-3xl font-semibold text-gray-900">{events.length}</p>
        <p className="text-sm text-gray-600 mt-1">ostatnie 24h</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Krytyczne</h3>
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <p className="text-3xl font-semibold text-gray-900">
          {events.filter((event) => event.severity === "Critical").length}
        </p>
        <p className="text-sm text-gray-600 mt-1">wymaga uwagi</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Ostrzeżenia</h3>
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>
        <p className="text-3xl font-semibold text-gray-900">
          {events.filter((event) => event.severity === "Warning").length}
        </p>
        <p className="text-sm text-gray-600 mt-1">do przeglądu</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Zgodność</h3>
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-3xl font-semibold text-gray-900">98%</p>
        <p className="text-sm text-gray-600 mt-1">w tym miesiącu</p>
      </div>
    </div>
  );
}
