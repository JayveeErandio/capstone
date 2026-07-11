import { useState, useContext, useEffect } from "react";
import { Variables } from "../../Variables";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Alert,
  Modal,
} from "react-native";
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

  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotStudentNo, setForgotStudentNo] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotButton, setForgotButton] = useState("Send Temporary Password");

  // For text and style bugs during launch
  const [bug1, setBug1] = useState("Welcome Back");
  const [bug2, setBug2] = useState("Don't have an account? ");
  const [bug3, setBug3] = useState("Sign up");
  const [bug4, setBug4] = useState("Forgot Password?");
  const bugging = function () {
    setTimeout(() => {
      setBug1("WeIcome Back");
      setBug2("Don't have am account? ");
      setBug3("Sigm up");
      setBug4("Forgot Possword?");
    }, 120);
    setTimeout(() => {
      setBug1("Welcome Back");
      setBug2("Don't have an account? ");
      setBug3("Sign up");
      setBug4("Forgot Password?");
    }, 180);
  };
  useEffect(() => {
    bugging();
  }, []);

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

          <Text className="font-lora-bold text-3xl text-[#333]">{bug1}</Text>
          <Text className="opacity-50 text-sm font-archivo">
            Sign in to your MoodLink account
          </Text>
        </View>

        {/* ==== Forms ==== */}
        <View className="p-7 flex gap-0 pb-4">
          <Text className="font-archivo-bold text-[#333]">STUDENT NUMBER</Text>
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
            Invalid student number or password
          </Text>
          <Button
            onPress={async () => {
              if (loginField1 && loginField2) {
                setLoading(true);
                const data = await login(loginField1, loginField2);
                bugging();
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
                } else if (data.tokenized) {
                  navigation.navigate("Signup");
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
              setForgotStudentNo(loginField1);
              setForgotEmail("");
              setForgotMessage("");
              setForgotSuccess(null);
              setForgotModalVisible(true);
            }}
            className={
              (showForgot ? "" : "hidden") +
              " self-start p-3 py-1 mx-auto mt-3 "
            }
          >
            <Text
              className="font-archivo text-center text-sm"
              style={{ color: darkenColor(chosenTheme) }}
            >
              {bug4}
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
              🚀 Skip — Try a Demo
            </Text>
          </Pressable>
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
      <Modal visible={forgotModalVisible} transparent animationType="fade">
        <View
          className="flex-1 justify-center items-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <View className="bg-white rounded-2xl w-full p-6">
            {/* Close */}
            <Pressable
              onPress={() => {
                setForgotModalVisible(false);
                setForgotButton("Send Temporary Password");
              }}
              className="absolute right-4 top-4 z-10"
            >
              <Text className="text-xl font-bold text-[#666]">✕</Text>
            </Pressable>

            <Text className="font-lora-bold text-2xl text-center text-[#333]">
              Forgot Password
            </Text>

            <Text className="text-center text-[#777] mt-2 mb-5 font-archivo">
              Enter your student number and the associated email address.
            </Text>

            <Text className="font-archivo-bold">STUDENT NUMBER</Text>

            <InputField
              value={forgotStudentNo}
              onChangeText={setForgotStudentNo}
              placeholder="e.g. 202310097"
              numeric
              maxLength={9}
            />

            <Text className="font-archivo-bold mt-4">EMAIL ADDRESS</Text>

            <InputField
              value={forgotEmail}
              onChangeText={setForgotEmail}
              placeholder="example@feu.edu.ph"
            />

            <View className="mt-5">
              <Button
                value={forgotLoading ? "Sending..." : forgotButton}
                disabled={
                  forgotLoading ||
                  forgotStudentNo.length !== 9 ||
                  forgotEmail.length === 0 ||
                  forgotButton == "Sent"
                }
                onPress={async () => {
                  setForgotLoading(true);
                  setForgotMessage("");

                  const result = await forgotPassword(
                    forgotStudentNo,
                    forgotEmail,
                  );

                  setForgotLoading(false);

                  if (result.status == "success") {
                    setForgotButton("Sent");
                    setForgotSuccess(true);
                    setForgotMessage(
                      "A temporary password has been sent to your registered email.",
                    );
                  } else {
                    setForgotSuccess(false);
                    setForgotMessage(
                      result.message ??
                        "Student Number and email do not match our records.",
                    );
                  }
                }}
              />
            </View>

            {forgotMessage !== "" && (
              <Text
                className="text-center mt-4 font-archivo"
                style={{
                  color: forgotSuccess ? "#16a34a" : "#dc2626",
                }}
              >
                {forgotMessage}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
