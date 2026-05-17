import { Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { Variables } from "../../Variables";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {
    user,
    setUser,
    logout,
    changeAnonymousName,
    capitalizeWords,
    changePassword,
  } = useContext(Variables);

  const firstName = capitalizeWords(user["first_name"]);
  const lastName = capitalizeWords(user["last_name"]);
  const prof_initialname = firstName[0] + lastName[0];

  const oldAnon = user["anonymous_name"];
  const oldPass = user["password"];
  const [field1, setField1] = useState(user["anonymous_name"]);
  const [field2, setField2] = useState("");

  const [invalid, setInvalid] = useState(false);

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
              <Text className="text-lg font-lora-bold">My Profile</Text>
            </View>
            <Pressable
              onPress={async () => {
                logout();
                setUser(null);
              }}
              className="bg-[#c59] p-2 px-5 rounded-xl"
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
          <TextInput
            onChangeText={setField1}
            className="bg-[#eee] rounded-xl p-3 text-[#555] border font-archivo"
            textAlignVertical="top"
            value={field1}
          />
          <Text className="mt-5 font-archivo-bold">NEW PASSWORD</Text>
          <TextInput
            onChangeText={setField2}
            secureTextEntry={true}
            autoCapitalize="none"
            className="bg-[#eee] rounded-xl p-4 text-[#555] border"
            value={field2}
          />
          <Text
            className={
              "text-red-700 text-sm opacity-" + (invalid ? "100" : "0")
            }
          >
            The password is either weak or not allowed.
          </Text>
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
            }}
            className={
              (user["anonymous_name"] == field1 && field2 == ""
                ? "opacity-50"
                : "active:bg-[#b57]") + " bg-[#c68] p-4 rounded-full my-6 "
            }
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
