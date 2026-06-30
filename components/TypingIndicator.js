import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

function Dot({ delay }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: -6,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        width: 5,
        height: 5,
        borderRadius: 4,
        backgroundColor: "#888",
        marginHorizontal: 2,
        transform: [{ translateY }],
      }}
    />
  );
}

export default function TypingIndicator() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
      className="py-1"
    >
      <Dot delay={0} />
      <Dot delay={150} />
      <Dot delay={300} />
    </View>
  );
}
