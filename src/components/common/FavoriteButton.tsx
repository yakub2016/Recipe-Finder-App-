import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../../context/FavoritesContext";

type Props = {
  id: number;
  style?: StyleProp<ViewStyle>;
  size?: number;
};

export default function FavoriteButton({ id, style, size = 18 }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(id);

  return (
    <Pressable
      onPress={() => toggle(id)}
      hitSlop={8}
      style={[styles.button, style]}
      accessibilityLabel={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Ionicons
        name={active ? "heart" : "heart-outline"}
        size={size}
        color="#F5C518"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
});
