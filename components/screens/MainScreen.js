import { View, Text, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Pages from "../Pages";
import { useContext, useState } from "react";
import HomeScreen from "./HomeScreen";
import JournalScreen from "./JournalScreen";
import SpaceScreen from "./SpaceScreen";
import { Variables } from "../../Variables";
import AuthScreen from "./AuthScreen";
import NotificationScreen from "./NotificationScreen";

export default function MainScreen() {
  const { user } = useContext(Variables);

  return user.success ? (
    <SafeAreaView>
      <View className="h-full">
        <Pages>
          <HomeScreen name="home" icon="🏠" />
          <JournalScreen name="journal" icon="📓" />
          <SpaceScreen name="space" icon="🌸" />
          <NotificationScreen name="alerts" icon="🔔" />
        </Pages>
      </View>
    </SafeAreaView>
  ) : (
    <AuthScreen />
  );
}
