import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthContext } from "../../contexts/Authentication";
import { useContext } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

function Header({ order }) {
  const navigation = useNavigation();
  return (
    <View className="flex-row justify-between items-center">
      <View className="p-1">
        <Pressable
          onPress={() => {
            if (order == 1) navigation.goBack();
          }}
          className="bg-white rounded-full p-2 px-5"
          style={styles.shadow}
        >
          <Text>{"\u27F5"} Back</Text>
        </Pressable>
      </View>

      <View className="flex-row gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={i}
            className={
              i + 1 === order
                ? "w-7 h-2 bg-[#cd698f] rounded-full"
                : "w-2 h-2 bg-[#eab] rounded-full"
            }
          />
        ))}
      </View>
      <Text className="text-[#777] text-sm">Step {order} out of 4</Text>
    </View>
  );
}

function Door1() {
  const navigation = useNavigation();
  const { entries, setEntries } = useContext(AuthContext);

  return (
    <SafeAreaView className="bg-[#eee] p-6 h-full">
      <ScrollView>
        <View className="flex gap-4">
          <Header order={1} />
          <View className="flex-row items-center gap-2">
            <View className="bg-[#ebc] p-2 px-5 rounded-full">
              <Text className="text-sm text-[#a55] font-bold">DOOR 1</Text>
            </View>
            <View className="flex-1 h-0.5 w-full bg-[#ebc]"></View>
            <Image
              source={require("../../assets/square.png")}
              className="w-10 h-10"
            />
          </View>
          <Text className="text-[#a55]">AROUSAL LEVEL</Text>
          <Text className="text-2xl font-serif font-bold">
            What's your energy like today?
          </Text>
          <View className="flex-row">
            <Pressable
              onPress={() => setEntries({ ...entries, door1: "high" })}
              className="p-2 flex-1"
            >
              <View
                className={
                  (entries.door1 == "high" ? "border" : "") +
                  " bg-white p-5 rounded-xl gap-2"
                }
                style={styles.shadow}
              >
                <Image
                  source={require("../../assets/square.png")}
                  className="w-14 h-14"
                />
                <Text className="text-xl font-bold font-serif">High</Text>
                <Text className="text-[#999] text-sm">
                  Buzzing, charged, full of fuel
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setEntries({ ...entries, door1: "low" })}
              className="p-2 flex-1"
            >
              <View
                className={
                  (entries.door1 == "low" ? "border" : "") +
                  " bg-white p-5 rounded-xl gap-2"
                }
                style={styles.shadow}
              >
                <Image
                  source={require("../../assets/square.png")}
                  className="w-14 h-14"
                />
                <Text className="text-xl font-bold font-serif">Low</Text>
                <Text className="text-[#999] text-sm">
                  Drained, sluggish, running on empty
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View className="py-3">
        <Pressable
          className={
            (entries.door1 ?? "opacity-50") +
            " bottom-0 bg-[#c7a] rounded-full p-4 active:bg-[#b69]"
          }
        >
          <Text className="text-center text-white text-lg font-bold">
            Next {"\u27F6"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function EntryScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Door1" component={Door1} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#333",
    elevation: 7,
  },
});
