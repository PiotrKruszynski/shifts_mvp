import { mockSeed } from "../mocks/seed";
import type { AdminUserFixture } from "../fixtures/users.fixture";
import type { User } from "../domain/types";
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
    return mockResolve(mockSeed.users);
  },

  listAdminUsers(): Promise<AdminUserListItem[]> {
    return mockResolve(mockSeed.adminUsers);
  },

  listAvailableCoordinators(): Promise<AvailableCoordinator[]> {
    return mockResolve(availableCoordinators);
  },

  inviteUser(input: InviteUserInput): Promise<User> {
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
