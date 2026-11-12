import { Stack } from "expo-router";
import { SettingsProvider } from "@/context/SettingsContext";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </SettingsProvider>
  );
}
