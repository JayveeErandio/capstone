import { View, Text } from "react-native";
import { useContext } from "react";
import { Variables } from "../../../Variables";

export default function Entries() {
  const { statusDays, capitalizeWords, moodToEmoji, moodToColor } =
    useContext(Variables);
  const entries = statusDays.filter((current) => !!current.journal);
  entries.reverse();

  function formatDate(datetime) {
    const dateObj = new Date(datetime);

    const date = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const time = dateObj.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return date;
  }

  return (
    <View className="px-6 gap-4 py-3">
      {entries.map((current) => (
        <View className="bg-white p-4 rounded-2xl gap-4" key={current.id}>
          <View className="flex-row items-center gap-3">
            <Text
              className="border border-[#cca] p-2 text-xl rounded-xl"
              style={{ backgroundColor: moodToColor(current.mood) + "20" }}
            >
              {moodToEmoji(current.mood)}
            </Text>
            <View className="gap-1">
              <Text className="text-[#996] font-bold">
                {capitalizeWords(current.mood)}
              </Text>
              <Text className="text-xs text-[#888]">
                {formatDate(current.date)}
              </Text>
            </View>
          </View>
          <Text className="text-[#555] leading-normal">
            "{current.journal}"
          </Text>
        </View>
      ))}
    </View>
  );
}
