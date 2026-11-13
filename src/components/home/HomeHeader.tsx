import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";
import { useAsync } from "../../../src/hooks/useAsync";
import { getCurrentUser } from "../../../src/lib/localAuth";

export default function HomeHeader() {
  const user = useAsync(() => getCurrentUser(), []);
  const me = user.data;

  return (
    <View style={styles.row}>
      <View style={styles.greeting}>
        <Text style={styles.hello}>Hello, {me?.name}</Text>
        <Text style={styles.sub}>What would you like to cook today?</Text>
      </View>
      <TouchableOpacity
        style={styles.avatar}
        onPress={() => router.navigate("/profile")}
        accessibilityLabel="Open profile"
      >
        <Ionicons name="person" size={20} color="#F5C518" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    flex: 1,
    paddingRight: 12,
  },
  hello: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  sub: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
