import "./global.css";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Provider, Variables } from "./Variables";

import SignupScreen from "./components/screens/SignupScreen";
import LoginScreen from "./components/screens/LoginScreen";
import MainScreen from "./components/screens/MainScreen";
import EntryScreen from "./components/screens/EntryScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user } = useContext(Variables);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user?.success ? (
        <>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Entry" component={EntryScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider>
      {/* Yung SafeAreaView, parang viewport lang sya na sasakupan ng mga UI screen */}
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
