import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";

export default function Pages({ children }) {
  const screens = React.Children.toArray(children);
  const [activePage, setActivePage] = useState("home");

  return (
    <View className="bg-[#f0f0f0] h-full flex justify-between">
      {screens.find((current) => {
        return current.props.name == activePage;
      })}

      {/* Navigation Bar */}
      <View className="bg-white w-full flex-row gap-3 p-3">
        {screens.map((current, index) => (
          <Pressable
            onPress={() => {
              setActivePage(current.props.name);
            }}
            className={
              (activePage == current.props.name ? "bg-[#eee]" : "") +
              " flex-1 items-center gap-2 rounded-xl p-2"
            }
            key={index}
          >
            <View className="flex items-center">
              <Image
                source={require("../assets/square.png")}
                className="w-11 h-11"
              />
              <Text className="text-xs text-[#888]">{current.props.name}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
