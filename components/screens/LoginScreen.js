import { useState, useContext, useEffect } from "react";
import { Variables } from "../../Variables";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [ID, setID] = useState(0);
  const [password, setPassword] = useState("");
  const { login, page, setPage } = useContext(Variables);
  const [valid, setValid] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (valid == false)
      setTimeout(() => {
        setValid(null);
      }, 1200);
  }, [valid]);

  return loading ? (
    <LoadingScreen message="Signing you in" />
  ) : (
    <SafeAreaView>
      <View className="bg-[#fff] h-full">
        {/* ==== Headline Top ==== */}
        <View className="bg-[#f5ebf4] flex items-center py-12 gap-2">
          <View
            className="rounded-full h-20 w-20 justify-center"
            style={{ backgroundColor: "#d16583" }}
          >
            <Text className="text-4xl text-center">🌸</Text>
          </View>

          <Text className="font-lora-bold text-3xl text-[#333]">
            Welcome back
          </Text>
          <Text className="opacity-50 text-sm font-archivo">
            Sign in to your MoodLink account
          </Text>
        </View>

        {/* ==== Forms ==== */}
        <View className="p-7 flex gap-1">
          <Text className="font-archivo-bold text-[#333]">STUDENT ID</Text>
          <TextInput
            onChangeText={setID}
            inputMode="numeric"
            placeholder="e.g. 202310097"
            className="border rounded-lg px-3 py-3 border-[#ccc] bg-[#fff] text-[#555] font-archivo"
            placeholderTextColor="#aaa"
          />
          <Text className="font-archivo-bold text-[#333] mt-4">PASSWORD</Text>
          <TextInput
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            placeholder="Enter your password"
            className="border rounded-lg px-3 py-3 border-[#ccc] bg-[#fff] text-[#555] font-archivo"
            placeholderTextColor="#aaa"
          />
          <Text
            className={
              (valid == false ? "" : "opacity-0") +
              " text-center text-[#f00] m-2"
            }
          >
            Invalid Student ID or Password
          </Text>
          <Pressable
            onPress={async () => {
              if (ID && password) {
                setLoading(true);
                setID();
                setPassword();
                const data = await login(ID, password);
                setLoading(false);
                setValid(data);
              }
            }}
            className={
              "mt-2 bg-[#c6a] rounded-xl p-5  " +
              (ID && password != ""
                ? "opacity-100 active:bg-[#b59]"
                : "opacity-50")
            }
          >
            <Text className="text-white w-full text-center text-lg font-archivo-bold">
              Sign In {"\u27F6"}
            </Text>
          </Pressable>
        </View>

        {/* ==== Footer ==== */}
        <View className="px-7 flex gap-6">
          <Pressable className="border border-[#f0f0f0] rounded-xl p-4 active:bg-[#eff]">
            <Text className="text-[#777] w-full text-center font-archivo">
              {"\u{1f680}"} Skip — View Demo
            </Text>
          </Pressable>
          <View className="flex-row mx-auto">
            <Text className="self-start text-[#777] font-archivo">
              Don't have an account?{" "}
            </Text>
            <Text
              onPress={() => {
                navigation.navigate("Signup");
              }}
              className="font-archivo-bold text-[#c6a] self-start"
            >
              Sign up
            </Text>
          </View>
          <View className="flex-row border border-[#ccc] rounded-lg gap-3 p-4 items-center bg-[#fff0ff]">
            <Text className="text-xl">🏫</Text>
            <Text className="flex-1 text-[#555] text-sm font-archivo">
              MoodLink is an official FEU Diliman GCU app. Use your{" "}
              <Text className="font-archivo-bold">FEU student credentials</Text>{" "}
              to sign in.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
