import { View, Text } from "react-native";

export default function Weekly() {
  return (
    <View className="px-6">
      <View className="bg-white p-4 rounded-xl gap-3">
        <Text className="text-[#a57]">WEEKLY SUMMARY</Text>

        {/* Days */}
        <View className="flex-row gap-2">
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              🍀
            </Text>
            <Text className="text-center text-sm text-[#777]">Sun</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              ⚡
            </Text>
            <Text className="text-center text-sm text-[#777]">Mon</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              😤
            </Text>
            <Text className="text-center text-sm text-[#777]">Tue</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              🍀
            </Text>
            <Text className="text-center text-sm text-[#777]">Wed</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              ⚡
            </Text>
            <Text className="text-center text-sm text-[#777]">Thu</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#77c] rounded-xl text-center self-start py-3 w-full text-lg bg-[#fff]">
              🌧
            </Text>
            <Text className="text-center text-sm text-[#777]">Fri</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              🍀
            </Text>
            <Text className="text-center text-sm text-[#777]">Sat</Text>
          </View>
        </View>

        {/* Summary */}
        <View className="flex-row bg-[#efe] border-[#bcb] border rounded-xl p-3 items-center gap-2">
          <Text className="text-2xl">🍀</Text>
          <View>
            <Text className="font-serif font-bold text-[#575]">
              Mostly {"Content"}
            </Text>
            <Text className="text-sm text-[#888]">
              {3} out of {7} days this week
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
