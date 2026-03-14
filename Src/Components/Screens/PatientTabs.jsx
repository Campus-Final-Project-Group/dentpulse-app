import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import Profile from "./Profile";


import Dashboard from "./Dashboard";
import BookAppointment from "./BookAppointment"
import Appointments from "./Appointments"

const Tab = createBottomTabNavigator();


const AppointmentsScreen = () => null;


const PatientTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#33D063",
        tabBarInactiveTintColor: "#555555",
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="BookAppointment"
        component={BookAppointment}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="calendar-month-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Appointments"
        component={Appointments}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="clipboard-text-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default PatientTabs;