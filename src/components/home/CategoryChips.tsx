import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../constants/theme";
import { capitalize } from "../../utils/format";

type Props = {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
};

export default function CategoryChips({ tags, selected, onSelect }: Props) {
  const items: (string | null)[] = [null, ...tags];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((tag) => {
        const active = tag === selected;
        return (
          <TouchableOpacity
            key={tag ?? "all"}
            onPress={() => onSelect(tag)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {tag === null ? "All" : capitalize(tag)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  textActive: {
    color: "#FFFFFF",
  },
});
