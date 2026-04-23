import { View, Text, Image } from "react-native";

export default function JournalScreen() {
  return (
    <View className="bg-red-500">
      {/* Headline */}
      <View>
        <View>
          <Text>My Journal</Text>
          <Text>Patterns, entries, & mood trends</Text>
        </View>
        <Image source={require("../../assets/square.png")} />
      </View>
    </View>
  );
}
