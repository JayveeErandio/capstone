import { useNavigation } from "@react-navigation/native";
import { Text, View, Pressable, TextInput, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useContext, useEffect } from "react";
import { Variables } from "../../Variables";

export default function ChatbotScreen() {
  const { chats, canSend, send } = useContext(Variables);
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const [message, setMessage] = useState("");

  const [time, setTime] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={240}
        keyboardShouldPersistTaps="handled"
        className="h-full bg-[#eee] flex"
      >
        {/* Header */}
        <View className="flex-row items-center gap-3 p-4 bg-white">
          <Pressable
            onPress={() => navigation.goBack()}
            className="bg-[#ddd] w-9 h-9 rounded-xl"
          >
            <Text className="text-2xl font-bold text-center ">‹</Text>
          </Pressable>
          <View className="flex-row items-center flex-1 gap-2">
            <Text className="bg-[#c9c] text-lg p-1 w-9 text-center rounded-full">
              🌸
            </Text>
            <View>
              <Text className="font-bold font-serif text-lg">MoLi 🌸</Text>
              <View className="flex-row">
                <Text className="text-6xl leading-5 text-[#0c0]">·</Text>
                <Text className="text-sm text-[#888]">
                  Online · GCU Wellness AI
                </Text>
              </View>
            </View>
          </View>
          <Text className="text-xs text-[#777] bg-[#fef] border p-1 rounded-full px-2 border-[#a7a]">
            Not a therapist
          </Text>
        </View>

        {/* Info Warning */}
        <View className="flex-row bg-purple-100 p-4 gap-3 border border-[#995] border-[0.5px]">
          <Text>ℹ️</Text>
          <Text className="flex-1 text-xs leading-4 text-[#774]">
            MoLi offers emotional support only. For urgent concerns, please
            visit GCU Room 201 or use the Appointments feature.
          </Text>
        </View>

        {/* Chat Related Reminder */}
        <View
          className={
            (time <= 0 ? "hidden" : "") +
            " flex-row bg-[#ffd] p-4 gap-3 border border-[#995] border-[0.5px]"
          }
        >
          <Text>⚠️</Text>
          <Text className="flex-1 text-xs leading-4 text-[#774]">
            Chats unrelated to this app or psychology are prohibited. Violations
            may result in a 1-hour chat restriction.
          </Text>
          <Text className="text-sm text-gray-400">{time}</Text>
        </View>

        {/* Main Chats */}
        <View className="flex-1">
          <ScrollView
            className="h-20"
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            <Text
              className={
                (chats.length > 0 ? "hidden" : "") +
                " text-center mt-12 text-gray-400"
              }
            >
              Got something in mind? Let’s chat 💭
            </Text>
            {chats.map((current, index) => {
              const ai = (
                <View key={index} className="flex-row items-end p-3 gap-2">
                  <Text className="bg-[#b9b] p-2 rounded-full">🌸</Text>
                  <View className="flex-row flex-1">
                    <Text className="max-w-72 text-sm bg-white p-3 rounded-xl rounded-bl-none">
                      {current.content}
                    </Text>
                  </View>
                </View>
              );
              const mine = (
                <View key={index} className="flex-row items-end p-3 gap-2">
                  <Text className="bg-[#b9b] p-2 rounded-full opacity-0">
                    🌸
                  </Text>
                  <View className="flex-row flex-1">
                    <Text className="max-w-72 text-sm bg-white p-3 bg-pink-500 text-white rounded-xl rounded-br-none ml-auto">
                      {current.content}
                    </Text>
                  </View>
                </View>
              );

              return current.is_student ? mine : ai;
            })}
          </ScrollView>
        </View>

        {/* Chat Input */}
        <View className="bg-white flex-row p-3 gap-2">
          <TextInput
            onChangeText={setMessage}
            className="flex-1 bg-[#eee] rounded-xl px-3"
            placeholder="Type a message..."
            value={message}
          ></TextInput>
          <Pressable
            onPress={() => {
              if (!(canSend && message != "")) return;

              send(message);
              setMessage("");
            }}
            className={
              (canSend && message != "" ? "active:bg-[#ccc]" : "opacity-50") +
              " bg-[#d6a] w-12 h-12 rounded-xl justify-center"
            }
          >
            <Text className="text-lg font-bold text-center text-[#777] text-white">
              ➤
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
