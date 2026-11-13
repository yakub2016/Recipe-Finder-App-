import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ReAnimated, { FadeInUp } from "react-native-reanimated";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const value = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    router.push({ pathname: "/resetpassword", params: { email: value } });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.flex} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={10}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#F5C518" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ReAnimated.View entering={FadeInUp.duration(450)}>
              <View style={styles.iconCircle}>
                <Ionicons name="mail-outline" size={34} color="#F5C518" />
              </View>

              <Text style={styles.title}>Forgot password?</Text>
              <Text style={styles.subtitle}>
                Enter the email you signed up with and we&apos;ll help you get back in.
              </Text>

              <View style={styles.card}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={[
                    styles.inputWrap,
                    focused && styles.inputWrapFocused,
                    !!error && styles.inputWrapError,
                  ]}
                >
                  <Ionicons name="mail-outline" size={20} color="#F5C518" />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#B5B5B5"
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      if (error) setError(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="send"
                    onSubmitEditing={handleContinue}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                </View>

                {error && (
                  <View style={styles.errorRow}>
                    <Ionicons name="alert-circle" size={15} color="#E5484D" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <TouchableOpacity activeOpacity={0.85} onPress={handleContinue} style={styles.button}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} style={styles.backRow} hitSlop={8}>
                  <Text style={styles.backText}>
                    Remember it? <Text style={styles.backLink}>Log in</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ReAnimated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFBEF" },
  flex: { flex: 1 },
  topBar: { paddingHorizontal: 20, height: 52, justifyContent: "center" },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B07A00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40 },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#F5C518",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 20,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B6B6B",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    marginTop: 28,
    shadowColor: "#B07A00",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  label: { fontSize: 13, fontWeight: "700", color: "#1A1A1A", marginBottom: 8 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
    backgroundColor: "#F6F6F6",
  },
  inputWrapFocused: { borderColor: "#F5C518", backgroundColor: "#FFFDF5" },
  inputWrapError: { borderColor: "#E5484D" },
  input: { flex: 1, fontSize: 16, color: "#1A1A1A", height: "100%" },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  errorText: { fontSize: 13, color: "#E5484D", flex: 1 },
  button: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#F5C518",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    shadowColor: "#F5C518",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonText: { fontSize: 17, fontWeight: "800", color: "#1A1A1A", letterSpacing: 0.3 },
  backRow: { marginTop: 18, alignItems: "center" },
  backText: { fontSize: 14, color: "#6B6B6B" },
  backLink: { color: "#1A1A1A", fontWeight: "800" },
});
