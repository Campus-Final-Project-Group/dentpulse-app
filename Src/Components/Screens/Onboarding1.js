// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   Image,
//   SafeAreaView,
// } from "react-native";

// export default function Onboarding1() {
//   return (
//     <ImageBackground
//       source={require("../Assets/onboard-bg.png")}
//       style={styles.bg}
//       resizeMode="cover"
//     >
//       {/* Soft green overlay like your design */}
//       <View style={styles.overlay} />

//       <SafeAreaView style={styles.safe}>
//         <View style={styles.content}>
//           {/* Logo circle */}
//           <View style={styles.logoWrap}>
//             <Image
//               source={require("../Assets/logo.png")}
//               style={styles.logo}
//               resizeMode="contain"
//             />
//           </View>

//           {/* Title & subtitle */}
//           <Text style={styles.title}>DentPulse</Text>
//           <Text style={styles.subtitle}>Your Smile, Our Priority</Text>

//           {/* Dots */}
//           <View style={styles.dots}>
//             <View style={[styles.dot, styles.dotActive]} />
//             <View style={styles.dot} />
//             <View style={styles.dot} />
//             <View style={styles.dot} />
//           </View>
//         </View>
//       </SafeAreaView>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   bg: {
//     flex: 1,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(210, 235, 220, 0.65)", // green mist overlay
//   },
//   safe: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 24,
//   },
//   logoWrap: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     backgroundColor: "rgba(120, 190, 140, 0.20)",
//     borderWidth: 2,
//     borderColor: "rgba(40, 120, 70, 0.35)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 18,
//   },
//   logo: {
//     width: 70,
//     height: 70,
//   },
//   title: {
//     fontSize: 42,
//     fontWeight: "800",
//     color: "#1F5A3B",
//     letterSpacing: 0.5,
//     marginTop: 4,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#2F6B4D",
//     marginTop: 8,
//   },
  
// });


import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding1({ onFinish }) {
  // ✅ Auto move to next screen
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require("../Assets/onboard-bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(210, 235, 220, 0.65)",
  },
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(120, 190, 140, 0.20)",
    borderWidth: 2,
    borderColor: "rgba(40, 120, 70, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logo: { width: 70, height: 70 },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#1F5A3B",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2F6B4D",
    marginTop: 8,
  },
});
