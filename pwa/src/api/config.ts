export type ApiMode = "api" | "mock";

const env = import.meta.env as ImportMetaEnv & {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_API_MODE?: ApiMode;
};

const configuredBaseUrl = env.VITE_API_URL ?? env.VITE_API_BASE_URL ?? "";

export const apiConfig = {
  baseUrl: configuredBaseUrl,
  mode: env.VITE_API_MODE ?? (configuredBaseUrl ? "api" : "mock"),
};

export const shouldUseMockApi = () => apiConfig.mode === "mock" || !apiConfig.baseUrl;
