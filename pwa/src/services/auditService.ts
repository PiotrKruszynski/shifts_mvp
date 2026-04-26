import { toComplianceAuditEvent } from "../api/adapters";
import { apiRequest, type PageResponse } from "../api/client";
import { shouldUseMockApi } from "../api/config";
import type { AuditLogEntry } from "../domain/types";
import type { ComplianceAuditEventFixture } from "../fixtures/audit.fixture";
import { mockSeed } from "../mocks/seed";
import { mockResolve } from "./mockTransport";

export type AuditCategory = "Access" | "Change" | "Security" | "Compliance";
export type AuditSeverity = "Info" | "Warning" | "Critical";
export type ComplianceAuditEvent = ComplianceAuditEventFixture;

export interface ScheduleAuditEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  details: string;
  type: "Create" | "Update" | "Generate" | "Publish" | "Swap" | "Override";
}

type ApiAuditLogEntry = AuditLogEntry & {
  actorLabel?: string;
  actionLabel?: string;
  resourceLabel?: string;
};

const scheduleAuditEvents: ScheduleAuditEvent[] = [
  {
    id: "audit-schedule-publish-display",
    timestamp: "2026-04-24 14:32:15",
    user: "Koordynator - Jan Kowalski",
    action: "Opublikował grafik",
    entity: "Grafik Maj 2026",
    details: "Status zmieniony z Wygenerowany na Opublikowany",
    type: "Publish",
  },
  {
    id: "audit-swap-approved-display",
    timestamp: "2026-04-24 14:15:42",
    user: "Koordynator - Jan Kowalski",
    action: "Zaakceptował zamianę",
    entity: "Zamiana dyżurów",
    details: "Dr Anna Kowalska ↔ Dr Jan Nowak (15.05.2026 ↔ 18.05.2026)",
    type: "Swap",
  },
  {
    id: "audit-swap-requested-display",
    timestamp: "2026-04-24 13:45:18",
    user: "Dr Anna Kowalska",
    action: "Zaproponował zamianę",
    entity: "Zamiana dyżurów",
    details: "Propozycja zamiany dyżuru z Dr Jan Nowak",
    type: "Swap",
  },
  {
    id: "audit-override-display",
    timestamp: "2026-04-24 11:20:33",
    user: "Koordynator - Jan Kowalski",
    action: "Nadpisał preferencję",
    entity: "Grafik Maj 2026",
    details:
      "Przypisał Dr Piotr Zieliński do dyżuru 10.05.2026 (Niepreferowany dzień). Uzasadnienie: Brak alternatywnych lekarzy z wymaganymi kwalifikacjami",
    type: "Override",
  },
  {
    id: "audit-generation-display",
    timestamp: "2026-04-23 16:05:22",
    user: "Koordynator - Jan Kowalski",
    action: "Wygenerował grafik",
    entity: "Grafik Maj 2026",
    details: "Uruchomił generator z 24 lekarzami i 31 dyżurami",
    type: "Generate",
  },
  {
    id: "audit-availability-lock-display",
    timestamp: "2026-04-23 15:30:00",
    user: "Koordynator - Jan Kowalski",
    action: "Zamknął okno zgłoszeń",
    entity: "Grafik Maj 2026",
    details: "Deadline dostępności: 21/24 lekarzy zgłosiło dostępność",
    type: "Update",
  },
  {
    id: "audit-schedule-created-display",
    timestamp: "2026-04-20 09:15:44",
    user: "Koordynator - Jan Kowalski",
    action: "Utworzył grafik",
    entity: "Grafik Maj 2026",
    details: "Okres: 01.05.2026 - 31.05.2026, Deadline: 28.04.2026",
    type: "Create",
  },
];

export const auditService = {
  listAuditLogEntries(): Promise<AuditLogEntry[]> {
    if (!shouldUseMockApi()) {
      return apiRequest<PageResponse<AuditLogEntry>>("/audit-log").then((response) => response.data);
    }

    return mockResolve(mockSeed.complianceAuditEvents.map((event) => event.entry));
  },

  listComplianceAuditEvents(): Promise<ComplianceAuditEvent[]> {
    if (!shouldUseMockApi()) {
      return apiRequest<PageResponse<AuditLogEntry>>("/audit-log").then((response) =>
        response.data.map(toComplianceAuditEvent),
      );
    }

    return mockResolve(mockSeed.complianceAuditEvents);
  },

  listScheduleAuditEvents(): Promise<ScheduleAuditEvent[]> {
    if (!shouldUseMockApi()) {
      return apiRequest<PageResponse<ApiAuditLogEntry>>("/audit-log?entityType=Schedule").then((response) =>
        response.data.map((entry) => ({
          id: entry.id,
          timestamp: entry.timestamp,
          user: entry.actorLabel ?? entry.actorUserId,
          action: entry.actionLabel ?? entry.actionType,
          entity: entry.resourceLabel ?? entry.entityType,
          details: entry.reason ?? `${entry.actionType} ${entry.entityType}`,
          type: entry.actionType.includes("PUBLISH")
            ? "Publish"
            : entry.actionType.includes("GENERAT")
              ? "Generate"
              : entry.actionType.includes("SWAP")
                ? "Swap"
                : entry.actionType.includes("CREAT")
                  ? "Create"
                  : "Update",
        })),
      );
    }

    return mockResolve(scheduleAuditEvents);
  },
};
