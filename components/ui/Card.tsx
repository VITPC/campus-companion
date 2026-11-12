import { useTheme } from "@/hooks/useTheme";
import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

type CardProps = {
  children: ReactNode;
  padding?: keyof ReturnType<typeof useTheme>["spacing"] | number;
  style?: StyleProp<ViewStyle>;
  variant?: "surface" | "primary" | "outline";
};

export function Card({
  children,
  padding = "lg",
  style,
  variant = "surface",
}: CardProps) {
  const { colors, radius, spacing } = useTheme();
  const variants = {
    surface: {
      backgroundColor: colors.surface,
      borderColor: "transparent",
    },
    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    outline: {
      backgroundColor: colors.background,
      borderColor: colors.primary,
    },
  };
  const paddingValue = typeof padding === "number" ? padding : spacing[padding];

  return (
    <View
      style={[
        {
          padding: paddingValue,
          borderWidth: variant === "outline" ? 1 : 0,
          borderRadius: radius.lg,
          backgroundColor: variants[variant].backgroundColor,
          borderColor: variants[variant].borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
