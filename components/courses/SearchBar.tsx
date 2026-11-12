// components/courses/SearchBar.tsx
// Grey rounded search box with a magnifier and a clear (×) button.
// Controlled: the parent owns the text, so it can also clear it (e.g. the
// "Clear search" button on the empty state).
import { Feather } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search by name or code",
}: Props) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        height: 48,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
      }}
    >
      <Feather name="search" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel="Search courses"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        style={{
          flex: 1,
          height: "100%",
          color: colors.text,
          // Only font and size from the body style: lineHeight on a
          // TextInput pushes the text off-centre on iOS.
          fontFamily: fonts.regular,
          fontSize: typography.body.fontSize,
        }}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Feather name="x-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}
