import { useContext } from "react";
import { View, ScrollView, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../contexts/Authentication";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { setUser, entries, setEntries, isAnalyzing } = useContext(AuthContext);

  return (
    <ScrollView className="p-8 flex-1">
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
            setEntries(
              Object.fromEntries(
                Object.entries(entries).map(([key]) => [key, ""]),
              ),
            );
            setUser({});
          }}
        >
          <Image
            source={require("../../assets/square.png")}
            className="w-16 h-16 rounded-full"
          />
        </Pressable>
      </View>

      {/* Mood CheckIn */}
      <View className="bg-[#f1e6f4] p-4 gap-4 rounded-lg">
        <View className="flex-row gap-2 items-center">
          <Image
            source={require("../../assets/square.png")}
            className="w-16 h-16"
          />
          <View className="flex-1 gap-1">
            <Text className="font-bold font-serif text-xl">Mood Check-In</Text>
            <Text className="text-[#555] text-xs">
              4 quick questions to understand what you're feeling.
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 bg-white rounded-lg p-2 gap-1 items-center">
            <Image
              source={require("../../assets/square.png")}
              className="w-8 h-8"
            />
            <Text className="text-xs text-[#555]">Energy</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-2 gap-1 items-center">
            <Image
              source={require("../../assets/square.png")}
              className="w-8 h-8"
            />
            <Text className="text-xs text-[#555]">Duration</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-2 gap-1 items-center">
            <Image
              source={require("../../assets/square.png")}
              className="w-8 h-8"
            />
            <Text className="text-xs text-[#555]">Heart</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-2 gap-1 items-center">
            <Image
              source={require("../../assets/square.png")}
              className="w-8 h-8"
            />
            <Text className="text-xs text-[#555]">Context</Text>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Entry")}
          className="bg-[#c57] rounded-full p-4 active:bg-[#b46]"
        >
          <Text className="text-white text-center font-bold text-lg">
            {isAnalyzing ? "Analyzing..." : "Start Check-In \u27F6"}
          </Text>
        </Pressable>
      </View>

      {/* User's Progress */}
      <View className="bg-white mt-6 p-5 rounded-3xl gap-3 mb-12">
        <Text className="text-[#c57] font-bold text-sm">YOUR PROGRESS</Text>
        <View className="gap-2">
          <View className="bg-[#f5e0ef] flex-row gap-3 p-4 rounded-2xl border border-[#e0cbd2] items-center">
            <Image
              source={require("../../assets/square.png")}
              className="w-14 h-16"
            />
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
              <Image
                source={require("../../assets/square.png")}
                className="w-10 h-10"
              />
              <Text className="font-bold">22</Text>
              <Text className="text-xs text-[#777]">Total Check-Ins</Text>
            </View>
            <View className="bg-[#f0f0f0] flex-1 items-center py-2 rounded-xl gap-1">
              <Image
                source={require("../../assets/square.png")}
                className="w-10 h-10"
              />
              <Text className="font-bold">Content</Text>
              <Text className="text-xs text-[#777]">Most felt mood</Text>
            </View>
            <View className="bg-[#f0f0f0] flex-1 items-center py-2 rounded-xl gap-1">
              <Image
                source={require("../../assets/square.png")}
                className="w-10 h-10"
              />
              <Text className="font-bold">3</Text>
              <Text className="text-xs text-[#777]">Day best streak</Text>
            </View>
          </View>
        </View>
        <View className="gap-1">
          <Text className="text-xs text-[#777]">This week</Text>
          <View>
            <View className="w-10 h-10 bg-[#ca5476] rounded-lg"></View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
