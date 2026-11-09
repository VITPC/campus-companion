import { useTheme } from "@/hooks/useTheme";
import { ScrollView, type ViewProps } from "react-native";

export function Screen({ children, style }: ViewProps) {
  const { colors, spacing } = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxl,
        gap: spacing.lg,
        ...style,
      }}
    >
      {children}
    </ScrollView>
  );
}
