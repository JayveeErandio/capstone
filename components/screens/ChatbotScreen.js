import { useNavigation } from "@react-navigation/native";
import { Text, View, Pressable, TextInput, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";

export default function ChatbotScreen() {
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const [chatbox, setChatbox] = useState([
    "Hi there 🌸 I'm MoLi, your GCU wellness companion. This is a safe space — feel free to share what's on your mind. What's going on today?",
    "I feel really drained 🌧️",
    "Sorry, I had trouble connecting 🌸 Please try again in a moment.",
    "oraytt",
    "Welcome",
  ]);
  const [message, setMessage] = useState("");

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
        <View className="flex-row bg-[#ffd] p-4 gap-3 border border-[#995] border-[0.5px]">
          <Text>⚠️</Text>
          <Text className="flex-1 text-xs leading-4 text-[#774]">
            MoLi offers emotional support only. For urgent concerns, please
            visit GCU Room 201 or use the Appointments feature.
          </Text>
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
            {chatbox.map((current, index) => {
              const ai = (
                <View key={index} className="flex-row items-end p-3 gap-2">
                  <Text className="bg-[#b9b] p-2 rounded-full">🌸</Text>
                  <View className="flex-row flex-1">
                    <Text className="max-w-72 text-sm bg-white p-3 rounded-xl rounded-bl-none">
                      {current}
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
                    <Text className="max-w-72 text-sm bg-white p-3 bg-[#d6a] text-white rounded-xl rounded-br-none ml-auto">
                      {current}
                    </Text>
                  </View>
                </View>
              );

              if (chatbox.length % 2) return index % 2 ? mine : ai;
              else return index % 2 ? ai : mine;
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
            className={
              (message == "" ? "opacity-50" : "active:bg-[#ccc]") +
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
