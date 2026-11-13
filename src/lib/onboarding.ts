import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "onboarding_completed";

/** True once the user has finished (or skipped) onboarding on this device. */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === "true";
  } catch {
    return false;
  }
}

export async function markOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, "true");
  } catch {
    // Storage unavailable: onboarding will show again next time, which is safe.
  }
}
