import { View, Text, Dimensions, Pressable } from "react-native";
import { Variables } from "../../../Variables";
import { useState, useContext } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
  RadarChart,
  BubbleChart,
} from "react-native-gifted-charts";
import Graph from "../../Graph";

export default function Weekly() {
  const {
    journWeek,
    setJournWeek,
    moodToEmoji,
    moodToColor,
    generateWeekData,
  } = useContext(Variables);

  let haveMood = true;

  function getMajorMood(array) {
    const counts = {};

    array.forEach((item) => {
      if (!item.mood) return;

      counts[item.mood] = (counts[item.mood] || 0) + 1;
    });

    if (Object.keys(counts).length == 0) {
      haveMood = false;
      return { mood: null, count: 0 };
    }

    const majorMood = Object.keys(counts).reduce((major, current) => {
      return counts[current] > counts[major] ? current : major;
    });

    return {
      mood: majorMood,
      count: counts[majorMood],
    };
  }
  const major = getMajorMood(journWeek);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const firstDate = new Date(journWeek[0].date);
  const lastDate = new Date(journWeek[6].date);

  const sameMonth = firstDate.getMonth() == lastDate.getMonth();

  function mapDays(data) {
    const moodValueMap = {
      excited: 4,
      content: 3,
      drained: 2,
      stressed: 1,
    };

    return data.map((item) => {
      const label = item.day?.[0] ?? "";

      const mapped = { label };

      if (item.mood && moodValueMap[item.mood] != null) {
        mapped.value = moodValueMap[item.mood];
      }

      return mapped;
    });
  }

  const [graphWidth, setGraphWidth] = useState(0);

  return (
    <View className="px-6 gap-6 py-3">
      {/* Weeks Navigation */}
      <View className="bg-white p-1 rounded-xl gap-3 flex-row items-center">
        <Pressable
          onPress={() => {
            const thatDate = journWeek[0].date;
            let d = new Date(thatDate);
            d.setUTCDate(d.getUTCDate() - 7);
            setJournWeek(generateWeekData(d.toISOString().substr(0, 10)));
          }}
          className="p-3 px-5 active:bg-gray-100"
        >
          <Text className="text-lg leading-none">❮</Text>
        </Pressable>
        <Text className="flex-1 text-center font-archivo">
          {monthNames[firstDate.getMonth()]} {firstDate.getDate()} -{" "}
          {sameMonth ? "" : monthNames[lastDate.getMonth()]}{" "}
          {lastDate.getDate()}
        </Text>
        <Pressable
          onPress={() => {
            const thatDate = journWeek[0].date;
            let d = new Date(thatDate);
            d.setUTCDate(d.getUTCDate() + 7);
            setJournWeek(generateWeekData(d.toISOString().substr(0, 10)));
          }}
          className="p-3 px-5"
        >
          <Text className="text-lg leading-none">❯</Text>
        </Pressable>
      </View>

      {/* Weekly Summary */}
      <View className="bg-white p-4 rounded-xl gap-3">
        <Text className="text-[#a57] font-archivo">WEEKLY SUMMARY</Text>

        {/* Days */}
        <View className="flex-row gap-2">
          {journWeek.map((current) => (
            <View className="flex-1 gap-1" key={current.date}>
              <Text
                className={
                  "border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg text-gray-300"
                }
                style={{ backgroundColor: moodToColor(current.mood) + "20" }}
              >
                {moodToEmoji(current.mood)}
              </Text>
              <Text className="text-center text-sm text-[#777] font-archivo">
                {current.day}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View
          className={
            "flex-row border-[#bcb] border rounded-xl p-3 items-center gap-2"
          }
          style={{ backgroundColor: moodToColor(major.mood) + "10" }}
        >
          <Text className="text-2xl">{moodToEmoji(major.mood)}</Text>
          <View>
            <Text className="font-lora-bold text-[#575]">
              {haveMood ? "Mostly " + major.mood : "No any status yet"}
            </Text>
            <Text className="text-sm text-[#888] font-archivo">
              {major.count} out of {7} days this week
            </Text>
          </View>
        </View>
      </View>

      {/* Mood Trends */}
      <View className="p-4 bg-white rounded-xl gap-1 ">
        <Text className="text-[#a57] font-archivo">MOOD TREND</Text>
        <Text className="text-[#999] text-sm font-archivo">
          {journWeek[0].day} — {journWeek[6].day} • this week
        </Text>
        <View
          onLayout={(e) => {
            setGraphWidth(e.nativeEvent.layout.width);
          }}
          className="-mt-3"
        >
          <Graph width={graphWidth} data={mapDays(journWeek)} />
        </View>
        <View className="flex-row gap-2 mt-3">
          {["Excited", "Content", "Drained", "Stressed"].map((current) => (
            <View className="flex-row items-center gap-1">
              <View
                style={{
                  backgroundColor: moodToColor(current),
                  width: "10",
                  height: "10",
                }}
                className="rounded-full"
              ></View>
              <Text className="text-gray-500 text-sm font-archivo">
                {current}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Weekly Insight */}
      <View className="bg-white p-4 rounded-xl gap-2 hidden">
        <Text className="text-[#a57]">WEEKLY INSIGHT</Text>
        <Text className="text-[#333] font-bold font-serif italic">
          {"I notice you're riding some natural waves this"}
        </Text>
      </View>
    </View>
  );
}
