import { useMemo } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../constants/theme";
import { useRecipeFeed } from "../../../hooks/useRecipeFeed";
import { usePullToRefresh } from "../../../hooks/usePullToRefresh";
import StateView from "../../../components/common/StateView";
import RecipeFlatList from "../../../components/common/RecipeFlatList";
import SearchBar from "../../../components/common/SearchBar";
import HomeHeader from "../../../components/home/HomeHeader";
import BannerCarousel from "../../../components/home/BannerCarousel";
import CategoryChips from "../../../components/home/CategoryChips";
import PopularRecipes from "../../../components/home/PopularRecipes";
import FoodAppBanner from "../../../components/home/FoodAppBanner";
import { capitalize } from "../../../utils/format";

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export default function HomeScreen() {
  const feed = useRecipeFeed();
  const { refreshing, onRefresh } = usePullToRefresh(feed.refresh);

  // Top 4 by rating from the full list.
  const popular = useMemo(
    () => [...feed.allRecipes].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [feed.allRecipes],
  );

  const recommendedTitle = feed.searching
    ? "Search results"
    : feed.tag
      ? capitalize(feed.tag)
      : "Recommended";

  const header = (
    <View>
      {/* 1. Header */}
      <HomeHeader />

      {/* 2. Banner carousel */}
      <BannerCarousel />

      {/* 3. Search */}
      <View style={styles.block}>
        <SearchBar value={feed.query} onChangeText={feed.setQuery} />
      </View>

      {/* 4. Menu categories */}
      <View style={styles.block}>
        <CategoryChips tags={feed.tags} selected={feed.tag} onSelect={feed.setTag} />
      </View>

      {/* 5. Popular recipes */}
      <View style={styles.block}>
        <SectionTitle>Popular Recipes</SectionTitle>
        <StateView
          loading={feed.allLoading}
          error={feed.allError}
          empty={feed.allRecipes.length === 0}
          emptyText="No popular recipes right now."
          onRetry={feed.reload}
        >
          <PopularRecipes recipes={popular} />
        </StateView>
      </View>

      {/* 6. Recommended recipes (grid rows come from the FlatList below) */}
      <SectionTitle>{recommendedTitle}</SectionTitle>
    </View>
  );

  const empty = (
    <StateView
      loading={feed.loading}
      error={feed.error}
      onRetry={feed.reload}
      empty={feed.recipes.length === 0}
      emptyText={
        feed.searching ? `No recipes match "${feed.query.trim()}".` : "No recipes found."
      }
    >
      {null}
    </StateView>
  );

  // 7. Promo banner: shown only after the grid has loaded.
  const footer =
    !feed.loading && feed.recipes.length > 0 ? (
      <View style={styles.block}>
        <FoodAppBanner />
      </View>
    ) : null;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <RecipeFlatList
        recipes={feed.recipes}
        header={header}
        footer={footer}
        empty={empty}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  block: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
});
