import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { Variables } from "../../../Variables";

export default function Main({ index, setPage }) {
  const {
    posts,
    setPosts,
    updateReact,
    reportPost,
    moodToColor,
    moodToEmoji,
    darkenColor,
    softenColor,
    chosenTheme,
    reloadMorePosts,
    getLatestPosts,
    user,
  } = useContext(Variables);

  const [reloading, setReloading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // Simulate fetching data
    await getLatestPosts(
      posts.reduce((max, current) => (current.id > max.id ? current : max)).id,
    );

    setRefreshing(false);
  };

  return (
    <View className={"px-6 absolute w-full h-full flex-col z-" + index}>
      {/* Header */}
      <View className="flex-row justify-between items-center py-6 bg-[#eee]">
        <View>
          <Text className="text-2xl font-lora-bold">MoodSpace 🌸</Text>
          <Text className="text-sm text-[#777] font-archivo">
            A safe space to share how you feel
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => setPage("Create")}
            className="p-3 rounded-full active:bg-[#b46]"
            style={{ backgroundColor: darkenColor(chosenTheme) }}
          >
            <Text className="text-white text-sm font-archivo">✍🏻 Post</Text>
          </Pressable>
          <Pressable
            onPress={() => setPage("Mine")}
            className="bg-white items-center p-2 rounded-lg border border-[#777] gap-1 active:bg-[#eee]"
          >
            <Text className="text-sm">📝</Text>
            <Text className="text-xs text-[#555] font-archivo">Mine</Text>
          </Pressable>
        </View>
      </View>

      {/* Newsfeed Posts */}
      <View className="flex-1 bg-[#eee]">
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {posts.map((current, index) => (
            <View
              className="rounded-2xl p-5 border border-black/0 gap-2 mb-5 overflow-hidden"
              style={{
                backgroundColor:
                  current.student_id == user.id
                    ? (darkenColor(softenColor(chosenTheme, 0.7), 5) ?? "#c59")
                    : "white",
              }}
              key={index}
            >
              {console.log(67, current.student_id)}
              <View className="flex-row justify-between">
                <View className="flex-row items-center gap-2">
                  <Text
                    className="text-lg p-2 rounded-xl border"
                    style={{
                      backgroundColor:
                        current.student_id == user.id
                          ? darkenColor(softenColor(chosenTheme, 0.3), 0)
                          : moodToColor(current.mood) + "20",
                      borderColor: darkenColor(moodToColor(current.mood), 20),
                    }}
                  >
                    {moodToEmoji(current.mood)}
                  </Text>
                  <View>
                    <Text className="text-[#444] font-archivo-bold">
                      {current.student_id == user.id ? (
                        <>
                          <Text>{user.anonymous_name}</Text>
                          <Text className="text-[#777]"> • You</Text>
                        </>
                      ) : (
                        current.students.anonymous_name
                      )}
                    </Text>
                    <Text className="text-sm font-archivo text-[#888]">
                      {current.mood} • {formatTime(current.datetime)}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={async () => {
                    if (
                      await new Promise((resolve) => {
                        Alert.alert(
                          "Do you want to report this post?",
                          "Make sure it's reasonable or else GCU might give warning consideration to your action",
                          [
                            {
                              text: "Yes",
                              onPress: () => resolve(true), // User confirmed
                              style: "cancel",
                            },
                            {
                              text: "No",
                              onPress: () => resolve(false), // User cancelled
                            },
                          ],
                          { cancelable: false },
                        );
                      })
                    ) {
                      reportPost(current);
                    }
                  }}
                  className="self-start pb-4 pl-8"
                >
                  <Text className="text-sm text-[#bbb] font-archivo">
                    Report
                  </Text>
                </Pressable>
              </View>
              <Text className="leading-normal font-archivo text-[#444]">
                {current.content}
              </Text>

              {/* Reaction Buttons */}
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => {
                    updateReact(
                      current.id,
                      current.myreact == "love" ? null : "love",
                    );
                  }}
                  className={
                    (current.myreact == "love"
                      ? "bg-blue-500/20 active:bg-blue-500/30 border-blue-600/50"
                      : "bg-black/5 active:bg-black/20 border-black/10") +
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
                    {(current.reactions.love ?? 0) +
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
                      ? "bg-blue-500/20 active:bg-blue-500/30 border-blue-600/50"
                      : "bg-black/5 active:bg-black/20 border-black/10") +
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
                    🤗{" "}
                    {(current.reactions.funny ?? 0) +
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
                      ? "bg-blue-500/20 active:bg-blue-500/30 border-blue-600/50"
                      : "bg-black/5 active:bg-black/20 border-black/10") +
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
                    {(current.reactions.sad ?? 0) +
                      (current.myreact == "sad" ? 1 : 0)}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
          {posts.length == 0 ? (
            <Text className="text-center text-gray-400 text-sm mt-12">
              No posts available yet. Make it start from you!
            </Text>
          ) : (
            ""
          )}
          <Pressable
            onPress={async () => {
              if (reloading) return;
              setReloading(true);
              await reloadMorePosts();
              setReloading(false);
            }}
            className={" bottom-0 rounded-full p-4 items-center justify-center"}
            style={{ backgroundColor: darkenColor(chosenTheme) }}
          >
            <ActivityIndicator
              color="white"
              className={(reloading ? "" : "opacity-0") + " absolute"}
            />
            <Text
              className={
                (!reloading ? "" : "opacity-0") +
                " text-center text-white text-lg font-archivo-bold"
              }
            >
              Reload More
            </Text>
          </Pressable>
          <View className="h-36"></View>
        </ScrollView>
      </View>
    </View>
  );
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
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
