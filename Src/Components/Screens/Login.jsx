import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Pressable,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ validation errors
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    const emailTrim = email.trim();

    // email required
    if (!emailTrim) {
      newErrors.email = "Email is required";
    }
    // email format
    else if (!/^\S+@\S+\.\S+$/.test(emailTrim)) {
      newErrors.email = "Enter a valid email address";
    }

    // password required
    if (!password) {
      newErrors.password = "Password is required";
    }
    // password length
    else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <ImageBackground
      source={require("../Assets/role-bg.jpeg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Top */}
              <View style={styles.top}>
                <View style={styles.logoCircle}>
                  <Image
                    source={require("../Assets/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.brand}>DentPulse</Text>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.sub}>
                  Access your patient portal to manage{"\n"}appointments
                </Text>
              </View>

              {/* Login Card */}
              <View style={styles.card}>
                {/* Email */}
                <Text style={styles.label}>Email Address</Text>
                <View
                  style={[
                    styles.inputWrap,
                    errors.email ? styles.inputWrapError : null,
                  ]}
                >
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      // clear error while typing
                      if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="Email Address"
                    placeholderTextColor="#9AA6A0"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>
                {!!errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* Password */}
                <Text style={[styles.label, { marginTop: 14 }]}>Password *</Text>
                <View
                  style={[
                    styles.inputWrap,
                    errors.password ? styles.inputWrapError : null,
                  ]}
                >
                  <Text style={styles.inputIcon}>🔒</Text>

                  <TextInput
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      if (errors.password)
                        setErrors((p) => ({ ...p, password: "" }));
                    }}
                    placeholder="Password"
                    placeholderTextColor="#9AA6A0"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    returnKeyType="done"
                  />

                  <Pressable
                    onPress={() => setShowPassword((p) => !p)}
                    hitSlop={10}
                  >
                    <Text style={styles.eye}>{showPassword ? "🙈" : "👁️"}</Text>
                  </Pressable>
                </View>
                {!!errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {/* Remember + Forgot */}
                <View style={styles.row}>
                  <View style={styles.rememberRow}>
                    <Switch
                      value={rememberMe}
                      onValueChange={setRememberMe}
                      trackColor={{ false: "#CFE5D7", true: "#33D063" }}
                      thumbColor="#FFFFFF"
                    />
                    <Text style={styles.rememberText}>Remember Me</Text>
                  </View>

                  <Pressable>
                    <Text style={styles.link}>Forgot Password?</Text>
                  </Pressable>
                </View>

                {/* Sign In */}
                <Pressable
                  style={styles.signInBtn}
                  onPress={() => {
                    if (validate()) {
                      console.log("LOGIN OK", { email, password, rememberMe });
                      // ✅ Later: API call here
                    }
                  }}
                >
                  <Text style={styles.signInText}>Sign In</Text>
                </Pressable>

                {/* Register */}
                <View style={styles.bottomRow}>
                  <Text style={styles.smallText}>Don't Have An Account? </Text>
                  <Pressable>
                    <Text style={styles.link}>Register Here</Text>
                  </Pressable>
                </View>
              </View>

              <Text style={styles.helpText}>
                For assistance, call us at (555) 123-4567
              </Text>

              {/* Back Button */}
              <Pressable onPress={onBack} style={styles.backBtn}>
                <Text style={styles.backText}>← Back</Text>
              </Pressable>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },

  safe: { flex: 1, paddingHorizontal: 16 },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  top: { alignItems: "center", marginTop: 14 },

  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ✅ your current values
  logo: { width: 100, height: 100 },

  brand: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 10,
  },

  title: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: "900",
    color: "white",
  },

  sub: {
    marginTop: 6,
    textAlign: "center",
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    lineHeight: 18,
  },

  card: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 18,
    padding: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1F2D22",
  },

  inputWrap: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(47,107,77,0.35)",
    backgroundColor: "rgba(255,255,255,0.98)",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  // ✅ red border when invalid
  inputWrapError: {
    borderColor: "#D32F2F",
  },

  inputIcon: { fontSize: 16, marginRight: 8, opacity: 0.8 },

  input: { flex: 1, color: "#1F2D22", fontSize: 13 },

  eye: { fontSize: 18, opacity: 0.7, marginLeft: 8 },

  errorText: {
    color: "#D32F2F",
    fontSize: 11,
    marginTop: 4,
  },

  row: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rememberRow: { flexDirection: "row", alignItems: "center", gap: 8 },

  rememberText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2F6B4D",
  },

  smallText: { fontSize: 12, color: "#2E3C35" },

  link: { fontSize: 12, fontWeight: "800", color: "#2F6B4D" },

  signInBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1C8F3E",
    alignItems: "center",
    justifyContent: "center",
  },

  signInText: { color: "white", fontWeight: "900", fontSize: 14 },

  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  helpText: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
  },

  backBtn: {
    marginTop: 14,
    marginBottom: 18,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#33D063",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: { color: "white", fontWeight: "900", fontSize: 16 },
});
