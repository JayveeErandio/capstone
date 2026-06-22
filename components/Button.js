import { useContext, useState } from "react";
import { Pressable, Text } from "react-native";
import { Variables } from "../Variables";

export default function Button(args) {
  const { darkenColor, chosenTheme } = useContext(Variables);
  const finalTheme = chosenTheme ? chosenTheme : "#f4c";
  const [click, setClick] = useState(false);
  return (
    <Pressable
      onTouchStart={() => {
        setClick(true);
      }}
      onTouchEnd={() => {
        setClick(false);
      }}
      onPress={args.onPress}
      className="p-4 rounded-full"
      style={{
        backgroundColor: !args.disabled
          ? darkenColor(finalTheme) + (click ? "ff" : "ee")
          : darkenColor(finalTheme) + "88",
      }}
    >
      <Text className="text-white text-center font-archivo-bold text-lg">
        {args.value}
      </Text>
    </Pressable>
  );
}
