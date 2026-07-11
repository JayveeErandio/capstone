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
  const {
    setPage,
    signup,
    softenColor,
    chosenTheme,
    darkenColor,
    studNumAccCreate,
  } = useContext(Variables);
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
  useEffect(() => {
    const generateds = [
      "newbie",
      "moodlinkerist",
      "imRandom",
      "sixseven",
      "juandelacruz67",
    ];
    setAnonymous(generateds[Math.floor(Math.random() * generateds.length)]);
  }, []);
  const [invalid, setInvalid] = useState(null);
  useEffect(() => {
    if (!invalid) return;

    const timer = setTimeout(() => {
      setInvalid(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [invalid]);
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [buttonContent, setButtonContent] = useState("Create Account ➞");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "1st Year", value: "1" },
    { label: "2nd Year", value: "2" },
    { label: "3rd Year", value: "3" },
    { label: "4th Year", value: "4" },
  ]);
  const [openProg, setOpenProg] = useState(false);
  const [valueProg, setValueProg] = useState(null);
  const [itemsProg, setItemsProg] = useState([
    { label: "BSA", value: "1" },
    { label: "BSBA-FMBA", value: "2" },
    { label: "BSBA-MMMD", value: "3" },
    { label: "BSBA-OSM", value: "4" },
    { label: "BSCS-SE", value: "5" },
    { label: "BSIT-AGD", value: "6" },
    { label: "BSIT-Cyber", value: "7" },
    { label: "BSIT-WMA", value: "8" },
    { label: "BSP", value: "9" },
    { label: "BSTM", value: "10" },
  ]);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const isValidName = (text) =>
    /^\p{L}+(?:[ '.-]\p{L}+)*\.?$/u.test(text.trim());
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

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
          className="flex items-center py-12 gap-2"
          style={{ backgroundColor: softenColor(chosenTheme) }}
        >
          <Image
            className="rounded-full"
            source={require("../../assets/logo_plain.png")}
            style={{ width: 80, height: 80 }}
          />
          <Text className="font-lora-bold text-3xl text-[#333] text-center">
            Account Creation
          </Text>
          <Text className="opacity-50 text-sm text-center mx-5 font-archivo">
            Hi, Ka-Tamaraw! It looks like you're new to our app. We're excited
            to have you here! Before you can connect with fellow Tamaraws and
            access all of the app's features, please take a moment to set up
            your account.
          </Text>
          <Text className="opacity-50 text-sm text-center mx-5 font-archivo">
            Your Student Number: {studNumAccCreate}
          </Text>
        </View>

        {/* ==== Forms ==== */}
        <View className="p-7 flex gap-6">
          <View>
            <Text className="font-archivo-bold text-[#333]">
              LAST NAME <Required />
            </Text>
            <InputField
              placeholder="e.g. Dela Cruz"
              onChangeText={setLastName}
            />
          </View>
          <View>
            <Text className="font-archivo-bold text-[#333]">
              FIRST NAME <Required />
            </Text>
            <InputField placeholder="e.g. Juan" onChangeText={setFirstName} />
          </View>
          <View>
            <Text className="font-archivo-bold text-[#333]">
              YEAR LEVEL <Required />
            </Text>

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
              zIndex={2000}
              zIndexInverse={1000}
            />
          </View>
          <View>
            <Text className="font-archivo-bold text-[#333]">
              PROGRAM <Required />
            </Text>
            <DropDownPicker
              open={openProg}
              value={valueProg}
              items={itemsProg}
              setOpen={setOpenProg}
              setValue={setValueProg}
              setItems={setItemsProg}
              placeholder="Select Program"
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
              zIndex={1000}
              zIndexInverse={2000}
            />
          </View>
          <View>
            <Text className="font-archivo-bold text-[#333]">
              ANONYMOUS NAME <Required />
            </Text>
            <InputField
              onChangeText={setAnonymous}
              value={anonymous}
              placeholder="e.g. moodlinkerist"
            />
            <Text className="text-xs text-gray-400 font-archivo">
              (Your public screen name throughout the app.)
            </Text>
          </View>
          <View>
            <Text className="font-archivo-bold text-[#333]">
              CONTACT NUMBER
            </Text>
            <InputField
              onChangeText={(ev) => {
                let value = ev.trim();
                if (value == "9") value = "09";
                if (
                  value[value.length - 1] == " " ||
                  value[value.length - 1] == "," ||
                  value[value.length - 1] == "." ||
                  value[value.length - 1] == "-"
                ) {
                  value = value.slice(0, -1);
                }
                setContactNumber(value);
              }}
              value={contactNumber}
              numeric
              placeholder="e.g. 09123456789"
              maxLength={11}
            />
          </View>
          <View>
            <Text className="font-archivo-bold text-[#333]">EMAIL ADDRESS</Text>
            <InputField
              onChangeText={setEmailAddress}
              placeholder="e.g. juandelacruz@gmail.com"
              autoCapitalize="none"
            />
            <Text className="text-xs text-gray-400 font-archivo">
              (This email address will only be used for password recovery and
              account-related notifications. School email that ends with
              @feudiliman.edu.ph might not be effective)
            </Text>
          </View>
          <View className="bg-gray-300 w-full h-0.5 my-1"></View>
          <View>
            <Text className="font-archivo-bold text-[#333]">NEW PASSWORD</Text>
            <InputField password maxLength={11} onChangeText={setNewPass} />
            <Text className="text-xs text-gray-400 font-archivo">
              (Optional. You can change your password later)
            </Text>
          </View>
          <View className="gap-1">
            <Text className="font-archivo-bold text-[#333]">
              CONFIRM PASSWORD
            </Text>
            <InputField password maxLength={11} onChangeText={setConfirmPass} />
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
                    By registering, you agree to the following terms and
                    conditions:
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
                    2. Mood Assessment Disclaimer
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    The mood check-in and chatbot features are intended solely
                    for self-reflection and emotional awareness. They do not
                    provide psychological, psychiatric, or medical assessments,
                    diagnoses, or treatment. Results are generated from your
                    responses to help you better understand your current mood
                    and should not be considered a professional evaluation. If
                    you are experiencing significant emotional distress or a
                    mental health crisis, please seek assistance from the
                    Guidance and Counseling Unit (GCU) or a qualified mental
                    health professional.
                  </Text>

                  <Text className="font-archivo-bold text-[#333] text-sm mb-1">
                    3. Mental Health Data
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    Any journal entries, mood logs, or interactions with the
                    chatbot are treated as confidential. This data may be
                    reviewed in aggregate, anonymized form by authorized GCU
                    counselors for the purpose of improving student wellness
                    services.
                  </Text>

                  <Text className="font-archivo-bold text-[#333] text-sm mb-1">
                    4. Anonymous Identity
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    Your chosen anonymous name is your public identity within
                    the app. You are responsible for maintaining appropriate
                    conduct when interacting in shared spaces.
                  </Text>

                  <Text className="font-archivo-bold text-[#333] text-sm mb-1">
                    5. Account Approval
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    Account creation is subject to GCU verification. Providing
                    false or misleading information may result in rejection or
                    revocation of your account.
                  </Text>

                  <Text className="font-archivo-bold text-[#333] text-sm mb-1">
                    6. Privacy Policy
                  </Text>
                  <Text className="font-archivo text-[#555] text-sm leading-6 mb-3">
                    Your data is protected in accordance with applicable data
                    privacy laws. You have the right to request access to,
                    correction of, or deletion of your personal data by
                    contacting the GCU directly.
                  </Text>

                  <Text className="font-archivo text-[#555] text-sm leading-6">
                    By checking the acceptance box, you confirm that you have
                    read, understood, and agree to these terms and conditions.
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
              (!!invalid ? "100" : "0")
            }
          >
            {invalid}
          </Text>
          <Button
            value={buttonContent}
            onPress={async () => {
              if (lastName.trim() == "") {
                setInvalid("Please put your last name");
                return;
              } else if (!isValidName(lastName)) {
                setInvalid("Last name should contain letters only");
                return;
              } else if (firstName.trim() == "") {
                setInvalid("Please put your first name");
                return;
              } else if (!isValidName(firstName)) {
                setInvalid("First name should contain letters only");
                return;
              } else if (value == null) {
                setInvalid("Please select a year level");
                return;
              } else if (valueProg == null) {
                setInvalid("Please select a program");
                return;
              } else if (anonymous.trim() == "") {
                setInvalid("Anonymous name cannot be blank");
                return;
              } else if (newPass.trim() != "" || confirmPass.trim() != "") {
                if (newPass.trim() != confirmPass.trim()) {
                  setInvalid("New and confirm password do not match");
                  return;
                } else if (newPass.trim().length < 6) {
                  setInvalid("Password must be atleast 6 characters");
                  return;
                }
              } else if (
                !isValidEmail(emailAddress) &&
                emailAddress.trim() != ""
              ) {
                setInvalid("Email address set is invalid");
                return;
              } else if (!accepted) {
                setInvalid("Please agree first to the policy provided");
                return;
              }

              setButtonContent("Creating");
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
              setButtonContent("Create Account ➞");

              if (result.success) {
                navigation.goBack();
                Alert.alert(
                  "Notifying GCU",
                  "Your password will be provided via your school emails when the GCU has already approved your request.",
                  [{ text: "OK" }],
                );
              }
            }}
            disabled={
              /*lastName == "" ||
              firstName == "" ||
              yearLevel == "" ||
              value == null ||
              anonymous == "" ||
              contactNumber.length != 11 ||
              emailAddress.trim().includes(" ") || */
              buttonContent == "Creating"
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

const Required = function () {
  return <Text className="text-red-500 ">*</Text>;
};
