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
import ProfileScreen from "./components/screens/ProfileScreen";
import ChatbotScreen from "./components/screens/ChatbotScreen";
import LoadingScreen from "./components/screens/LoadingScreen";
import { useFonts } from "expo-font";
import * as Notification from "expo-notifications";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, isLoaded, onDemo } = useContext(Variables);

  //SETUP: FONTS
  const [fontsLoaded] = useFonts({
    Lora: require("./assets/fonts/lora.ttf"),
    LoraBold: require("./assets/fonts/Lora-Bold.ttf"),
    Archivo: require("./assets/fonts/Archivo-Regular.ttf"),
    ArchivoBold: require("./assets/fonts/Archivo-Bold.ttf"),
  });

  // SETUP: NOTIFICATION
  Notification.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  useEffect(() => {
    Notification.requestPermissionsAsync();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoaded ? (
        user?.success ? (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Entry" component={EntryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Chatbot" component={ChatbotScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen
              name={onDemo ? "Entry" : "ASO"}
              component={EntryScreen}
            />
          </>
        )
      ) : (
        <Stack.Screen name="Loading" component={LoadingScreen} />
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

// BUILD COMMAND
//eas build -p android --profile preview
