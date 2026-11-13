import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius } from "../../../constants/theme";
import { useAsync } from "../../../hooks/useAsync";
import { recipeService } from "../../../services/recipes";
import { formatMinutes, capitalize } from "../../../utils/format";
import type { Recipe } from "../../../types/recipe";
import StateView from "../../../components/common/StateView";
import FavoriteButton from "../../../components/common/FavoriteButton";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const recipe = useAsync(() => recipeService.getById(numericId), [numericId]);
  const r = recipe.data;

  const isReady = !recipe.loading && !recipe.error && !!r;

  if (!isReady || !r) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" />
        <StateView
          loading={recipe.loading}
          error={recipe.error}
          onRetry={recipe.reload}
          empty={!recipe.loading && !recipe.error && !r}
          emptyText="This recipe could not be found."
        >
          {null}
        </StateView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <FlatList<string>
        data={r.instructions}
        keyExtractor={(_, i) => `step-${i}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<DetailHeader recipe={r} />}
        renderItem={({ item, index }) => (
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

function DetailHeader({ recipe: r }: { recipe: Recipe }) {
  return (
    <View>
      <Image source={{ uri: r.image }} style={styles.hero} contentFit="cover" />

      <SafeAreaView edges={["top"]} style={styles.topBar} pointerEvents="box-none">
        <TouchableOpacity onPress={() => router.back()} style={styles.roundBtn} accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color="#F5C518" />
        </TouchableOpacity>
        <FavoriteButton id={r.id} size={20} style={styles.roundBtn} />
      </SafeAreaView>

      <View style={styles.body}>
        <Text style={styles.name}>{r.name}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={15} color="#F5C518" />
          <Text style={styles.ratingText}>
            {r.rating.toFixed(1)} ({r.reviewCount} reviews)
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Stat icon="time-outline" label="Total" value={formatMinutes(r.prepTimeMinutes + r.cookTimeMinutes)} />
          <Stat icon="people-outline" label="Servings" value={String(r.servings)} />
          <Stat icon="flame-outline" label="Difficulty" value={capitalize(r.difficulty)} />
        </View>

        <Text style={styles.heading}>Ingredients</Text>
        <View style={styles.card}>
          {r.ingredients.map((item, i) => (
            <View key={`${item}-${i}`} style={styles.ingredientRow}>
              <View style={styles.bullet} />
              <Text style={styles.ingredientText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.heading}>Instructions</Text>
      </View>
    </View>
  );
}

function Stat({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={18} color="#F5C518" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  hero: {
    width: "100%",
    height: 300,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    marginTop: -24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 13,
    color: colors.muted,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  heading: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  ingredientText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.accent,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});
