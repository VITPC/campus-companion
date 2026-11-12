import { SafeAreaProvider } from "react-native-safe-area-context";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";

export default function CoursesScreen() {
  return (
    <SafeAreaProvider>
      <Screen>
        <Text>Courses</Text>
      </Screen>
    </SafeAreaProvider>
  );
}
