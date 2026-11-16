import { useCallback, useState } from "react";
import { Keyboard } from "react-native";
import { useAsync } from "./useAsync";
import { useDebouncedValue } from "./useDebouncedValue";
import { useRecentSearches } from "./useRecentSearches";
import { recipeService } from "../services/recipes";

/**
 * Shared data for Home and Explore.
 * - Typing (debounced 250ms) switches the grid to /recipes/search.
 * - Picking a category switches it to /recipes/tag/{tag}.
 * - Otherwise shows the full /recipes list.
 * - `open` controls the live suggestion panel under the search bar.
 */
export function useRecipeFeed() {
  const [query, setQueryText] = useState("");
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query.trim(), 250);
  const recent = useRecentSearches();

  const all = useAsync(() => recipeService.list(30), []);
  const tags = useAsync(() => recipeService.tags(), []);

  const searching = debouncedQuery.length > 0;
  const filterSource = searching
    ? () => recipeService.search(debouncedQuery)
    : tag !== null
      ? () => recipeService.byTag(tag)
      : null;
  const filtered = useAsync(filterSource, [debouncedQuery, tag]);

  const filterActive = searching || tag !== null;
  const active = filterActive ? filtered : all;

  // Typing opens the suggestion panel.
  const setQuery = useCallback((text: string) => {
    setQueryText(text);
    setOpen(true);
  }, []);

  // Pick a recent term or a suggestion: fill the search and keep the panel open.
  const pickTerm = useCallback((term: string) => {
    setQueryText(term);
    setOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    Keyboard.dismiss();
  }, []);

  return {
    query,
    setQuery,
    open,
    closeSearch,
    pickTerm,
    recent: recent.items,
    rememberSearch: recent.remember,
    clearRecent: recent.clear,
    tag,
    setTag,
    tags: tags.data ?? [],
    tagsError: tags.error,
    recipes: active.data ?? [],
    allRecipes: all.data ?? [],
    allLoading: all.loading,
    allError: all.error,
    loading: active.loading,
    error: active.error,
    reload: active.reload,
    // Resolves when the list, categories and current filter have all reloaded.
    refresh: async () => {
      await Promise.all([all.refetch(), tags.refetch(), filtered.refetch()]);
    },
    filterActive,
    searching,
  };
}
