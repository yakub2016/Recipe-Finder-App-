import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATIONS_KEY = "pref_notifications";

/** Notifications are on unless the user turned them off. */
export async function getNotificationsEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(NOTIFICATIONS_KEY)) !== "off";
  } catch {
    return true;
  }
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, enabled ? "on" : "off");
  } catch {
    // storage unavailable: the switch still works for this session
  }
}
