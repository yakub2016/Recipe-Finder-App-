import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image } from "expo-image";
import { ActivityIndicator, Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius } from "../../constants/theme";
import { useAsync } from "../../hooks/useAsync";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { recipeService } from "../../services/recipes";
import type { Recipe } from "../../types/recipe";
import { formatMinutes } from "../../utils/format";

type Props = {
  query: string;
  open: boolean;
  recent: string[];
  onPickTerm: (term: string) => void;
  onRemember: (term: string) => void;
  onClearRecent: () => void;
  onClose: () => void;
};

const MAX_SUGGESTIONS = 5;

/** Live suggestions under the search bar: matches while typing, recent searches when empty. */
export default function SearchSuggestions({
  query,
  open,
  recent,
  onPickTerm,
  onRemember,
  onClearRecent,
  onClose,
}: Props) {
  const term = query.trim();
  const live = useDebouncedValue(term, 200);
  const matches = useAsync(live ? () => recipeService.search(live) : null, [live]);

  if (!open) return null;

  // Empty query: show recent searches (if any).
  if (!term) {
    if (recent.length === 0) return null;
    return (
      <View style={styles.panel}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Recent searches</Text>
          <TouchableOpacity onPress={onClearRecent} hitSlop={8}>
            <Text style={styles.clear}>Clear</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chips}>
          {recent.map((item) => (
            <TouchableOpacity key={item} style={styles.chip} onPress={() => onPickTerm(item)}>
              <Ionicons name="time-outline" size={14} color="#F5C518" />
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  const results: Recipe[] = (matches.data ?? []).slice(0, MAX_SUGGESTIONS);
  // Only show results that belong to what the user has typed right now.
  const typingAhead = term !== live;

  const pickRecipe = (recipe: Recipe) => {
    onRemember(term);
    Keyboard.dismiss();
    onClose();
    router.push(`/recipe/${recipe.id}`);
  };

  const seeAll = () => {
    onRemember(term);
    Keyboard.dismiss();
    onClose();
  };

  return (
    <View style={styles.panel}>
      {(matches.loading || typingAhead) && (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color="#F5C518" />
          <Text style={styles.muted}>Searching...</Text>
        </View>
      )}

      {!matches.loading && !typingAhead && results.length === 0 && (
        <Text style={styles.empty}>No matches for &quot;{term}&quot;.</Text>
      )}

      {!matches.loading &&
        !typingAhead &&
        results.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => pickRecipe(recipe)}
          >
            <Image source={{ uri: recipe.image }} style={styles.thumb} contentFit="cover" />
            <View style={styles.itemText}>
              <Text style={styles.itemName} numberOfLines={1}>
                {recipe.name}
              </Text>
              <Text style={styles.itemMeta} numberOfLines={1}>
                {recipe.cuisine} · {formatMinutes(recipe.prepTimeMinutes + recipe.cookTimeMinutes)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </TouchableOpacity>
        ))}

      {!matches.loading && !typingAhead && (matches.data?.length ?? 0) > 0 && (
        <TouchableOpacity style={styles.seeAll} onPress={seeAll}>
          <Ionicons name="search" size={15} color="#F5C518" />
          <Text style={styles.seeAllText}>See all results for &quot;{term}&quot;</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 10,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#8A5A2B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  heading: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  clear: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  muted: {
    fontSize: 13,
    color: colors.muted,
  },
  empty: {
    fontSize: 14,
    color: colors.muted,
    paddingVertical: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
});
