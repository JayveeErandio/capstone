import React from "react";
import { View, Text, Image } from "react-native";

export default function Pages({ children }) {
  const items = React.Children.toArray(children);

  items.map((child, index) => {
    console.log(child.props);
  });

  return (
    <View className="bg-[#eee] h-full">
      {children}

      {/* Navigation Bar */}
      <View className="absolute bottom-0 bg-white w-full flex-row gap-3 p-3">
        <View className="flex-1 items-center gap-2">
          <Image
            source={require("../assets/square.png")}
            className="w-11 h-11"
          />
          <Text className="text-xs text-[#888]">Home</Text>
        </View>
        <View className="flex-1 items-center gap-2">
          <Image
            source={require("../assets/square.png")}
            className="w-11 h-11"
          />
          <Text className="text-xs text-[#888]">Journal</Text>
        </View>
        <View className="flex-1 items-center gap-2">
          <Image
            source={require("../assets/square.png")}
            className="w-11 h-11"
          />
          <Text className="text-xs text-[#888]">MoodSpace</Text>
        </View>
        <View className="flex-1 items-center gap-2">
          <Image
            source={require("../assets/square.png")}
            className="w-11 h-11 "
          />
          <Text className="text-xs text-[#888]">Alerts</Text>
        </View>
        <View className="flex-1 items-center gap-2">
          <Image
            source={require("../assets/square.png")}
            className="w-11 h-11 "
          />
          <Text className="text-xs text-[#888]">Book</Text>
        </View>
      </View>
    </View>
  );
}
