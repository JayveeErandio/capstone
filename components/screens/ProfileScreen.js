import { Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { Variables } from "../../Variables";
import InputField from "../InputField";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {
    user,
    setUser,
    logout,
    changeAnonymousName,
    capitalizeWords,
    changePassword,
    moodToColor,
    moodToEmoji,
    darkenColor,
    chosenTheme,
    changeTheme,
    setDailyStatus,
  } = useContext(Variables);

  const firstName = capitalizeWords(user["first_name"]);
  const lastName = capitalizeWords(user["last_name"]);
  const prof_initialname = firstName[0] + lastName[0];

  const oldAnon = user["anonymous_name"];
  const oldPass = user["password"];
  const [field1, setField1] = useState(user["anonymous_name"]);
  const [field2, setField2] = useState("");
  const [theme, setTheme] = useState(chosenTheme);

  const [invalid, setInvalid] = useState(false);

  const colorToMood = function (color) {
    switch (color) {
      case "#eecc00":
        return "Excited";
      case "#00ee77":
        return "Content";
      case "#cc99ee":
        return "Drained";
      case "#bb0000":
        return "Stressed";
      default:
        return "Default";
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled"
        className="h-full"
      >
        {/* Header */}
        <View className="bg-white p-5 gap-3">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => navigation.goBack()}
                className="bg-[#ddd] w-9 h-9 rounded-xl"
              >
                <Text className="text-2xl font-bold text-center ">‹</Text>
              </Pressable>
              <Text className="text-lg font-lora-bold">Profile & Settings</Text>
            </View>
            <Pressable
              onPress={async () => {
                logout();
              }}
              className="p-2 px-5 rounded-xl opacity-90 active:opacity-100"
              style={{ backgroundColor: darkenColor(chosenTheme) }}
            >
              <Text className="text-white font-archivo-bold">Log Out</Text>
            </Pressable>
          </View>
          <View
            className={
              "bg-cyan-600 w-20 h-20 rounded-full justify-center mx-auto"
            }
          >
            <Text className="text-center text-white text-4xl">
              {prof_initialname}
            </Text>
          </View>
          <Text className="text-center text-lg font-lora-bold">
            {firstName} {lastName}
          </Text>
          <Text className="text-center text-sm text-[#777] -mt-2 font-archivo">
            {user["student_number"]} · {user["section"]}
          </Text>
        </View>

        <ScrollView className="px-5">
          <Text className="mt-5 font-archivo-bold">ANONYMOUS NAME</Text>
          <Text className="text-[#555] text-xs font-archivo">
            (Your screen name in Mood Space)
          </Text>
          <InputField
            onChangeText={setField1}
            value={field1}
            placeholder="e.g. moodlinkerist"
          />

          {/* Password */}
          <Text className="mt-5 font-archivo-bold">NEW PASSWORD</Text>
          <InputField
            onChangeText={setField2}
            password
            value={field2}
            placeholder="Enter your new password"
          />
          <Text
            className={
              "text-red-700 text-sm opacity-" + (invalid ? "100" : "0")
            }
          >
            The password is either weak or not allowed.
          </Text>

          {/* Theme Color */}
          <View className="bg-white p-4 rounded-xl gap-1">
            <Text
              className="font-archivo-bold text-sm"
              style={{ color: darkenColor(chosenTheme) }}
            >
              THEME COLOR
            </Text>
            <View className="flex-row flex-wrap justify-center">
              {["Excited", "Content", "Drained", "Stressed", "Default"].map(
                (current) => (
                  <Pressable
                    key={current}
                    onPress={() => setTheme(moodToColor(current))}
                    className={
                      (theme == moodToColor(current) ? "bg-gray-100" : "") +
                      " rounded-lg w-1/3 p-3 justify-center items-center gap-1"
                    }
                  >
                    <View
                      className="rounded-full w-9 aspect-square border border-[#888]"
                      style={{
                        backgroundColor: moodToColor(current) ?? "#c59",
                      }}
                    ></View>
                    <Text>
                      {moodToEmoji(current) == "⦸"
                        ? "🌸"
                        : moodToEmoji(current)}
                    </Text>
                    <Text className="font-archivo text-xs text-[#555]">
                      {current}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
            <View
              className="flex-row p-3 border rounded-xl gap-2 items-center"
              style={{
                backgroundColor: theme ? theme + "20" : "#cc559920",
                borderColor: theme,
              }}
            >
              <View
                className="rounded-full w-8 aspect-square border"
                style={{ backgroundColor: theme ?? "#c59" }}
              ></View>
              <View>
                <Text className="font-archivo text-sm">
                  {colorToMood(theme)} theme selected
                </Text>
                <Text className="font-archivo text-xs">
                  This will apply across the whole app
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={async () => {
              if (oldAnon != field1) {
                changeAnonymousName(field1);
                navigation.goBack();
              }
              if (field2 != "") {
                const result = await changePassword(field2);
                if (result.error) {
                  setInvalid(true);
                  setTimeout(() => {
                    setInvalid(false);
                  }, 2000);
                } else navigation.goBack();
              }
              if (chosenTheme != theme) {
                changeTheme(theme);
                navigation.goBack();
              }
            }}
            className={
              (user["anonymous_name"] == field1 &&
              field2 == "" &&
              chosenTheme == theme
                ? "opacity-50"
                : "") + " p-4 rounded-full my-6 "
            }
            style={{ backgroundColor: darkenColor(chosenTheme) }}
          >
            <Text className="text-white text-center font-archivo-bold text-lg">
              Save
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
