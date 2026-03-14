import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";

export default function Onboarding1({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.logoWrap}>
            <Image
              source={require("../Assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>DentPulse</Text>
          <Text style={styles.subtitle}>Your Smile, Our Priority</Text>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logoWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(51, 208, 99, 0.10)",
    borderWidth: 2,
    borderColor: "rgba(47, 107, 77, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  logo: {
    width: 70,
    height: 70,
  },

  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#1C8F3E",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2F6B4D",
    marginTop: 8,
  },
});