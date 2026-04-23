import "./global.css";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "./StateVariables";
import LoginScreen from "./components/screens/LoginScreen";
import AuthScreen from "./components/screens/AuthScreen";
import { AuthProvider } from "./contexts/Authentication";
import MainScreen from "./components/screens/MainScreen";

export default function App() {
  return (
    <Provider>
      <AuthProvider>
        {/* Yung SafeAreaView, parang viewport lang sya na sasakupan ng mga UI screen */}
        <SafeAreaView>
          <MainScreen />
        </SafeAreaView>
      </AuthProvider>
    </Provider>
  );
}
