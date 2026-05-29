import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ActivityIndicator, Pressable } from "react-native";

export default function LoadingScreen({ message = "Please wait", buttons }) {
  return (
    <SafeAreaView className="h-full items-center justify-center bg-[#eee]">
      <View className="gap-3 w-1/2">
        <ActivityIndicator size="large" style={{ transform: [{ scale: 2 }] }} />
        <Text className="text-[#555] text-center mt-5 font-archivo">
          {message}
        </Text>

        {buttons?.map((current, index) => (
          <Pressable
            key={index}
            onPress={current.event}
            className="border rounded-full p-1 active:bg-[#e0e0e0]"
          >
            <Text className="text-lg text-[#555] text-center font-archivo">
              {current.text}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
