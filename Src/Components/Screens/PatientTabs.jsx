import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";

import Dashboard from "./Dashboard";

const Tab = createBottomTabNavigator();

const BookScreen = () => null;
const AppointmentsScreen = () => null;
const ProfileScreen = () => null;

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
        name="Book"
        component={BookScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="calendar-month-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="clipboard-text-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
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