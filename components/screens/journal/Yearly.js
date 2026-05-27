import { View, Text } from "react-native";
import { useContext } from "react";
import { Variables } from "../../../Variables";

export default function Yearly() {
  const { journYear, capitalizeWords, moodToEmoji, darkenColor, chosenTheme } =
    useContext(Variables);

  return (
    <View className="px-6 gap-6 py-3">
      <View className="bg-[#e7e7f0] p-4 rounded-xl gap-4">
        <Text className="text-sm text-[#935] font-archivo">
          {new Date().getFullYear()} AT A GLANCE
        </Text>
        <View className="flex-row gap-4">
          <View className="bg-white flex-1 p-4 rounded-xl gap-1">
            <Text className="text-3xl">📅</Text>
            <Text className="text-xl font-lora-bold">{journYear.total}</Text>
            <Text className="text-sm text-[#777] font-archivo">
              Total Check-Ins
            </Text>
          </View>
          <View className="bg-white flex-1 p-4 rounded-xl gap-1">
            <Text className="text-3xl">🔥</Text>
            <Text className="text-xl font-lora-bold">
              {journYear.longestStreak}
            </Text>
            <Text className="text-sm text-[#777] font-archivo">
              Longest Streak
            </Text>
          </View>
        </View>
        <View className="flex-row gap-4">
          <View className="bg-white flex-1 p-4 rounded-xl gap-1">
            <Text className="text-3xl">{moodToEmoji(journYear.mostMood)}</Text>
            <Text className="text-xl font-lora-bold">
              {capitalizeWords(journYear.mostMood) ?? "No data yet"}
            </Text>
            <Text className="text-sm text-[#777] font-archivo">
              Most felt mood
            </Text>
          </View>
          <View className="bg-white flex-1 p-4 rounded-xl gap-1">
            <Text className="text-3xl">📓</Text>
            <Text className="text-xl font-lora-bold">{journYear.journals}</Text>
            <Text className="text-sm text-[#777] font-archivo">
              Journal Entries
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl gap-4">
        <Text
          className="font-archivo-bold text-sm"
          style={{ color: darkenColor(chosenTheme) }}
        >
          YEARLY MOOD HEATMAP
        </Text>
        <View className="flex-row flex-wrap px-2">
          {journYear.months.map((month) => (
            <View key={month.monthOrder} className="w-1/4 p-1 ">
              <View
                className={
                  (month.mostMood
                    ? "bg-[#fee]  border-[#a55]"
                    : "bg-gray-200 border-gray-300 opacity-30") +
                  " border rounded-xl p-3 items-center justify-center gap-1"
                }
              >
                <Text className="text-xl">{moodToEmoji(month.mostMood)}</Text>
                <Text className="text-sm font-archivo">{month.name}</Text>
                <Text className="text-xs text-[#888] font-archivo">
                  {month.total + "d"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
