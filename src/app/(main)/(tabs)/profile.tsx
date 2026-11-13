import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius } from "../../../constants/theme";
import { useFavorites } from "../../../context/FavoritesContext";
import { useAsync } from "../../../hooks/useAsync";
import { getCurrentUser, logoutUser } from "../../../lib/localAuth";
import type { PublicUser } from "../../../lib/localAuth";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type DetailItem = { key: string; icon: IconName; label: string; value: string };

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function memberSince(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function detailsFor(user: PublicUser): DetailItem[] {
  return [
    { key: "name", icon: "person-outline", label: "Full name", value: user.name },
    { key: "email", icon: "mail-outline", label: "Email", value: user.email },
    { key: "phone", icon: "call-outline", label: "Phone", value: user.phone || "Not added" },
  ];
}

export default function ProfileScreen() {
  const { ids } = useFavorites();
  const user = useAsync(() => getCurrentUser(), []);
  const me = user.data;
  const details = me ? detailsFor(me) : [];

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  const header = (
    <View>
      <Text style={styles.title}>Profile</Text>

      {/* Header card: solid yellow */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{me ? initials(me.name) : "?"}</Text>
        </View>
        <Text style={styles.name}>{me?.name ?? "Guest"}</Text>
        <Text style={styles.heroSub}>{me?.email ?? "Not signed in"}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{ids.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{me ? memberSince(me.createdAt) : "—"}</Text>
            <Text style={styles.statLabel}>Member since</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const footer = (
    <TouchableOpacity style={styles.logout} onPress={handleLogout} activeOpacity={0.85}>
      <Ionicons name="log-out-outline" size={18} color={colors.danger} />
      <Text style={styles.logoutText}>Log out</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={details}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name={item.icon} size={18} color="#F5C518" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowValue}>{item.value}</Text>
            </View>
          </View>
        )}
        // Wrap rows in a card look via the list container
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },
  hero: {
    borderRadius: 26,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#F5C518",
    shadowColor: "#F5C518",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    marginTop: 12,
  },
  heroSub: {
    fontSize: 14,
    color: "#3D3420",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: radius.md,
    paddingVertical: 12,
    alignSelf: "stretch",
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(26,26,26,0.15)",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  statLabel: {
    fontSize: 12,
    color: "#3D3420",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    backgroundColor: colors.card,
    marginTop: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginTop: 2,
  },
  logout: {
    marginTop: 24,
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.danger,
  },
});
