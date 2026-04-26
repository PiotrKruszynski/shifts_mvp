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
    return mockResolve(mockSeed.doctorProfiles);
  },

  listDoctorDirectory(): Promise<DoctorDirectoryEntry[]> {
    return mockResolve(mockSeed.doctors);
  },

  getCurrentDoctorContext(): Promise<CurrentDoctorContext> {
    return mockResolve(currentDoctorContext);
  },
};
