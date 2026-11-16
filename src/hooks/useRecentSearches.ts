import { useCallback, useEffect, useState } from "react";
import {
  clearRecentSearches,
  getRecentSearches,
  saveRecentSearches,
} from "../lib/recentSearches";

/** Recent search terms, most recent first, saved on the device. */
export function useRecentSearches() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    getRecentSearches().then((saved) => {
      if (active) setItems(saved);
    });
    return () => {
      active = false;
    };
  }, []);

  const remember = useCallback(
    (term: string) => {
      const clean = term.trim();
      if (!clean) return;
      const next = [
        clean,
        ...items.filter((x) => x.toLowerCase() !== clean.toLowerCase()),
      ].slice(0, 6);
      setItems(next);
      saveRecentSearches(next);
    },
    [items],
  );

  const clear = useCallback(() => {
    setItems([]);
    clearRecentSearches();
  }, []);

  return { items, remember, clear };
}
