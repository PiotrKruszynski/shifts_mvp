import type { Role } from "../domain/types";
import { ApiError, apiRequest, authTokenStore } from "../api/client";
import { shouldUseMockApi } from "../api/config";
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

const demoAccounts: Record<string, Pick<AuthSession, "role" | "redirectPath" | "userId">> = {
  "admin@hospital.pl": { userId: "user-admin-piotr", role: "ADMIN", redirectPath: "/admin" },
  "coordinator@hospital.pl": { userId: "user-coordinator-jan", role: "COORDINATOR", redirectPath: "/coordinator" },
  "doctor@hospital.pl": { userId: "user-doctor-anna", role: "DOCTOR", redirectPath: "/doctor" },
};

const loginAliases: Record<string, string> = {
  "admin@hospital.pl": "admin@shifts.test",
  "coordinator@hospital.pl": "koordynator@shifts.test",
  "doctor@hospital.pl": "lekarz1@shifts.test",
};

const redirectForRole: Record<Role, string> = {
  ADMIN: "/admin",
  COORDINATOR: "/coordinator",
  DOCTOR: "/doctor",
};

const demoLogin = (input: LoginInput): AuthSession => {
  const email = input.email.trim().toLowerCase();
  const session = demoAccounts[email];

  if (!session || input.password !== "password123") {
    throw new ApiError(401, "INVALID_DEMO_CREDENTIALS", "Nieprawidłowy e-mail lub hasło demo.");
  }

  // Demo-only fallback for public frontend deployments without a configured backend URL.
  authTokenStore.save(`demo-token:${session.userId}`, `demo-refresh-token:${session.userId}`);
  return session;
};

const demoSignupSession = (email: string): AuthSession => {
  const normalizedEmail = email.trim().toLowerCase();
  const session = demoAccounts[normalizedEmail]
    ?? (normalizedEmail.includes("coordinator")
      ? demoAccounts["coordinator@hospital.pl"]
      : normalizedEmail.includes("admin")
        ? demoAccounts["admin@hospital.pl"]
        : demoAccounts["doctor@hospital.pl"]);

  authTokenStore.save(`demo-token:${session.userId}`, `demo-refresh-token:${session.userId}`);
  return session;
};

const toSession = (response: {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; roles: { role: Role }[] };
}): AuthSession => {
  authTokenStore.save(response.accessToken, response.refreshToken);
  const role = response.user.roles.find((item) => item.role === "ADMIN")?.role
    ?? response.user.roles.find((item) => item.role === "COORDINATOR")?.role
    ?? response.user.roles[0]?.role
    ?? "DOCTOR";

  return {
    userId: response.user.id,
    role,
    redirectPath: redirectForRole[role],
  };
};

export const authService = {
  async login(input: LoginInput): Promise<AuthSession> {
    if (shouldUseMockApi()) {
      return mockMutate(() => demoLogin(input));
    }

    const email = loginAliases[input.email.toLowerCase()] ?? input.email;
    return toSession(
      await apiRequest("/auth/login", {
        method: "POST",
        body: { email, password: input.password },
      }),
    );
  },

  logout(): void {
    authTokenStore.clear();
  },

  resetPassword(email: string): Promise<{ email: string; sent: true }> {
    if (!shouldUseMockApi()) {
      return apiRequest("/auth/password-reset-requests", {
        method: "POST",
        body: { email },
      });
    }

    return mockMutate(() => ({ email, sent: true }));
  },

  async completeInvitationSignup(input: InvitationSignupInput): Promise<AuthSession> {
    if (shouldUseMockApi()) {
      return mockMutate(() => demoSignupSession(input.email));
    }

    return toSession(
      await apiRequest("/doctor-invitations/accept", {
        method: "POST",
        body: {
          token: input.invitationToken,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: input.password,
        },
      }),
    );
  },
};
