import { View, Text } from "react-native";

export default function Yearly() {
  return (
    <View className="px-6 gap-6 py-3">
      <View className="bg-[#e7e7f0] p-4 rounded-xl gap-4">
        <Text className="text-sm text-[#935]">2025 AT A GLANCE</Text>
        <View className="flex-row gap-4">
          <View className="bg-white flex-1 p-4 rounded-xl gap-1">
            <Text className="text-3xl">📅</Text>
            <Text className="text-xl font-bold font-serif">218</Text>
            <Text className="text-sm text-[#777]">Total Check-Ins</Text>
          </View>
          <View className="bg-white flex-1 p-4 rounded-xl gap-1">
            <Text className="text-3xl">🔥</Text>
            <Text className="text-xl font-bold font-serif">22</Text>
            <Text className="text-sm text-[#777]">Longest Streak</Text>
          </View>
        </View>
        <View className="flex-row gap-4">
          <View className="bg-white flex-1 p-4 rounded-xl gap-1">
            <Text className="text-3xl">🍀</Text>
            <Text className="text-xl font-bold font-serif">Content</Text>
            <Text className="text-sm text-[#777]">Most felt mood</Text>
          </View>
          <View className="bg-white flex-1 p-4 rounded-xl gap-1">
            <Text className="text-3xl">📓</Text>
            <Text className="text-xl font-bold font-serif">47</Text>
            <Text className="text-sm text-[#777]">Journal Entries</Text>
          </View>
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl gap-4">
        <Text className="text-sm text-[#935]">YEARLY MOOD HEATMAP</Text>
        <View className="flex-row flex-wrap px-2">
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((month, i) => (
            <View key={i} className="w-1/4 p-1 ">
              <View className="bg-[#fee] border border-[#a55] rounded-xl p-3 items-center justify-center gap-1">
                <Text className="text-xl">🍀</Text>
                <Text className="text-sm">{month}</Text>
                <Text className="text-xs text-[#888]">{"16d"}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
