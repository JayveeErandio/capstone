import { View, Text, FlatList, Pressable } from "react-native";
import { useState, useContext, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import { Variables } from "../../../Variables";
import Graph from "../../Graph";

const buildCalendar = (currentDate = new Date()) => {
  const today = new Date(currentDate);
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const cells = [];

  let emptyOrder = 0;
  for (; emptyOrder < startDay; emptyOrder++) {
    cells.push({ key: `empty-${emptyOrder}`, empty: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
    });
  }

  while (cells.length % 7 != 0) {
    cells.push({ key: `empty-${emptyOrder}`, empty: true });
    emptyOrder++;
  }

  return cells;
};

export default function Monthly() {
  const {
    statusDays,
    moodToEmoji,
    capitalizeWords,
    moodToColor,
    darkenColor,
    chosenTheme,
  } = useContext(Variables);
  const [chosenDay, setChosenDay] = useState(new Date().getDate());
  const [chosenMonth, setChosenMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const monthName = new Date(chosenMonth).toLocaleString("default", {
    month: "long",
  });

  const statusMonths = statusDays.filter((current) =>
    current.date.startsWith(chosenMonth),
  );
  const selectedStatus = statusMonths.find(
    (current) =>
      current.date == chosenMonth + "-" + chosenDay.toString().padStart(2, "0"),
  );

  const mood = selectedStatus?.mood;
  const journal = selectedStatus?.journal;
  const statusMap = Object.fromEntries(
    statusMonths.map((item) => [item.date, item]),
  );

  function generateMonthChartData(data) {
    if (!data.length) return [];

    const moodMap = {
      excited: 4,
      content: 3,
      drained: 2,
      stressed: 1,
    };

    // Get month/year from first entry
    const sampleDate = new Date(data[0].date);

    const year = sampleDate.getFullYear();
    const month = sampleDate.getMonth();

    // Total number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Dates that should display labels
    const labelDates = [1, 6, 11, 16, 21, 26, 31];

    // Convert input into lookup by day
    const lookup = {};

    for (const item of data) {
      const day = new Date(item.date).getDate();

      lookup[day] = moodMap[item.mood];
    }

    const result = [];

    // ALWAYS generate every day
    for (let day = 1; day <= daysInMonth; day++) {
      const obj = {};

      // Add value only if data exists
      if (lookup[day] !== undefined) {
        obj.value = lookup[day];
      }

      // Add label only on selected dates
      if (labelDates.includes(day)) {
        obj.label = day;
      }

      result.push(obj);
    }

    return result;
  }

  const totalEntry = statusMonths.length;

  const [graphWidth, setGraphWidth] = useState(0);

  return (
    <View className="px-6 gap-6 py-3">
      {/* Calendar */}
      <View className="bg-white p-4 rounded-xl gap-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-1 items-center">
            <Pressable
              onPress={() => {
                let newDate = new Date(chosenMonth);
                newDate.setMonth(newDate.getMonth() - 1);
                const prevMonth = newDate.toISOString().slice(0, 7);
                setChosenMonth(prevMonth);
              }}
              className="p-2 active:bg-[#eee]"
            >
              <Text className="leading-none text-gray-500">❮</Text>
            </Pressable>
            <Text
              className="w-36 text-center font-archivo-bold"
              style={{ color: darkenColor(chosenTheme) }}
            >
              {monthName.toUpperCase()} {new Date(chosenMonth).getFullYear()}
            </Text>
            <Pressable
              onPress={() => {
                let newDate = new Date(chosenMonth);
                newDate.setMonth(newDate.getMonth() + 1);
                const nextMonth = newDate.toISOString().slice(0, 7);
                setChosenMonth(nextMonth);
              }}
              className="p-2 active:bg-[#eee]"
            >
              <Text className="leading-none text-gray-500">❯</Text>
            </Pressable>
          </View>
          <Text className="text-[#888] text-xs font-archivo">
            {totalEntry} check-ins
          </Text>
        </View>

        <View className="flex-row justify-between px-5">
          {["S", "M", "T", "W", "T", "F", "S"].map((current, index) => (
            <Text className="text-[#555] text-sm font-archivo" key={index}>
              {current}
            </Text>
          ))}
        </View>

        <FlatList
          data={buildCalendar(chosenMonth + "-01")}
          numColumns={7}
          keyExtractor={(item) => (item.empty ? item.key : item.day.toString())}
          scrollEnabled={false}
          renderItem={({ item }) => {
            if (item.empty) {
              return <View className="flex-1 rounded-xl m-0.5" />;
            }
            const thatStatus =
              statusMap[
                chosenMonth + "-" + item.day.toString().padStart(2, "0")
              ];

            return (
              <View className="flex-1 m-0.5">
                <Pressable
                  onPress={() => setChosenDay(item.day)}
                  className={
                    (item.day == new Date().getDate() ? " border " : " ") +
                    (item.day == chosenDay ? " bg-[#099] " : " bg-[#fef] ") +
                    " h-12 rounded-xl items-center justify-center active:bg-[#ddd]"
                  }
                >
                  <Text
                    className={
                      (item.day == chosenDay
                        ? " text-white "
                        : " text-[#777] ") + " text-sm font-archivo-bold"
                    }
                  >
                    {item.day}
                  </Text>

                  <Text className="text-xs">
                    {thatStatus ? moodToEmoji(thatStatus.mood) : ""}
                  </Text>
                </Pressable>
              </View>
            );
          }}
        />
        <View
          className="gap-2 p-3 rounded-2xl border border-[#cac]"
          style={{ backgroundColor: moodToColor(mood) + "10" }}
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl w-8 text-center">
              {moodToEmoji(mood)}
            </Text>
            <View>
              <Text className="font-archivo-bold">
                {mood ? capitalizeWords(mood) : "No entry"}
              </Text>
              <Text className="text-sm text-[#777] font-archivo">
                {chosenDay} {monthName} {new Date(chosenMonth).getFullYear()}
              </Text>
            </View>
          </View>
          <Text className="text-sm text-gray-700 font-archivo">{journal}</Text>
        </View>
      </View>

      {/* Mood Trend */}
      <View className="bg-white p-4 rounded-xl gap-1">
        <Text
          className="font-archivo-bold text-sm"
          style={{ color: darkenColor(chosenTheme) }}
        >
          MOOD TREND
        </Text>
        <Text className="text-[#888] text-xs font-archivo">
          {monthName} — daily mood across the month
        </Text>
        <View
          onLayout={(e) => {
            setGraphWidth(e.nativeEvent.layout.width);
          }}
          className="-mt-3"
        >
          <Graph
            width={graphWidth}
            data={generateMonthChartData(statusMonths)}
          />
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

      {/* Mood Percentage Breakdown */}
      <View className="bg-white p-4 rounded-xl gap-4">
        <Text
          className="font-archivo-bold text-sm"
          style={{ color: darkenColor(chosenTheme) }}
        >
          MOOD BREAKDOWN
        </Text>
        {(function () {
          let moods = [];
          for (let status of statusMonths) {
            let saved = moods.find((current) => current.mood == status.mood);
            if (saved) saved.count++;
            else moods.push({ mood: status.mood, count: 1 });
          }
          moods.sort((a, b) => b.count - a.count);
          const total = moods.reduce((prev, next) => prev + next.count, 0);
          moods = moods.map((current) => ({
            ...current,
            percent: (current.count / total) * 100,
          }));
          return moods;
        })().map((current) => (
          <View className="gap-1">
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-xs font-archivo">
                {moodToEmoji(current.mood)} {capitalizeWords(current.mood)}
              </Text>
              <Text className="text-gray-500 text-xs font-archivo">
                {current.count} days · {parseFloat(current.percent.toFixed(2))}%
              </Text>
            </View>
            <View className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <View
                className="h-full"
                style={{
                  width: current.percent + "%",
                  backgroundColor: moodToColor(current.mood),
                }}
              ></View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
