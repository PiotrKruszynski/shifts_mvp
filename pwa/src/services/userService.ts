import { apiRequest, type PageResponse } from "../api/client";
import { toAdminUser, toAvailableCoordinator } from "../api/adapters";
import { shouldUseMockApi } from "../api/config";
import { mockSeed } from "../mocks/seed";
import type { AdminUserFixture } from "../fixtures/users.fixture";
import type { Department, User } from "../domain/types";
import { mockMutate, mockResolve } from "./mockTransport";

export type AdminUserListItem = AdminUserFixture;

export interface AvailableCoordinator {
  id: string;
  name: string;
  email: string;
}

export interface InviteUserInput {
  email: string;
  firstName: string;
  lastName: string;
}

const availableCoordinators: AvailableCoordinator[] = [
  { id: "user-coordinator-piotr", name: "Piotr Wiśniewski", email: "p.wisniewski@hospital.pl" },
  { id: "user-coordinator-anna", name: "Anna Kowalczyk", email: "a.kowalczyk@hospital.pl" },
];

export const userService = {
  listUsers(): Promise<User[]> {
    if (!shouldUseMockApi()) {
      return apiRequest<PageResponse<User>>("/users").then((response) => response.data);
    }

    return mockResolve(mockSeed.users);
  },

  async listAdminUsers(): Promise<AdminUserListItem[]> {
    if (!shouldUseMockApi()) {
      const [users, departments] = await Promise.all([
        apiRequest<PageResponse<User>>("/users").then((response) => response.data),
        apiRequest<PageResponse<Department>>("/departments").then((response) => response.data),
      ]);
      return users.map((user) => toAdminUser(user, departments));
    }

    return mockResolve(mockSeed.adminUsers);
  },

  async listAvailableCoordinators(): Promise<AvailableCoordinator[]> {
    if (!shouldUseMockApi()) {
      const users = await apiRequest<PageResponse<User>>("/users?role=COORDINATOR").then((response) => response.data);
      return users.map(toAvailableCoordinator);
    }

    return mockResolve(availableCoordinators);
  },

  inviteUser(input: InviteUserInput): Promise<User> {
    if (!shouldUseMockApi()) {
      return apiRequest("/users", {
        method: "POST",
        body: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          roles: [{ role: "DOCTOR", scope: "DEPARTMENT" }],
        },
      });
    }

    return mockMutate(() => ({
      id: `user-invited-${input.email}`,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      status: "INVITED",
      roles: [],
      createdAt: "2026-04-26T10:00:00+02:00",
    }));
  },
};
