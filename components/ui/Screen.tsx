import { useTheme } from "@/hooks/useTheme";
import { ScrollView, type ViewProps } from "react-native";

export function Screen({ children, style }: ViewProps) {
  const { colors, spacing } = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md, ...style }}
    >
      {children}
    </ScrollView>
  );
}
