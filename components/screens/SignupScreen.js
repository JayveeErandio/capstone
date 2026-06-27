import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Variables } from "../../Variables";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputField from "../InputField";
import Button from "../Button";
import DropDownPicker from "react-native-dropdown-picker";

export default function SignupScreen() {
  const navigation = useNavigation();
  const { setPage, signup, softenColor, chosenTheme, darkenColor } =
    useContext(Variables);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  useEffect(() => {
    if (yearLevel > 4) setYearLevel("4");
  }, [yearLevel]);
  const [program, setProgram] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [anonymous, setAnonymous] = useState("newbie");
  const [invalid, setInvalid] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [buttonContent, setButtonContent] = useState("Request to GCU ➞");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "BSA", value: "1" },
    { label: "BSBA-FMBA", value: "2" },
    { label: "BSBA-MMM", value: "3" },
    { label: "BSBA-OSM", value: "4" },
    { label: "BSCS-SE", value: "5" },
    { label: "BSIT-AGD", value: "6" },
    { label: "BSIT-Cyber", value: "7" },
    { label: "BSIT-WMA", value: "8" },
    { label: "BSP", value: "9" },
    { label: "BSTM", value: "10" },
  ]);
  console.log(value);
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={150}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView>
        {/* ==== Headline Top ==== */}
        <View
          className="flex items-center py-8 gap-2"
          style={{ backgroundColor: softenColor(chosenTheme) }}
        >
          <Image
            className="rounded-full"
            source={require("../../assets/logo_plain.png")}
            style={{ width: 80, height: 80 }}
          />
          <Text className="font-lora-bold text-3xl text-[#333] text-center">
            Student Registration Verification
          </Text>
          <Text className="opacity-50 text-sm text-center mx-5 font-archivo">
            Submit your student information for verification. The GCU will
            review your details before creating your account. Please wait for an
            email notification regarding your application status.
          </Text>
        </View>

        {/* ==== Forms ==== */}
        <View className="p-7 flex gap-5">
          <View className="gap-1">
            <Text className="font-archivo-bold text-[#333]">LAST NAME</Text>
            <InputField
              placeholder="e.g. Dela Cruz"
              onChangeText={setLastName}
            />
          </View>
          <View className="gap-1">
            <Text className="font-archivo-bold text-[#333]">FIRST NAME</Text>
            <InputField placeholder="e.g. Juan" onChangeText={setFirstName} />
          </View>
          <View className="gap-1">
            <Text className="font-archivo-bold text-[#333]">YEAR LEVEL</Text>
            <InputField
              onChangeText={setYearLevel}
              maxLength={1}
              placeholder="e.g. 4"
              numeric
              value={yearLevel}
            />
          </View>
          <View className="gap-1">
            <Text className="font-archivo-bold text-[#333]">PROGRAM</Text>

            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select Year Level"
              listMode="SCROLLVIEW"
              style={{
                borderColor: "#d1d5db",
                borderRadius: 10,
                backgroundColor: "#eee",
              }}
              textStyle={{
                fontFamily: "Archivo",
                fontSize: 14,
              }}
              labelStyle={{
                fontFamily: "Archivo",
              }}
              placeholderStyle={{
                fontFamily: "Archivo",
                color: "#9ca3af",
              }}
              dropDownContainerStyle={{
                borderColor: "#d1d5db",
              }}
            />
          </View>
          <View className="gap-1">
            <Text className="font-archivo-bold text-[#333]">
              ANONYMOUS NAME
            </Text>
            <Text className="text-xs text-gray-400 font-archivo">
              (Your public screen name throughout the app.)
            </Text>
            <InputField
              onChangeText={setAnonymous}
              value={anonymous}
              placeholder="e.g. moodlinkerist"
            />
          </View>
          <View className="gap-1">
            <Text className="font-archivo-bold text-[#333]">
              STUDENT NUMBER
            </Text>
            <InputField
              onChangeText={setStudentNumber}
              numeric
              maxLength={9}
              placeholder="e.g. 202310097"
            />
          </View>
          <View className="gap-1">
            <Text className="font-archivo-bold text-[#333]">
              CONTACT NUMBER
            </Text>
            <InputField
              onChangeText={setContactNumber}
              numeric
              placeholder="e.g. 09123456789"
            />
          </View>
          <View className="gap-1">
            <Text className="font-archivo-bold text-[#333]">EMAIL ADDRESS</Text>
            <Text className="text-xs text-gray-400 font-archivo">
              (This email address will only be used for password recovery and
              account-related notifications.)
            </Text>
            <InputField
              onChangeText={setEmailAddress}
              placeholder="e.g. juandelacruz@gmail.com"
            />
          </View>
          {/* ==== Terms Modal ==== */}
          <Modal
            visible={showTerms}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowTerms(false)}
          >
            <View
              className="flex-1 justify-end"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <View
                className="bg-white rounded-t-3xl p-6"
                style={{ maxHeight: "80%" }}
              >
                <Text className="font-lora-bold text-xl text-[#333] mb-4 text-center">
                  Terms & Conditions
                </Text>
                <ScrollView
                  className="mb-4"
                  showsVerticalScrollIndicator={true}
                >
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    By registering with Jaybot, you agree to the following terms
                    and conditions:
                  </Text>
                  <Text className="font-archivo-bold text-[#333] text-sm mb-1">
                    1. Data Collection & Use
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    We collect your personal information (name, student number,
                    contact details, and email address) solely for the purpose
                    of verifying your student status and creating your account.
                    This information is stored securely and will not be shared
                    with third parties without your consent.
                  </Text>
                  <Text className="font-archivo-bold text-[#333] text-sm mb-1">
                    2. Mental Health Data
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    Any journal entries, mood logs, or interactions with the
                    chatbot are treated as confidential. This data may be
                    reviewed in aggregate, anonymized form by authorized GCU
                    counselors for the purpose of improving student wellness
                    services.
                  </Text>
                  <Text className="font-archivo-bold text-[#333] text-sm mb-1">
                    3. Anonymous Identity
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    Your chosen anonymous name is your public identity within
                    the app. You are responsible for maintaining appropriate
                    conduct when interacting in shared spaces.
                  </Text>
                  <Text className="font-archivo-bold text-[#333] text-sm mb-1">
                    4. Account Approval
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    Account creation is subject to GCU verification. Providing
                    false or misleading information may result in rejection or
                    revocation of your account.
                  </Text>
                  <Text className="font-archivo-bold text-[#333] text-sm mb-1">
                    5. Privacy Policy
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    Your data is protected in accordance with applicable data
                    privacy laws. You have the right to request access to,
                    correction of, or deletion of your personal data by
                    contacting the GCU directly.
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6">
                    By checking the acceptance box, you confirm that you have
                    read, understood, and agree to these terms.
                  </Text>
                </ScrollView>
                <Pressable
                  onPress={() => setShowTerms(false)}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: darkenColor(chosenTheme) }}
                >
                  <Text className="font-archivo-bold text-white text-center">
                    Close
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* ==== User Acceptance ==== */}
          <Pressable
            onPress={() => setAccepted(!accepted)}
            className="flex-row items-start gap-3"
          >
            <View
              className="w-5 h-5 rounded border-2 items-center justify-center mt-0.5 flex-shrink-0"
              style={{
                borderColor: darkenColor(chosenTheme),
                backgroundColor: accepted
                  ? darkenColor(chosenTheme)
                  : "transparent",
              }}
            >
              {accepted && (
                <Text className="text-white text-xs font-archivo-bold leading-none">
                  ✓
                </Text>
              )}
            </View>
            <Text className="font-archivo text-sm text-[#555] flex-1">
              I have read and agree to the{" "}
              <Text
                className="font-archivo-bold underline"
                style={{ color: darkenColor(chosenTheme) }}
                onPress={() => setShowTerms(true)}
              >
                Terms & Conditions and Privacy Policy
              </Text>
            </Text>
          </Pressable>

          <Text
            className={
              "text-center -my-2 text-red-700 text-sm opacity-" +
              (invalid ? "100" : "0")
            }
          >
            An account associated with this student number already exists.
          </Text>
          <Button
            value={buttonContent}
            onPress={async () => {
              setButtonContent("Requesting");
              const result = await signup({
                last_name: lastName,
                first_name: firstName,
                year_level: yearLevel,
                program: items.find((current) => current.value == value).label,
                student_number: studentNumber,
                contact_number: contactNumber,
                anonymous_name: anonymous,
                personal_email: emailAddress,
              });
              setButtonContent("Request to GCU ➞");

              if (result.success) {
                navigation.goBack();
                Alert.alert(
                  "Notifying GCU",
                  "Your password will be provided via your school emails when the GCU has already approved your request.",
                  [{ text: "OK" }],
                );
              } else {
                setInvalid(true);
                setTimeout(function () {
                  setInvalid(false);
                }, 2500);
              }
            }}
            disabled={
              lastName == "" ||
              firstName == "" ||
              yearLevel == "" ||
              value == null ||
              anonymous == "" ||
              studentNumber == "" ||
              contactNumber == "" ||
              emailAddress == "" ||
              !accepted ||
              buttonContent == "Requesting"
            }
          />
          <Pressable
            onPress={() => navigation.goBack()}
            className="border border-[#ccc] rounded-xl p-4 active:bg-[#eee]"
          >
            <Text className="text-[#777] w-full text-center font-archivo">
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
