import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Text, TextInput, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";

const ResetPassword = () => {
  const navigation = useNavigation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://api.dentpulseclinic.com";

  const resetPassword = async () => {
    if (newPassword.trim() === "") {
      Alert.alert("Please enter new password");
      return;
    }

    if (confirmPassword.trim() === "") {
      Alert.alert("Please confirm your new password");
      return;
    }

    if (newPassword.length < 4) {
      Alert.alert("Password must be at least 4 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const savedEmail = await AsyncStorage.getItem("forgotPasswordEmail");

      if (!savedEmail) {
        Alert.alert("Email not found. Please try again.");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/v1/auth/forgot-password/reset`,
        {
          email: savedEmail,
          newPassword: newPassword.trim(),
        }
      );

      console.log("Reset password response:", response.data);

      await AsyncStorage.removeItem("forgotPasswordEmail");

      Alert.alert("Success", "Password reset successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      console.log("Reset password error:", error.response?.data || error.message);

      if (error.response) {
        Alert.alert(
          "Reset Failed",
          error.response.data.message || "Unable to reset password"
        );
      } else {
        Alert.alert("Error", "Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.safe}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid={true}
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordOtp")}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.topSection}>
            <View style={styles.logoRow}>
              <Image
                source={require("../Assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.brand}>DentPulse</Text>
            </View>

            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subText}>Enter your new password</Text>
          </View>

          <View style={styles.formSection}>
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{
                roundness: 12,
                colors: {
                  primary: "#33D063",
                  onSurfaceVariant: "#6B7C73",
                },
              }}
              textColor="#1F2D22"
              secureTextEntry
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              style={[styles.input, { marginTop: 16 }]}
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{
                roundness: 12,
                colors: {
                  primary: "#33D063",
                  onSurfaceVariant: "#6B7C73",
                },
              }}
              textColor="#1F2D22"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={resetPassword}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator animating={true} color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 20,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 30,
  },

  backText: {
    fontSize: 15,
    color: "#111111",
    marginTop: 6,
  },

  topSection: {
    alignItems: "center",
    marginTop: 10,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  logo: {
    width: 68,
    height: 68,
    marginRight: 8,
  },

  brand: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111111",
  },

  title: {
    marginTop: 28,
    fontSize: 34,
    fontWeight: "bold",
    color: "#111111",
    textAlign: "center",
  },

  subText: {
    marginTop: 8,
    fontSize: 16,
    color: "#2F6B4D",
    textAlign: "center",
  },

  formSection: {
    marginTop: 120,
  },

  input: {
    backgroundColor: "#FFFFFF",
  },

  inputOutline: {
    borderRadius: 12,
  },

  confirmButton: {
    marginTop: 28,
    backgroundColor: "#33D063",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmButtonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ResetPassword;
