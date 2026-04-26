export type ApiMode = "api" | "mock";

const env = import.meta.env as ImportMetaEnv & {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_MODE?: ApiMode;
};

export const apiConfig = {
  baseUrl: env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1",
  mode: env.VITE_API_MODE ?? "api",
};

export const shouldUseMockApi = () => apiConfig.mode === "mock";
