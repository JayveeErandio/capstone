import { Text, View } from "react-native";
import Svg, { Circle, Rect, Line, Path } from "react-native-svg";
import { useState } from "react";

export default function Graph(args) {
  const [col1width, setCol1width] = useState(0);
  const [row1height, setRow1height] = useState(0);
  const [col2width, setCol2width] = useState(0);
  const [dayHeight, setDayHeight] = useState(0);

  return (
    <View className="gap-4">
      {/* Row 1 */}
      <View className="flex-row gap-1">
        {/* Cell 1: Y Axis Labels */}
        <View
          onLayout={(e) => {
            setCol1width(e.nativeEvent.layout.width);
            setRow1height(e.nativeEvent.layout.height);
          }}
          className="pl-2"
        >
          {["Exc", "Con", "Dra", "Str"].map((current) => (
            <View>
              <Text className="text-center text-xs text-gray-500 translate-y-1/2 mt-5 mb-1">
                {current}
              </Text>
            </View>
          ))}
        </View>
        {/* Cell 2: Actual Graph */}
        <View
          onLayout={(e) => {
            setCol2width(e.nativeEvent.layout.width);
          }}
          className="flex-1"
        >
          <Canvas width={col2width} height={row1height} data={args.data} />
        </View>
      </View>

      {/* Row 2 */}
      <View className="flex-row">
        <View width={col1width}></View>
        <View className="flex-row flex-1 relative" height={dayHeight}>
          {args.data.map((current, index, array) => {
            const herepercent = ((index + 1) / (array.length + 1)) * 100;

            return (
              <Text
                key={index}
                className="absolute -translate-x-1/2 text-xs text-gray-500"
                style={{
                  left: `${herepercent}%`,
                }}
                onLayout={(e) => {
                  if (index == 0) setDayHeight(e.nativeEvent.layout.height);
                }}
              >
                {current.label}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function Canvas(args) {
  const [mustConnect] = useState();
  const [lastPoint, setLastPoint] = useState();

  return (
    <Svg width={args.width} height={args.height}>
      {[1, 2, 3, 4].map((current, index) => {
        const strokeWidth = 1;
        return (
          <Line
            key={index}
            x1="0"
            y1={((args.height - 6) * current) / 4 - strokeWidth / 2}
            x2={args.width}
            y2={((args.height - 6) * current) / 4 - strokeWidth / 2}
            stroke="gray"
            strokeWidth={strokeWidth}
            strokeDasharray="6 4"
          />
        );
      })}

      {console.log(args.data)}

      {args.data.map((current, index, array) => {
        if (!current.value) return;

        const xPos = (index + 1) / (array.length + 1);

        let color;

        switch (current.value) {
          case 4:
            color = "#ea0";
            break;
          case 3:
            color = "#0d7";
            break;
          case 2:
            color = "#c5e";
            break;
          case 1:
            color = "#c00";
            break;
        }

        return (
          <Circle
            cx={args.width * xPos}
            cy="70"
            cy={((args.height - 6) * (5 - current.value)) / 4}
            r="7"
            fill={color}
            stroke="white"
            strokeWidth={3}
          />
        );
      })}

      <Path
        d="
    M 10 10
    L 100 10
    L 100 100
    L 10 100
    
  "
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}
