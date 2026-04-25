import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";

import { AuthContext } from "../../Variables";
import { useContext } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Stack = createNativeStackNavigator();

function Header({ order }) {
  const navigation = useNavigation();
  return (
    <View className="flex-row justify-between items-center">
      <View className="p-1">
        <Pressable
          onPress={() => navigation.goBack()}
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

function Door({ order, label, question, flex, children }) {
  const navigation = useNavigation();
  const { entries, setEntries, isAnalyzing, setIsAnalyzing, analyze } =
    useContext(AuthContext);
  const doorItem = useRoute().name.toLowerCase();

  return (
    <SafeAreaView className="bg-[#eee] p-6 h-full">
      <ScrollView>
        <View className="flex gap-4">
          <Header order={order} />
          <View className="flex-row items-center gap-2">
            <View className="bg-[#ebc] p-2 px-5 rounded-full">
              <Text className="text-sm text-[#a55] font-bold">
                DOOR {order}
              </Text>
            </View>
            <View className="flex-1 h-0.5 w-full bg-[#ebc]"></View>
            <Image
              source={require("../../assets/square.png")}
              className="w-10 h-10"
            />
          </View>
          <Text className="text-[#a55]">{label}</Text>
          <Text className="text-2xl font-serif font-bold">{question}</Text>
          <View className={"flex-" + flex}>{children}</View>
        </View>
      </ScrollView>
      <View className="py-3">
        <Pressable
          onPress={async () => {
            if (entries[doorItem] != null)
              if (order < 4) navigation.navigate("Door" + (order + 1));
              else {
                setIsAnalyzing(true);
                await analyze();
                setIsAnalyzing(false);
                navigation.navigate("Result");
              }
          }}
          className={
            (entries["door" + order] ? "active:bg-[#b69]" : "opacity-50") +
            " bottom-0 bg-[#c7a] rounded-full p-4"
          }
        >
          <Text className="text-center text-white text-lg font-bold">
            {order < 4 ? "Next \u27F6" : "See my mood \u27F6"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Option({ title, description, icon }) {
  const { entries, setEntries } = useContext(AuthContext);
  const doorItem = useRoute().name.toLowerCase();

  return (
    <Pressable
      onPress={() => setEntries({ ...entries, [doorItem]: title })}
      className="p-2 flex-1"
    >
      <View
        className={
          (entries[doorItem] == title ? "border" : "") +
          " bg-white p-5 rounded-xl gap-2"
        }
        style={styles.shadow}
      >
        <Image
          source={require("../../assets/square.png")}
          className="w-14 h-14"
        />
        <Text className="text-xl font-bold font-serif">{title}</Text>
        <Text className="text-[#999] text-sm">{description}</Text>
      </View>
    </Pressable>
  );
}

function Door1() {
  return (
    <Door
      order={1}
      label="AROUSAL LEVEL"
      question="What's your energy like today?"
      flex="row"
    >
      <Option
        title="High"
        description="Buzzing, charged, full of fuel"
        icon="../../assets/square.png"
      />
      <Option
        title="Low"
        description="Drained, sluggish, running on empty"
        icon="../../assets/square.png"
      />
    </Door>
  );
}

function Door2() {
  return (
    <Door
      order={2}
      label="DURATION"
      question="How long have you been this way?"
      flex="col"
    >
      <Option
        title="Just today"
        description="Started today - feeling fresh"
        icon="../../assets/square.png"
      />
      <Option
        title="A few days"
        description="Been like this 2-4 days"
        icon="../../assets/square.png"
      />
      <Option
        title="A week or more"
        description="Lasting a week or longer"
        icon="../../assets/square.png"
      />
    </Door>
  );
}

function Door3() {
  return (
    <Door
      order={3}
      label="EMOTIONAL TONE"
      question="Is your heart feeling light or heavy?"
      flex="row"
    >
      <Option
        title="Light"
        description="Warm, open, at ease"
        icon="../../assets/square.png"
      />
      <Option
        title="Heavy"
        description="Tight, cloudy, weighed down"
        icon="../../assets/square.png"
      />
    </Door>
  );
}

function Door4() {
  return (
    <Door
      order={4}
      label="LIFE CONTEXT"
      question="What part of your life is this about?"
      flex="col"
    >
      <Option
        title="Academic"
        description="School, studying, exams"
        icon="../../assets/square.png"
      />
      <Option
        title="Social"
        description="Friends, family, people"
        icon="../../assets/square.png"
      />
      <Option
        title="Personal"
        description="Just you, your inner world"
        icon="../../assets/square.png"
      />
    </Door>
  );
}

function Result() {
  const navigation = useNavigation();
  const { entries, dailyStatus } = useContext(AuthContext);

  // Mood Identification by Decision Tree Algorithm
  const mood =
    entries.door1 == "High"
      ? entries.door3 == "Light"
        ? "Excited"
        : "Stressed"
      : entries.door3 == "Light"
        ? "Content"
        : "Drained";

  return (
    <KeyboardAwareScrollView
      className="flex-1 p-7 py-12"
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={150}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView>
        <View className="gap-4">
          <Text className="text-center text-[#978] text-xl">
            You're feeling
          </Text>
          <Text className="text-center text-[#c93] font-serif font-bold text-5xl">
            {mood}
          </Text>
          <Text className="text-center text-[#777]">
            You've been riding this buzz for a few days. That's great!
          </Text>

          {/* Options selected */}
          <View className="flex-row flex-wrap justify-center gap-2">
            <View className="flex-row items-center gap-1 self-center p-1 px-3 border border-[#aaa] rounded-full">
              <Text className="text-sm text-[#555]">
                {entries.door1 == "High" ? "\u{1F525} High" : "\u{1F319} Low"}{" "}
                Energy
              </Text>
            </View>
            <View className="flex-row items-center gap-1 self-center p-1 px-3 border border-[#aaa] rounded-full">
              <Image
                source={require("../../assets/square.png")}
                className="w-6 h-6"
              />
              <Text className="text-sm text-[#555]">{entries.door3}</Text>
            </View>
            <View className="flex-row items-center gap-1 self-center p-1 px-3 border border-[#aaa] rounded-full">
              <Image
                source={require("../../assets/square.png")}
                className="w-6 h-6"
              />
              <Text className="text-sm text-[#555]">
                {entries.door3 == "Light"
                  ? "\u{1F340} Light"
                  : "\u{2601} Heavy"}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 self-center p-1 px-3 border border-[#aaa] rounded-full">
              <Image
                source={require("../../assets/square.png")}
                className="w-6 h-6"
              />
              <Text className="text-sm text-[#555]">{entries.door4}</Text>
            </View>
          </View>

          {/* Suggestions Section */}
          <View className="gap-4">
            <Text className="text-[#c79] font-bold">
              {"\u{1F4A1} "} SUGGESTIONS FOR YOU
            </Text>
            <View className="flex gap-4">
              {dailyStatus.suggestions.map((current, index) => (
                <View
                  className="bg-white flex-row items-center p-4 gap-3 rounded-2xl"
                  key={index}
                >
                  <Text className="bg-[#eee] text-2xl p-2 rounded-xl">
                    {String.fromCodePoint(parseInt(current.icon, 16))}
                  </Text>
                  <View>
                    <Text className="font-bold font-serif text-lg">
                      {current.title}
                    </Text>
                    <Text className="text-sm text-[#777]">
                      {current.details}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Pressable className="bg-[#edd] border border-dashed border-[#a77] p-5 rounded-2xl active:bg-[#ecc]">
              <Text className="text-center text-[#b58] font-bold">
                Suggestions didn't help? Get GCU Support
              </Text>
            </Pressable>
          </View>

          {/* Journal Notes */}
          <View className="bg-white p-5 rounded-xl gap-3">
            <View className="flex-row items-center gap-3">
              <Text className="bg-[#eee] text-2xl p-2 rounded-xl">
                {"\u{1F4D8}"}
              </Text>
              <View>
                <Text className="text-lg font-bold font-serif">
                  Journal your thoughts
                </Text>
                <Text className="text-sm text-[#777]">
                  Private — only you can see this
                </Text>
              </View>
            </View>
            <Text className="bg-[#ffd] border border-[#cca] p-2 rounded-full italic text-[#552]">
              {"\u{1F914}"} {dailyStatus.followup}
            </Text>
            <TextInput
              multiline
              className="bg-[#eee] rounded-xl p-4 h-32"
              textAlignVertical="top"
              placeholder="Write your thoughts here..."
            ></TextInput>
          </View>

          {/* Done or Submit */}
          <Pressable
            onPress={() => navigation.navigate("Main")}
            className="bg-[#c7a] rounded-full p-4 active:bg-[#b69] mb-20"
          >
            <Text className="text-center text-white text-lg font-bold">
              Done
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

export default function EntryScreen() {
  const { restartEntries, isAnalyzing, setIsAnalyzing, dailyStatus } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  return (
    <View className="flex-1">
      <Stack.Navigator
        initialRouteName={dailyStatus != null ? "Result" : "Door1"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Door1" component={Door1} />
        <Stack.Screen name="Door2" component={Door2} />
        <Stack.Screen name="Door3" component={Door3} />
        <Stack.Screen name="Door4" component={Door4} />
        <Stack.Screen name="Result" component={Result} />
      </Stack.Navigator>

      {isAnalyzing && (
        <View className="absolute inset-0 z-50">
          <LoadingScreen
            message="Generating insights... You can go back home and return later once it’s ready."
            buttons={[
              {
                text: "Go Home",
                event: () => navigation.navigate("Main"),
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#333",
    elevation: 7,
  },
});
