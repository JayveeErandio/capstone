import "./global.css";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "./StateVariables";
import LoginScreen from "./components/screens/LoginScreen";

export default function App() {
  return (
    <Provider>
      <SafeAreaView>
        <LoginScreen />
      </SafeAreaView>
    </Provider>
  );
}
