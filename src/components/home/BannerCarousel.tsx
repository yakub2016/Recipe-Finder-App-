import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { colors } from "../../constants/theme";

// Banner images from src/assets/images/banners/
const BANNERS = [
  require("../../assets/images/banners/banner1.png"),
  require("../../assets/images/banners/banner2.png"),
  require("../../assets/images/banners/banner3.png"),
  require("../../assets/images/banners/banner4.png"),
];

const AUTO_SLIDE_MS = 2500;
const SIDE_PADDING = 20;
// Most banners are 1672x941 (about 1.78:1). Use that ratio so nothing is cropped.
const ASPECT = 1672 / 941;

export default function BannerCarousel() {
  const { width } = useWindowDimensions();
  const pageWidth = width; // each page is exactly the screen width (paging snaps to this)
  const imageWidth = width - SIDE_PADDING * 2;
  const imageHeight = imageWidth / ASPECT;

  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  // Auto-slide, looping back to the first banner.
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % BANNERS.length), AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, []);

  // Move the list to the current index (auto-slide or after a swipe).
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: index * pageWidth, animated: true });
  }, [index, pageWidth]);

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        getItemLayout={(_, i) => ({ length: pageWidth, offset: pageWidth * i, index: i })}
        onMomentumScrollEnd={(e) => {
          setIndex(Math.round(e.nativeEvent.contentOffset.x / pageWidth));
        }}
        renderItem={({ item }) => (
          <View style={[styles.page, { width: pageWidth }]}>
            <Image
              source={item}
              style={{ width: imageWidth, height: imageHeight, borderRadius: 22 }}
              contentFit="contain"
              transition={250}
            />
          </View>
        )}
      />

      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 18,
  },
  page: {
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.accent,
  },
});
