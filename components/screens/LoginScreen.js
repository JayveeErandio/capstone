import { useState, useContext, useEffect } from "react";
import { Variables } from "../../Variables";
import { View, Text, TextInput, Image, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "./LoadingScreen";
import InputField from "../InputField";
import Button from "../Button";
import { Resend } from "resend";

export default function LoginScreen() {
  const navigation = useNavigation();
  const {
    login,
    page,
    setPage,
    darkenColor,
    chosenTheme,
    freeTrial,
    setOnDemo,
    loginField1,
    setLoginField1,
    loginField2,
    setLoginField2,
    softenColor,
    forgotPassword,
  } = useContext(Variables);
  const [valid, setValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  useEffect(() => {
    if (valid == false) {
      setTimeout(() => {
        setValid(null);
      }, 1200);
      setShowForgot(true);
    }
  }, [valid]);

  return loading ? (
    <LoadingScreen message="Logging you in" />
  ) : (
    <SafeAreaView>
      <View className="bg-[#fff] h-full">
        {/* ==== Headline Top ==== */}
        <View
          className=" flex items-center py-12 gap-2"
          style={{ backgroundColor: softenColor(chosenTheme) }}
        >
          <Image
            className="rounded-full"
            source={require("../../assets/logo_plain.png")}
            style={{ width: 80, height: 80 }}
          />

          <Text className="font-lora-bold text-3xl text-[#333]">
            Welcome back
          </Text>
          <Text className="opacity-50 text-sm font-archivo">
            Sign in to your MoodLink account
          </Text>
        </View>

        {/* ==== Forms ==== */}
        <View className="p-7 flex gap-0 pb-4">
          <Text className="font-archivo-bold text-[#333]">STUDENT ID</Text>
          <InputField
            onChangeText={setLoginField1}
            placeholder="e.g. 202310097"
            numeric
            value={loginField1}
            maxLength={9}
          />
          <Text className="font-archivo-bold text-[#333] mt-4">PASSWORD</Text>
          <InputField
            password
            placeholder="Enter your password"
            onChangeText={setLoginField2}
            value={loginField2}
          />

          <Text
            className={
              (valid == false ? "" : "opacity-0") +
              " text-center text-[#f00] m-2 font-archivo text-sm"
            }
          >
            Invalid Student ID or Password
          </Text>
          <Button
            onPress={async () => {
              if (loginField1 && loginField2) {
                setLoading(true);
                const data = await login(loginField1, loginField2);
                setLoading(false);
                if (data.success) {
                  setLoginField1("");
                  setLoginField2("");
                } else if (data.reason == "deactivated") {
                  Alert.alert(
                    "Account banned",
                    "Your account has been deactivated by the administrators due to possible unwanted or inappropriate activities. You can contact them through any available channel regarding this concern.",
                    [
                      {
                        text: "OK",
                      },
                    ],
                    { cancelable: true },
                  );
                  return;
                }

                setValid(data.success);
              }
            }}
            value={"Log In ➞"}
            disabled={loginField1.length != 9 || loginField2.length < 6}
          />
          <Pressable
            onPress={async () => {
              if (!showForgot) return;
              //const resend = new Resend("re_2WRpYfzu_LWvKMDq4ptyPvuremVd2nGdB");
              /*await resend.emails.send({
                from: "noreply@feumoodlink.com",
                to: "ayahuascadump@gmail.com",
                subject: "Hello!",
                html: "<p>This is a test email</p>",
              });*/
              forgotPassword(loginField1);
            }}
            className={
              (showForgot ? "" : "opacity-0") +
              " self-start p-3 py-1 mx-auto mt-3 "
            }
          >
            <Text
              className="font-archivo text-center text-sm"
              style={{ color: darkenColor(chosenTheme) }}
            >
              Forgot Password?
            </Text>
          </Pressable>
        </View>

        {/* ==== Footer ==== */}
        <View className="px-7 flex gap-6">
          <Pressable
            onPress={() => {
              setOnDemo(true);
              setTimeout(() => {
                navigation.navigate("Entry");
              }, 300);
            }}
            className={
              (freeTrial ? "" : "hidden") +
              " border border-[#f0f0f0] rounded-xl p-4 active:bg-[#eff]"
            }
          >
            <Text className="text-[#777] w-full text-center font-archivo">
              🚀 Skip — View Demo
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
              className="font-archivo-bold self-start"
              style={{ color: darkenColor(chosenTheme) }}
            >
              Sign up
            </Text>
          </View>
          <View
            className="flex-row border rounded-lg gap-3 p-4 items-center "
            style={{
              backgroundColor: softenColor(chosenTheme),
              borderColor: darkenColor(chosenTheme),
            }}
          >
            <Text className="text-xl">🏫</Text>
            <Text className="flex-1 text-[#555] text-sm font-archivo">
              MoodLink is an official FEU Diliman GCU app. Use your{" "}
              <Text className="font-archivo-bold">FEU student credentials</Text>{" "}
              to Log in.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
