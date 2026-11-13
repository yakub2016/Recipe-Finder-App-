import { useRef, useState } from "react";
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
} from "react-native";
import type { ScrollViewInstance } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { registerUser } from "../../lib/localAuth";

type FieldProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  onFocus?: () => void;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "words";
  secureTextEntry?: boolean;
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
  rightSlot?: React.ReactNode;
};

const Field = ({ label, icon, rightSlot, onFocus, ...inputProps }: FieldProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <View style={[styles.iconBubble, focused && styles.iconBubbleFocused]}>
          <Ionicons name={icon} size={18} color="#F5C518" />
        </View>
        <TextInput
          style={styles.input}
          placeholderTextColor="#B5B5B5"
          autoCorrect={false}
          {...inputProps}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => setFocused(false)}
        />
        {rightSlot}
      </View>
    </View>
  );
};

const Sign = () => {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  };

  const handleCreateAccount = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({ name, email, phone, password });
      router.replace("/login");
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#FFD84D", "#FFEFA6", "#FFFBEF", "#FFFFFF"]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Decorative blobs */}
      <View style={[styles.blob, styles.blobTopRight]} />
      <View style={[styles.blob, styles.blobLeft]} />

      <SafeAreaView style={styles.flex} edges={["top", "bottom"]}>
        <StatusBar barStyle="dark-content" />

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
            ref={scrollRef}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>
                Join Hanger Station and start cooking smarter
              </Text>
            </View>

            <View style={styles.card}>
              <Field
                label="Full name"
                icon="person-outline"
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
                onFocus={scrollToBottom}
              />

              <Field
                label="Email"
                icon="mail-outline"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onFocus={scrollToBottom}
              />

              <Field
                label="Phone number"
                icon="call-outline"
                placeholder="+1 555 000 0000"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                returnKeyType="next"
                onFocus={scrollToBottom}
              />

              <Field
                label="Password"
                icon="lock-closed-outline"
                placeholder="At least 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleCreateAccount}
                onFocus={scrollToBottom}
                rightSlot={
                  <TouchableOpacity
                    onPress={() => setShowPassword((s) => !s)}
                    hitSlop={10}
                    accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#F5C518"
                    />
                  </TouchableOpacity>
                }
              />

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleCreateAccount}
                disabled={loading}
                style={styles.buttonShadow}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Create account</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.back()} style={styles.loginRow} hitSlop={8}>
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginLink}>Log in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Sign;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.5,
    backgroundColor: "#FFB020",
  },
  blobTopRight: {
    width: 220,
    height: 220,
    top: -90,
    right: -80,
  },
  blobLeft: {
    width: 160,
    height: 160,
    top: 180,
    left: -90,
    backgroundColor: "#FFE27A",
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 4,
    height: 52,
    justifyContent: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B6B6B",
    marginTop: 6,
    lineHeight: 21,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#B07A00",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingLeft: 8,
    paddingRight: 14,
    height: 56,
    gap: 10,
  },
  inputWrapFocused: {
    borderColor: "#FFB020",
    backgroundColor: "#FFFDF5",
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBubbleFocused: {
    backgroundColor: "#FFE9A8",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    height: "100%",
  },
  buttonShadow: {
    marginTop: 10,
    borderRadius: 18,
    shadowColor: "#F5C518",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  button: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5C518",
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  loginRow: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  loginLink: {
    color: "#1A1A1A",
    fontWeight: "800",
  },
});
