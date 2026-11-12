// components/profile/ProfileHeader.tsx
// Centred avatar (104) with a camera badge on the 45° bottom-right point, the
// student's name and the matricule/programme/level subtitle. §6.3 / §6.4.
import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";
import { radius } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

const AVATAR_SIZE = 104;
const BADGE_SIZE = 34;

type props = {
  name: string;
  subtitle: string;
  photoUri: string | null;
  onPressPhoto: () => void;
};

export function ProfileHeader({
  name,
  subtitle,
  photoUri,
  onPressPhoto,
}: props) {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}>
        <Avatar name={name} size={AVATAR_SIZE} photoUri={photoUri} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("profile.changePhoto")}
          hitSlop={10}
          onPress={onPressPhoto}
          style={{
            position: "absolute",
            // Badge centre lands on the avatar circumference at the 45° point.
            right: -2,
            bottom: -2,
            width: BADGE_SIZE,
            height: BADGE_SIZE,
            borderRadius: radius.full,
            backgroundColor: colors.primary,
            borderWidth: 2,
            borderColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="camera" size={16} color={colors.onPrimary} />
        </Pressable>
      </View>

      <Text
        variant="h2"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          marginTop: spacing.lg,
          paddingHorizontal: spacing.xl,
          textAlign: "center",
        }}
      >
        {name}
      </Text>
      <Text
        variant="caption"
        color="textMuted"
        numberOfLines={2}
        style={{ marginTop: spacing.xs, textAlign: "center" }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
