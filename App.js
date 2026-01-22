import React, { useState } from "react";
import Onboarding1 from "./Src/Components/Screens/Onboarding1";
import SelectRole from "./Src/Components/Screens/SelectRole";

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [role, setRole] = useState(null);

  if (screen === "onboarding") {
    return <Onboarding1 onFinish={() => setScreen("role")} />;
  }

  if (screen === "role") {
    return (
      <SelectRole
        selectedRole={role}
        onSelectRole={setRole}
        onContinue={() => {
          if (!role) return;
          console.log("Selected Role:", role);
          // setScreen("login");
        }}
      />
    );
  }

  return null;
}
