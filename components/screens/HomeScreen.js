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
    statusDays,
    curStreak,
    bestStreak,
    homeWeek,
    mostMood,
    capitalizeWords,
    moodToEmoji,
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
              <Text className="text-3xl font-lora-bold text-[#333]">
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
              className={"bg-red-600 w-14 h-14 rounded-full justify-center"}
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
                <Text className="font-lora-bold text-xl">Mood Check-In</Text>
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
              <Text className="text-white text-center font-archivo-bold text-lg">
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
                <Text className="text-4xl">{curStreak >= 3 ? "🔥" : "⏳"}</Text>
                <View className="flex-1">
                  <Text className="text-[#d25e78] font-lora-bold text-3xl">
                    {curStreak} day{curStreak > 1 ? "s" : ""}
                  </Text>
                  <Text className="text-sm text-[#555]">
                    Current check-in streak
                  </Text>
                </View>
                <View className="gap-2">
                  <Text className="text-sm text-[#555] text-center">BEST</Text>
                  <Text className="font-bold text-xl text-center">
                    {bestStreak}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                <View className="bg-[#f0f0f0] flex-1 items-center py-2 rounded-xl gap-1">
                  <Text className="text-2xl">📅</Text>
                  <Text className="font-bold">{statusDays.length}</Text>
                  <Text className="text-xs text-[#777]">Total Check-Ins</Text>
                </View>
                <View className="bg-[#f0f0f0] flex-1 items-center py-2 rounded-xl gap-1">
                  <Text className="text-2xl">{moodToEmoji(mostMood)}</Text>
                  <Text className="font-bold">
                    {mostMood ? capitalizeWords(mostMood) : "No Data"}
                  </Text>
                  <Text className="text-xs text-[#777]">Most felt mood</Text>
                </View>
                <View className="bg-[#f0f0f0] flex-1 items-center py-2 rounded-xl gap-1">
                  <Text className="text-2xl">⚡</Text>
                  <Text className="font-bold">{bestStreak}</Text>
                  <Text className="text-xs text-[#777]">Day best streak</Text>
                </View>
              </View>
            </View>
            <View className="gap-1">
              <Text className="text-xs text-[#777]">This week</Text>
              {/* Days */}
              <View className="flex-row gap-1">
                {homeWeek.map((current, index) => (
                  <View className="items-center gap-1 flex-1" key={index}>
                    <View
                      className={
                        (current.mood ? "bg-[#ca5476]" : "bg-[#ddd]") +
                        " w-10 h-10  rounded-lg justify-center"
                      }
                    >
                      <Text className="text-center">
                        {current.mood ? "✓" : ""}
                      </Text>
                    </View>
                    <Text className="text-sm text-[#777]">
                      {current.day.slice(0, 1)}
                    </Text>
                  </View>
                ))}
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
