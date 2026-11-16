import type { Recipe } from "../types/recipe";

// Must match android.package in app.json (used for the Play Store link).
const ANDROID_PACKAGE = "com.spackdigi.hangerstation";

/** Opens the app's Play Store page. Works for anyone, even without the app installed. */
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

/** Deep link that opens this recipe when the app is already installed. */
export function buildRecipeLink(recipeId: number): string {
  return `myapp://recipe/${recipeId}`;
}

/** Message for the share sheet: Play Store link first, then the recipe deep link. */
export function buildShareMessage(recipe: Recipe): string {
  return [
    `${recipe.name} on Hanger Station.`,
    `Get the app: ${PLAY_STORE_URL}`,
    `Already have it? Open the recipe: ${buildRecipeLink(recipe.id)}`,
  ].join("\n");
}
