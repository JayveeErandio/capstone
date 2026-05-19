import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useContext } from "react";
import { Variables } from "../../../Variables";

export default function Mine({ index, setPage }) {
  const {
    myposts,
    pendingPosts,
    deletePost,
    updateReact,
    moodToEmoji,
    capitalizeWords,
  } = useContext(Variables);
  const final = [...pendingPosts, ...myposts];

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
      <View className="flex-row bg-[#eee] py-5 items-center gap-3">
        <Pressable
          onPress={setPage}
          className="bg-white p-2 px-5 rounded-full active:bg-[#f7f7f7]"
        >
          <Text className="text-[#555] font-archivo">{"\u27F5 Back"}</Text>
        </Pressable>
        <Text className="font-lora-bold text-xl">My Posts</Text>
      </View>
      <ScrollView className="bg-[#eee]">
        <View className="pb-5">
          {final.map((current, index) => (
            <View
              className={
                (!current.datetime ? "border border-[#cb7]" : "") +
                " bg-white p-5 rounded-2xl gap-2 mb-5"
              }
              key={index}
            >
              <Text
                className={
                  (current.datetime ? "hidden" : "") +
                  " bg-[#fec] self-start p-1 px-2 border text-xs text-[#b97] rounded-full border-[#a97] font-archivo-bold"
                }
              >
                ⏳ Under review by GCU
              </Text>
              <View className="flex-row justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg bg-[#fee] p-2 rounded-xl border">
                    {moodToEmoji(current.mood)}
                  </Text>
                  <View>
                    <Text className="text-[#773] font-archivo-bold">
                      {capitalizeWords(current.mood)}
                    </Text>
                    <Text className="text-sm text-[#777] font-archivo">
                      {!!current.datetime
                        ? "Posted " + formatTime(current.datetime)
                        : "Not yet posted"}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={async () => {
                    if (
                      await new Promise((resolve) => {
                        Alert.alert(
                          "Delete Post",
                          !!current.datetime
                            ? "Do you want to delete the post?"
                            : "Do you want to discontinue your pending post?",
                          [
                            {
                              text: "Yes",
                              onPress: () => resolve(true), // User cancelled
                              style: "cancel",
                            },
                            {
                              text: "No",
                              onPress: () => resolve(false), // User confirmed
                            },
                          ],
                          { cancelable: false },
                        );
                      })
                    ) {
                      deletePost(current, !!current.datetime);
                    }
                  }}
                  className="self-start pb-4 pl-8"
                >
                  <Text className="text-sm text-[#bbb] font-archivo">
                    Delete
                  </Text>
                </Pressable>
              </View>
              <Text className="leading-normal font-archivo">
                {current.content}
              </Text>

              {/* Reactions Button */}
              <View
                className={
                  (!current.datetime ? "hidden" : "") + " flex-row gap-2"
                }
              >
                <Pressable
                  onPress={() => {
                    updateReact(
                      current.id,
                      current.myreact == "love" ? null : "love",
                    );
                  }}
                  className={
                    (current.myreact == "love"
                      ? "bg-blue-100 active:bg-blue-200 border-blue-500"
                      : "bg-gray-100 active:bg-gray-200 border-gray-300") +
                    "  p-2 rounded-full px-3 border "
                  }
                >
                  <Text
                    className={
                      (current.myreact == "love"
                        ? "text-blue-500"
                        : "text-[#888]") + "  font-bold"
                    }
                  >
                    ❤️{" "}
                    {(current.reactions?.love ?? 0) +
                      (current.myreact == "love" ? 1 : 0)}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    updateReact(
                      current.id,
                      current.myreact == "funny" ? null : "funny",
                    );
                  }}
                  className={
                    (current.myreact == "funny"
                      ? "bg-blue-100 active:bg-blue-200 border-blue-500"
                      : "bg-gray-100 active:bg-gray-200 border-gray-300") +
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
                    😂{" "}
                    {(current.reactions?.funny ?? 0) +
                      (current.myreact == "funny" ? 1 : 0)}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    updateReact(
                      current.id,
                      current.myreact == "sad" ? null : "sad",
                    );
                  }}
                  className={
                    (current.myreact == "sad"
                      ? "bg-blue-100 active:bg-blue-200 border-blue-500"
                      : "bg-gray-100 active:bg-gray-200 border-gray-300") +
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
                    😥{" "}
                    {(current.reactions?.sad ?? 0) +
                      (current.myreact == "sad" ? 1 : 0)}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
          {final.length == 0 ? (
            <Text className="text-center text-[#888]">
              You have not posted anything yet.
            </Text>
          ) : (
            ""
          )}
          <View className="h-28"></View>
        </View>
      </ScrollView>
    </View>
  );
}
