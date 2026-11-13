import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../constants/theme";
import { useRecipeFeed } from "../../../hooks/useRecipeFeed";
import StateView from "../../../components/common/StateView";
import RecipeFlatList from "../../../components/common/RecipeFlatList";
import SearchBar from "../../../components/common/SearchBar";
import CategoryChips from "../../../components/home/CategoryChips";

export default function ExploreScreen() {
  const feed = useRecipeFeed();

  const header = (
    <View>
      <Text style={styles.title}>Explore</Text>

      <View style={styles.block}>
        <SearchBar value={feed.query} onChangeText={feed.setQuery} placeholder="Search any recipe" />
      </View>

      <View style={styles.block}>
        <CategoryChips tags={feed.tags} selected={feed.tag} onSelect={feed.setTag} />
      </View>
    </View>
  );

  const empty = (
    <StateView
      loading={feed.loading}
      error={feed.error}
      onRetry={feed.reload}
      empty={feed.recipes.length === 0}
      emptyText="No recipes found. Try another search or category."
    >
      {null}
    </StateView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <RecipeFlatList recipes={feed.recipes} header={header} empty={empty} />
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
  block: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
});
