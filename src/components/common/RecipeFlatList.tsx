import type { ReactElement } from "react";
import { FlatList, RefreshControl, StyleSheet, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";
import type { Recipe } from "../../types/recipe";
import { colors } from "../../constants/theme";
import RecipeCard from "./RecipeCard";

type Props = {
  recipes: Recipe[];
  header?: ReactElement | null;
  footer?: ReactElement | null;
  empty?: ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
};

const MAX_STAGGER = 8;

/** Two-column recipe FlatList with staggered entrance, layout animation and optional pull-to-refresh. */
export default function RecipeFlatList({ recipes, header, footer, empty, refreshing, onRefresh }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 40 - 14) / 2;

  return (
    <FlatList
      data={recipes}
      numColumns={2}
      keyExtractor={(item) => String(item.id)}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={header ?? undefined}
      ListFooterComponent={footer ?? undefined}
      ListEmptyComponent={empty ?? undefined}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        ) : undefined
      }
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeInDown.delay(Math.min(index, MAX_STAGGER) * 70)
            .duration(450)
            .springify()
            .damping(16)}
          layout={LinearTransition.springify().damping(18)}
        >
          <RecipeCard recipe={item} width={cardWidth} />
        </Animated.View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    justifyContent: "space-between",
    marginBottom: 14,
  },
  content: {
    paddingBottom: 24,
  },
});
