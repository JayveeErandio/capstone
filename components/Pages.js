import React, { useState, useContext, useEffect } from "react";
import { View, Text, Image, Pressable, Vibration } from "react-native";
import { Variables } from "../Variables";

export default function Pages({ children }) {
  const screens = React.Children.toArray(children);
  const [activePage, setActivePage] = useState("home");
  const { notifications, capitalizeWords, chosenTheme, goGCU, setGoGCU } =
    useContext(Variables);
  const unread = notifications.reduce(
    (count, current) => (!current.is_seen ? count + 1 : count),
    0,
  );

  useEffect(() => {
    if (goGCU) {
      setActivePage("book");
      setGoGCU(false);
    }
  }, [goGCU]);

  return (
    <View className="h-full justify-between">
      {screens.find((current) => {
        return current.props.name == activePage;
      })}

      {/* Navigation Bar */}
      <View
        className="absolute bottom-0 z-50 bg-white flex-row items-center m-3 p-2 rounded-full"
        style={{
          boxShadow: "0px 0px 8px rgba(0,0,0,0.2)",
        }}
      >
        {screens.map((current, index) => (
          <Pressable
            onPress={() => {
              setActivePage(current.props.name);
              Vibration.vibrate(100);
            }}
            className={
              " flex-1 items-center gap-1 aspect-square justify-center rounded-full"
            }
            style={{
              backgroundColor:
                activePage == current.props.name
                  ? (chosenTheme ? chosenTheme : "#cc5599") + "40"
                  : "white",
            }}
            key={index}
          >
            <View>
              <Text className="text-2xl">{current.props.icon}</Text>
              {/* For Notification Tab only */}
              <Text
                className={
                  (unread == 0 ? "hidden" : "") +
                  " absolute bg-[#e37] text-white text-sm p-1 rounded-full right-0 top-0 translate-x-1/2 -translate-y-1/2 w-7 text-center h-7 " +
                  (current.props.name != "alerts" ? "hidden" : "")
                }
              >
                {unread}
              </Text>
            </View>
            <Text className="text-xs text-[#888] font-archivo">
              {capitalizeWords(current.props.name)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
