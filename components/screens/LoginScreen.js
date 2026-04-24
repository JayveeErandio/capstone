import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/Authentication";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [ID, setID] = useState(0);
  const [password, setPassword] = useState("");
  const { login, page, setPage } = useContext(AuthContext);
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
      <View className="bg-[#f8f4f9] h-full">
        {/* ==== Headline Top ==== */}
        <View className="bg-[#f5ebf4] flex items-center py-8">
          <Image
            source={require("../../assets/square.png")}
            className="rounded-full w-20 h-20 my-3"
          />
          <Text className="font-bold text-3xl text-[#333] font-serif">
            Welcome back
          </Text>
          <Text className="opacity-50 text-sm">
            Sign in to your MoodLink account
          </Text>
        </View>

        {/* ==== Forms ==== */}
        <View className="p-7 flex gap-1">
          <Text className="font-bold text-[#333]">STUDENT ID</Text>
          <TextInput
            onChangeText={setID}
            inputMode="numeric"
            placeholder="e.g. 202310097"
            className="border rounded-lg px-3 border-[#ccc]"
          />
          <Text className="font-bold text-[#333] mt-3">PASSWORD</Text>
          <TextInput
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            placeholder="Enter your password"
            className="border rounded-lg px-3 border-[#ccc]"
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
            <Text className="font-bold text-white w-full text-center text-lg">
              Sign In {"\u27F6"}
            </Text>
          </Pressable>
        </View>

        {/* ==== Footer ==== */}
        <View className="px-7 flex gap-6">
          <Pressable className="border border-[#f0f0f0] rounded-xl p-4">
            <Text className="text-[#777] w-full text-center">
              {"\u{1f680}"} Skip — View Demo
            </Text>
          </Pressable>
          <View className="flex-row mx-auto">
            <Text className="self-start text-[#777]">
              Don't have an account?{" "}
            </Text>
            <Text
              onPress={() => {
                navigation.navigate("Signup");
              }}
              className="font-bold text-[#c6a] self-start"
            >
              Sign up
            </Text>
          </View>
          <View className="flex-row border border-[#ccc] rounded-lg gap-3 p-4 items-center bg-[#fff0ff]">
            <Image
              source={require("../../assets/square.png")}
              className="w-10 h-10 my-3"
            />
            <Text className="flex-1 text-[#555] text-sm">
              MoodLink is an official FEU Diliman GCU app. Use your{" "}
              <Text className="font-bold">FEU student credentials</Text> to sign
              in.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
