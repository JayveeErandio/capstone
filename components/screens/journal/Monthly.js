import { View, Text, FlatList, Pressable } from "react-native";
import { useState, useContext, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import { Variables } from "../../../Variables";

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
  const { statusDays, moodToEmoji, capitalizeWords } = useContext(Variables);
  const [chosenDay, setChosenDay] = useState(new Date().getDate());
  const [chosenMonth, setChosenMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const monthName = new Date(chosenMonth).toLocaleString("default", {
    month: "long",
  });
  const selectedStatus = statusDays.find(
    (current) =>
      current.date == chosenMonth + "-" + chosenDay.toString().padStart(2, "0"),
  );

  const mood = selectedStatus?.mood;
  const journal = selectedStatus?.journal;
  const statusMap = Object.fromEntries(
    statusDays.map((item) => [item.date, item]),
  );

  const totalEntry = statusDays.filter((current) =>
    current.date.startsWith(chosenMonth),
  ).length;

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
            <Text className="text-[#a57] w-36 text-center">
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
          <Text className="text-[#888] text-xs">{totalEntry} check-ins</Text>
        </View>

        <View className="flex-row justify-between px-5">
          {["S", "M", "T", "W", "T", "F", "S"].map((current, index) => (
            <Text className="text-[#555] text-sm" key={index}>
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
                        : " text-[#777] ") + " text-sm font-bold"
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
        <View className="gap-2 bg-[#fef] p-3 rounded-2xl border border-[#cac]">
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl w-8 text-center">
              {moodToEmoji(mood)}
            </Text>
            <View>
              <Text className="font-bold">
                {mood ? capitalizeWords(mood) : "No entry"}
              </Text>
              <Text className="text-sm text-[#777]">
                {chosenDay} {monthName} {new Date(chosenMonth).getFullYear()}
              </Text>
            </View>
          </View>
          <Text className="text-sm text-gray-700">{journal}</Text>
        </View>
      </View>
    </View>
  );
}
