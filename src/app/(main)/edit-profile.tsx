import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, radius } from "../../constants/theme";
import { useAsync } from "../../hooks/useAsync";
import { getCurrentUser, updateCurrentProfile } from "../../lib/localAuth";
import type { PublicUser } from "../../lib/localAuth";
import StateView from "../../components/common/StateView";

export default function EditProfileScreen() {
  const user = useAsync(() => getCurrentUser(), []);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#F5C518" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Edit profile</Text>
        <View style={styles.backBtn} />
      </View>

      <StateView
        loading={user.loading}
        error={user.error}
        onRetry={user.reload}
        empty={!user.loading && !user.data}
        emptyText="Log in to edit your profile."
      >
        {user.data ? <EditForm key={user.data.id} user={user.data} /> : null}
      </StateView>
    </SafeAreaView>
  );
}

function EditForm({ user }: { user: PublicUser }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (name.trim().length < 2) {
      Alert.alert("Name too short", "Enter at least 2 characters.");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (phone.trim() && digits.length < 7) {
      Alert.alert("Check phone number", "Enter a valid phone number or leave it empty.");
      return;
    }
    try {
      setSaving(true);
      await updateCurrentProfile({ name, phone });
      router.back();
    } catch (e: unknown) {
      Alert.alert("Could not save", e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Field label="Full name" icon="person-outline">
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#B5B5B5"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </Field>

          <Field label="Phone number" icon="call-outline">
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 00000 00000"
              placeholderTextColor="#B5B5B5"
              keyboardType="phone-pad"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </Field>

          <Field label="Email" icon="mail-outline">
            <TextInput style={[styles.input, styles.readOnly]} value={user.email} editable={false} />
          </Field>
          <Text style={styles.hint}>Email is used to log in and can&apos;t be changed here.</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          disabled={saving}
          style={[styles.save, saving && styles.saveDisabled]}
        >
          <Text style={styles.saveText}>{saving ? "Saving..." : "Save changes"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={icon} size={18} color="#F5C518" />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 56,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
  scroll: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 8 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
  },
  input: { flex: 1, fontSize: 16, color: colors.text, height: "100%" },
  readOnly: { color: colors.muted },
  hint: { fontSize: 12, color: colors.muted, marginTop: 4 },
  save: {
    marginTop: 24,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#F5C518",
    alignItems: "center",
    justifyContent: "center",
  },
  saveDisabled: { opacity: 0.6 },
  saveText: { fontSize: 17, fontWeight: "800", color: "#1A1A1A" },
});
