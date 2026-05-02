import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getAll() {
  const keys = await AsyncStorage.getAllKeys();

  const stores = await AsyncStorage.multiGet(keys);
  console.log(stores);
}

export async function deleteAll() {
  await AsyncStorage.clear();
}
