import { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { markOnboardingCompleted } from "../lib/onboarding";

const SLIDES = [
  {
    id: "1",
    image: require("../../assets/images/onboarding.png"),
    title: "Make Your Own Food\nStay at Home",
    description:
      "Select your preferred dish from our app and enjoy a delightful culinary experience today!",
  },
  {
    id: "2",
    image: require("../../assets/images/onboarding2.png"),
    title: "Get Delivery at Your\nFood Step",
    description: "Your food arrives at your doorstep. Just click and relax.",
  },
  {
    id: "3",
    image: require("../../assets/images/onboarding3.png"),
    title: "We Have 5000+\nReview On Our App",
    description:
      "Over 5,000 happy customers have reviewed our app. Check them out on the App Store.",
  },
];

const Onboarding = () => {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: { index?: number | null }[] }) => {
      const first = viewableItems[0]?.index;
      if (first != null) setIndex(first);
    },
    [],
  );

  const goTo = (i: number) => {
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  const finish = () => {
    markOnboardingCompleted();
    router.replace("/login");
  };

  const next = () => (isLast ? finish() : goTo(index + 1));
  const prev = () => index > 0 && goTo(index - 1);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={prev}
          style={styles.roundBtn}
          hitSlop={10}
          accessibilityLabel="Previous"
        >
          <Ionicons name="arrow-back" size={18} color="#F5C518" />
        </TouchableOpacity>

        <TouchableOpacity onPress={finish} style={styles.skipBtn} hitSlop={10}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.imageWrap}>
              <Image source={item.image} style={styles.image} contentFit="contain" />
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />

      {/* Footer: pagination + next */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <View
              key={s.id}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={next}
          style={styles.nextOuter}
          activeOpacity={0.85}
          accessibilityLabel={isLast ? "Get started" : "Next"}
        >
          <View style={styles.nextInner}>
            <Ionicons name="arrow-forward" size={22} color="#F5C518" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 56,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },
  skipBtn: {
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  slide: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    maxWidth: 340,
    maxHeight: 340,
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 26,
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 34,
  },
  description: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E5E5",
  },
  dotActive: {
    width: 28,
    backgroundColor: "#F5C518",
  },
  nextOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: "#F5C518",
    alignItems: "center",
    justifyContent: "center",
  },
  nextInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#1E1A17",
    alignItems: "center",
    justifyContent: "center",
  },
});
