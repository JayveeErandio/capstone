import { Text, View } from "react-native";
import Svg, { Circle, Rect, Line, Path, Polygon } from "react-native-svg";
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
            <View key={current}>
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
      <View className="flex-row gap-1">
        <View width={col1width}></View>
        <View className="flex-row flex-1 relative" height={dayHeight}>
          {args.data?.map((current, index, array) => {
            const herepercent =
              array.length > 1 ? 2 + (index / (array.length - 1)) * 96 : 50;

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
  const pointRadius = 4;
  const slightShrink = 3;

  const perform = (data) => {
    const points = [];
    const lines = [];

    let noprev = true;
    for (let i in args.data) {
      const current = args.data[i];

      if (current.value) {
        const x =
          args.data.length > 1
            ? pointRadius / 2 +
              slightShrink +
              (JSON.parse(i) / (args.data.length - 1)) *
                (args.width - pointRadius - slightShrink * 2)
            : args.width / 2;
        const y = ((args.height - 6) * (5 - current.value)) / 4;

        points.push({
          x,
          y,
          color: { 4: "#ea0", 3: "#0d7", 2: "#c5e", 1: "#c00" }[current.value],
        });

        if (noprev) lines.push([x, y]);
        else lines.at(-1).push(x, y);

        noprev = false;
      } else noprev = true;
    }

    return { points, lines };
  };

  const graphData = perform(args.data);

  return (
    <Svg width={args.width} height={args.height}>
      {[1, 2, 3, 4].map((current, index) => {
        const strokeWidth = 0.5;
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

      {graphData.lines?.map((current) => {
        let d = "";
        let polies = current[0] + " " + (args.height - 6) + " ";
        for (let i = 0; i < current.length / 2; i++) {
          if (i == 0) d += "M ";
          else d += "L ";
          let addend = current[i * 2] + " " + current[i * 2 + 1] + " ";
          d += addend;
          polies += addend;
        }
        polies += current.at(-2) + " " + (args.height - 6);

        return (
          <>
            <Polygon points={polies} fill="#faa" opacity={0.3} />
            <Path d={d} stroke="#d67" strokeWidth={3} fill="none" />
          </>
        );
      })}

      {graphData.points?.map((current, index) => {
        return (
          <Circle
            key={index}
            cx={current.x}
            cy={current.y}
            r={pointRadius}
            fill={current.color}
            stroke="white"
            strokeWidth={1.5}
          />
        );
      })}
    </Svg>
  );
}
