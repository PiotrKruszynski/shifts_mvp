import { Shield } from "lucide-react";
import type {
  AuditCategory,
  AuditSeverity,
  ComplianceAuditEvent,
} from "../../../../services/auditService";

const severityColors: Record<AuditSeverity, string> = {
  Info: "bg-blue-100 text-blue-800 border-blue-300",
  Warning: "bg-amber-100 text-amber-800 border-amber-300",
  Critical: "bg-red-100 text-red-800 border-red-300",
};

const categoryColors: Record<AuditCategory, string> = {
  Access: "bg-purple-100 text-purple-800",
  Change: "bg-blue-100 text-blue-800",
  Security: "bg-red-100 text-red-800",
  Compliance: "bg-amber-100 text-amber-800",
};

function formatAuditTimestamp(timestamp: string) {
  return timestamp.replace("T", " ").slice(0, 19);
}

interface ComplianceEventListProps {
  events: ComplianceAuditEvent[];
}

export function ComplianceEventList({ events }: ComplianceEventListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Historia zdarzeń</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {events.map((event) => (
          <div key={event.entry.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{event.actionLabel}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        severityColors[event.severity]
                      }`}
                    >
                      {event.severity}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                        categoryColors[event.category]
                      }`}
                    >
                      {event.category}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {formatAuditTimestamp(event.entry.timestamp)}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Użytkownik:</span> {event.userLabel}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Zasób:</span> {event.resourceLabel}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">IP:</span> {event.ipAddress}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">{event.details}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
