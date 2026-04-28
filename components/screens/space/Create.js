import { View, Text } from "react-native";

export default function Create({ index }) {
  return (
    <View className={"absolute w-full bg-white opacity-" + index}>
      <Text>POST TO MOODSPACE</Text>
    </View>
  );
}
