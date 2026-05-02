import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getAll() {
  const keys = await AsyncStorage.getAllKeys();

  const stores = await AsyncStorage.multiGet(keys);

  const parsedObj = Object.fromEntries(
    stores.map(([key, value]) => {
      try {
        return [key, JSON.parse(value)];
      } catch {
        return [key, value];
      }
    }),
  );
  return parsedObj;
}

export async function deleteAll() {
  await AsyncStorage.clear();
}

export async function putUser(data) {
  await AsyncStorage.setItem("user", JSON.stringify(data));
}

export async function getUser() {
  return await AsyncStorage.getItem("user");
}

export async function putAll(data) {}

export async function putStatusDays(data) {
  await AsyncStorage.setItem("statusDays", JSON.stringify(data));
}

export async function putDailyStatus(data) {
  await AsyncStorage.setItem("dailyStatus", JSON.stringify(data));
}

export async function getFirstDay() {
  return await AsyncStorage.getItem("firstDay");
}

export async function putFirstDay(data) {
  console.log(89);
  await AsyncStorage.setItem("firstDay", JSON.stringify(data));
  console.log(45);
}
