import { Text, View, Pressable, ScrollView } from "react-native";

export default function Finalize({ show, setPage }) {
  return (
    <View
      className={(show ? "z-50" : "") + " absolute h-full w-full bg-[#eee]"}
    >
      {/* Header */}
      <View className="flex-row bg-white p-6 items-center gap-3">
        <Pressable
          onPress={() => setPage("Create")}
          className="bg-[#ddd] w-9 h-9 rounded-xl"
        >
          <Text className="text-2xl font-bold text-center ">‹</Text>
        </Pressable>
        <Text className="font-bold font-serif text-lg">
          Confirm Appointment
        </Text>
      </View>

      <ScrollView>
        <View className="p-6 gap-5">
          <Text className="font-bold font-serif text-lg">
            Appointment Summary
          </Text>
          <View className="gap-0.5">
            <View className="flex-row justify-between bg-white p-4 items-center">
              <Text className="text-sm text-[#777]">Concern</Text>
              <Text className="text-sm">{"🏠 Family Issues"}</Text>
            </View>
            <View className="flex-row justify-between bg-white p-4 items-center">
              <Text className="text-sm text-[#777]">Date</Text>
              <Text className="text-sm">{"📆 Mar 17, 2026"}</Text>
            </View>
            <View className="flex-row justify-between bg-white p-4 items-center">
              <Text className="text-sm text-[#777]">Time</Text>
              <Text className="text-sm">{"🕐 2:00 PM"}</Text>
            </View>
            <View className="flex-row justify-between bg-white p-4 items-center">
              <Text className="text-sm text-[#777]">Counselor</Text>
              <Text className="text-sm">
                {"GCU Counselor (assigned by GCU)"}
              </Text>
            </View>
            <View className="flex-row justify-between bg-white p-4 items-center">
              <Text className="text-sm text-[#777]">Mode</Text>
              <Text className="text-sm">
                {"In-person · GCU Office, Room 201"}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-3 bg-[#fef] p-3 rounded-2xl mb-3 border border-[#cac]">
            <Text className="text-center text-[#99c] text-3xl rounded-lg font-bold">
              🔒
            </Text>
            <Text className="text-xs text-[#777] leading-4 flex-1">
              Your information is kept{" "}
              <Text className="font-bold">strictly confidential</Text> by the
              GCU in accordance with FEU Diliman's student welfare policies.
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setPage("Main");
            }}
            className={"bg-[#c68] p-4 rounded-full active:bg-[#b57]"}
          >
            <Text className="text-white text-center font-bold">
              Submit Appointment Request ✓
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setPage("Create");
            }}
            className={"p-4 rounded-full active:bg-[#ddd] border border-[#aaa]"}
          >
            <Text className="text-[#555] text-center font-bold">
              Go Back & Edit
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
