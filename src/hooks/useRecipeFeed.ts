import { useState } from "react";
import { useAsync } from "./useAsync";
import { useDebouncedValue } from "./useDebouncedValue";
import { recipeService } from "../services/recipes";

/**
 * Shared data for Home and Explore.
 * - Typing in search (debounced 400ms) switches to /recipes/search.
 * - Picking a category switches to /recipes/tag/{tag}.
 * - Otherwise shows the full /recipes list.
 */
export function useRecipeFeed() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query.trim(), 400);

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

  return {
    query,
    setQuery,
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
