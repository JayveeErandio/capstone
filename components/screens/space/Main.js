import { View, Text, ScrollView, Pressable } from "react-native";

export default function Main({ index, setPage }) {
  return (
    <View className={"px-6 absolute w-full h-full flex-col z-" + index}>
      {/* Header */}
      <View className="flex-row justify-between items-center py-6 bg-[#eee]">
        <View>
          <Text className="text-2xl font-bold font-serif">MoodSpace 🌸</Text>
          <Text className="text-sm text-[#777]">
            A safe space to share how you feel
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => setPage("Create")}
            className="bg-[#c57] p-3 rounded-full active:bg-[#000]"
          >
            <Text className="text-white text-sm">✍🏻 Post</Text>
          </Pressable>
          <Pressable className="bg-white items-center p-2 rounded-lg border border-[#777] gap-1">
            <Text className="text-sm">📝</Text>
            <Text className="text-xs text-[#555]">Mine</Text>
          </Pressable>
        </View>
      </View>

      {/* Newsfeed Posts */}
      <View className="flex-1 bg-[#eee]">
        <ScrollView className="flex-1">
          {[1, 2, 7].map((current, index) => (
            <View className="bg-white p-5 rounded-2xl gap-2 mb-5" key={index}>
              <View className="flex-row justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg bg-[#fee] p-2 rounded-xl border">
                    😤
                  </Text>
                  <View>
                    <Text className="text-[#773] font-bold">mrkrabzzz</Text>
                    <Text className="text-sm text-[#777]">
                      {"Stressed"} • 2m ago
                    </Text>
                  </View>
                </View>
                <Pressable className="self-start pb-4 pl-8">
                  <Text className="text-sm text-[#bbb]">Report</Text>
                </Pressable>
              </View>
              <Text className="leading-normal">
                Deadlines are piling up and I feel like I can't breathe. Anyone
                else feeling this way this week?
              </Text>
              <View className="flex-row gap-2">
                <Pressable className="bg-[#eee] p-2 rounded-full px-3 border border-[#aaa] active:bg-[#ddd]">
                  <Text className="text-[#555] font-bold">❤️ {14}</Text>
                </Pressable>
                <Pressable className="bg-[#eee] p-2 rounded-full px-3 border border-[#aaa] opacity-50">
                  <Text className="text-[#555] font-bold">😂 {0}</Text>
                </Pressable>
                <Pressable className="bg-[#eee] p-2 rounded-full px-3 border border-[#aaa] opacity-50">
                  <Text className="text-[#555] font-bold">😥 {0}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
