import React, { useState, useContext } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Variables } from "../Variables";

export default function Pages({ children }) {
  const screens = React.Children.toArray(children);
  const [activePage, setActivePage] = useState("home");
  const { notifications, capitalizeWords } = useContext(Variables);
  const unread = notifications.reduce(
    (count, current) => (!current.is_seen ? count + 1 : count),
    0,
  );

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
            <View className="flex items-center gap-1">
              <Text className="text-xl">{current.props.icon}</Text>
              <Text className="text-xs text-[#888] font-archivo">
                {capitalizeWords(current.props.name)}
              </Text>

              {/* For Notification Tab only */}
              <Text
                className={
                  (unread == 0 ? "hidden" : "") +
                  " absolute bg-[#e37] text-white text-sm p-1 rounded-full right-1 top-1 translate-x-1/2 -translate-y-1/2 w-7 text-center h-7 " +
                  (current.props.name != "alerts" ? "hidden" : "")
                }
              >
                {unread}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
