import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PaperProvider } from "react-native-paper";

import Onboarding1 from "./Src/Components/Screens/Onboarding1";
import Login from "./Src/Components/Screens/Login";
import SignUp from "./Src/Components/Screens/SignUp"
import OtpVerification from "./Src/Components/Screens/OtpVerification";
import PatientTabs from "./Src/Components/Screens/PatientTabs";
import MyIdCard from "./Src/Components/Screens/MyIdCard"
import FamilyMembers from "./Src/Components/Screens/FamilyMembers";
import AddFamilyMember from "./Src/Components/Screens/AddFamilyMember";
import UpdateFamilyMember from "./Src/Components/Screens/UpdateFamilyMember"
import FamilyMemberIdCard from "./Src/Components/Screens/FamilyMemberIdCard";
import BookAppointment from "./Src/Components/Screens/BookAppointment";
import ReviewAppointment from "./Src/Components/Screens/ReviewAppointment"


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
          <Stack.Screen name="OtpVerification" component={OtpVerification} />
          <Stack.Screen name="PatientTabs" component={PatientTabs} />
          <Stack.Screen name="MyIdCard" component={MyIdCard} />
          <Stack.Screen name="FamilyMembers" component={FamilyMembers} />
          <Stack.Screen name="AddFamilyMember" component={AddFamilyMember} />
          <Stack.Screen name="UpdateFamilyMember" component={UpdateFamilyMember} />
          <Stack.Screen name="FamilyMemberIdCard" component={FamilyMemberIdCard} />
          <Stack.Screen name="BookAppointment" component={BookAppointment} />
          <Stack.Screen name="ReviewAppointment" component={ReviewAppointment} />

          
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}