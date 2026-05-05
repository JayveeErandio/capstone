import * as Notifications from "expo-notifications";

export async function testNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "MoodLink",
      body: "Someone laughed to your post",
    },
    trigger: null, // immediately
  });
}
