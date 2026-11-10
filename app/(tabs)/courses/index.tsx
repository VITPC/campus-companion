import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function () {
  return (
    <SafeAreaProvider>
      <Screen>
        <Text>Courses</Text>
      </Screen>
    </SafeAreaProvider>
  );
}
