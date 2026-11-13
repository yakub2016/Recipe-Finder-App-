import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";
import type { Recipe } from "../../types/recipe";
import RecipeCard from "../common/RecipeCard";

type Props = {
  recipes: Recipe[];
};

const MAX_STAGGER = 8;

/**
 * Two-column grid. Cards fade and rise in with a stagger,
 * and slide smoothly when the list changes (search, category).
 */
export default function RecommendedGrid({ recipes }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 40 - 14) / 2;

  return (
    <View style={styles.grid}>
      {recipes.map((recipe, index) => (
        <Animated.View
          key={recipe.id}
          entering={FadeInDown.delay(Math.min(index, MAX_STAGGER) * 70)
            .duration(450)
            .springify()
            .damping(16)}
          layout={LinearTransition.springify().damping(18)}
        >
          <RecipeCard recipe={recipe} width={cardWidth} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    rowGap: 14,
  },
});
