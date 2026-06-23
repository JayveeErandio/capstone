import { Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Variables } from "../../Variables";
import InputField from "../InputField";
import { Ionicons } from "@expo/vector-icons";
import Button from "../Button";

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
    changeUserColumn,
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
  const [anonyField, setAnonyField] = useState(user.anonymous_name);
  const [levelField, setLevelField] = useState(user.year_level);
  useEffect(() => {
    if (levelField > 4) setLevelField(4);
  }, [levelField]);
  const [sectionField, setSectionField] = useState(user.section);
  const [fieldCurrent, setFieldCurrent] = useState("");
  const [fieldNew, setFieldNew] = useState("");
  const [fieldConfirm, setFieldConfirm] = useState("");

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

  const [pop1, setPop1] = useState(false);
  const [button1, setButton1] = useState("Save");
  const [pop2, setPop2] = useState(false);
  const [button2, setButton2] = useState("Save");
  const [showMatch, setShowMatch] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pop3, setPop3] = useState(false);
  const [button3, setButton3] = useState("Save");

  const minPass = 8;

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
          </View>
          <View
            className={"w-20 h-20 rounded-full justify-center mx-auto"}
            style={{ backgroundColor: darkenColor(chosenTheme) }}
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

        <ScrollView className="px-5 py-5">
          {/* Account Information */}
          <View className="gap-1 mb-3">
            <Pressable
              onPress={() => {
                setPop1((prev) => !prev);
                setPop2(false);
                setPop3(false);
              }}
              className="flex-row justify-between bg-white p-3 rounded-md active:bg-[#eff]"
            >
              <Text
                className="font-archivo-bold text-sm"
                style={{ color: darkenColor(chosenTheme) }}
              >
                ACCOUNT INFORMATION
              </Text>
              <Text style={{ color: darkenColor(chosenTheme) }}>
                {pop1 ? "▲" : "▼"}
              </Text>
            </Pressable>
            <View
              className={
                (pop1 ? "" : "hidden") + " bg-white p-5 rounded-md gap-6"
              }
            >
              <View>
                <Text className="font-archivo-bold text-sm text-[#333]">
                  ANONYMOUS NAME
                </Text>

                <InputField
                  onChangeText={setAnonyField}
                  value={anonyField}
                  placeholder="e.g. moodlinkerist"
                />
                <Text className="text-xs font-archivo text-gray-400">
                  Reminder: Anonymous names must not contain troll, offensive,
                  or foul content. All posts appear in the public newsfeed and
                  are monitored by GCU admins. Please keep your identity
                  appropriate.
                </Text>
              </View>
              <View>
                <Text className="font-archivo-bold text-sm text-[#333]">
                  YEAR LEVEL
                </Text>

                <InputField
                  onChangeText={setLevelField}
                  value={levelField ? String(levelField) : ""}
                  placeholder="e.g. 3"
                  maxLength={1}
                  numeric
                />
              </View>
              <View>
                <Text className="font-archivo-bold text-sm text-[#333]">
                  SECTION
                </Text>
                <InputField
                  onChangeText={setSectionField}
                  value={sectionField}
                  placeholder="e.g. DW31"
                />
              </View>
              <Button
                onPress={async () => {
                  if (
                    user.anonymous_name != anonyField ||
                    user.year_level != levelField ||
                    user.section != sectionField
                  ) {
                    await changeUserColumn({
                      anonymous_name: anonyField,
                      year_level: levelField,
                      section: sectionField,
                    });
                    setButton1("Saved Changes");
                    setTimeout(() => {
                      setButton1("Save");
                    }, 1500);
                  }
                }}
                disabled={
                  user.anonymous_name == anonyField &&
                  user.year_level == levelField &&
                  user.section == sectionField
                }
                value={button1}
              />
            </View>
          </View>

          {/* Password */}
          <View className="gap-1 mb-3">
            <Pressable
              onPress={() => {
                setPop2((prev) => !prev);
                setPop1(false);
                setPop3(false);
              }}
              className="flex-row justify-between bg-white p-3 rounded-md active:bg-[#eff]"
            >
              <Text
                className="font-archivo-bold text-sm"
                style={{ color: darkenColor(chosenTheme) }}
              >
                PASSWORD
              </Text>
              <Text style={{ color: darkenColor(chosenTheme) }}>
                {pop2 ? "▲" : "▼"}
              </Text>
            </Pressable>
            <View
              className={
                (pop2 ? "" : "hidden") + " bg-white p-5 rounded-md gap-6"
              }
            >
              <View>
                <Text className="font-archivo-bold text-sm text-[#333]">
                  CURRENT PASSWORD
                </Text>
                <InputField
                  onChangeText={setFieldCurrent}
                  password
                  value={fieldCurrent}
                />
                <Text
                  className={
                    (showOld ? "opacity-100" : "opacity-0") +
                    " text-xs font-archivo"
                  }
                  style={{ color: "#c00" }}
                >
                  Wrong old password.
                </Text>
              </View>
              <View>
                <Text className="font-archivo-bold text-sm text-[#333]">
                  NEW PASSWORD
                </Text>
                <InputField
                  onChangeText={setFieldNew}
                  password
                  value={fieldNew}
                />
                <Text className="text-xs font-archivo text-gray-400">
                  Reminder: Minimum 8 characters
                </Text>
              </View>
              <View>
                <Text className="font-archivo-bold text-sm text-[#333]">
                  CONFIRM PASSWORD
                </Text>
                <InputField
                  onChangeText={setFieldConfirm}
                  password
                  value={fieldConfirm}
                />
                <Text
                  className={
                    (showMatch ? "opacity-100" : "opacity-0") +
                    " text-xs font-archivo"
                  }
                  style={{ color: "#c00" }}
                >
                  {errorMessage}
                </Text>
              </View>

              <Button
                onPress={async () => {
                  if (fieldNew != fieldConfirm) {
                    setErrorMessage("New and current password do not match.");
                    setShowMatch(true);
                    setTimeout(() => {
                      setShowMatch(false);
                    }, 2000);
                    return;
                  }
                  const sameOld = await changePassword(fieldCurrent, fieldNew);
                  if (!sameOld) {
                    setShowOld(true);
                    setTimeout(() => {
                      setShowOld(false);
                    }, 2000);
                  } else {
                    if (sameOld.error == null) {
                      //SAVED CHANGES
                      setButton2("Saved Changes");
                      setFieldCurrent("");
                      setFieldNew("");
                      setFieldConfirm("");
                      setTimeout(() => {
                        setButton2("Save");
                      }, 2000);
                    } else {
                      setErrorMessage(
                        "Old password cannot be same as new password.",
                      );
                      setShowMatch(true);
                      setTimeout(() => {
                        setShowMatch(false);
                      }, 1500);
                    }
                  }
                }}
                disabled={
                  fieldCurrent == "" ||
                  fieldNew.length < 8 ||
                  fieldConfirm.length < 8
                }
                value={button2}
              />
            </View>
          </View>

          {/* Theme Color */}
          <View className="gap-1 mb-3">
            <Pressable
              onPress={() => {
                setPop3((prev) => !prev);
                setPop1(false);
                setPop2(false);
              }}
              className="flex-row justify-between bg-white p-3 rounded-md active:bg-[#eff]"
            >
              <Text
                className="font-archivo-bold text-sm"
                style={{ color: darkenColor(chosenTheme) }}
              >
                THEME COLOR
              </Text>
              <Text style={{ color: darkenColor(chosenTheme) }}>
                {pop3 ? "▲" : "▼"}
              </Text>
            </Pressable>
            <View
              className={
                (pop3 ? "" : "hidden") + " bg-white p-4 rounded-xl gap-3"
              }
            >
              <View className={" flex-row flex-wrap justify-center"}>
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

              <Button
                onPress={async () => {
                  if (chosenTheme != theme) {
                    changeTheme(theme);
                    setButton3("Theme Changed");
                    setTimeout(() => {
                      setButton3("Save");
                    }, 1500);
                  }
                }}
                disabled={chosenTheme == theme}
                value={button3}
              />
            </View>
          </View>

          <Pressable
            onPress={logout}
            className={"p-4 rounded-full my-6"}
            style={{ backgroundColor: darkenColor(chosenTheme) }}
          >
            <Text className="text-white text-center font-archivo-bold text-lg">
              Log Out
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
