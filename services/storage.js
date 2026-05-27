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
  await AsyncStorage.setItem("firstDay", JSON.stringify(data));
}

export async function getStatusDays() {
  return await AsyncStorage.getItem("statusDays");
}

export async function putPendingPost(data) {
  await AsyncStorage.setItem("pendingPosts", JSON.stringify(data));
}

export async function putPosts(data) {
  await AsyncStorage.setItem("posts", JSON.stringify(data));
}

export async function putMyPosts(data) {
  await AsyncStorage.setItem("myPosts", JSON.stringify(data));
}

export async function putNotifications(data) {
  await AsyncStorage.setItem("notifications", JSON.stringify(data));
}

export async function putAppointments(data) {
  await AsyncStorage.setItem("appointments", JSON.stringify(data));
}

export async function putChats(data) {
  await AsyncStorage.setItem("chats", JSON.stringify(data));
}

export async function getChosenTheme() {
  return await AsyncStorage.getItem("chosenTheme");
}

export async function setChosenTheme(data) {
  await AsyncStorage.setItem("chosenTheme", data);
}

export async function get(key) {
  return JSON.parse(await AsyncStorage.getItem(key));
}

export async function setFreeTrial(value) {
  AsyncStorage.setItem("freeTrial", JSON.stringify(value));
}
