import { apiRequest, type PageResponse } from "../api/client";
import { shouldUseMockApi } from "../api/config";
import type { Department } from "../domain/types";
import { mockSeed } from "../mocks/seed";
import { mockMutate, mockResolve } from "./mockTransport";
import type { AvailableCoordinator } from "./userService";
import { userService } from "./userService";

export interface DepartmentCoordinatorSummary {
  id: string;
  name: string;
  coordinator: string | null;
  coordinatorEmail: string | null;
  doctorsCount: number;
  activeSchedules: number;
  assignedAt?: string;
}

export interface CreateDepartmentInput {
  name: string;
  hospitalName?: string;
}

const departmentSummaries: DepartmentCoordinatorSummary[] = [
  {
    id: "dep-surgery",
    name: "Oddział Chirurgii",
    coordinator: "Jan Kowalski",
    coordinatorEmail: "j.kowalski@hospital.pl",
    doctorsCount: 24,
    activeSchedules: 2,
    assignedAt: "2026-01-15",
  },
  {
    id: "dep-cardiology",
    name: "Oddział Kardiologii",
    coordinator: null,
    coordinatorEmail: null,
    doctorsCount: 18,
    activeSchedules: 0,
  },
  {
    id: "dep-neurology",
    name: "Oddział Neurologii",
    coordinator: "Maria Nowak",
    coordinatorEmail: "m.nowak@hospital.pl",
    doctorsCount: 15,
    activeSchedules: 1,
    assignedAt: "2026-02-10",
  },
];

export const departmentService = {
  listDepartments(): Promise<Department[]> {
    if (!shouldUseMockApi()) {
      return apiRequest<PageResponse<Department>>("/departments").then((response) => response.data);
    }

    return mockResolve(mockSeed.departments);
  },

  listDepartmentCoordinatorSummaries(): Promise<DepartmentCoordinatorSummary[]> {
    if (!shouldUseMockApi()) {
      return apiRequest<{ data: DepartmentCoordinatorSummary[] }>("/departments/coordinator-summaries").then(
        (response) => response.data,
      );
    }

    return mockResolve(departmentSummaries);
  },

  listAvailableCoordinators(): Promise<AvailableCoordinator[]> {
    return userService.listAvailableCoordinators();
  },

  createDepartment(input: CreateDepartmentInput): Promise<DepartmentCoordinatorSummary> {
    if (!shouldUseMockApi()) {
      return apiRequest<Department>("/departments", {
        method: "POST",
        body: {
          name: input.name,
          hospitalName: input.hospitalName || "Szpital Wojewodzki",
          timezone: "Europe/Warsaw",
        },
      }).then((department) => ({
        id: department.id,
        name: department.name,
        coordinator: null,
        coordinatorEmail: null,
        doctorsCount: 0,
        activeSchedules: 0,
      }));
    }

    return mockMutate(() => ({
      id: `dep-${input.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: input.name,
      coordinator: null,
      coordinatorEmail: null,
      doctorsCount: 0,
      activeSchedules: 0,
    }));
  },
};
