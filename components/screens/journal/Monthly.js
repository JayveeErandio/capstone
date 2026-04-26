import { View, Text, FlatList, Pressable } from "react-native";
import { useState } from "react";

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
      <View className="bg-white p-4 rounded-xl gap-3">
        <Text className="text-[#a57] font-bold">APRIL 2025</Text>
        <View className="flex-row justify-between px-5">
          <Text className="text-[#555] text-sm">S</Text>
          <Text className="text-[#555] text-sm">M</Text>
          <Text className="text-[#555] text-sm">T</Text>
          <Text className="text-[#555] text-sm">W</Text>
          <Text className="text-[#555] text-sm">T</Text>
          <Text className="text-[#555] text-sm">F</Text>
          <Text className="text-[#555] text-sm">S</Text>
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
    </View>
  );
}
