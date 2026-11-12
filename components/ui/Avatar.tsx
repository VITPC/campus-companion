import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import {
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type AvatarSize = 44 | 64 | 104;

type AvatarProps = {
  initials: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  uri?: string;
};

const textVariants: Record<AvatarSize, "bodyBold" | "h2" | "h1"> = {
  44: "bodyBold",
  64: "h2",
  104: "h1",
};

export function Avatar({
  initials,
  size = 44,
  style,
  uri,
}: AvatarProps) {
  const { colors, radius } = useTheme();
  const avatarStyle: ViewStyle = {
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  };

  return (
    <View
      accessible
      accessibilityLabel={`${initials} avatar`}
      accessibilityRole="image"
      style={[avatarStyle, style]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          contentFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <Text
          variant={textVariants[size]}
          color="onSecondary"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {initials}
        </Text>
      )}
    </View>
  );
}
