import { View, Text, FlatList } from "react-native";

export default function Monthly() {
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

    for (let i = 0; i < startDay; i++) {
      cells.push({ key: `empty-${i}`, empty: true });
    }

    return cells;
  };

  return (
    <View className="px-6 gap-6 py-3">
      <View className="bg-white p-4 rounded-xl gap-3">
        <Text className="text-[#a57] font-bold">APRIL 2025</Text>
        <FlatList
          className="bg-red-500 "
          data={buildCalendar()}
          numColumns={7}
          keyExtractor={(item) => item.key}
          scrollEnabled={false}
          renderItem={({ item }) => {
            if (item.empty) {
              return (
                <View className="h-12 m-1 flex-1 rounded-2xl bg-blue-500" />
              );
            }

            return (
              <View className="h-12 m-1 bg-[#eee] rounded-xl items-center justify-center flex-1">
                {/* 👇 YOUR CUSTOM CHILD HERE */}
                <Text className="text-lg font-bold">{item.day}</Text>

                {/* Example custom content */}
                <Text className="text-xs text-gray-400">🙂</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
