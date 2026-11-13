import { ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import type { Recipe } from "../../types/recipe";
import RecipeCard from "../common/RecipeCard";

type Props = {
  recipes: Recipe[];
};

/** Horizontal carousel. Card width scales with the screen so about 2.2 cards show at once. */
export default function PopularRecipes({ recipes }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(200, (width - 40 - 12 * 2) / 2.2);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} width={cardWidth} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
  },
});
