import { Text, View } from "react-native";
import { useState } from "react";
import Main from "./book/Main";
import Create from "./book/Create";
import Finalize from "./book/Finalize";

export default function BookingScreen() {
  const [page, setPage] = useState("Main");

  return (
    <View className="flex-1">
      <Main show={page == "Main"} setPage={() => setPage("Create")} />
      <Create show={page == "Create"} setPage={setPage} />
      <Finalize show={page == "Finalize"} setPage={setPage} />
    </View>
  );
}
