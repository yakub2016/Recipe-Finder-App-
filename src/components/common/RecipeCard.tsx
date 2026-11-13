import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import type { Recipe } from "../../types/recipe";
import { colors, radius } from "../../constants/theme";
import { formatMinutes } from "../../utils/format";
import FavoriteButton from "./FavoriteButton";

type Props = {
  recipe: Recipe;
  width?: number;
};

export default function RecipeCard({ recipe, width }: Props) {
  const [scale] = useState(() => new Animated.Value(1));

  const springTo = (value: number, damping: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      damping,
      stiffness: 260,
      mass: 0.6,
    }).start();

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Animated.View style={[width ? { width } : null, { transform: [{ scale }] }]}>
    <Pressable
      onPressIn={() => springTo(0.96, 16)}
      onPressOut={() => springTo(1, 10)}
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      style={styles.card}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.45)"]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={styles.ratingPill}>
          <Ionicons name="star" size={11} color="#F5C518" />
          <Text style={styles.ratingText}>{recipe.rating.toFixed(1)}</Text>
        </View>

        <FavoriteButton id={recipe.id} style={styles.favorite} />
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {recipe.name}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={13} color="#F5C518" />
          <Text style={styles.metaText}>{formatMinutes(totalTime)}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText} numberOfLines={1}>
            {recipe.cuisine}
          </Text>
        </View>
      </View>
    </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#8A5A2B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  imageWrap: {
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ratingPill: {
    position: "absolute",
    left: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(26,26,26,0.72)",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  favorite: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  body: {
    padding: 12,
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    minHeight: 36,
    lineHeight: 18,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: colors.muted,
    flexShrink: 1,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.muted,
    marginHorizontal: 2,
  },
});
