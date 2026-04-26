import type { AuditLogEntry, ConstraintSeverity } from "../domain/types";

export type AuditCategory = "Access" | "Change" | "Security" | "Compliance";
export type AuditSeverity = "Info" | "Warning" | "Critical";

export interface ComplianceAuditEventFixture {
  entry: AuditLogEntry;
  category: AuditCategory;
  severity: AuditSeverity;
  userLabel: string;
  actionLabel: string;
  resourceLabel: string;
  ipAddress: string;
  details: string;
}

export const complianceAuditEventsFixture: ComplianceAuditEventFixture[] = [
  {
    entry: {
      id: "audit-schedule-published",
      actorUserId: "user-coordinator-jan",
      actionType: "SCHEDULE_PUBLISHED",
      entityType: "Schedule",
      entityId: "schedule-2026-05-surgery",
      timestamp: "2026-04-24T15:32:18+02:00",
    },
    category: "Change",
    severity: "Info",
    userLabel: "Koordynator - Jan Kowalski",
    actionLabel: "Opublikował grafik",
    resourceLabel: "Grafik Maj 2026 - Oddział Chirurgii",
    ipAddress: "192.168.1.45",
    details: "Status zmieniony z Wygenerowany na Opublikowany. Powiadomienia wysłane do 24 lekarzy.",
  },
  {
    entry: {
      id: "audit-soft-rule-override",
      actorUserId: "user-coordinator-jan",
      actionType: "SOFT_RULE_OVERRIDE",
      entityType: "Assignment",
      entityId: "assignment-2026-05-10",
      timestamp: "2026-04-24T14:22:05+02:00",
      reason: "Brak alternatywnych lekarzy z wymaganymi kwalifikacjami.",
    },
    category: "Compliance",
    severity: "Warning",
    userLabel: "Koordynator - Jan Kowalski",
    actionLabel: "Nadpisał miękką regułę",
    resourceLabel: "Grafik Maj 2026",
    ipAddress: "192.168.1.45",
    details:
      "Przypisał Dr Piotr Zieliński do dyżuru 10.05.2026 mimo preferencji 'Niepreferowany' (Kategoria II). Uzasadnienie: Brak alternatywnych lekarzy z wymaganymi kwalifikacjami.",
  },
  {
    entry: {
      id: "audit-user-role-change",
      actorUserId: "user-admin-piotr",
      actionType: "USER_ROLE_CHANGED",
      entityType: "User",
      entityId: "user-doctor-maria",
      timestamp: "2026-04-24T10:15:33+02:00",
    },
    category: "Access",
    severity: "Info",
    userLabel: "Admin - Piotr Admin",
    actionLabel: "Zmienił rolę użytkownika",
    resourceLabel: "Użytkownik: Maria Nowak",
    ipAddress: "192.168.1.12",
    details: "Zmieniono rolę z 'Lekarz' na 'Koordynator' dla oddziału Neurologii.",
  },
  {
    entry: {
      id: "audit-unauthorized-access",
      actorUserId: "system",
      actionType: "UNAUTHORIZED_ACCESS_BLOCKED",
      entityType: "SecurityEvent",
      entityId: "security-event-203-0-113-42",
      timestamp: "2026-04-23T16:45:22+02:00",
    },
    category: "Security",
    severity: "Critical",
    userLabel: "System",
    actionLabel: "Wykryto nieautoryzowaną próbę dostępu",
    resourceLabel: "API Endpoint: /admin/users",
    ipAddress: "203.0.113.42",
    details:
      "Zablokowano próbę dostępu do panelu administracyjnego z konta bez odpowiednich uprawnień. IP dodane do listy obserwowanych.",
  },
  {
    entry: {
      id: "audit-swap-warning",
      actorUserId: "user-coordinator-jan",
      actionType: "SWAP_APPROVED_WITH_WARNING",
      entityType: "SwapRequest",
      entityId: "swap-2026-05-01",
      timestamp: "2026-04-23T14:30:11+02:00",
    },
    category: "Compliance",
    severity: "Warning",
    userLabel: "Koordynator - Jan Kowalski",
    actionLabel: "Zatwierdził zamianę z ostrzeżeniem",
    resourceLabel: "Zamiana dyżurów",
    ipAddress: "192.168.1.45",
    details:
      "Zaakceptowano zamianę między Dr Anna Kowalska i Dr Jan Nowak. System wykrył zbliżenie do limitu tygodniowego dla Dr Kowalska (44h/48h).",
  },
];

export const constraintSeverityToAuditSeverity: Record<ConstraintSeverity, AuditSeverity> = {
  INFO: "Info",
  WARNING: "Warning",
  BLOCKING: "Critical",
};
