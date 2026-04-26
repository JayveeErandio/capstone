import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function Weekly() {
  return (
    <View className="px-6 gap-6 py-3">
      {/* Weekly Summary */}
      <View className="bg-white p-4 rounded-xl gap-3">
        <Text className="text-[#a57]">WEEKLY SUMMARY</Text>

        {/* Days */}
        <View className="flex-row gap-2">
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              🍀
            </Text>
            <Text className="text-center text-sm text-[#777]">Sun</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              ⚡
            </Text>
            <Text className="text-center text-sm text-[#777]">Mon</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              😤
            </Text>
            <Text className="text-center text-sm text-[#777]">Tue</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              🍀
            </Text>
            <Text className="text-center text-sm text-[#777]">Wed</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              ⚡
            </Text>
            <Text className="text-center text-sm text-[#777]">Thu</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#77c] rounded-xl text-center self-start py-3 w-full text-lg bg-[#fff]">
              🌧
            </Text>
            <Text className="text-center text-sm text-[#777]">Fri</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="border border-[#777] rounded-xl text-center self-start py-3 w-full text-lg bg-[#ffd]">
              🍀
            </Text>
            <Text className="text-center text-sm text-[#777]">Sat</Text>
          </View>
        </View>

        {/* Summary */}
        <View className="flex-row bg-[#efe] border-[#bcb] border rounded-xl p-3 items-center gap-2">
          <Text className="text-2xl">🍀</Text>
          <View>
            <Text className="font-serif font-bold text-[#575]">
              Mostly {"Content"}
            </Text>
            <Text className="text-sm text-[#888]">
              {3} out of {7} days this week
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
            labels: ["M", "T", "W", "T", "F", "S", "S"],
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
      <View className="bg-white p-4 rounded-xl gap-2">
        <Text className="text-[#a57]">WEEKLY INSIGHT</Text>
        <Text className="text-[#333] font-bold font-serif italic">
          {"I notice you're riding some natural waves this"}
        </Text>
      </View>
    </View>
  );
}
