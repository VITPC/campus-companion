// components/profile/LanguageOption.tsx
// A selectable language card: code badge, native name + subtitle, and a radio
// indicator (filled blue + yellow tick when selected). MY_UI_IMPLEMENTATION.md §7.5.
import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { radius } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type props = {
  code: string;
  name: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
};

export function LanguageOption({
  code,
  name,
  subtitle,
  selected,
  onPress,
}: props) {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={name}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 74,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        borderRadius: radius.md,
        backgroundColor: selected ? colors.secondarySoft : colors.background,
        overflow: "hidden",
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.full,
          backgroundColor: selected ? colors.background : colors.surface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text variant="bodyBold">{code.toUpperCase()}</Text>
      </View>

      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text variant="bodyBold">{name}</Text>
        <Text variant="caption" color="textMuted">
          {subtitle}
        </Text>
      </View>

      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: radius.full,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: selected ? colors.primary : "transparent",
          borderWidth: selected ? 0 : 1.5,
          borderColor: colors.textMuted,
          // Unselected ring: textMuted at 40% (§4.3 #1 — needs a borderStrong token).
          opacity: selected ? 1 : 0.4,
        }}
      >
        {selected ? (
          <Feather name="check" size={14} color={colors.secondary} />
        ) : null}
      </View>
    </Pressable>
  );
}
