import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import type { ScrollViewInstance } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { loginUser } from "../../lib/localAuth";
import { Link, router, useLocalSearchParams } from "expo-router";

const Login = () => {
  // Pre-filled when arriving from sign-up.
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const scrollRef = useRef<ScrollViewInstance>(null);

  // Scroll the focused field (and the Login button below it) above the keyboard.
  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  };

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing info", "Enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      await loginUser(email, password);
      router.replace("/home");
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces
        >
          {/* Greeting + chef illustration */}
          <View style={styles.header}>
            <Text style={styles.hello}>Hello!</Text>
            <Text style={styles.welcome}>Welcome to Hanger Station</Text>
            <Image
              source={require("../../../assets/images/image copy.png")}
              style={styles.chef}
              contentFit="contain"
            />
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={20} color="#F5C518" />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#B0B0B0"
                value={email}
                onChangeText={setEmail}
                onFocus={scrollToBottom}
                returnKeyType="next"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color="#F5C518" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#B0B0B0"
                value={password}
                onChangeText={setPassword}
                onFocus={scrollToBottom}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((s) => !s)}
                hitSlop={10}
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#F5C518"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.rememberRow}
                onPress={() => setRemember((r) => !r)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={remember ? "checkbox" : "square-outline"}
                  size={20}
                  color="#F5C518"
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/forgotpassword")} hitSlop={8}>
                <Text style={styles.forgot} >Forgot Password</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                <Link href="https://accounts.google.com" target="_blank">
                  <Text style={styles.googleG}>G</Text>
                </Link>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                <Link href="https://www.apple.com" target="_blank">
                  <Ionicons name="logo-apple" size={22} color="#F5C518" />
                </Link>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                <Ionicons name="logo-facebook" size={22} color="#F5C518" />
              </TouchableOpacity>
            </View>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  header: {
    paddingTop: 24,
    paddingHorizontal: 8,
    height: 260,
  },
  hello: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  welcome: {
    fontSize: 15,
    color: "#5A5A5A",
    marginTop: 4,
  },
  chef: {
    position: "absolute",
    right: -10,
    top: 20,
    width: 220,
    height: 260,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
    marginTop: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    height: "100%",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rememberText: {
    fontSize: 14,
    color: "#1A1A1A",
  },
  forgot: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "600",
  },

  loginBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F5C518",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  dividerText: {
    fontSize: 13,
    color: "#8A8A8A",
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },
  googleG: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4285F4",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#8A8A8A",
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});
