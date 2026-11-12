// app/(tabs)/profile/language.tsx — Language picker (issue #16). §7.
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LanguageOption } from "@/components/profile/LanguageOption";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { radius } from "@/constants/theme";
import { type Language, useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import data from "@/mocks/data.json";

function isLanguage(code: string): code is Language {
  return code === "en" || code === "fr";
}

export default function LanguageScreen() {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const { settings, updateSetting } = useSettings();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <Screen
        style={{
          // §7.2: 24 pt horizontal gutter (Screen defaults to spacing.md = 12).
          paddingHorizontal: spacing.xl,
          // §7.2: back button top = safe-area inset + spacing.lg (≈66 pt on a
          // ~50 pt status bar). `style` overrides Screen's fixed 32 pt padding,
          // so the total is not doubled.
          paddingTop: insets.top + spacing.lg,
          // §6.7: clear the floating tab bar (64 pt tall, offset max(inset, 28)).
          paddingBottom: Math.max(insets.bottom, 28) + 64 + spacing.xl,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          hitSlop={4}
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.full,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="chevron-left" size={20} color={colors.text} />
        </Pressable>

        <View>
          <Text variant="overline" color="textMuted">
            {t("language.breadcrumb")}
          </Text>
          <Text variant="h1" style={{ marginTop: spacing.xs }}>
            {t("language.title")}
          </Text>

          <View
            accessibilityRole="radiogroup"
            style={{
              marginTop: spacing.lg + spacing.xs,
              gap: 10, // off-scale: design value (§4.3 #4)
            }}
          >
            {data.languages.map((language) => (
              <LanguageOption
                key={language.code}
                code={language.code}
                name={language.nativeName}
                subtitle={
                  language.isDefault
                    ? t("language.default")
                    : language.name
                }
                selected={settings.language === language.code}
                onPress={() => {
                  if (
                    isLanguage(language.code) &&
                    settings.language !== language.code
                  ) {
                    updateSetting("language", language.code);
                  }
                }}
              />
            ))}
          </View>

          <Text
            variant="caption"
            color="textMuted"
            style={{ marginTop: spacing.lg + spacing.xs, lineHeight: 20 }}
          >
            {t("language.note")}
          </Text>
        </View>
      </Screen>
    </SafeAreaProvider>
  );
}
