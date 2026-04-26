import type { Role } from "../domain/types";
import { mockMutate } from "./mockTransport";

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthSession {
  userId: string;
  role: Role;
  redirectPath: string;
}

export interface InvitationSignupInput {
  invitationToken: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const resolveSession = (email: string): AuthSession => {
  if (email.includes("coordinator")) {
    return { userId: "user-coordinator-jan", role: "COORDINATOR", redirectPath: "/coordinator" };
  }

  if (email.includes("admin")) {
    return { userId: "user-admin-piotr", role: "ADMIN", redirectPath: "/admin" };
  }

  return { userId: "user-doctor-anna", role: "DOCTOR", redirectPath: "/doctor" };
};

export const authService = {
  login(input: LoginInput): Promise<AuthSession> {
    return mockMutate(() => resolveSession(input.email));
  },

  resetPassword(email: string): Promise<{ email: string; sent: true }> {
    return mockMutate(() => ({ email, sent: true }));
  },

  completeInvitationSignup(input: InvitationSignupInput): Promise<AuthSession> {
    return mockMutate(() => resolveSession(input.email));
  },
};
