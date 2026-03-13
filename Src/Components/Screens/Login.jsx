import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const navigation = useNavigation();

  async function goLogin() {
    if (email.trim() === "") {
      Alert.alert("Please enter your email");
      return;
    }

    if (password.trim() === "") {
      Alert.alert("Please enter your password");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.155.122:8080/api/v1/auth/login",
        {
          email: email,
          password: password,
        }
      );

      console.log("Login response:", response.data);
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("fullName", response.data.user.fullName);

      console.log("Token:", response.data.token);

      Alert.alert(
        "Login Successful",
        "You have logged in successfully",
        [
          {
            text: "OK",
            onPress: () => navigation.replace("PatientTabs"),
          },
        ]
      );

      setEmail("");
      setPassword("");


    } catch (error) {
      console.log("Login error:", error);

      if (error.response) {
        Alert.alert("Login Failed", error.response.data.message || "Invalid credentials");
      } else {
        Alert.alert("Error", "Unable to connect to server");
      }
    }
  }

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
          <View style={styles.card}>
            <Image
              source={require("../Assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.heads}>Login</Text>

            <Text style={styles.subText}>
              Access your patient portal to manage appointments
            </Text>

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              label="Email Address"
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              mode="outlined"
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{ roundness: 12 }}
              autoCapitalize="none"
              keyboardType="email-address"
              textColor="#1F2D22"

            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              label="Password"
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              mode="outlined"
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{ roundness: 12 }}
              secureTextEntry={showPassword}
              textColor="#1F2D22"
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={goLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Sign in</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Dont Have An Account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.registerLink}>Register Here</Text>
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
    paddingHorizontal: 16,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 24,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "#F8F8F8",
    borderWidth: 1.5,
    borderColor: "#33D063",
    padding: 20,
  },

  logo: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginBottom: 10,
  },

  heads: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111111",
  },

  subText: {
    textAlign: "center",
    fontSize: 13,
    color: "#149647",
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#149647",
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#ffffff",

  },

  inputOutline: {
    borderRadius: 12,
  },

  forgotText: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 13,
    color: "#111111",
  },

  loginButton: {
    width: "100%",
    alignSelf: "center",
    marginTop: 22,
    backgroundColor: "#08B33E",
    paddingVertical: 14,
    borderRadius: 12,
  },

  loginButtonText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },

  divider: {
    marginTop: 28,
    marginBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  registerText: {
    fontSize: 12,
    color: "#149647",
  },

  registerLink: {
    fontSize: 12,
    color: "#149647",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default Login;