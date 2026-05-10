import { View, Text, Dimensions, Pressable } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Variables } from "../../../Variables";
import { useContext } from "react";

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
      <View className="bg-white p-4 rounded-xl gap-1">
        <Text className="text-[#a57]">MOOD TREND</Text>
        <Text className="text-[#999] text-sm">
          {"Mon"} — {"Sun"} • this week
        </Text>
        <LineChart
          style={{
            paddingRight: 60,
            marginRight: 20,
            paddingBottom: 18,
            marginTop: 10,
          }}
          data={{
            labels: journWeek.map((current) => current.day.slice(0, 1)),
            datasets: [
              {
                data: [3, 4, 1, 3, 2, 3, 4],
              },
            ],
          }}
          width={300}
          height={100}
          withHorizontalLabels={true}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#c79",
          }}
          segments={3}
          formatYLabel={(y) => {
            switch (parseInt(y)) {
              case 4:
                return "⚡ Exc";
              case 3:
                return "🍀 Con";
              case 2:
                return "🌧 Dra";
              case 1:
                return "😤 Str";
            }
          }}
          withVerticalLines={false}
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
