import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function testNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "MoodLink",
      body: "Someone laughed at your post",
    },
    trigger: null, // immediately
  });
}

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log("Must use a physical device");
    return null;
  }

  // Check current permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  // Request permission if not granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  // Permission denied
  if (finalStatus !== "granted") {
    console.log("Notification permission denied");
    return null;
  }

  // Generate Expo push token
  const tokenData = await Notifications.getExpoPushTokenAsync();

  const token = tokenData.data;

  return token;
}

export async function sendPushNotification({
  expoTokens,
  title,
  body,
  data = {},
}) {
  const messages = expoTokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data,
  }));

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  const result = await response.json();

  console.log("PUSH RESULT:", result);
  console.log(messages);
}
