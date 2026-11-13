import { useRef, useState } from "react";
import type { TextInputInstance } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import ReAnimated, { FadeInUp } from "react-native-reanimated";
import { updatePassword } from "../../lib/localAuth";

const DEMO_OTP = "1234";
const OTP_LENGTH = 4;

export default function ResetPasswordScreen() {
  const { email = "" } = useLocalSearchParams<{ email?: string }>();
  const otpInputRef = useRef<TextInputInstance>(null);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyOtp = () => {
    if (otp.length !== OTP_LENGTH) {
      setOtpError("Enter the 4-digit code.");
      return;
    }
    if (otp !== DEMO_OTP) {
      setOtpError("Wrong code. Try again.");
      setOtp("");
      return;
    }
    setOtpError(null);
    setVerified(true);
  };

  const savePassword = async () => {
    if (password.length < 6) {
      Alert.alert("Weak password", "Use at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Passwords differ", "The two passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      await updatePassword(email, password);
      Alert.alert("Password updated", "Log in with your new password.", [
        { text: "Log in", onPress: () => router.replace("/login") },
      ]);
    } catch (e: unknown) {
      Alert.alert(
        "Could not reset",
        e instanceof Error ? e.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
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
                <Ionicons
                  name={verified ? "lock-open-outline" : "keypad-outline"}
                  size={34}
                  color="#F5C518"
                />
              </View>

              <Text style={styles.title}>
                {verified ? "Set new password" : "Enter your code"}
              </Text>
              <Text style={styles.subtitle}>
                {verified
                  ? "Choose a password you haven't used before."
                  : "Enter the 4-digit code for"}
                {!verified && "\n"}
                {!verified && (
                  <Text style={styles.emailHighlight}>
                    {email || "your account"}
                  </Text>
                )}
              </Text>

              {!verified && (
                <View style={styles.hintPill}>
                  <Ionicons
                    name="information-circle-outline"
                    size={15}
                    color="#F5C518"
                  />
                  <Text style={styles.hintText}>Demo code: 1234</Text>
                </View>
              )}

              {!verified && (
                <View style={styles.card}>
                  <Pressable
                    style={styles.otpRow}
                    onPress={() => otpInputRef.current?.focus()}
                  >
                    {Array.from({ length: OTP_LENGTH }).map((_, i) => {
                      const digit = otp[i] ?? "";
                      const active = i === otp.length;
                      return (
                        <View
                          key={i}
                          style={[
                            styles.otpBox,
                            active && styles.otpBoxActive,
                            !!otpError && styles.otpBoxError,
                          ]}
                        >
                          <Text style={styles.otpDigit}>{digit}</Text>
                        </View>
                      );
                    })}
                    <TextInput
                      ref={otpInputRef}
                      value={otp}
                      onChangeText={(t) => {
                        setOtpError(null);
                        setOtp(t.replace(/\D/g, "").slice(0, OTP_LENGTH));
                      }}
                      keyboardType="number-pad"
                      maxLength={OTP_LENGTH}
                      textContentType="oneTimeCode"
                      autoFocus
                      style={styles.hiddenInput}
                    />
                  </Pressable>

                  {otpError && (
                    <View style={styles.errorRow}>
                      <Ionicons name="alert-circle" size={15} color="#E5484D" />
                      <Text style={styles.errorText}>{otpError}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={verifyOtp}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Verify code</Text>
                  </TouchableOpacity>
                </View>
              )}

              {verified && (
                <View style={styles.card}>
                  <Text style={styles.label}>New password</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#F5C518"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="At least 6 characters"
                      placeholderTextColor="#B5B5B5"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((s) => !s)}
                      hitSlop={10}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#F5C518"
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.label, styles.labelSpaced]}>
                    Confirm password
                  </Text>
                  <View style={styles.inputWrap}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={20}
                      color="#F5C518"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Type it again"
                      placeholderTextColor="#B5B5B5"
                      value={confirm}
                      onChangeText={setConfirm}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={savePassword}
                    />
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={savePassword}
                    disabled={loading}
                    style={[styles.button, loading && styles.buttonDisabled]}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "Saving..." : "Save password"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
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
  },
  emailHighlight: { color: "#1A1A1A", fontWeight: "700" },
  hintPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF3C4",
  },
  hintText: { fontSize: 13, fontWeight: "700", color: "#1A1A1A" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    marginTop: 24,
    shadowColor: "#B07A00",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
  },
  otpBox: {
    width: 62,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    borderWidth: 1.5,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxActive: { borderColor: "#F5C518", backgroundColor: "#FFFDF5" },
  otpBoxError: { borderColor: "#E5484D" },
  otpDigit: { fontSize: 24, fontWeight: "800", color: "#1A1A1A" },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  label: { fontSize: 13, fontWeight: "700", color: "#1A1A1A", marginBottom: 8 },
  labelSpaced: { marginTop: 16 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
  },
  input: { flex: 1, fontSize: 16, color: "#1A1A1A", height: "100%" },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
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
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
});
