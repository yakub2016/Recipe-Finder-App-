import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";
import { hasCompletedOnboarding } from "../lib/onboarding";
import { getCurrentUser } from "../lib/localAuth";


const Onboarding = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topLeftLeaf} />
      <View style={styles.topRightLeaf} />

      {/* Title */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.happy}>Happy </Text>
          <Text style={styles.food}>Food</Text>
        </View>
        <Text style={styles.delivery}>Delivery</Text>
        <Text style={styles.subtitle}>
          5000+ best free food in our{"\n"}restaurant service
        </Text>
      </View>

      <View style={styles.imageWrap}>
        <Image
          source={require("../../assets/images/homeworkdirartifactshappy-food.gif")}
          style={styles.heroImage}
        
        />
      </View>

      <TouchableOpacity
        style={styles.startBtn}
        activeOpacity={0.85}
        onPress={async () => {
          const done = await hasCompletedOnboarding();
          if (!done) {
            router.push("/onboarding");
            return;
          }
          const user = await getCurrentUser();
          router.push(user ? "/home" : "/login");
        }}
      >
        <Text style={styles.startText}>Start</Text>
      </TouchableOpacity>

      <View style={styles.bottomLeftLeaf} />
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
    paddingHorizontal: 24,
  },

  header: {
    marginTop: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  happy: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "System",
  },
  food: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F5C518",
    fontFamily: "System",
  },
  delivery: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#8A8A8A",
    marginTop: 12,
    lineHeight: 20,
  },

  imageWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  heroImage: {
    width: 800,
    height: 600,
  },

  startBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#F5C518",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 30,
    marginRight: 8,
    elevation: 4,
    shadowColor: "#F5C518",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startText: {
    color: "#1A1A1A",
    fontSize: 15,
    fontWeight: "600",
  },

  topLeftLeaf: {
    position: "absolute",
    top: -20,
    left: -30,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F5C518",
    opacity: 0.9,
    transform: [{ rotate: "-20deg" }],
  },
  topRightLeaf: {
    position: "absolute",
    top: 30,
    right: -25,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F5C518",
    opacity: 0.85,
    transform: [{ rotate: "25deg" }],
  },
  bottomLeftLeaf: {
    position: "absolute",
    bottom: -30,
    left: -40,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F5C518",
    opacity: 0.9,
  },
});
