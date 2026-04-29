import { View, Text, Pressable, ScrollView } from "react-native";

export default function NotificationScreen() {
  return (
    <View className="px-6 bg-[#eee] flex-1">
      {/* Header */}
      <View className="bg-[#eee] flex-row justify-between py-6 items-center">
        <View>
          <Text className="font-serif font-bold text-2xl">Notifications</Text>
          <Text className="text-sm text-[#777]">{3 + " unread"}</Text>
        </View>
        <Pressable className="bg-white self-start p-2 px-3 rounded-full active:bg-[#f7f7f7]">
          <Text className="text-sm text-[#555]">Mark all read</Text>
        </Pressable>
      </View>

      {/* Main Notification */}
      <ScrollView>
        {/* Unread */}
        <Text className="text-[#c59] font-bold text-sm mb-2">UNREAD</Text>
        {[1, 2].map((current, index) => (
          <Pressable
            className="bg-[#ffe] p-4 rounded-2xl active:bg-[#eed] mb-5 border border-[#bb7]"
            key={index}
          >
            <View className="flex-row gap-3 ">
              <Text className="text-xl bg-red-500 self-start bg-[#ffc] border border-[#ece] p-2 rounded-xl">
                ❤️
              </Text>
              <View className="flex-row flex-1">
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-bold">
                    {"Someone reacted to your post"}
                  </Text>
                  <Text className="text-xs text-[#777]">
                    {"Your post got a Heart reaction on MoodSpace."}
                  </Text>
                  <Text className="text-xs text-[#777]">{"2m ago"}</Text>
                </View>
                <Text className="text-5xl text-[#c69] leading-6">•</Text>
              </View>
            </View>
          </Pressable>
        ))}

        {/* Read */}
        <Text className="text-[#c59] font-bold text-sm mb-2">EARLIER</Text>
        {[1, 2, 3, 4, 5].map((current, index) => (
          <View
            className="flex-row  gap-3 bg-white p-4 rounded-2xl mb-5"
            key={index}
          >
            <Text className="text-xl bg-red-500 self-start bg-[#ffc] border border-[#ece] p-2 rounded-xl">
              ❤️
            </Text>
            <View className="flex-row flex-1">
              <View className="flex-1 gap-1">
                <Text className="text-sm font-bold">
                  {"Someone reacted to your post"}
                </Text>
                <Text className="text-xs text-[#777]">
                  {"Your post got a Heart reaction on MoodSpace."}
                </Text>
                <Text className="text-xs text-[#777]">{"2m ago"}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
