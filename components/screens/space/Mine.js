import { View, Text } from "react-native";

export default function Mine({ index }) {
  return (
    <View className={"absolute w-full bg-white opacity-" + index}>
      <Text>MY POSTS</Text>
    </View>
  );
}
