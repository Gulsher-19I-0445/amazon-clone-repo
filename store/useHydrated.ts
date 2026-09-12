import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during server render and the first client render, `true` afterwards.
 * Persisted store values (localStorage) differ from the server snapshot, so
 * components read them only once hydrated to avoid hydration mismatches.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
