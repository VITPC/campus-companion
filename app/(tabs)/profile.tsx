import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function profile() {
  return (
    <SafeAreaProvider>
      <Screen>
        <Text>Profile</Text>
      </Screen>
    </SafeAreaProvider>
  );
}
