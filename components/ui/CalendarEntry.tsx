import { XStack } from "./XStack";
import { YStack } from "./YStack";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/Text";

type props = {
  time: string;
  courseTitle: string;
  hall: string;
};

export function CalendarEntry({ time, courseTitle, hall }: props) {
  const { colors, spacing } = useTheme();
  return (
    <XStack
      style={{
        alignItems: "center",
        gap: spacing.lg,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.primarySoft,
      }}
    >
      <Text variant="bodyBold" style={{ flex: 1 }}>
        {time}
      </Text>
      <YStack
        style={{
          flex: 5,
          paddingLeft: spacing.xl,
          borderLeftWidth: 4,
          borderLeftColor: colors.primary,
        }}
      >
        <Text variant="h3">{courseTitle}</Text>
        <Text>{hall}</Text>
      </YStack>
    </XStack>
  );
}
