import { View, Text, Pressable, ScrollView } from "react-native";

export default function Mine({ index, setPage }) {
  return (
    <View className={"px-6 absolute w-full h-full flex-col z-" + index}>
      {/* Header */}
      <View className="flex-row bg-[#eee] py-5 items-center gap-3">
        <Pressable
          onPress={setPage}
          className="bg-white p-2 px-5 rounded-full active:bg-[#f7f7f7]"
        >
          <Text className="text-[#555]">{"\u27F5 Back"}</Text>
        </Pressable>
        <Text className="font-bold text-xl font-serif">My Posts</Text>
      </View>
      <ScrollView className="bg-[#eee]">
        <View className="pb-5">
          {[0, 1, 1].map((current, index) => (
            <View
              className={
                (current == 0 ? "border border-[#cb7]" : "") +
                " bg-white p-5 rounded-2xl gap-2 mb-5"
              }
              key={index}
            >
              <Text
                className={
                  (current == 1 ? "hidden" : "") +
                  " bg-[#fec] self-start p-1 px-2 border text-xs font-bold text-[#b97] rounded-full border-[#a97]"
                }
              >
                ⏳ Under review by GCU
              </Text>
              <View className="flex-row justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg bg-[#fee] p-2 rounded-xl border">
                    😤
                  </Text>
                  <View>
                    <Text className="text-[#773] font-bold">{"Stressed"}</Text>
                    <Text className="text-sm text-[#777]">
                      {"Posted"} 2m ago
                    </Text>
                  </View>
                </View>
                <Pressable className="self-start pb-4 pl-8">
                  <Text className="text-sm text-[#bbb]">Delete</Text>
                </Pressable>
              </View>
              <Text className="leading-normal">
                Deadlines are piling up and I feel like I can't breathe. Anyone
                else feeling this way this week?
              </Text>
              <View
                className={(current == 0 ? "hidden" : "") + " flex-row gap-2"}
              >
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
        </View>
      </ScrollView>
    </View>
  );
}
