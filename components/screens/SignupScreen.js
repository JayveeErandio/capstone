import { useContext, useState } from "react";
import { View, Text, TextInput, Pressable, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Variables } from "../../Variables";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignupScreen() {
  const navigation = useNavigation();
  const { setPage, signup } = useContext(Variables);
  const [ID, setID] = useState("");

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={150}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView>
        {/* ==== Headline Top ==== */}
        <View className="bg-[#fef] flex items-center py-8 gap-2">
          <Image
            source={require("../../assets/square.png")}
            className="rounded-full w-20 h-20 my-3"
          />
          <Text className="font-bold text-3xl text-[#333] font-serif text-center">
            Student Registration Verification
          </Text>
          <Text className="opacity-50 text-sm text-center mx-5">
            Submit your student information for verification. The GCU will
            review your details before creating your account. Please wait for an
            email notification regarding your application status.
          </Text>
        </View>

        {/* ==== Forms ==== */}
        <View className="p-7 flex gap-5">
          <View className="gap-1">
            <Text className="font-bold text-[#333]">LAST NAME</Text>
            <TextInput
              placeholder="e.g. Dela Cruz"
              className="border rounded-lg px-3 border-[#ccc] text-[#555] bg-[#eee]"
              placeholderTextColor="#aaa"
            />
          </View>
          <View className="gap-1">
            <Text className="font-bold text-[#333]">FIRST NAME</Text>
            <TextInput
              placeholder="e.g. Juan"
              className="border rounded-lg px-3 border-[#ccc] text-[#555] bg-[#eee]"
              placeholderTextColor="#aaa"
            />
          </View>
          <View className="gap-1">
            <Text className="font-bold text-[#333]">YEAR LEVEL</Text>
            <TextInput
              inputMode="numeric"
              placeholder="e.g. 4"
              className="border rounded-lg px-3 border-[#ccc] text-[#555] bg-[#eee]"
              placeholderTextColor="#aaa"
            />
          </View>
          <View className="gap-1">
            <Text className="font-bold text-[#333]">SECTION</Text>
            <TextInput
              placeholder="e.g. DW31"
              className="border rounded-lg px-3 border-[#ccc] text-[#555] bg-[#eee]"
              placeholderTextColor="#aaa"
            />
          </View>
          <View className="gap-1">
            <Text className="font-bold text-[#333]">STUDENT NUMBER</Text>
            <TextInput
              inputMode="numeric"
              placeholder="e.g. 202310097"
              className="border rounded-lg px-3 border-[#ccc] text-[#555] bg-[#eee]"
              placeholderTextColor="#aaa"
            />
          </View>
          <View className="gap-1">
            <Text className="font-bold text-[#333]">PASSWORD</Text>
            <TextInput
              secureTextEntry={true}
              autoCapitalize="none"
              placeholder="Enter your password"
              className="border rounded-lg px-3 border-[#ccc] text-[#555] bg-[#eee]"
              placeholderTextColor="#aaa"
            />
          </View>

          <Pressable
            onPress={() => {
              if (ID != "") {
                signup(ID);
                navigation.goBack();
                Alert.alert(
                  "Notifying GCU",
                  "Your password will be provided via your school emails when the GCU has already approved your request.",
                  [{ text: "OK" }],
                );
              }
            }}
            className={
              "bg-[#c6a] rounded-xl p-5  " +
              (ID == "" ? "opacity-50" : "active:bg-[#b59]")
            }
          >
            <Text className="font-bold text-white w-full text-center text-lg">
              Request to GCU {"\u27F6"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            className="border border-[#ccc] rounded-xl p-4 active:bg-[#eee]"
          >
            <Text className="text-[#777] w-full text-center">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
