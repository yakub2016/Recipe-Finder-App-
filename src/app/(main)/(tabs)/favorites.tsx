import { StatusBar, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../constants/theme";
import { useFavorites } from "../../../context/FavoritesContext";
import { useAsync } from "../../../hooks/useAsync";
import { recipeService } from "../../../services/recipes";
import StateView from "../../../components/common/StateView";
import RecipeFlatList from "../../../components/common/RecipeFlatList";

export default function FavoritesScreen() {
  const { ids } = useFavorites();
  const key = ids.join(",");

  const favorites = useAsync(
    ids.length > 0 ? () => Promise.all(ids.map((id) => recipeService.getById(id))) : null,
    [key],
  );

  const header = <Text style={styles.title}>Favorites</Text>;

  const empty = (
    <StateView
      loading={ids.length > 0 && favorites.loading}
      error={ids.length > 0 ? favorites.error : null}
      onRetry={favorites.reload}
      empty={ids.length === 0}
      emptyText="No favorites yet. Tap the heart on a recipe to save it here."
    >
      {null}
    </StateView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <RecipeFlatList recipes={favorites.data ?? []} header={header} empty={empty} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16,
  },
});
