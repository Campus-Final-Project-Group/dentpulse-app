import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Text, TextInput, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";

const ForgotPasswordOtp = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://192.168.155.122:8080";

  const verifyOtp = async () => {
    if (otp.trim() === "") {
      Alert.alert("Please enter the OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      Alert.alert("OTP must contain 6 digits");
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
        `${BASE_URL}/api/v1/auth/forgot-password/verify-otp`,
        {
          email: savedEmail,
          otp: otp.trim(),
        }
      );

      console.log("Forgot password OTP verify response:", response.data);

      Alert.alert("Success", "OTP verified successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate("ResetPassword"),
        },
      ]);
    } catch (error) {
      console.log("Forgot password OTP error:", error.response?.data || error.message);

      if (error.response) {
        Alert.alert(
          "Verification Failed",
          error.response.data.message || "Invalid OTP"
        );
      } else {
        Alert.alert("Error", "Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("forgotPasswordEmail");

      if (!savedEmail) {
        Alert.alert("Email not found. Please try again.");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/v1/auth/forgot-password`,
        {
          email: savedEmail,
        }
      );

      console.log("Forgot password resend response:", response.data);
      Alert.alert("Success", "OTP resent successfully");
    } catch (error) {
      console.log("Forgot password resend error:", error.response?.data || error.message);

      if (error.response) {
        Alert.alert(
          "Resend Failed",
          error.response.data.message || "Unable to resend OTP"
        );
      } else {
        Alert.alert("Error", "Unable to connect to server");
      }
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
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
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

            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subText}>Check your email for the OTP</Text>
          </View>

          <View style={styles.formSection}>
            <TextInput
              label="Enter 6-digit OTP"
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
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
              keyboardType="number-pad"
              maxLength={6}
            />

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={verifyOtp}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator animating={true} color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm</Text>
              )}
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={resendOtp}>
                <Text style={styles.resendText}>Resend</Text>
              </TouchableOpacity>
            </View>
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
    marginTop: 140,
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

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    flexWrap: "wrap",
  },

  bottomText: {
    fontSize: 14,
    color: "#2F6B4D",
  },

  resendText: {
    fontSize: 14,
    color: "#149647",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default ForgotPasswordOtp;
