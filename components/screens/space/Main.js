import { View, Text, ScrollView, Pressable } from "react-native";
import { useContext } from "react";
import { Variables } from "../../../Variables";

export default function Main({ index, setPage }) {
  const { posts } = useContext(Variables);
  console.log(posts[0]);

  function formatTime(timestamp) {
    const date = new Date(timestamp); // auto handles UTC → local
    const now = new Date();

    const diffMs = now - date;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // 🕒 Just now / seconds
    if (seconds < 60) return "just now";

    // ⏱ Minutes
    if (minutes < 60) return `${minutes}m ago`;

    // 🕐 Hours
    if (hours < 24) return `${hours}h ago`;

    // 📅 Yesterday
    if (days === 1) return "yesterday";

    // 📆 Days ago
    if (days < 7) return `${days}d ago`;

    // 🗓 Fallback to full date (e.g., Jan 18 | 6:38 PM)
    return date
      .toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", " |");
  }

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
          <Pressable
            onPress={() => setPage("Mine")}
            className="bg-white items-center p-2 rounded-lg border border-[#777] gap-1 active:bg-[#eee]"
          >
            <Text className="text-sm">📝</Text>
            <Text className="text-xs text-[#555]">Mine</Text>
          </Pressable>
        </View>
      </View>

      {/* Newsfeed Posts */}
      <View className="flex-1 bg-[#eee]">
        <ScrollView className="flex-1">
          {posts.map((current, index) => (
            <View className="bg-white p-5 rounded-2xl gap-2 mb-5" key={index}>
              <View className="flex-row justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg bg-[#fef] p-2 rounded-xl border">
                    {current.mood == "Excited"
                      ? "⚡"
                      : current.mood == "Content"
                        ? "🍀"
                        : current.mood == "Drained"
                          ? "🌧"
                          : "😤"}
                  </Text>
                  <View>
                    <Text className="text-[#773] font-bold">
                      {current.students.anonymous_name}
                    </Text>
                    <Text className="text-sm text-[#777]">
                      {current.mood} • {formatTime(current.datetime)}
                    </Text>
                  </View>
                </View>
                <Pressable className="self-start pb-4 pl-8">
                  <Text className="text-sm text-[#bbb]">Report</Text>
                </Pressable>
              </View>
              <Text className="leading-normal">{current.content}</Text>
              <View className="flex-row gap-2">
                <Pressable
                  className={
                    (current.myreact == "love"
                      ? "bg-blue-100 active:bg-blue-200"
                      : "bg-gray-100 active:bg-gray-200") +
                    "  p-2 rounded-full px-3 border border-[#aaa]"
                  }
                >
                  <Text
                    className={
                      (current.myreact == "love"
                        ? "text-blue-500"
                        : "text-[#888]") + "  font-bold"
                    }
                  >
                    ❤️ {current.reactions.love ?? 0}
                  </Text>
                </Pressable>
                <Pressable
                  className={
                    (current.myreact == "funny"
                      ? "bg-blue-100 active:bg-blue-200"
                      : "bg-gray-100 active:bg-gray-200") +
                    "  p-2 rounded-full px-3 border border-[#aaa]"
                  }
                >
                  <Text
                    className={
                      (current.myreact == "funny"
                        ? "text-blue-500"
                        : "text-[#888]") + "  font-bold"
                    }
                  >
                    😂 {current.reactions.funny ?? 0}
                  </Text>
                </Pressable>
                <Pressable
                  className={
                    (current.myreact == "sad"
                      ? "bg-blue-100 active:bg-blue-200"
                      : "bg-gray-100 active:bg-gray-200") +
                    "  p-2 rounded-full px-3 border border-[#aaa]"
                  }
                >
                  <Text
                    className={
                      (current.myreact == "sad"
                        ? "text-blue-500"
                        : "text-[#888]") + "  font-bold"
                    }
                  >
                    😥 {current.reactions.sad ?? 0}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
