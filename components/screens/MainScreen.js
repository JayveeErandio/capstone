import { View, Text, Image } from "react-native";
import Pages from "../Pages";

export default function MainScreen() {
  return (
    <View className="bg-[#eee] h-full">
      <Pages>
        <Text>ASO</Text>
        <Text>PUSA</Text>
        <View>
          <Text>BAKA</Text>
        </View>
        <Text>DAGA</Text>
      </Pages>
    </View>
  );
}
