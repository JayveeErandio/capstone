import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useContext, useEffect } from "react";
import { Variables } from "../../Variables";
import TypingIndicator from "../TypingIndicator";

export default function ChatbotScreen() {
  const {
    chats,
    canSend,
    send,
    darkenColor,
    chosenTheme,
    availChat,
    setAvailChat,
    softenColor,
  } = useContext(Variables);
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const [message, setMessage] = useState("");
  const maxLength = 120;
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

  const [showChatting, setShowChatting] = useState(false);
  let timeoutID;
  useEffect(() => {
    if (chats[chats.length - 1]?.is_student)
      timeoutID = setTimeout(() => {
        setShowChatting(true);
      }, 700);
    else {
      setShowChatting(false);
      clearTimeout(timeoutID);
    }
  }, [chats]);

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
            <Image
              className="rounded-full"
              source={require("../../assets/logo_transparent.png")}
              style={{
                width: 35,
                height: 35,
                backgroundColor: softenColor(chosenTheme),
              }}
            />
            <View>
              <Text className="font-lora-bold text-lg">MoLi</Text>
              <View className="flex-row">
                <Text className="text-6xl leading-4 text-[#0c0]">·</Text>
                <Text className="text-xs text-[#888] font-archivo">
                  Online · GCU Wellness AI
                </Text>
              </View>
            </View>
          </View>
          <Text
            className="text-xs text-[#777] border p-1 rounded-full px-2 border-[#a7a]"
            style={{ backgroundColor: softenColor(chosenTheme) }}
          >
            Not a therapist
          </Text>
        </View>

        {/* Info Warning */}
        <View
          className="flex-row p-4 gap-3 border-[#995] border-[0.5px]"
          style={{ backgroundColor: softenColor(chosenTheme) }}
        >
          <Text>ℹ️</Text>
          <Text className="flex-1 text-xs leading-4 text-[#774] font-archivo">
            MoLi offers emotional support only. For urgent concerns, please
            visit GCU Room 201 or use the Appointments feature.
          </Text>
        </View>

        {/* Chat Related Reminder */}
        <View
          className={
            (time <= 0 ? "hidden" : "") +
            " flex-row bg-[#ffd] p-4 gap-3 border-[#995] border-[0.5px]"
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
                    <Text className="max-w-72 text-sm bg-white p-3 rounded-xl rounded-bl-none font-archivo">
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
                  <View className="flex-row flex-1 ">
                    <Text
                      className="max-w-72 text-sm p-3 text-white rounded-xl rounded-br-none ml-auto font-archivo"
                      style={{ backgroundColor: darkenColor(chosenTheme) }}
                    >
                      {current.content}
                    </Text>
                  </View>
                </View>
              );

              return current.is_student ? mine : ai;
            })}
            <View
              className={
                (showChatting ? "" : "hidden") +
                " flex-row items-end p-3 gap-2 "
              }
            >
              <Text className="bg-[#b9b] p-2 rounded-full">🌸</Text>
              <View className="flex-row flex-1">
                <Text className="max-w-72 text-sm bg-white p-3 rounded-xl rounded-bl-none font-archivo">
                  <TypingIndicator />
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Chat Input */}
        <View className="bg-white flex-row p-3 gap-2">
          <View className="flex-1 bg-[#eee] rounded-xl overflow-hidden px-3">
            <TextInput
              onChangeText={setMessage}
              className="font-archivo"
              placeholder="Type a message..."
              placeholderTextColor="#aaa"
              style={{ color: "#333" }}
              value={message}
              multiline
              maxLength={maxLength}
            ></TextInput>
            <View className="flex-row justify-between">
              <Text
                className={
                  (availChat == 0 ? "text-[#c00]" : "text-[#aaa]") + " text-xs"
                }
              >
                Available Chat: {availChat}
              </Text>
              <Text
                className={
                  (message.length >= maxLength
                    ? "text-[#c00]"
                    : "text-[#aaa]") + " text-right pb-1 text-xs"
                }
              >
                {message.length}/{maxLength}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              if (!(canSend && message != "" && availChat > 0)) return;

              setAvailChat(availChat - 1);
              send(message);
              setMessage("");
            }}
            className={
              (canSend && message != "" && availChat > 0 ? "" : "opacity-50") +
              " w-12 h-max rounded-xl justify-center"
            }
            style={{ backgroundColor: darkenColor(chosenTheme) }}
          >
            <Text className="text-lg font-bold text-center text-white">➤</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
