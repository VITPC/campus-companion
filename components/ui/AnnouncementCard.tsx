import { useTheme } from "@/hooks/useTheme";
import { YStack } from "./YStack";
import { Text } from "./Text";
import { useWindowDimensions } from "react-native";

type Announcement = {
  id: string;
  category: string;
  title: string;
  body: string;
  source: string;
  publishedAt: string;
  highlighted: boolean;
};

type Props = {
  announcement: Announcement;
};

export function AnnouncementCard({ announcement: a }: Props) {
  const { spacing, colors } = useTheme();
  const { width } = useWindowDimensions();

  return (
    <YStack
      style={{
        maxWidth: width - 40,
        gap: spacing.sm,
        backgroundColor: colors.secondarySoft,
        borderRadius: spacing.xl,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.xxl,
      }}
    >
      <Text>{a.title}</Text>
      <Text variant="bodyBold">{a.body}</Text>
      <Text color="textMuted">{a.source}</Text>
    </YStack>
  );
}
