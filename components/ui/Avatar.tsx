// components/ui/Avatar.tsx
// Shared avatar: a photo when one is set, otherwise the user's initials on a
// yellow circle. Used by the Profile header, the photo sheet header and Home,
// so all three reflect the same photo (MY_UI_IMPLEMENTATION.md §5.2 / §9.3).
import { Image } from "expo-image";
import { View } from "react-native";
import { fonts, radius } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "./Text";

type props = {
  name: string;
  size: number;
  photoUri?: string | null;
};

// First letter of the first two words, uppercased ("Ngwa Emmanuel" -> "NE").
// One word -> its first letter. Empty -> "?".
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export function Avatar({ name, size, photoUri }: props) {
  const { colors } = useTheme();

  if (photoUri) {
    return (
      <Image
        accessibilityRole="image"
        accessibilityLabel={name}
        source={photoUri}
        style={{ width: size, height: size, borderRadius: radius.full }}
        contentFit="cover"
      />
    );
  }

  // Initials size is derived from the diameter (0.375 x), not a token size.
  const fontSize = Math.round(size * 0.375);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name}
      style={{
        width: size,
        height: size,
        borderRadius: radius.full,
        backgroundColor: colors.secondary,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize,
          lineHeight: fontSize,
          color: colors.onSecondary,
        }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}
