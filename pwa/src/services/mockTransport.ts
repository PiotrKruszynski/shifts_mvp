export interface MockServiceOptions {
  latencyMs?: number;
  shouldFail?: boolean;
  failureMessage?: string;
}

export const mockApiConfig = {
  latencyMs: 0,
};

export class MockServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MockServiceError";
  }
}

const clone = <T>(value: T): T => structuredClone(value);

const wait = (latencyMs: number) =>
  new Promise<void>((resolve) => {
    if (latencyMs <= 0) {
      resolve();
      return;
    }

    window.setTimeout(resolve, latencyMs);
  });

export async function mockResolve<T>(data: T, options: MockServiceOptions = {}): Promise<T> {
  await wait(options.latencyMs ?? mockApiConfig.latencyMs);

  if (options.shouldFail) {
    throw new MockServiceError(options.failureMessage ?? "Mock service request failed");
  }

  return clone(data);
}

export async function mockMutate<T>(factory: () => T, options: MockServiceOptions = {}): Promise<T> {
  await wait(options.latencyMs ?? mockApiConfig.latencyMs);

  if (options.shouldFail) {
    throw new MockServiceError(options.failureMessage ?? "Mock service mutation failed");
  }

  return clone(factory());
}
