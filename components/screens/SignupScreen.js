import { useContext, useState } from "react";
import { View, Text, TextInput, Pressable, Image, Alert } from "react-native";
import { Variables } from "../../Variables";
import { useNavigation } from "@react-navigation/native";

export default function SignupScreen() {
  const navigation = useNavigation();
  const { setPage } = useContext(Variables);
  const [ID, setID] = useState("");

  return (
    <View>
      {/* ==== Headline Top ==== */}
      <View className="bg-[#fef] flex items-center py-8 gap-2">
        <Image
          source={require("../../assets/square.png")}
          className="rounded-full w-20 h-20 my-3"
        />
        <Text className="font-bold text-3xl text-[#333] font-serif text-center">
          Please provide your student number
        </Text>
        <Text className="opacity-50 text-sm text-center mx-5">
          Your student number will be notified to the GCU for them to verify and
          create your account.
        </Text>
      </View>

      {/* ==== Forms ==== */}
      <View className="p-7 flex gap-5">
        <View>
          <Text className="font-bold text-[#333]">STUDENT ID</Text>
          <TextInput
            onChangeText={setID}
            inputMode="numeric"
            placeholder="e.g. 202310097"
            className="border rounded-lg px-3 border-[#ccc]"
          />
        </View>

        <Pressable
          onPress={async () => {
            if (ID != "") {
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
    </View>
  );
}
