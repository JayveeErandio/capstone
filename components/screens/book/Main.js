import { View, Text, ScrollView, Pressable } from "react-native";

export default function Main({ show, setPage }) {
  return (
    <View
      className={(show ? "z-50" : "") + " absolute w-full h-full bg-[#eee]"}
    >
      <View className="bg-white p-5">
        <Text className="text-[#333] text-2xl font-bold font-serif">
          GCU Appointments 📅
        </Text>
        <Text className="text-sm text-[#777]">
          Book a session with a GCU counselor
        </Text>
      </View>
      <ScrollView className="px-5">
        <View className="gap-3 py-6">
          <View className="rounded-2xl overflow-hidden">
            {/* Back */}
            <Pressable
              onPress={setPage}
              className="flex-row justify-between bg-[#d69] active:bg-[#c58] p-5 items-center"
            >
              <View>
                <Text className="text-white text-lg font-serif font-bold">
                  Book an Appointment
                </Text>
                <Text className="text-white text-sm">
                  Schedule time with a GCU counselor
                </Text>
              </View>
              <Text className="text-white text-4xl">➕</Text>
            </Pressable>

            {/* Front */}
            <View className="absolute bg-[#000]/60 h-full justify-center hidden">
              <Text className="text-center mx-7 font-bold text-[#fff]">
                Booking can only be set once. You have ongoing appointment set
                right now
              </Text>
            </View>
          </View>
          <View className="flex-row gap-3 bg-[#fef] p-3 rounded-2xl mb-3 border border-[#cac]">
            <Text className="text-center text-[#99c] text-3xl rounded-lg font-bold">
              ℹ️
            </Text>
            <Text className="text-xs text-[#777] leading-4 flex-1">
              All sessions are <Text className="font-bold">confidential</Text>.
              For urgent concerns, please visit the GCU office directly at Room
              201, Admin Building.
            </Text>
          </View>

          <Text>Your Appointments</Text>

          {/* Appointment: Current or Ongoing */}
          <View className="bg-white p-3 rounded-2xl gap-1 border border-[#555]">
            <View className="flex-row justify-between">
              <Text className="text-xs bg-[#ffd] border border-[#cca] p-1 px-2 rounded-full text-[#995] font-bold">
                Pending ⏳
              </Text>
              <Pressable className="pl-6">
                <Text className="text-sm text-[#888]">Delete</Text>
              </Pressable>
            </View>
            <Text className="font-bold ">{"Academic Stress"}</Text>
            <Text className="text-sm text-[#777]">
              {"📆 Mar 14, 2026 · 🕐 10:00 AM"}
            </Text>
          </View>

          {/* Appointment: Past or History */}
          {[1, 2].map((current, index) => (
            <View className="bg-white p-3 rounded-2xl gap-1" key={index}>
              <Text className="text-xs bg-[#eef] border border-[#cca] px-2 rounded-full text-[#779] font-bold self-start">
                Done
              </Text>
              <Text className="font-bold ">{"Academic Stress"}</Text>
              <Text className="text-sm text-[#777]">
                {"📆 Mar 14, 2026 · 🕐 10:00 AM"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
