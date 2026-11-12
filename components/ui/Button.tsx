import { Feather } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";
import type { ComponentProps, ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  children: ReactNode;
  leadingIcon?: ComponentProps<typeof Feather>["name"];
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  leadingIcon,
  style,
  variant = "primary",
  ...pressableProps
}: ButtonProps) {
  const { colors, radius, spacing } = useTheme();
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      style={[
        {
          height: 52,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.sm,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.full,
          backgroundColor: isPrimary ? colors.primary : colors.surface,
        },
        style,
      ]}
      {...pressableProps}
    >
      {leadingIcon && (
        <Feather
          name={leadingIcon}
          size={20}
          color={isPrimary ? colors.secondary : colors.text}
        />
      )}
      <Text
        variant="bodyBold"
        color={isPrimary ? "onPrimary" : "text"}
        style={{ textAlign: "center" }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
