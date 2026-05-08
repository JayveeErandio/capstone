import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useContext } from "react";
import { Variables } from "../../../Variables";

export default function Main({ show, setPage }) {
  const { books, currentBook, deleteAppointment } = useContext(Variables);
  function formatAppointment(datetime) {
    const dateObj = new Date(datetime);

    const date = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const time = dateObj.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `📆 ${date} · 🕐 ${time}`;
  }

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
            <View
              className={
                !currentBook.context
                  ? "hidden"
                  : "" + "absolute bg-[#000]/60 h-full justify-center"
              }
            >
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

          <Text
            className={
              !currentBook.context && books.length == 0
                ? "text-center text-sm text-gray-500 mt-12"
                : ""
            }
          >
            {!currentBook.context && books.length == 0
              ? "You currently don't have appointments yet."
              : "Your appointments"}
          </Text>

          {/* Appointment: Current or Ongoing */}
          <View
            className={
              !currentBook.context
                ? "hidden"
                : "" + " bg-white p-3 rounded-2xl gap-1 border border-[#555]"
            }
          >
            <View className="flex-row justify-between">
              <Text className="text-xs bg-[#ffd] border border-[#cca] p-1 px-2 rounded-full text-[#995] font-bold">
                {currentBook.status}{" "}
                {currentBook.status == "Pending" ? "⏳" : "📌"}
              </Text>
              <Pressable
                onPress={async () => {
                  if (
                    await new Promise((resolve) => {
                      Alert.alert(
                        "Delete appointment",
                        "Do you want to discontinue your appointment?",
                        [
                          {
                            text: "Yes",
                            onPress: () => resolve(true), // User cancelled
                            style: "cancel",
                          },
                          {
                            text: "No",
                            onPress: () => resolve(false), // User confirmed
                          },
                        ],
                        { cancelable: false },
                      );
                    })
                  ) {
                    deleteAppointment();
                  }
                }}
                className="pl-6"
              >
                <Text className="text-sm text-[#888]">Delete</Text>
              </Pressable>
            </View>
            <Text className="font-bold ">{currentBook.context?.slice(3)}</Text>
            <Text className="text-sm text-[#777]">
              {formatAppointment(currentBook.datetime)}
            </Text>
          </View>

          {/* Appointment: Past or History */}
          {books.map((current, index) => (
            <View className="bg-white p-3 rounded-2xl gap-1" key={index}>
              <Text
                className={
                  (current.status == "Done"
                    ? "bg-[#eef] text-[#779]"
                    : "bg-red-200 text-red-700") +
                  " text-xs border border-[#cca] px-2 rounded-full font-bold self-start"
                }
              >
                {current.status}
              </Text>
              <Text className="font-bold ">{current.context?.slice(3)}</Text>
              <Text className="text-sm text-[#777]">
                {formatAppointment(current.datetime)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
