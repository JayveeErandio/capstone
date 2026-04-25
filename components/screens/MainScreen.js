import { View, Text, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Pages from "../Pages";
import { useContext, useState } from "react";
import HomeScreen from "./HomeScreen";
import JournalScreen from "./JournalScreen";
import { AuthContext } from "../../Variables";
import AuthScreen from "./AuthScreen";

export default function MainScreen() {
  const { user } = useContext(AuthContext);

  return user.success ? (
    <SafeAreaView>
      <View className="h-full">
        <Pages>
          <HomeScreen name="home" icon="🏠" />
          <JournalScreen name="journal" icon="📓" />
        </Pages>
      </View>
    </SafeAreaView>
  ) : (
    <AuthScreen />
  );
}
