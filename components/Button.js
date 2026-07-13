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
      onPress={() => {
        if (!args.disabled) args.onPress();
      }}
      className={args.className + " p-4 rounded-full"}
      style={{
        backgroundColor: !args.plain
          ? !args.disabled
            ? darkenColor(finalTheme) + (click ? "ff" : "dd")
            : darkenColor(finalTheme) + "88"
          : "transparent",
        borderColor: !args.disabled
          ? darkenColor(finalTheme) + (click ? "ff" : "bb")
          : darkenColor(finalTheme) + "00",
        borderWidth: 1.5,
      }}
    >
      <Text
        className="text-center font-archivo-bold text-lg"
        style={{
          color: args.plain
            ? darkenColor(finalTheme) + (click ? "ff" : "bb")
            : "#fff",
        }}
      >
        {args.value}
      </Text>
    </Pressable>
  );
}
