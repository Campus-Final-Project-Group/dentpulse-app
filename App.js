import React, { useState } from "react";
import Onboarding1 from "./Src/Components/Screens/Onboarding1";
import SelectRole from "./Src/Components/Screens/SelectRole";
import Login from "./Src/Components/Screens/Login";

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [role, setRole] = useState(null);

  // 1️⃣ Onboarding
  if (screen === "onboarding") {
    return <Onboarding1 onFinish={() => setScreen("role")} />;
  }

  // 2️⃣ Role selection
  if (screen === "role") {
    return (
      <SelectRole
        selectedRole={role}
        onSelectRole={(r) => {
          // ✅ ONLY select role (no navigation here)
          setRole(r);
        }}
        onContinue={() => {
          if (!role) return;

          // ✅ Navigate ONLY after Continue
          if (role === "patient") {
            setScreen("login");
          }

          // Later:
          // if (role === "doctor") setScreen("doctorLogin");
          // if (role === "admin") setScreen("adminLogin");
        }}
      />
    );
  }

  // 3️⃣ Login
  if (screen === "login") {
    return <Login onBack={() => setScreen("role")} />;
  }

  return null;
}
