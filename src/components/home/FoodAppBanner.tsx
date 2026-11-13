import { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReAnimated, { FadeIn, FadeInUp, SlideInLeft } from "react-native-reanimated";

const TITLE_WORDS = ["India's", "biggest", "food", "order", "app"];
const ICONS = ["restaurant", "fast-food", "bicycle"] as const;

/** Icon that bobs up and down forever, starting after `delay` ms. */
function BobbingIcon({
  name,
  delay,
}: {
  name: (typeof ICONS)[number];
  delay: number;
}) {
  const [offset] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(offset, { toValue: -10, duration: 500, useNativeDriver: true }),
        Animated.timing(offset, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [offset, delay]);

  return (
    <Animated.View style={{ transform: [{ translateY: offset }] }}>
      <Ionicons name={name} size={30} color="#F5C518" />
    </Animated.View>
  );
}

/**
 * Animated promo line for the bottom of Home (no card).
 * Mount it after the recipe grid has loaded so it plays after the grid.
 */
export default function FoodAppBanner() {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconRow}>
        {ICONS.map((name, i) => (
          <BobbingIcon key={name} name={name} delay={i * 220} />
        ))}
      </View>

      <View style={styles.titleRow}>
        {TITLE_WORDS.map((word, i) => (
          <ReAnimated.Text
            key={`${word}-${i}`}
            entering={FadeInUp.delay(300 + i * 110).duration(450).springify().damping(14)}
            style={styles.word}
          >
            {word}
          </ReAnimated.Text>
        ))}
      </View>

      <ReAnimated.View
        entering={SlideInLeft.delay(900).duration(600)}
        style={styles.underline}
      />

      <ReAnimated.Text
        entering={FadeIn.delay(1100).duration(500)}
        style={styles.subtitle}
      >
        Fresh meals, fast delivery, every day.
      </ReAnimated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 10,
  },
  iconRow: {
    flexDirection: "row",
    gap: 22,
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 8,
  },
  word: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  underline: {
    width: 120,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#F5C518",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#8A7F78",
    textAlign: "center",
    marginTop: 4,
  },
});
