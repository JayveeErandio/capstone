import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Main from "./space/Main";
import Create from "./space/Create";
import Mine from "./space/Mine";

export default function SpaceScreen() {
  const [page, setPage] = useState("Main");

  return (
    <View className="flex-1">
      <Main index={page == "Main" ? 50 : 0} setPage={setPage} />
      <Create
        index={page == "Create" ? 50 : 0}
        setPage={() => setPage("Main")}
      />
      <Mine index={page == "Mine" ? 50 : 0} />
    </View>
  );
}
