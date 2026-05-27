import { Text, View, Pressable, ScrollView } from "react-native";
import { useContext } from "react";
import { Variables } from "../../../Variables";

export default function Finalize({ show, setPage }) {
  const { currentBook, bookAppointment, darkenColor, chosenTheme } =
    useContext(Variables);
  function formatReadableDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  function formatTime12Hour(time24) {
    let [hours, minutes] = time24.split(":");

    hours = parseInt(hours);

    const suffix = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${String(hours).padStart(2, "0")}:${minutes} ${suffix}`;
  }

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
              <Text className="text-sm">{currentBook.context}</Text>
            </View>
            <View className="flex-row justify-between bg-white p-4 items-center">
              <Text className="text-sm text-[#777]">Date</Text>
              <Text className="text-sm">
                {"📆 " + formatReadableDate(currentBook.date)}
              </Text>
            </View>
            <View className="flex-row justify-between bg-white p-4 items-center">
              <Text className="text-sm text-[#777]">Time</Text>
              <Text className="text-sm">
                {"🕐 " + formatTime12Hour(currentBook.time ?? "00:00")}
              </Text>
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
              bookAppointment();
              setPage("Main");
            }}
            className="p-4 rounded-full"
            style={{ backgroundColor: darkenColor(chosenTheme) }}
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
