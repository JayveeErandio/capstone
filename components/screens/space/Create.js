import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Variables } from "../../../Variables";
import { useContext } from "react";

export default function Create({ index, setPage }) {
  const { putPost } = useContext(Variables);
  const [collapse, setCollapse] = useState(true);
  const [mood, setMood] = useState();
  const [text, setText] = useState();

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
        <Text className="font-bold text-xl font-serif">New Post</Text>
      </View>

      <ScrollView className="bg-[#eee]">
        <View className="gap-5 pb-5">
          {/* Anonymity Notice */}
          <View className="flex-row bg-[#ffd] border border-[#cc8] rounded-xl p-4 gap-3">
            <Text className="text-xl">⚠️</Text>
            <View className="flex-1">
              <Text className="text-sm text-[#aa0] font-bold">
                Anonymity Notice
              </Text>
              <Text className="text-xs text-[#995]">
                Your post will appear anonymous to other students. However, GCU
                can trace posts back to your registered account if necessary.
              </Text>
            </View>
          </View>

          {/* Community Rules */}
          <Pressable
            onPress={() => setCollapse(!collapse)}
            className="bg-white p-3 rounded-xl active:bg-[#f7f7f7]"
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-2">
                <Text className="text-xl">📋</Text>
                <Text className="text-sm font-bold text-[#333]">
                  Community Rules
                </Text>
              </View>
              <Text>{collapse ? "▼" : "▲"}</Text>
            </View>
          </Pressable>
          <Text
            className={
              (collapse ? "hidden" : "") +
              " bg-white p-3 rounded-xl -mt-2 text-[#777] text-sm leading-relaxed"
            }
          >
            {`• Be kind — no bullying or targeting others 
• No foul or offensive language 
• No spreading negativity or harmful content 
• Respect everyone's emotional space 
• Posts are anonymous but traceable by GCU`}
          </Text>

          {/* Moods */}
          <Text className="text-[#c57] font-bold text-sm">
            HOW ARE YOU FEELING?
          </Text>
          <View className="flex-row gap-3 -mt-3">
            {[
              ["⚡", "Excited"],
              ["🍀", "Content"],
              ["🌧️", "Drained"],
              ["😤", "Stressed"],
            ].map((current, index) => (
              <Pressable
                onPress={() => setMood(current[1])}
                className={
                  (mood == current[1]
                    ? "border-[#777] bg-[#eff]"
                    : "border-[#ddd] bg-white") +
                  " flex-1 rounded-xl border active:bg-[#f7f7f7]"
                }
                key={index}
              >
                <View className="items-center gap-1 p-3">
                  <Text className="text-2xl">{current[0]}</Text>
                  <Text className="text-xs text-[#777]">{current[1]}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Text Post */}
          <Text className="text-[#c57] font-bold text-sm">YOUR POST</Text>
          <TextInput
            onChangeText={setText}
            multiline
            className="bg-white rounded-xl p-4 h-32 text-[#555] text-sm -mt-3"
            textAlignVertical="top"
            placeholder="Share what's on your mind... this is your space 🌸"
            value={text}
          ></TextInput>

          {/* AI Check Reminder */}
          <View className="flex-row items-center bg-[#fef] gap-3 p-3 border border-[#eae] rounded-2xl">
            <Text className="text-2xl">🤖</Text>
            <Text className="flex-1 text-sm leading-tight text-[#888]">
              Your post will be scanned by AI before publishing. Posts that may
              violate rules will be held for review.
            </Text>
          </View>

          {/* Post Submit Button */}
          <Pressable
            onPress={async () => {
              putPost(mood, text);
              setPage();
              if (
                await new Promise((resolve) => {
                  Alert.alert(
                    "Verifying your post",
                    "We'll notify you if your post is allowed to be published. Else, it will undergo to GCU. You can check it via 'Mine' page",
                    [
                      {
                        text: "OK",
                        onPress: () => resolve(true), // User cancelled
                      },
                    ],
                    { cancelable: false },
                  );
                })
              ) {
                //HERE YOUR PROGRAM GUYS
              }
            }}
            className={
              (mood && text ? "active:bg-[#b47]" : "opacity-50") +
              " bg-[#c58] p-4 rounded-full "
            }
          >
            <Text className="text-white text-center font-bold">
              Post to MoodSpace 🌸
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
