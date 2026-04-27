import { View, Text, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { LineChart } from "react-native-chart-kit";

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getStartDay = (year, month) => {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
};

const buildCalendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);

  const cells = [];

  // empty slots before day 1
  for (let i = 0; i < startDay; i++) {
    cells.push({ key: `empty-${i}`, empty: true });
  }

  // actual days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      key: `day-${d}`,
      day: d,
      empty: false,
    });
  }

  while (cells.length % 7 != 0) {
    cells.push({ key: `empty-${0}`, empty: true });
  }

  return cells;
};

const nowMonth = new Date().toLocaleString("default", { month: "long" });
const nowYear = new Date().getFullYear();

export default function Monthly() {
  const [chosenDay, setChosenDay] = useState(new Date().getDate());

  return (
    <View className="px-6 gap-6 py-3">
      {/* Calendar */}
      <View className="bg-white p-4 rounded-xl gap-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-[#a57]">APRIL 2025</Text>
          <Text className="text-[#888] text-xs">31 check-ins</Text>
        </View>

        <View className="flex-row justify-between px-5">
          {["S", "M", "T", "W", "T", "F", "S"].map((current, index) => (
            <Text className="text-[#555] text-sm" key={index}>
              {current}
            </Text>
          ))}
        </View>
        <FlatList
          data={buildCalendar()}
          numColumns={7}
          keyExtractor={(item) => item.key}
          scrollEnabled={false}
          renderItem={({ item }) => {
            if (item.empty) {
              return <View className="flex-1 rounded-xl m-0.5" />;
            }

            return (
              <Pressable
                onPress={() => setChosenDay(item.day)}
                className="flex-1 m-0.5"
              >
                <View
                  className={
                    (item.day == new Date().getDate() ? " border " : " ") +
                    (item.day == chosenDay ? " bg-[#099] " : " bg-[#eee] ") +
                    " h-12 rounded-xl items-center justify-center"
                  }
                >
                  {/* 👇 YOUR CUSTOM CHILD HERE */}
                  <Text
                    className={
                      (item.day == chosenDay
                        ? " text-white "
                        : " text-[#777] ") + " text-sm font-bold"
                    }
                  >
                    {item.day}
                  </Text>

                  {/* Example custom content */}
                  <Text className="text-xs text-gray-400">🙂</Text>
                </View>
              </Pressable>
            );
          }}
        />
        <View className="gap-2 bg-[#fef] p-3 rounded-2xl border border-[#cac]">
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl">🌧</Text>
            <View>
              <Text className="font-bold">Drained</Text>
              <Text className="text-sm text-[#777]">
                {chosenDay} {nowMonth} {nowYear}
              </Text>
            </View>
          </View>
          <Text className="italic">
            {'"Exhausted by end of week. Need rest"'}
          </Text>
        </View>
      </View>

      {/* Mood Trend */}
      <View className="bg-white p-4 rounded-xl gap-1">
        <Text className="text-[#a57]">MOOD TREND</Text>
        <Text className="text-[#888] text-xs">
          {nowMonth} — daily mood across the month
        </Text>
        <LineChart
          style={{
            paddingRight: 25,
            marginRight: 5,
            paddingBottom: 18,
            marginTop: 10,
          }}
          data={{
            labels: [
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
            ],
            datasets: [
              {
                data: [
                  3, 4, 1, 3, 2, 3, 4, 1, 4, 4, 2, 3, 1, 1, 2, 2, 3, 3, 4, 4, 1,
                  1, 2, 2, 3, 3, 4, 4, 1, 1, 2,
                ],
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
            propsForLabels: {
              fontSize: 6,
            },
          }}
          segments={3}
          formatYLabel={(y) => {
            switch (parseInt(y)) {
              case 4:
                return "Exc";
              case 3:
                return "Con";
              case 2:
                return "Dra";
              case 1:
                return "Str";
            }
          }}
          withVerticalLines={false}
        />
      </View>
    </View>
  );
}
