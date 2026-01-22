// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   Image,
//   Pressable,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const roles = [
//   {
//     key: "patient",
//     title: "Patient",
//     desc: "Book appointments and manage your dental health",
//     img: require("../Assets/patient.png"),
//     icon: "👤",
//   },
//   {
//     key: "doctor",
//     title: "Doctor",
//     desc: "Manage patients and appointments efficiently",
//     img: require("../Assets/doctor.jpeg"),
//     icon: "🩺",
//   },
//   {
//     key: "admin",
//     title: "Admin",
//     desc: "Oversee clinic operations and billing",
//     img: require("../Assets/admin.png"),
//     icon: "🛡️",
//   },
// ];

// export default function SelectRole({ selectedRole, onSelectRole, onContinue }) {
//   const canContinue = !!selectedRole;

//   return (
//     <ImageBackground
//       source={require("../Assets/role-bg.jpeg")}
//       style={styles.bg}
//       resizeMode="cover"
//     >
//       <View style={styles.overlay} />

//       <SafeAreaView style={styles.safe}>
//         {/* Top */}
//         <View style={styles.topRow}>
//           <View style={styles.logoCircle}>
//             <Image source={require("../Assets/logo.png")} style={styles.logo} />
//           </View>
//           <Text style={styles.brand}>DentPulse</Text>
//         </View>

//         <Text style={styles.heading}>Select Your Role</Text>
//         <Text style={styles.sub}>Choose your role to get started.</Text>

//         {/* Cards */}
//         <View style={styles.cardsRow}>
//           {roles.map((r) => {
//             const active = selectedRole === r.key;

//             return (
//               <Pressable
//                 key={r.key}
//                 onPress={() => onSelectRole(r.key)}
//                 style={[styles.card, active && styles.cardActive]}
//               >
//                 <Image source={r.img} style={styles.cardImg} />

//                 <View style={[styles.check, active && styles.checkActive]}>
//                   <Text style={styles.checkText}>✓</Text>
//                 </View>

//                 <View style={styles.cardBody}>
//                   <View style={styles.roleLine}>
//                     <Text style={styles.roleIcon}>{r.icon}</Text>
//                     <Text style={styles.roleTitle}>{r.title}</Text>
//                   </View>

//                   <Text style={styles.roleDesc}>{r.desc}</Text>
//                 </View>
//               </Pressable>
//             );
//           })}
//         </View>

//         {/* Continue */}
//         <Pressable
//           onPress={canContinue ? onContinue : null}
//           style={[styles.btn, !canContinue && styles.btnDisabled]}
//         >
//           <Text style={styles.btnText}>Continue →</Text>
//         </Pressable>
//       </SafeAreaView>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   bg: { flex: 1 },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.35)",
//   },
//   safe: { flex: 1, paddingHorizontal: 16 },

//   topRow: { marginTop: 10, alignItems: "center" },
//   logoCircle: {
//     width: 54,
//     height: 54,
//     borderRadius: 27,
//     backgroundColor: "rgba(255,255,255,0.12)",
//     borderWidth: 2,
//     borderColor: "rgba(255,255,255,0.25)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logo: { width: 34, height: 34 },
//   brand: { color: "white", fontSize: 18, fontWeight: "900", marginTop: 6 },

//   heading: {
//     color: "white",
//     fontSize: 28,
//     fontWeight: "900",
//     textAlign: "center",
//     marginTop: 18,
//   },
//   sub: {
//     color: "rgba(255,255,255,0.85)",
//     textAlign: "center",
//     marginTop: 6,
//     fontSize: 13,
//   },

//   cardsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//     marginTop: 18,
//   },
//   card: {
//     flex: 1,
//     borderRadius: 16,
//     backgroundColor: "rgba(255,255,255,0.92)",
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "transparent",
//   },
//   cardActive: { borderColor: "#2F6B4D" },

//   cardImg: { width: "100%", height: 110 },

//   check: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: "rgba(0,0,0,0.25)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkActive: { backgroundColor: "#2F6B4D" },
//   checkText: { color: "white", fontWeight: "900" },

//   cardBody: { padding: 10 },
//   roleLine: { flexDirection: "row", alignItems: "center", gap: 6 },
//   roleIcon: { fontSize: 14 },
//   roleTitle: { fontSize: 14, fontWeight: "900", color: "#1F2D22" },
//   roleDesc: { marginTop: 6, fontSize: 11, color: "#4A5A52" },

//   btn: {
//     marginTop: "auto",
//     marginBottom: 24,
//     height: 52,
//     borderRadius: 14,
//     backgroundColor: "#2F6B4D",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   btnDisabled: { backgroundColor: "rgba(47,107,77,0.35)" },
//   btnText: { color: "white", fontWeight: "900", fontSize: 16 },
// });


import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const roles = [
  {
    key: "patient",
    title: "Patient",
    desc: "Book appointments\nand manage your\ndental health",
    img: require("../Assets/patient.png"),
    icon: "👤",
  },
  {
    key: "doctor",
    title: "Doctor",
    desc: "Manage patients and\nappointments\nefficiently",
    img: require("../Assets/doctor.jpeg"),
    icon: "🩺",
  },
  {
    key: "admin",
    title: "Admin",
    desc: "Oversee clinic\noperations and billing",
    img: require("../Assets/admin.png"),
    icon: "🛡️",
  },
];

export default function SelectRole({ selectedRole, onSelectRole, onContinue }) {
  const canContinue = !!selectedRole;

  return (
    <ImageBackground
      source={require("../Assets/role-bg.jpeg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        {/* Main content */}
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.topRow}>
            <View style={styles.logoCircle}>
              <Image
                source={require("../Assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brand}>DentPulse</Text>
          </View>

          <Text style={styles.heading}>Select Your Role</Text>
          <Text style={styles.sub}>Choose your role to get started.</Text>

          {/* Cards (moved DOWN slightly) */}
          <View style={styles.cardsRow}>
            {roles.map((r) => {
              const active = selectedRole === r.key;

              return (
                <Pressable
                  key={r.key}
                  onPress={() => onSelectRole(r.key)}
                  style={[styles.card, active && styles.cardActive]}
                >
                  <Image source={r.img} style={styles.cardImg} />

                  <View style={[styles.check, active && styles.checkActive]}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.roleLine}>
                      <Text style={styles.roleIcon}>{r.icon}</Text>
                      <Text style={styles.roleTitle}>{r.title}</Text>
                    </View>

                    <Text style={styles.roleDesc}>{r.desc}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Continue button (moved UP slightly) */}
        <Pressable
          onPress={canContinue ? onContinue : null}
          style={[styles.btn, !canContinue && styles.btnDisabled]}
        >
          <Text style={styles.btnText}>Continue →</Text>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  safe: {
    flex: 1,
    paddingHorizontal: 16,
  },

  /* CONTENT AREA */
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 26, // ⬇️ slightly lower than before
  },

  topRow: {
    alignItems: "center",
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 100,
    height: 100,
  },

  brand: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
  },

  heading: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 18,
  },

  sub: {
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
    marginTop: 6,
    fontSize: 14,
  },

  /* CARDS */
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 56, // ⬇️ cards moved DOWN
    gap: 16,
  },

  card: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.93)",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },

  cardActive: {
    borderColor: "#2F6B4D",
  },

  cardImg: {
    width: "100%",
    height: 130,
  },

  check: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  checkActive: {
    backgroundColor: "#2F6B4D",
  },

  checkText: {
    color: "white",
    fontWeight: "900",
    fontSize: 15,
  },

  cardBody: {
    padding: 12,
  },

  roleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  roleIcon: {
    fontSize: 16,
  },

  roleTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1F2D22",
  },

  roleDesc: {
    marginTop: 8,
    fontSize: 12,
    color: "#4A5A52",
    lineHeight: 16,
  },

  /* BUTTON */
  btn: {
  marginBottom: 90,   // ⬆️ moves button further UP
  height: 56,
  borderRadius: 18,
  backgroundColor: "#33D063",
  alignItems: "center",
  justifyContent: "center",
},


  btnDisabled: {
    backgroundColor: "rgba(51,208,99,0.35)",
  },

  btnText: {
    color: "white",
    fontWeight: "900",
    fontSize: 17,
  },
});

