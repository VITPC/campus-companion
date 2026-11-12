import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";

export default function UiDemoScreen() {
  const { spacing } = useTheme();

  return (
    <SafeAreaProvider>
      <Screen>
        <Text variant="h1">UI components</Text>

        <View style={{ gap: spacing.md }}>
          <Text variant="h3">Buttons</Text>
          <Button leadingIcon="arrow-up">Upload submission</Button>
          <Button variant="secondary">Cancel</Button>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="h3">Pills</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            <Pill variant="secondary">Now · Ends in 25 min</Pill>
            <Pill variant="danger">Due in 3 days</Pill>
            <Pill variant="primary">CSC 201 · Core</Pill>
            <Pill variant="outline">Pending</Pill>
          </View>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="h3">Cards</Text>
          <Card variant="surface">
            <Text variant="bodyBold">Surface card</Text>
          </Card>
          <Card variant="primary">
            <Text variant="bodyBold" color="onPrimary">
              Primary card
            </Text>
          </Card>
          <Card variant="outline" padding="xl">
            <Text variant="bodyBold">Outlined card</Text>
          </Card>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text variant="h3">Avatars</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <Avatar initials="NE" size={44} />
            <Avatar initials="NE" size={64} />
            <Avatar
              initials="NE"
              size={104}
              uri="https://picsum.photos/seed/campus-companion/104"
            />
          </View>
        </View>
      </Screen>
    </SafeAreaProvider>
  );
}
