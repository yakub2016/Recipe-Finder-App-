import { useCallback, useEffect, useState } from "react";

type Result<T> = { key: string; data: T | null; error: string | null };

/**
 * Runs `fn` whenever `deps` change (or reload() is called).
 * Pass `null` as fn to skip the request entirely.
 */
export function useAsync<T>(fn: (() => Promise<T>) | null, deps: unknown[]) {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);

  const key = JSON.stringify([reloadKey, ...deps]);

  useEffect(() => {
    if (!fn) return;
    let active = true;

    fn()
      .then((data) => {
        if (active) setResult({ key, data, error: null });
      })
      .catch((e: unknown) => {
        if (active) {
          setResult({
            key,
            data: null,
            error: e instanceof Error ? e.message : "Something went wrong",
          });
        }
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  // Re-runs the request and resolves when it finishes (used by pull-to-refresh).
  const refetch = useCallback(async () => {
    if (!fn) return;
    try {
      const data = await fn();
      setResult({ key, data, error: null });
    } catch (e: unknown) {
      setResult({
        key,
        data: null,
        error: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  }, [fn, key]);

  if (fn === null) return { data: null, loading: false, error: null, reload, refetch };

  // Only trust results that belong to the current request key.
  const current = result && result.key === key ? result : null;
  return {
    data: current?.data ?? null,
    loading: current === null,
    error: current?.error ?? null,
    reload,
    refetch,
  };
}
