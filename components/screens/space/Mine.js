import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useContext } from "react";
import { Variables } from "../../../Variables";

export default function Mine({ index, setPage }) {
  const { myposts, pendingPosts, deletePost } = useContext(Variables);
  const final = [...pendingPosts, ...myposts];

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
                  (current.datetime == 1 ? "hidden" : "") +
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
                    <Text className="text-[#773] font-bold">
                      {current.mood}
                    </Text>
                    <Text className="text-sm text-[#777]">
                      {"Posted"} 2m ago
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={async () => {
                    if (
                      await new Promise((resolve) => {
                        Alert.alert(
                          "Delete Post",
                          "Do you want to discontinue the pending post?",
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
                      deletePost(current);
                    }
                  }}
                  className="self-start pb-4 pl-8"
                >
                  <Text className="text-sm text-[#bbb]">Delete</Text>
                </Pressable>
              </View>
              <Text className="leading-normal">{current.content}</Text>
              <View
                className={
                  (!current.datetime ? "hidden" : "") + " flex-row gap-2"
                }
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
          {final.length == 0 ? (
            <Text className="text-center text-[#888]">
              You have not posted anything yet.
            </Text>
          ) : (
            ""
          )}
        </View>
      </ScrollView>
    </View>
  );
}
