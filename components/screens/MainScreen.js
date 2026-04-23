import { View, Text, Image } from "react-native";
import Pages from "../Pages";
import { useContext, useState } from "react";
import HomeScreen from "./HomeScreen";
import JournalScreen from "./JournalScreen";
import { AuthContext } from "../../contexts/Authentication";
import AuthScreen from "./AuthScreen";

export default function MainScreen() {
  const { user } = useContext(AuthContext);

  return user.success ? (
    <View className="h-screen">
      <Pages>
        <HomeScreen name="home" />
        <JournalScreen name="journal" />
      </Pages>
    </View>
  ) : (
    <AuthScreen />
  );
}
