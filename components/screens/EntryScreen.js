import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";

import { Variables } from "../../Variables";
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
    useContext(Variables);
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
  const { entries, setEntries } = useContext(Variables);
  const doorItem = useRoute().name.toLowerCase();

  return (
    <Pressable
      onPress={() => setEntries({ ...entries, [doorItem]: title })}
      className="p-2 flex-1"
    >
      <View
        className={
          (entries[doorItem] == title ? "border" : "") +
          " bg-white p-5 rounded-xl gap-4"
        }
        style={styles.shadow}
      >
        <Text className="text-4xl">{icon}</Text>
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
        icon="🔥"
      />
      <Option
        title="Low"
        description="Drained, sluggish, running on empty"
        icon="🌙"
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
        icon="📅"
      />
      <Option
        title="A few days"
        description="Been like this 2-4 days"
        icon="📅"
      />
      <Option
        title="A week or more"
        description="Lasting a week or longer"
        icon="📅"
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
      <Option title="Light" description="Warm, open, at ease" icon="🍀" />
      <Option
        title="Heavy"
        description="Tight, cloudy, weighed down"
        icon="🌧"
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
        icon="📚"
      />
      <Option title="Social" description="Friends, family, people" icon="👥" />
      <Option
        title="Personal"
        description="Just you, your inner world"
        icon="🪞"
      />
    </Door>
  );
}

function Result() {
  const navigation = useNavigation();
  const { entries, dailyStatus, setDailyStatus, updateJournal } =
    useContext(Variables);

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
          <Text className="text-center text-[#777]">{dailyStatus.comment}</Text>

          {/* Options selected */}
          <View className="flex-row flex-wrap justify-center gap-2">
            <View className="self-center p-1 px-3 border border-[#aaa] rounded-full">
              <Text className="text-sm text-[#555]">
                {entries.door1 == "High" ? "🔥 High" : "🌙 Low"} Energy
              </Text>
            </View>
            <View className="self-center p-1 px-3 border border-[#aaa] rounded-full">
              <Text className="text-sm text-[#555]">
                {entries.door3 == "Light" ? "🍀 Light" : "🌧 Heavy"}
              </Text>
            </View>
            <View className="self-center p-1 px-3 border border-[#aaa] rounded-full">
              <Text className="text-sm text-[#555]">📅 {entries.door2}</Text>
            </View>
            <View className="self-center p-1 px-3 border border-[#aaa] rounded-full">
              <Text className="text-sm text-[#555]">
                {entries.door4 == "Academic"
                  ? "📚"
                  : entries.door4 == "Social"
                    ? "👥"
                    : "🪞"}{" "}
                {entries.door4}
              </Text>
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
                    {current.icon}
                  </Text>
                  <View className="flex-1">
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
              <Text className="bg-[#eee] text-2xl p-2 rounded-xl">📒</Text>
              <View>
                <Text className="text-lg font-bold font-serif">
                  Journal your thoughts
                </Text>
                <Text className="text-sm text-[#777]">
                  Private — only you can see this
                </Text>
              </View>
            </View>
            <Text className="bg-[#ffd] border border-[#cca] p-2 px-4 rounded-full italic text-[#552]">
              {dailyStatus.followup}
            </Text>

            <TextInput
              onChangeText={(value) =>
                setDailyStatus({ ...dailyStatus, journal: value })
              }
              multiline
              className="bg-[#eee] rounded-xl p-4 h-32 text-[#555]"
              textAlignVertical="top"
              placeholder="Write your thoughts here..."
              value={dailyStatus.journal}
              placeholderTextColor={"#bbb"}
            ></TextInput>
          </View>

          {/* Done or Submit */}
          <Pressable
            onPress={() => {
              updateJournal();
              navigation.navigate("Main");
            }}
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
    useContext(Variables);
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
