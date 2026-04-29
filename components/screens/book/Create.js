import { useState } from "react";
import { Pressable, Text, View, ScrollView, TextInput } from "react-native";

export default function Create({ show, setPage }) {
  const [context, setContext] = useState();
  const [text, setText] = useState("");
  const maxText = 120;
  const [day, setDay] = useState();
  const [time, setTime] = useState();

  return (
    <View
      className={(show ? "z-50" : "") + " absolute h-full w-full bg-[#eee]"}
    >
      {/* Header */}
      <View className="flex-row bg-white p-6 items-center gap-3">
        <Pressable
          onPress={() => setPage("Main")}
          className="bg-[#ddd] w-9 h-9 rounded-xl"
        >
          <Text className="text-2xl font-bold text-center ">‹</Text>
        </Pressable>
        <View>
          <Text className="font-bold font-serif text-lg">Book a Session</Text>
          <Text className="text-sm text-[#888]">Fill in the details below</Text>
        </View>
      </View>

      <ScrollView>
        <View className="p-6 gap-5">
          <Text className="text-md text-[#333]">1 · WHAT'S ON YOUR MIND?</Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              "📚 Academic Stress",
              "💭 Personal Concerns",
              "🏠 Family Issues",
              "🎯 Career / Future",
              "👥 Social Difficulties",
              "💛 Emotional Wellbeing",
              "✏️ Other",
            ].map((current, index) => (
              <Pressable
                onPress={() => setContext(current)}
                className={
                  (context == current ? "border border-[#88c]" : "") +
                  " bg-white self-start p-2 rounded-full px-3 active:bg-[#f7f7f7]"
                }
                key={index}
              >
                <Text className="text-[#333]">{current}</Text>
              </Pressable>
            ))}
          </View>
          <Text className="text-md text-[#333]">
            ADDITIONAL NOTE (optional)
          </Text>
          <TextInput
            onChangeText={(value) => {
              if (value.length <= maxText) setText(value);
            }}
            multiline
            className="bg-white rounded-xl p-4 h-32 text-[#555] -mt-3"
            textAlignVertical="top"
            placeholder="Briefly describe what you'd like to talk about..."
            value={text}
          ></TextInput>
          <Text className="text-right text-sm -mt-3 text-[#777]">
            {maxText - text?.length}/{maxText}
          </Text>

          {/* Set Date */}
          <Text className="text-md text-[#333]">2 · PICK A DATE</Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { date: 29, day: "WED" },
              { date: 30, day: "THU" },
              { date: 2, day: "SAT" },
            ].map((current, index) => (
              <Pressable
                onPress={() => setDay(current)}
                key={index}
                className={
                  (JSON.stringify(day) == JSON.stringify(current)
                    ? "border"
                    : "") + " bg-white self-start items-center p-4 rounded-xl"
                }
              >
                <Text className="text-xs font-bold text-[#aaa]">
                  {current.day}
                </Text>
                <Text className="font-bold">{current.date}</Text>
              </Pressable>
            ))}
          </View>

          {/* Set Time */}
          <Text className="text-md text-[#333]">3 · PICK A TIME</Text>
          <View className="flex-row flex-wrap gap-3">
            {["9:00 AM", "10:00 AM", "12:00 PM"].map((current, index) => (
              <Pressable
                onPress={() => setTime(current)}
                key={index}
                className={
                  (time == current ? "border" : "") +
                  " bg-white self-start items-center p-4 rounded-xl"
                }
              >
                <Text className="text-sm font-bold text-[#777]">
                  🕐 {current}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={() => {
              if (context && day && time) setPage("Finalize");
            }}
            className={
              (context && day && time ? "active:bg-[#b57]" : "opacity-50") +
              " bg-[#c68] p-4 rounded-full"
            }
          >
            <Text className="text-white text-center font-bold">
              Review Appointment ➞
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
