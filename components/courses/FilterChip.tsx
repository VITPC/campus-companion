// components/courses/FilterChip.tsx
// One rounded filter chip: filled blue when selected, outlined when not.
import { Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChip({ label, selected, onPress }: Props) {
  const { colors, spacing, radius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => ({
        height: 36,
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary : colors.background,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        color={selected ? "onPrimary" : "text"}
        style={selected && { fontFamily: fonts.semibold }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
