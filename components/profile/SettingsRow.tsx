// components/profile/SettingsRow.tsx
// One settings row: leading icon, label, optional value/chevron/switch, and a
// 1pt bottom divider on every row (including the last). MY_UI_IMPLEMENTATION.md §5.4.
import { Feather } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import {
  type AccessibilityRole,
  type AccessibilityState,
  Pressable,
  View,
} from "react-native";
import { fonts } from "@/constants/theme";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

type FeatherName = ComponentProps<typeof Feather>["name"];

type props = {
  icon: FeatherName;
  label: string;
  value?: string;
  showChevron?: boolean;
  onPress?: () => void;
  trailing?: ReactNode;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessibilityLabel?: string;
};

export function SettingsRow({
  icon,
  label,
  value,
  showChevron = false,
  onPress,
  trailing,
  accessibilityRole = "button",
  accessibilityState,
  accessibilityLabel,
}: props) {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 56,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        opacity: pressed && onPress ? 0.6 : 1,
      })}
    >
      <Feather name={icon} size={20} color={colors.text} />

      <Text
        variant="body"
        numberOfLines={1}
        style={{ flex: 1, marginLeft: spacing.lg, fontFamily: fonts.medium }}
      >
        {label}
      </Text>

      {value ? (
        <Text
          color="textMuted"
          numberOfLines={1}
          style={{ flexShrink: 1, marginRight: spacing.md }}
        >
          {value}
        </Text>
      ) : null}

      {trailing ? (
        // The row itself is the accessible control, so hide the inner switch
        // from the accessibility tree (MY_UI_IMPLEMENTATION.md §6.5).
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {trailing}
        </View>
      ) : null}

      {showChevron ? (
        <Feather name="chevron-right" size={20} color={colors.textMuted} />
      ) : null}
    </Pressable>
  );
}
