import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, radius } from "../../constants/theme";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
  open?: boolean;
  onCancel?: () => void;
};

/** Search field with a clear button and an optional Cancel while suggestions are open. */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search recipes",
  onFocus,
  onSubmitEditing,
  open,
  onCancel,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.wrap}>
        <Ionicons name="search" size={18} color="#F5C518" />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor="#B5AAA2"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="never"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            hitSlop={10}
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={18} color="#F5C518" />
          </TouchableOpacity>
        )}
      </View>

      {open && onCancel && (
        <TouchableOpacity onPress={onCancel} hitSlop={8} style={styles.cancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  wrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  cancel: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
});
