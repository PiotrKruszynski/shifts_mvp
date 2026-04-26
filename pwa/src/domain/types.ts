export type Id = string;
export type IsoDate = string;
export type IsoTimestamp = string;

export type Role = "ADMIN" | "COORDINATOR" | "DOCTOR";
export type UserStatus = "ACTIVE" | "INVITED" | "SUSPENDED" | "DEACTIVATED";
export type RoleScope = "GLOBAL" | "DEPARTMENT";

export interface UserRole {
  role: Role;
  scope: RoleScope;
  departmentId?: Id;
  assignedAt: IsoTimestamp;
}

export interface User {
  id: Id;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  roles: UserRole[];
  createdAt: IsoTimestamp;
  lastLoginAt?: IsoTimestamp;
}

export interface Department {
  id: Id;
  name: string;
  hospitalName: string;
  timezone: string;
  active: boolean;
  createdAt: IsoTimestamp;
}

export type DoctorEmploymentType = "EMPLOYMENT_CONTRACT" | "B2B" | "CIVIL_CONTRACT" | "OTHER";
export type VerificationStatus = "VALID" | "EXPIRED" | "UNKNOWN";

export interface Qualification {
  id: Id;
  code: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface DoctorQualification {
  id: Id;
  doctorProfileId: Id;
  qualificationId: Id;
  validFrom: IsoDate;
  validTo?: IsoDate;
  verificationStatus: VerificationStatus;
}

export interface DoctorProfile {
  id: Id;
  userId: Id;
  licenseNumber: string;
  employmentType: DoctorEmploymentType;
  optOutSigned: boolean;
  weeklyHourLimitMinutes: number;
  active: boolean;
  qualifications?: DoctorQualification[];
}

export type ScheduleStatus = "DRAFT" | "GENERATED" | "PUBLISHED" | "ARCHIVED";
export type ScheduleParticipantStatus = "ACTIVE" | "REMOVED";

export interface Schedule {
  id: Id;
  departmentId: Id;
  coordinatorUserId: Id;
  periodStart: IsoDate;
  periodEnd: IsoDate;
  availabilityDeadline: IsoTimestamp;
  status: ScheduleStatus;
  publishedAt?: IsoTimestamp;
  archivedAt?: IsoTimestamp;
  createdAt?: IsoTimestamp;
}

export interface ScheduleParticipant {
  id: Id;
  scheduleId: Id;
  doctorProfileId: Id;
  status: ScheduleParticipantStatus;
  addedAt: IsoTimestamp;
  removedAt?: IsoTimestamp;
}

export type ShiftDurationHours = 24;
export type ShiftStatus = "UNASSIGNED" | "ASSIGNED" | "CONFLICTED";

export interface Shift {
  id: Id;
  scheduleId: Id;
  date: IsoDate;
  startsAt: IsoTimestamp;
  endsAt: IsoTimestamp;
  requiredQualificationId?: Id;
  status: ShiftStatus;
}

export type AssignmentStatus = "PROPOSED" | "CONFIRMED" | "REPLACED" | "CANCELLED";
export type AssignmentSource = "GENERATED" | "MANUAL" | "SWAP";

export interface Assignment {
  id: Id;
  scheduleId: Id;
  shiftId: Id;
  doctorProfileId: Id;
  status: AssignmentStatus;
  source: AssignmentSource;
  createdAt: IsoTimestamp;
  confirmedAt?: IsoTimestamp;
}

export type AvailabilityDeclarationStatus = "DRAFT" | "SUBMITTED" | "LOCKED";
export type AvailabilityType = "AVAILABLE" | "UNAVAILABLE" | "PREFERRED" | "NOT_PREFERRED";
export type PreferenceCategoryCode = "I" | "II" | "III";

export interface PreferenceCategory {
  id: Id;
  code: PreferenceCategoryCode;
  name: string;
  priority: number;
  description: string;
}

export interface AvailabilityDay {
  id: Id;
  date: IsoDate;
  availabilityType: AvailabilityType;
  preferenceCategoryId?: Id;
  comment?: string;
}

export interface AvailabilityDeclaration {
  id: Id;
  scheduleId: Id;
  doctorProfileId: Id;
  status: AvailabilityDeclarationStatus;
  submittedAt?: IsoTimestamp;
  lockedAt?: IsoTimestamp;
  days: AvailabilityDay[];
}

export type LeaveRequestStatus = "SUBMITTED" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface LeaveRequest {
  id: Id;
  scheduleId: Id;
  doctorProfileId: Id;
  dateFrom: IsoDate;
  dateTo: IsoDate;
  status: LeaveRequestStatus;
  reason?: string;
  reviewedByUserId?: Id;
  reviewedAt?: IsoTimestamp;
}

export type ConstraintSeverity = "INFO" | "WARNING" | "BLOCKING";

export interface ConstraintViolation {
  id: Id;
  constraintRuleId: Id;
  severity: ConstraintSeverity;
  message: string;
  doctorProfileId?: Id;
  shiftId?: Id;
}

export interface ValidationResult {
  id: Id;
  targetType: "SCHEDULE" | "ASSIGNMENT" | "SWAP_REQUEST";
  targetId: Id;
  isCompliant: boolean;
  validatedAt: IsoTimestamp;
  violations: ConstraintViolation[];
}

export interface ConflictItem {
  id: Id;
  shiftId?: Id;
  reasonCode: string;
  description: string;
}

export interface ConflictReport {
  id: Id;
  scheduleId: Id;
  generationRunId: Id;
  createdAt: IsoTimestamp;
  summary: string;
  items: ConflictItem[];
}

export type SwapRequestStatus =
  | "PENDING_DOCTOR_ACCEPTANCE"
  | "REJECTED_BY_DOCTOR"
  | "ACCEPTED_BY_DOCTORS"
  | "REJECTED_BY_SYSTEM"
  | "PENDING_COORDINATOR_APPROVAL"
  | "APPROVED"
  | "REJECTED_BY_COORDINATOR";

export type SwapCandidateResponseStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export interface SwapCandidate {
  id: Id;
  swapRequestId: Id;
  doctorProfileId: Id;
  assignmentId?: Id;
  responseStatus: SwapCandidateResponseStatus;
  respondedAt?: IsoTimestamp;
}

export interface SwapApproval {
  id: Id;
  swapRequestId: Id;
  coordinatorUserId: Id;
  decision: "APPROVED" | "REJECTED";
  comment?: string;
  decidedAt: IsoTimestamp;
}

export interface SwapRequest {
  id: Id;
  scheduleId: Id;
  requestingDoctorId: Id;
  sourceAssignmentId: Id;
  targetDoctorId?: Id;
  targetAssignmentId?: Id;
  status: SwapRequestStatus;
  candidates: SwapCandidate[];
  validationResult?: ValidationResult;
  approval?: SwapApproval;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}

export interface AuditLogEntry {
  id: Id;
  actorUserId: Id;
  actionType: string;
  entityType: string;
  entityId: Id;
  timestamp: IsoTimestamp;
  payloadBefore?: Record<string, unknown>;
  payloadAfter?: Record<string, unknown>;
  reason?: string;
}
