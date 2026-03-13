import React from "react";
import { View, StyleSheet } from "react-native";

export default function BackgroundWrapper({ children }) {
  return (
    <View style={styles.container}>
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FCF8",
    position: "relative",
    overflow: "hidden",
  },

  topCircle: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(51, 208, 99, 0.10)",
  },

  bottomCircle: {
    position: "absolute",
    bottom: -100,
    left: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(28, 143, 62, 0.08)",
  },

  content: {
    flex: 1,
  },
});