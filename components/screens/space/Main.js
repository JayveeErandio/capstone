import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Modal,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { Variables } from "../../../Variables";
import Button from "../../Button";

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

  const REPORT_REASONS = [
    "Harassment or bullying",
    "Hate speech",
    "Self-harm or dangerous content",
    "Sexual or inappropriate content",
    "False or misleading information",
    "Spam",
    "Other",
  ];
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportText, setReportText] = useState("Report");

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
                    setSelectedPost(current);
                    setSelectedReason("");
                    setReportSubmitted(false);
                    setReportModalVisible(true);
                  }}
                  className={
                    (current.student_id == user.id ? "hidden" : "") +
                    " self-start pb-4 pl-8"
                  }
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
      <Modal
        transparent
        animationType="fade"
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,.45)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            className="bg-white rounded-3xl p-6 w-full"
            style={{ maxWidth: 420 }}
          >
            <Text className="text-xl font-archivo-bold text-[#333]">
              Report Post
            </Text>

            <Text className="mt-2 text-[#666] font-archivo leading-5">
              Why are you reporting this post?
            </Text>

            <View className="mt-5 gap-3">
              {REPORT_REASONS.map((reason) => (
                <Pressable
                  key={reason}
                  onPress={() => setSelectedReason(reason)}
                  className={
                    "rounded-xl border p-2 " +
                    (selectedReason === reason
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white")
                  }
                >
                  <Text
                    className={
                      selectedReason === reason
                        ? "text-red-600 font-archivo-bold"
                        : "text-[#444] font-archivo"
                    }
                  >
                    {reason}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View
              className="rounded-xl p-4 mt-5"
              style={{ backgroundColor: "#FFF8E8" }}
            >
              <Text
                className="text-xs leading-5 font-archivo"
                style={{ color: "#9A6700" }}
              >
                Please report only when you genuinely believe this post violates
                the community guidelines. Intentionally submitting false or
                abusive reports may result in a warning or further review by the
                Guidance and Counseling Unit (GCU).
              </Text>
            </View>

            <View className="mt-6 flex-row gap-3">
              <Button
                onPress={() => {
                  setReportModalVisible(false);
                  setReportSubmitted(false);
                  setReportText("Report");
                }}
                value="Cancel"
                plain
                className="flex-1"
              />

              <Button
                disabled={!selectedReason || reportSubmitted}
                onPress={async () => {
                  await reportPost(selectedPost, selectedReason);
                  setReportText("Reported");
                  setReportSubmitted(true);
                }}
                value={reportText}
                className="flex-1"
              >
                {reportSubmitted ? "✓ Reported" : "Confirm Report"}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
