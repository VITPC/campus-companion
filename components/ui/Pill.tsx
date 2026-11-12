import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

type PillProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "secondary" | "danger" | "primary" | "outline";
};

export function Pill({
  children,
  style,
  variant = "outline",
}: PillProps) {
  const { colors, radius, spacing } = useTheme();
  const variants = {
    secondary: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondary,
      textColor: "onSecondary" as const,
    },
    danger: {
      backgroundColor: colors.dangerSoft,
      borderColor: colors.dangerSoft,
      textColor: "dangerText" as const,
    },
    primary: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primarySoft,
      textColor: "primary" as const,
    },
    outline: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      textColor: "textMuted" as const,
    },
  } satisfies Record<
    NonNullable<PillProps["variant"]>,
    { backgroundColor: string; borderColor: string; textColor: string }
  >;
  const selectedVariant = variants[variant];

  return (
    <View
      style={[
        {
          alignSelf: "flex-start",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderWidth: 1,
          borderRadius: radius.full,
          backgroundColor: selectedVariant.backgroundColor,
          borderColor: selectedVariant.borderColor,
        },
        style,
      ]}
    >
      <Text variant="label" color={selectedVariant.textColor}>
        {children}
      </Text>
    </View>
  );
}
