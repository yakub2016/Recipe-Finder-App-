import type { Recipe, RecipeListResponse } from "../types/recipe";

const BASE_URL = "https://dummyjson.com";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

/** All DummyJSON recipe endpoints live here so UI code never builds URLs. */
export const recipeService = {
  list: (limit = 30) =>
    request<RecipeListResponse>(`/recipes?limit=${limit}`).then((r) => r.recipes),

  search: (query: string) =>
    request<RecipeListResponse>(`/recipes/search?q=${encodeURIComponent(query)}`).then(
      (r) => r.recipes,
    ),

  getById: (id: number) => request<Recipe>(`/recipes/${id}`),

  tags: () => request<string[]>(`/recipes/tags`),

  byTag: (tag: string) =>
    request<RecipeListResponse>(`/recipes/tag/${encodeURIComponent(tag)}`).then(
      (r) => r.recipes,
    ),
};
