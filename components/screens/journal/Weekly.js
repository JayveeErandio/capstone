import { View, Text, Dimensions, Pressable } from "react-native";
import { Variables } from "../../../Variables";
import { useContext } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
  RadarChart,
  BubbleChart,
} from "react-native-gifted-charts";

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

  const mapped = journWeek.map((current) => {
    let num = null;

    switch (current.mood) {
      case "excited":
        num = 3;
        break;
      case "content":
        num = 2;
        break;
      case "drained":
        num = 1;
        break;
      case "stressed":
        num = 0;
        break;
    }

    return { value: num };
  });
  const lastValue = [...mapped]
    .reverse()
    .find((item) => item.value !== null)?.value;
  if (lastValue !== undefined) {
    mapped.push({ value: lastValue });
  }

  return (
    <View className="px-6 gap-6 py-3">
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
        <Text className="flex-1 text-center">
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
        <Text className="text-[#a57]">WEEKLY SUMMARY</Text>

        {/* Days */}
        <View className="flex-row gap-2">
          {journWeek.map((current) => (
            <View className="flex-1 gap-1" key={current.date}>
              <Text
                className={
                  "border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg text-gray-300"
                }
              >
                {moodToEmoji(current.mood)}
              </Text>
              <Text className="text-center text-sm text-[#777]">
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
        >
          <Text className="text-2xl">{moodToEmoji(major.mood)}</Text>
          <View>
            <Text className="font-serif font-bold text-[#575]">
              {haveMood ? "Mostly " + major.mood : "No any status yet"}
            </Text>
            <Text className="text-sm text-[#888]">
              {major.count} out of {7} days this week
            </Text>
          </View>
        </View>
      </View>

      {/* Mood Trends */}
      <View className="bg-white p-4 rounded-xl gap-1 overflow-hidden">
        <Text className="text-[#a57]">MOOD TREND</Text>
        <Text className="text-[#999] text-sm">
          {journWeek[0].day} — {journWeek[6].day} • this week
        </Text>
        <LineChart
          data={mapped}
          maxValue={3}
          stepValue={1}
          thickness={2}
          areaChart
          initialSpacing={0}
          dataPointsRadius={3}
          initialSpacing={10}
          width={Dimensions.get("window").width - 120}
          stepHeight={30}
          spacing={Dimensions.get("window").width / 9.5}
          yAxisLabelTexts={["Str", "Dra", "Con", "Exc"]}
          xAxisLabelTexts={journWeek.map((current) => current.day.slice(0, 1))}
          startFillColor="#fdd"
          endFillColor="#fdd"
          startOpacity={0.5}
          endOpacity={0.5}
          color="#d67"
          dataPointsColor="#a34"
          dataPointsRadius={4}
          yAxisTextStyle={{
            fontSize: 10,
            color: "gray",
          }}
          xAxisLabelTextStyle={{
            fontSize: 10,
            color: "gray",
          }}
          showDataPointsForMissingValues={false}
          connectMissingData={false}
        />
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
