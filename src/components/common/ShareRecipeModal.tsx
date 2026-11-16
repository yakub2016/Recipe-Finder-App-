import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { Modal, Pressable, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import type { Recipe } from "../../types/recipe";
import { colors, radius } from "../../constants/theme";
import { formatMinutes } from "../../utils/format";
import { PLAY_STORE_URL, buildShareMessage } from "../../utils/share";

type Props = {
  visible: boolean;
  recipe: Recipe;
  onClose: () => void;
};

/** Bottom-sheet share modal. Shares a deep link that opens the recipe in the app. */
export default function ShareRecipeModal({ visible, recipe, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({ message: buildShareMessage(recipe) });
    } catch {
      // user dismissed the share sheet or sharing failed; nothing to do
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(PLAY_STORE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <SafeAreaView edges={["bottom"]} style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>Share recipe</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10} accessibilityLabel="Close">
              <Ionicons name="close" size={22} color="#F5C518" />
            </TouchableOpacity>
          </View>

          <View style={styles.preview}>
            <Image source={{ uri: recipe.image }} style={styles.thumb} contentFit="cover" />
            <View style={styles.previewText}>
              <Text style={styles.recipeName} numberOfLines={2}>
                {recipe.name}
              </Text>
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={13} color="#F5C518" />
                <Text style={styles.metaText}>{formatMinutes(totalTime)}</Text>
                <Ionicons name="star" size={13} color="#F5C518" />
                <Text style={styles.metaText}>{recipe.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.85} onPress={handleShare} style={styles.primary}>
            <Ionicons name="share-social-outline" size={20} color="#F5C518" />
            <Text style={styles.primaryText}>Share with apps</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} onPress={handleCopy} style={styles.secondary}>
            <Ionicons name={copied ? "checkmark" : "link-outline"} size={20} color="#F5C518" />
            <Text style={styles.secondaryText}>{copied ? "Link copied" : "Copy link"}</Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            The link opens the Play Store page. Anyone who already has the app can open the recipe directly.
          </Text>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(26,26,26,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  previewText: {
    flex: 1,
    gap: 6,
  },
  recipeName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: colors.muted,
    marginRight: 6,
  },
  primary: {
    marginTop: 18,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: "#1E1A17",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondary: {
    marginTop: 10,
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: "#F5C518",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  note: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    marginTop: 14,
  },
});
