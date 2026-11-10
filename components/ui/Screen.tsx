import { ScrollView, type ViewProps } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export function Screen({ children, style }: ViewProps) {
  const { colors, spacing } = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xxl,
        // Room to scroll past the floating tab bar (64 high + 28 from the bottom + 24)
        paddingBottom: 116,
        gap: spacing.lg,
        ...style,
      }}
    >
      {children}
    </ScrollView>
  );
}
