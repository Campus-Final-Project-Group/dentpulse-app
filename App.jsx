import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PaperProvider } from "react-native-paper";

import Onboarding1 from "./Src/Components/Screens/Onboarding1";
import Login from "./Src/Components/Screens/Login";
import SignUp from "./Src/Components/Screens/SignUp"

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Onboarding" component={Onboarding1} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}