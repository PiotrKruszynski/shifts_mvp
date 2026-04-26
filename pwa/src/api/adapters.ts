import type {
  AuditLogEntry,
  Department,
  DoctorProfile,
  Schedule,
  ScheduleStatus,
  User,
} from "../domain/types";
import type { ComplianceAuditEvent } from "../services/auditService";
import type { DoctorDirectoryEntry } from "../services/doctorService";
import type { DoctorMetric } from "../services/metricsService";
import type { ScheduleListItem, ScheduleStatusLabel } from "../services/scheduleService";
import type { AdminUserListItem, AvailableCoordinator } from "../services/userService";

const qualificationNamesById: Record<string, string> = {
  "afaf7385-6019-549c-9c39-88fbf03f391e": "Choroby wewnętrzne",
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const qualificationName = (qualificationId: string) => {
  const mappedName = qualificationNamesById[qualificationId];
  if (mappedName) return mappedName;
  if (uuidPattern.test(qualificationId)) return "Kwalifikacja medyczna";
  return qualificationId;
};

type ApiAuditLogEntry = AuditLogEntry & {
  category?: ComplianceAuditEvent["category"];
  severity?: ComplianceAuditEvent["severity"];
  actorLabel?: string;
  actionLabel?: string;
  resourceLabel?: string;
};

export const scheduleStatusLabels: Record<ScheduleStatus, ScheduleStatusLabel> = {
  DRAFT: "Szkic",
  GENERATED: "Wygenerowany",
  PUBLISHED: "Opublikowany",
  ARCHIVED: "Zarchiwizowany",
};

export const fullName = (user: Pick<User, "firstName" | "lastName">) => `${user.firstName} ${user.lastName}`;
export const doctorName = (user: Pick<User, "firstName" | "lastName">) => `Dr ${fullName(user)}`;

export const formatPeriod = (schedule: Pick<Schedule, "periodStart">) =>
  new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(
    new Date(`${schedule.periodStart}T12:00:00`),
  );

export const formatDate = (value: string) => value;
export const formatDateRange = (schedule: Pick<Schedule, "periodStart" | "periodEnd">) =>
  `${formatDate(schedule.periodStart)} - ${formatDate(schedule.periodEnd)}`;

export const primaryRole = (user: User) =>
  user.roles.find((role) => role.role === "ADMIN")?.role ??
  user.roles.find((role) => role.role === "COORDINATOR")?.role ??
  user.roles[0]?.role ??
  "DOCTOR";

export const toAdminUser = (user: User, departments: Department[]): AdminUserListItem => {
  const role = user.roles.find((item) => item.departmentId);
  return {
    user,
    primaryRole: primaryRole(user),
    departmentName: departments.find((department) => department.id === role?.departmentId)?.name,
  };
};

export const toAvailableCoordinator = (user: User): AvailableCoordinator => ({
  id: user.id,
  name: fullName(user),
  email: user.email,
});

export const toScheduleListItem = (schedule: Schedule, doctors: number, shifts: number): ScheduleListItem => ({
  id: schedule.id,
  period: formatPeriod(schedule),
  dateRange: formatDateRange(schedule),
  status: scheduleStatusLabels[schedule.status],
  doctors,
  shifts,
  deadline: schedule.availabilityDeadline.slice(0, 10),
});

export const toDoctorDirectoryEntry = (
  profile: DoctorProfile,
  users: User[],
  shiftsThisMonth: number,
  availabilitySubmitted: boolean,
): DoctorDirectoryEntry => ({
  user: users.find((user) => user.id === profile.userId) ?? {
    id: profile.userId,
    email: "",
    firstName: "Nieznany",
    lastName: "Lekarz",
    status: "ACTIVE",
    roles: [],
    createdAt: "",
  },
  profile,
  qualificationNames: profile.qualifications?.map((qualification) => qualificationName(qualification.qualificationId)) ?? [],
  shiftsThisMonth,
  availabilitySubmitted,
});

export const toDoctorMetric = (metric: {
  doctorName: string;
  weekdayShiftCount: number;
  weekendShiftCount: number;
  holidayShiftCount: number;
  totalHours: number;
}): DoctorMetric => ({
  name: metric.doctorName,
  weekdayShifts: metric.weekdayShiftCount,
  weekendShifts: metric.weekendShiftCount,
  holidayShifts: metric.holidayShiftCount,
  totalHours: metric.totalHours,
});

export const toComplianceAuditEvent = (entry: ApiAuditLogEntry): ComplianceAuditEvent => ({
  entry,
  category: entry.category ?? "Change",
  severity: entry.severity ?? "Info",
  userLabel: entry.actorLabel ?? entry.actorUserId,
  actionLabel: entry.actionLabel ?? entry.actionType,
  resourceLabel: entry.resourceLabel ?? entry.entityType,
  ipAddress: "local",
  details: entry.reason ?? `${entry.actionType} ${entry.entityType}`,
});
