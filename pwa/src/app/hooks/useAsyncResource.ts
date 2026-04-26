import { useEffect, useState, type DependencyList } from "react";

type AsyncResourceState<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: string };

export function useAsyncResource<T>(loader: () => Promise<T>, dependencies: DependencyList = []) {
  const [state, setState] = useState<AsyncResourceState<T>>({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    let active = true;

    setState({ status: "loading", data: null, error: null });

    loader()
      .then((data) => {
        if (active) {
          setState({ status: "success", data, error: null });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "error",
            data: null,
            error: error instanceof Error ? error.message : "Nie udało się pobrać danych.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, dependencies);

  return state;
}
