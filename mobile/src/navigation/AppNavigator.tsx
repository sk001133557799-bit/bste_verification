import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { THEME } from "../config/theme";

// Screens
import HomeScreen from "../screens/HomeScreen";
import VerificationScreen from "../screens/VerificationScreen";
import QRScannerScreen from "../screens/QRScannerScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import LoginScreen from "../screens/LoginScreen";
import TeacherDashboardScreen from "../screens/TeacherDashboardScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: THEME.colors.primary,
          borderTopWidth: 2,
          borderTopColor: THEME.colors.accent,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: THEME.colors.accent,
        tabBarInactiveTintColor: "#94A3B8",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="QRTab"
        component={QRScannerScreen}
        options={{
          tabBarLabel: "Scan QR",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📷</Text>,
        }}
      />
      <Tab.Screen
        name="NoticesTab"
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Gazette",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📢</Text>,
        }}
      />
      <Tab.Screen
        name="LoginTab"
        component={LoginScreen}
        options={{
          tabBarLabel: "Staff Portal",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🔐</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    </Stack.Navigator>
  );
}
