import React, { useState, useContext } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import Weekly from "./journal/Weekly";
import Monthly from "./journal/Monthly";
import Yearly from "./journal/Yearly";
import Entries from "./journal/Entries";
import { Variables } from "../../Variables";

export default function JournalScreen() {
  const [page, setPage] = useState("Weekly");
  const { darkenColor, chosenTheme } = useContext(Variables);

  const content = (
    <>
      <Weekly name="Weekly" />
      <Monthly name="Monthly" />
      <Yearly name="Yearly" />
      <Entries name="Entries" />
    </>
  );

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="p-6 gap-2">
        <Text className="text-2xl font-lora-bold">My Journal</Text>
        <Text className="text-[#777] text-sm font-archivo">
          Patterns, entries, & mood trends
        </Text>
        <View className="flex-row gap-2">
          {content.props.children.map((current, index) => (
            <Pressable
              onPress={() => setPage(current.props.name)}
              className="self-start py-3 flex-1 rounded-full"
              style={{
                backgroundColor:
                  current.props.name == page
                    ? darkenColor(chosenTheme)
                    : "#fff",
              }}
              key={index}
            >
              <Text
                className={
                  (current.props.name == page ? "text-white" : "text-[#777]") +
                  " text-center font-archivo"
                }
              >
                {current.props.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <ScrollView>
        {content.props.children.find((current) => current.props.name == page)}
        <View className="h-32">
          <Text></Text>
        </View>
      </ScrollView>
    </View>
  );
}
