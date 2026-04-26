import type {
  Department,
  DoctorProfile,
  Qualification,
  Role,
  User,
  UserStatus,
} from "../domain/types";

export interface AdminUserFixture {
  user: User;
  primaryRole: Role;
  departmentName?: string;
}

export interface DoctorDirectoryFixture {
  user: User;
  profile: DoctorProfile;
  qualificationNames: string[];
  shiftsThisMonth: number;
  availabilitySubmitted: boolean;
}

export const departmentsFixture: Department[] = [
  {
    id: "dep-surgery",
    name: "Oddział Chirurgii",
    hospitalName: "Szpital Wojewodzki",
    timezone: "Europe/Warsaw",
    active: true,
    createdAt: "2025-12-01T09:00:00+01:00",
  },
  {
    id: "dep-neurology",
    name: "Oddział Neurologii",
    hospitalName: "Szpital Wojewodzki",
    timezone: "Europe/Warsaw",
    active: true,
    createdAt: "2026-01-10T09:00:00+01:00",
  },
];

export const qualificationsFixture: Qualification[] = [
  {
    id: "qual-general-surgery",
    code: "GENERAL_SURGERY",
    name: "Chirurgia ogólna",
    active: true,
  },
  {
    id: "qual-vascular-surgery",
    code: "VASCULAR_SURGERY",
    name: "Chirurgia naczyniowa",
    active: true,
  },
  {
    id: "qual-trauma",
    code: "TRAUMA",
    name: "Traumatologia",
    active: true,
  },
];

const userRole = (
  role: Role,
  scope: "GLOBAL" | "DEPARTMENT",
  departmentId?: string,
  assignedAt = "2026-01-01T09:00:00+01:00",
) => ({
  role,
  scope,
  departmentId,
  assignedAt,
});

export const usersFixture: User[] = [
  {
    id: "user-coordinator-jan",
    email: "j.kowalski@hospital.pl",
    firstName: "Jan",
    lastName: "Kowalski",
    status: "ACTIVE",
    roles: [userRole("COORDINATOR", "DEPARTMENT", "dep-surgery", "2026-01-15T09:00:00+01:00")],
    createdAt: "2026-01-15T09:00:00+01:00",
    lastLoginAt: "2026-04-24T15:32:18+02:00",
  },
  {
    id: "user-doctor-anna",
    email: "a.nowak@hospital.pl",
    firstName: "Anna",
    lastName: "Nowak",
    status: "ACTIVE",
    roles: [userRole("DOCTOR", "DEPARTMENT", "dep-surgery", "2026-02-10T09:00:00+01:00")],
    createdAt: "2026-02-10T09:00:00+01:00",
  },
  {
    id: "user-doctor-maria",
    email: "m.wisniewska@hospital.pl",
    firstName: "Maria",
    lastName: "Wiśniewska",
    status: "INVITED",
    roles: [userRole("DOCTOR", "DEPARTMENT", "dep-surgery", "2026-04-20T09:00:00+02:00")],
    createdAt: "2026-04-20T09:00:00+02:00",
  },
  {
    id: "user-admin-piotr",
    email: "p.admin@hospital.pl",
    firstName: "Piotr",
    lastName: "Admin",
    status: "ACTIVE",
    roles: [userRole("ADMIN", "GLOBAL", undefined, "2025-12-01T09:00:00+01:00")],
    createdAt: "2025-12-01T09:00:00+01:00",
  },
  {
    id: "user-doctor-jan",
    email: "j.nowak@hospital.pl",
    firstName: "Jan",
    lastName: "Nowak",
    status: "ACTIVE",
    roles: [userRole("DOCTOR", "DEPARTMENT", "dep-surgery", "2026-02-12T09:00:00+01:00")],
    createdAt: "2026-02-12T09:00:00+01:00",
  },
  {
    id: "user-doctor-piotr",
    email: "p.zielinski@hospital.pl",
    firstName: "Piotr",
    lastName: "Zieliński",
    status: "ACTIVE",
    roles: [userRole("DOCTOR", "DEPARTMENT", "dep-surgery", "2026-02-14T09:00:00+01:00")],
    createdAt: "2026-02-14T09:00:00+01:00",
  },
];

export const doctorProfilesFixture: DoctorProfile[] = [
  {
    id: "doctor-anna",
    userId: "user-doctor-anna",
    licenseNumber: "PWZ-1001",
    employmentType: "EMPLOYMENT_CONTRACT",
    optOutSigned: true,
    weeklyHourLimitMinutes: 2880,
    active: true,
    qualifications: [
      {
        id: "dq-anna-general",
        doctorProfileId: "doctor-anna",
        qualificationId: "qual-general-surgery",
        validFrom: "2025-01-01",
        verificationStatus: "VALID",
      },
      {
        id: "dq-anna-vascular",
        doctorProfileId: "doctor-anna",
        qualificationId: "qual-vascular-surgery",
        validFrom: "2025-01-01",
        verificationStatus: "VALID",
      },
    ],
  },
  {
    id: "doctor-jan",
    userId: "user-doctor-jan",
    licenseNumber: "PWZ-1002",
    employmentType: "B2B",
    optOutSigned: true,
    weeklyHourLimitMinutes: 2880,
    active: true,
    qualifications: [
      {
        id: "dq-jan-general",
        doctorProfileId: "doctor-jan",
        qualificationId: "qual-general-surgery",
        validFrom: "2025-01-01",
        verificationStatus: "VALID",
      },
    ],
  },
  {
    id: "doctor-maria",
    userId: "user-doctor-maria",
    licenseNumber: "PWZ-1003",
    employmentType: "EMPLOYMENT_CONTRACT",
    optOutSigned: false,
    weeklyHourLimitMinutes: 2275,
    active: false,
    qualifications: [
      {
        id: "dq-maria-general",
        doctorProfileId: "doctor-maria",
        qualificationId: "qual-general-surgery",
        validFrom: "2025-01-01",
        verificationStatus: "VALID",
      },
      {
        id: "dq-maria-trauma",
        doctorProfileId: "doctor-maria",
        qualificationId: "qual-trauma",
        validFrom: "2025-01-01",
        verificationStatus: "VALID",
      },
    ],
  },
  {
    id: "doctor-piotr",
    userId: "user-doctor-piotr",
    licenseNumber: "PWZ-1004",
    employmentType: "CIVIL_CONTRACT",
    optOutSigned: true,
    weeklyHourLimitMinutes: 2880,
    active: true,
    qualifications: [
      {
        id: "dq-piotr-general",
        doctorProfileId: "doctor-piotr",
        qualificationId: "qual-general-surgery",
        validFrom: "2025-01-01",
        verificationStatus: "VALID",
      },
    ],
  },
];

export const adminUsersFixture: AdminUserFixture[] = [
  {
    user: usersFixture[0],
    primaryRole: "COORDINATOR",
    departmentName: "Oddział Chirurgii",
  },
  {
    user: usersFixture[1],
    primaryRole: "DOCTOR",
    departmentName: "Oddział Chirurgii",
  },
  {
    user: usersFixture[2],
    primaryRole: "DOCTOR",
    departmentName: "Oddział Chirurgii",
  },
  {
    user: usersFixture[3],
    primaryRole: "ADMIN",
  },
];

export const doctorDirectoryFixture: DoctorDirectoryFixture[] = [
  {
    user: {
      ...usersFixture[1],
      firstName: "Anna",
      lastName: "Kowalska",
      email: "a.kowalska@hospital.pl",
    },
    profile: doctorProfilesFixture[0],
    qualificationNames: ["Chirurgia ogólna", "Chirurgia naczyniowa"],
    shiftsThisMonth: 8,
    availabilitySubmitted: true,
  },
  {
    user: usersFixture[4],
    profile: doctorProfilesFixture[1],
    qualificationNames: ["Chirurgia ogólna"],
    shiftsThisMonth: 7,
    availabilitySubmitted: true,
  },
  {
    user: usersFixture[2],
    profile: doctorProfilesFixture[2],
    qualificationNames: ["Chirurgia ogólna", "Traumatologia"],
    shiftsThisMonth: 0,
    availabilitySubmitted: false,
  },
  {
    user: usersFixture[5],
    profile: doctorProfilesFixture[3],
    qualificationNames: ["Chirurgia ogólna"],
    shiftsThisMonth: 9,
    availabilitySubmitted: false,
  },
];

export const isActiveUserStatus = (status: UserStatus) => status === "ACTIVE";
