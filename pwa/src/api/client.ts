import { apiConfig } from "./config";

const accessTokenKey = "shifts_mvp_access_token";
const refreshTokenKey = "shifts_mvp_refresh_token";

export interface PageResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown[];

  constructor(status: number, code: string, message: string, details: unknown[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const hasStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const authTokenStore = {
  getAccessToken(): string | null {
    return hasStorage() ? window.localStorage.getItem(accessTokenKey) : null;
  },

  save(accessToken: string, refreshToken: string): void {
    if (!hasStorage()) {
      return;
    }
    window.localStorage.setItem(accessTokenKey, accessToken);
    window.localStorage.setItem(refreshTokenKey, refreshToken);
  },

  clear(): void {
    if (!hasStorage()) {
      return;
    }
    window.localStorage.removeItem(accessTokenKey);
    window.localStorage.removeItem(refreshTokenKey);
  },
};

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

const messageForStatus = (status: number) => {
  if (status === 401) return "Sesja wygasła lub dane logowania są nieprawidłowe.";
  if (status === 403) return "Nie masz uprawnień do tej operacji.";
  if (status === 404) return "Nie znaleziono wymaganych danych.";
  if (status === 409) return "Operacja jest sprzeczna z aktualnym stanem danych.";
  if (status === 422) return "Dane naruszają reguły walidacji.";
  return "Nie udało się wykonać operacji API.";
};

const readError = async (response: Response) => {
  const fallback = messageForStatus(response.status);

  try {
    const payload = (await response.json()) as {
      code?: string;
      message?: string;
      details?: unknown[];
      violations?: unknown[];
    };
    return new ApiError(
      response.status,
      payload.code ?? `HTTP_${response.status}`,
      payload.message ?? fallback,
      payload.details ?? payload.violations ?? [],
    );
  } catch {
    return new ApiError(response.status, `HTTP_${response.status}`, fallback);
  }
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = authTokenStore.getAccessToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiConfig.baseUrl}${normalizePath(path)}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    throw await readError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export const queryString = (params: Record<string, string | number | boolean | undefined | null>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const value = search.toString();
  return value ? `?${value}` : "";
};
