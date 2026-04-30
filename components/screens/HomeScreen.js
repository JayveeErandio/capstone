import { useContext } from "react";
import { View, ScrollView, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Variables } from "../../Variables";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const {
    user,
    setUser,
    entries,
    setEntries,
    isAnalyzing,
    dailyStatus,
    profcol,
  } = useContext(Variables);
  const prof_initialname =
    user["first_name"][0].toUpperCase() + user["last_name"][0].toUpperCase();

  return (
    <View className="flex-1">
      <ScrollView>
        <View className="p-8 pb-24">
          {/* Headline */}
          <View className="flex-row gap-7 pb-5">
            <View className="flex-1 gap-2">
              <Text className="text-[#777]">Good morning {"\u2728"}</Text>
              <Text className="text-3xl font-bold text-[#333] font-serif">
                How are you feeling today?
              </Text>
            </View>
            <Pressable
              onPress={() => {
                navigation.navigate("Profile");
                return;
                setEntries(
                  Object.fromEntries(
                    Object.entries(entries).map(([key]) => [key, ""]),
                  ),
                );
                setUser({});
              }}
              className={
                "bg-" + profcol + "-600 w-14 h-14 rounded-full justify-center"
              }
            >
              <Text className="text-center text-white text-2xl">
                {prof_initialname}
              </Text>
            </Pressable>
          </View>

          {/* Mood CheckIn */}
          <View className="bg-[#f1e6f4] p-4 gap-4 rounded-lg">
            <View className="flex-row gap-2 items-center">
              <Text className="text-4xl">🚪</Text>
              <View className="flex-1 gap-1">
                <Text className="font-bold font-serif text-xl">
                  Mood Check-In
                </Text>
                <Text className="text-[#555] text-xs">
                  4 quick questions to understand what you're feeling.
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1 bg-white rounded-lg p-2 gap-1 items-center">
                <Text className="text-2xl">⚡</Text>
                <Text className="text-xs text-[#555]">Energy</Text>
              </View>
              <View className="flex-1 bg-white rounded-lg p-2 gap-1 items-center">
                <Text className="text-2xl">⏰</Text>
                <Text className="text-xs text-[#555]">Duration</Text>
              </View>
              <View className="flex-1 bg-white rounded-lg p-2 gap-1 items-center">
                <Text className="text-2xl">❤</Text>
                <Text className="text-xs text-[#555]">Heart</Text>
              </View>
              <View className="flex-1 bg-white rounded-lg p-2 gap-1 items-center">
                <Text className="text-2xl">📦</Text>
                <Text className="text-xs text-[#555]">Context</Text>
              </View>
            </View>
            <Pressable
              onPress={() => navigation.navigate("Entry")}
              className="bg-[#c57] rounded-full p-4 active:bg-[#b46]"
            >
              <Text className="text-white text-center font-bold text-lg">
                {isAnalyzing
                  ? "Analyzing..."
                  : dailyStatus == null
                    ? "Start Check-In \u27F6"
                    : "See Result"}
              </Text>
            </Pressable>
          </View>

          {/* User's Progress */}
          <View className="bg-white mt-6 p-5 rounded-3xl gap-3">
            <Text className="text-[#c57] font-bold text-sm">YOUR PROGRESS</Text>
            <View className="gap-2">
              <View className="bg-[#f5e0ef] flex-row gap-3 p-4 rounded-2xl border border-[#e0cbd2] items-center">
                <Text className="text-4xl">🔥</Text>
                <View className="flex-1">
                  <Text className="text-[#d25e78] font-bold text-3xl font-serif">
                    7 days
                  </Text>
                  <Text className="text-sm text-[#555]">
                    Current check-in streak
                  </Text>
                </View>
                <View className="gap-2">
                  <Text className="text-sm text-[#555] text-center">BEST</Text>
                  <Text className="font-bold text-xl text-center">14</Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                <View className="bg-[#f0f0f0] flex-1 items-center py-2 rounded-xl gap-1">
                  <Text className="text-2xl">📅</Text>
                  <Text className="font-bold">22</Text>
                  <Text className="text-xs text-[#777]">Total Check-Ins</Text>
                </View>
                <View className="bg-[#f0f0f0] flex-1 items-center py-2 rounded-xl gap-1">
                  <Text className="text-2xl">😊</Text>
                  <Text className="font-bold">Content</Text>
                  <Text className="text-xs text-[#777]">Most felt mood</Text>
                </View>
                <View className="bg-[#f0f0f0] flex-1 items-center py-2 rounded-xl gap-1">
                  <Text className="text-2xl">⚡</Text>
                  <Text className="font-bold">3</Text>
                  <Text className="text-xs text-[#777]">Day best streak</Text>
                </View>
              </View>
            </View>
            <View className="gap-1">
              <Text className="text-xs text-[#777]">This week</Text>
              {/* Days */}
              <View className="flex-row gap-1">
                <View className="items-center gap-1">
                  <View className="w-10 h-10 bg-[#ca5476] rounded-lg justify-center">
                    <Text className="text-center">✓</Text>
                  </View>
                  <Text className="text-sm text-[#777]">{"M"}</Text>
                </View>
                <View className="items-center gap-1">
                  <View className="w-10 h-10 bg-[#ca5476] rounded-lg justify-center">
                    <Text className="text-center">✓</Text>
                  </View>
                  <Text className="text-sm text-[#777]">{"T"}</Text>
                </View>
                <View className="items-center gap-1">
                  <View className="w-10 h-10 bg-[#ca5476] rounded-lg justify-center">
                    <Text className="text-center">✓</Text>
                  </View>
                  <Text className="text-sm text-[#777]">{"W"}</Text>
                </View>
                <View className="items-center gap-1">
                  <View className="w-10 h-10 bg-[#ca5476] rounded-lg justify-center">
                    <Text className="text-center">✓</Text>
                  </View>
                  <Text className="text-sm text-[#777]">{"T"}</Text>
                </View>
                <View className="items-center gap-1">
                  <View className="w-10 h-10 bg-[#ddd] rounded-lg justify-center">
                    <Text className="text-center"></Text>
                  </View>
                  <Text className="text-sm text-[#777]">{"F"}</Text>
                </View>
                <View className="items-center gap-1">
                  <View className="w-10 h-10 bg-[#ddd] rounded-lg justify-center">
                    <Text className="text-center"></Text>
                  </View>
                  <Text className="text-sm text-[#777]">{"S"}</Text>
                </View>
                <View className="items-center gap-1">
                  <View className="w-10 h-10 bg-[#ddd] rounded-lg justify-center">
                    <Text className="text-center"></Text>
                  </View>
                  <Text className="text-sm text-[#777]">{"S"}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* AI Chatbot Button */}
      <Pressable
        onPress={() => navigation.navigate("Chatbot")}
        className="absolute bottom-7 right-7 bg-[#c68] p-4 rounded-full active:bg-[#b57]"
      >
        <Text className="text-3xl">💬</Text>
      </Pressable>
    </View>
  );
}
