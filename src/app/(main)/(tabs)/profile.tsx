import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius } from "../../../constants/theme";
import { useFavorites } from "../../../context/FavoritesContext";
import { useAsync } from "../../../hooks/useAsync";
import { getCurrentUser, logoutUser } from "../../../lib/localAuth";
import type { PublicUser } from "../../../lib/localAuth";
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
} from "../../../lib/preferences";
import ConfirmModal from "@/components/common/conformModal";

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
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

function detailsFor(user: PublicUser): DetailItem[] {
  return [
    { key: "name", icon: "person-outline", label: "Full name", value: user.name },
    { key: "email", icon: "mail-outline", label: "Email", value: user.email },
    {
      key: "phone",
      icon: "call-outline",
      label: "Phone",
      value: user.phone || "Not added",
    },
  ];
}

export default function ProfileScreen() {
  const { ids } = useFavorites();
  const user = useAsync(() => getCurrentUser(), []);
  const prefs = useAsync(() => getNotificationsEnabled(), []);
  const me = user.data;
  const details = me ? detailsFor(me) : [];
  const [logoutVisible, setLogoutVisible] = useState(false);

  // Reload the profile every time this tab is shown (e.g. after editing).
  const reloadUser = user.reload;
  const reloadPrefs = prefs.reload;
  useFocusEffect(
    useCallback(() => {
      reloadUser();
      reloadPrefs();
    }, [reloadUser, reloadPrefs]),
  );

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  const toggleNotifications = async (value: boolean) => {
    await setNotificationsEnabled(value);
    prefs.reload();
  };

  const header = (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Profile</Text>
        {me && (
          <TouchableOpacity
            onPress={() => router.push("/edit-profile")}
            style={styles.editPill}
            activeOpacity={0.85}
          >
            <Ionicons name="create-outline" size={15} color="#F5C518" />
            <Text style={styles.editPillText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

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
            <Text style={styles.statValue}>
              {me ? memberSince(me.createdAt) : "—"}
            </Text>
            <Text style={styles.statLabel}>Member since</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const footer = (
    <View>
      {/* Settings */}
      <Text style={styles.sectionLabel}>Settings</Text>
      <View style={styles.settingsCard}>
        <SettingRow
          icon="create-outline"
          label="Edit profile"
          onPress={() => router.push("/edit-profile")}
        />
        <SettingRow
          icon="heart-outline"
          label="My favorites"
          value={`${ids.length}`}
          onPress={() => router.navigate("/favorites")}
        />
        <SettingRow
          icon="lock-closed-outline"
          label="Change password"
          onPress={() => router.push("/forgotpassword")}
        />
        <SettingRow
          icon="notifications-outline"
          label="Notifications"
          right={
            <Switch
              value={prefs.data ?? true}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#E5E5E5", true: "#F5C518" }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <SettingRow
          icon="information-circle-outline"
          label="About Hanger Station"
          value="v1.0.0"
          last
          onPress={() =>
            Alert.alert(
              "Hanger Station",
              "Find, save and cook recipes from around the world.\nVersion 1.0.0",
            )
          }
        />
      </View>

      <TouchableOpacity
        style={styles.logout}
        onPress={() => setLogoutVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
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
        style={styles.list}
      />
      <ConfirmModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={() => {
          setLogoutVisible(false);
          handleLogout();
        }}
      />
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  label,
  value,
  right,
  last,
  onPress,
}: {
  icon: IconName;
  label: string;
  value?: string;
  right?: React.ReactNode;
  last?: boolean;
  onPress?: () => void;
}) {
  const content = (
    <View style={[styles.setRow, !last && styles.setRowBorder]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color="#F5C518" />
      </View>
      <Text style={styles.setLabel}>{label}</Text>
      {value ? <Text style={styles.setValue}>{value}</Text> : null}
      {right ?? <Ionicons name="chevron-forward" size={18} color={colors.muted} />}
    </View>
  );

  return onPress && !right ? (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      {content}
    </TouchableOpacity>
  ) : (
    content
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  editPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editPillText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  setRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  setLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  setValue: {
    fontSize: 13,
    color: colors.muted,
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
