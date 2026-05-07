import { View, Text, Pressable, ScrollView } from "react-native";
import { useContext } from "react";
import { Variables } from "../../Variables";

export default function NotificationScreen() {
  const { notifications, readNotification } = useContext(Variables);
  const read = notifications.filter((current) => current.is_seen);
  const unread = notifications.filter((current) => !current.is_seen);

  const typetoemoji = function (type) {
    switch (type) {
      case "post_denied":
        return "🚫";
      case "funny":
        return "😂";
      case "post_approved":
        return "🚀";
    }
  };

  return (
    <View className="px-6 bg-[#eee] flex-1">
      {/* Header */}
      <View className="bg-[#eee] flex-row justify-between py-6 items-center">
        <View>
          <Text className="font-serif font-bold text-2xl">Notifications</Text>
          <Text className="text-sm text-[#777]">{3 + " unread"}</Text>
        </View>
        <Pressable
          onPress={() => {
            if (unread.length > 0) readNotification();
          }}
          className={
            (unread.length > 0 ? "active:bg-[#f7f7f7]" : "opacity-50") +
            " bg-white self-start p-2 px-3 rounded-full"
          }
        >
          <Text className="text-sm text-[#555]">Mark all read</Text>
        </Pressable>
      </View>

      {/* Main Notification */}
      <ScrollView>
        <View className="flex-row gap-3 bg-[#fef] p-3 rounded-2xl mb-3 border border-[#cac] items-center">
          <Text className="bg-[#ddf] text-center text-[#99c] text-3xl rounded-lg font-bold">
            ℹ️
          </Text>
          <Text className="text-sm text-[#777] leading-4 flex-1">
            By clicking the unread notification, you confirm that you already
            read it.
          </Text>
        </View>

        {/* Unread */}
        <Text
          className={
            (unread.length == 0 ? "hidden" : "") +
            " text-[#c59] font-bold text-sm mb-2"
          }
        >
          UNREAD
        </Text>
        {unread.map((current) => (
          <Pressable
            onPress={async () => {
              readNotification(current.id);
            }}
            className="bg-[#ffe] p-4 rounded-2xl active:bg-[#eed] mb-3 border border-[#bb7]"
            key={current.id}
          >
            <View className="flex-row gap-3 ">
              <Text className="text-xl self-start bg-white border border-[#ece] p-2 rounded-xl">
                {typetoemoji(current.type)}
              </Text>
              <View className="flex-row flex-1">
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-bold">{current.title}</Text>
                  <Text className="text-xs text-[#777]">{current.content}</Text>
                  <Text className="text-xs text-[#777]">{"2m ago"}</Text>
                </View>
                <Text className="text-5xl text-[#c69] leading-6">•</Text>
              </View>
            </View>
          </Pressable>
        ))}

        {/* Read */}
        <Text
          className={
            (read.length == 0 ? "hidden" : "") +
            " text-[#c59] font-bold text-sm mb-2"
          }
        >
          EARLIER
        </Text>
        {read.map((current, index) => (
          <View
            className="flex-row  gap-3 bg-white p-4 rounded-2xl mb-3"
            key={index}
          >
            <Text className="text-xl self-start bg-[#fef] border border-[#ece] p-2 rounded-xl">
              {typetoemoji(current.type)}
            </Text>
            <View className="flex-row flex-1">
              <View className="flex-1 gap-1">
                <Text className="text-sm font-bold">{current.title}</Text>
                <Text className="text-xs text-[#777]">{current.content}</Text>
                <Text className="text-xs text-[#777]">{"2m ago"}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
