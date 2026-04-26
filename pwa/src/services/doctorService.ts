import { apiRequest, type PageResponse } from "../api/client";
import { toDoctorDirectoryEntry } from "../api/adapters";
import { shouldUseMockApi } from "../api/config";
import type { Assignment, AvailabilityDeclaration, User } from "../domain/types";
import type { DoctorProfile } from "../domain/types";
import type { DoctorDirectoryFixture } from "../fixtures/users.fixture";
import { mockSeed } from "../mocks/seed";
import { mockResolve } from "./mockTransport";

export type DoctorDirectoryEntry = DoctorDirectoryFixture;

export interface CurrentDoctorContext {
  doctorProfileId: string;
  userId: string;
  firstName: string;
  fullName: string;
  departmentName: string;
}

export const currentDoctorContext: CurrentDoctorContext = {
  doctorProfileId: "doctor-anna",
  userId: "user-doctor-anna",
  firstName: "Anna",
  fullName: "Anna Kowalska",
  departmentName: "Oddział Chirurgii",
};

export const doctorService = {
  listDoctorProfiles(): Promise<DoctorProfile[]> {
    if (!shouldUseMockApi()) {
      return apiRequest<PageResponse<DoctorProfile>>("/doctor-profiles").then((response) => response.data);
    }

    return mockResolve(mockSeed.doctorProfiles);
  },

  async listDoctorDirectory(): Promise<DoctorDirectoryEntry[]> {
    if (!shouldUseMockApi()) {
      const [profiles, users, currentSchedule] = await Promise.all([
        apiRequest<PageResponse<DoctorProfile>>("/doctor-profiles").then((response) => response.data),
        apiRequest<PageResponse<User>>("/users").then((response) => response.data),
        apiRequest<{ id: string }>("/schedules/current"),
      ]);
      const [assignments, availability] = await Promise.all([
        apiRequest<{ data: Assignment[] }>(`/schedules/${currentSchedule.id}/assignments`).then((response) => response.data),
        apiRequest<{ data: AvailabilityDeclaration[] }>(`/schedules/${currentSchedule.id}/availability`).then(
          (response) => response.data,
        ),
      ]);
      return profiles.map((profile) =>
        toDoctorDirectoryEntry(
          profile,
          users,
          assignments.filter((assignment) => assignment.doctorProfileId === profile.id).length,
          availability.some((item) => item.doctorProfileId === profile.id && item.status === "SUBMITTED"),
        ),
      );
    }

    return mockResolve(mockSeed.doctors);
  },

  getCurrentDoctorContext(): Promise<CurrentDoctorContext> {
    if (!shouldUseMockApi()) {
      return apiRequest("/doctor-profiles/me/context");
    }

    return mockResolve(currentDoctorContext);
  },
};
