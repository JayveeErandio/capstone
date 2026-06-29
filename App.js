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
import { Image, Text, View } from "react-native";
import { connect } from "./services/backend";

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

function Root() {
  const { restartApp, setRestartApp } = useContext(Variables);
  let restartDetect = false;

  useEffect(() => {
    setRestartApp(false);
    const interval = setInterval(async () => {
      if (restartDetect) {
        setRestartApp(true);
        console.log("Connection Issue", Date.now());
      }
      restartDetect = true;
      await connect();
      restartDetect = false;
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AppNavigator />
      <View
        className={
          (restartApp ? "" : "hidden") +
          " absolute inset-0 z-50 bg-black/50 justify-center items-center"
        }
      >
        <View className="bg-white w-3/4 rounded-xl p-5 items-center gap-2">
          <Image
            source={require("./assets/connection_issue.jpg")}
            className="aspect-square h-20"
          />
          <Text className="font-archivo-bold text-[#555] text-xl text-center">
            Something went wrong with the connection.
          </Text>
          <Text className="font-archivo text-[#555] text-center">
            Please close the app completely, then reopen it to continue using
            the app normally. Sorry for this incovenience.
          </Text>
        </View>
      </View>
    </>
  );
}

export default function App() {
  return (
    <Provider>
      {/* Yung SafeAreaView, parang viewport lang sya na sasakupan ng mga UI screen */}
      <SafeAreaProvider>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

// BUILD COMMAND
//eas build -p android --profile preview
