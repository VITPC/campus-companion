// app/(tabs)/profile/index.tsx — Profile settings screen (issue #15). §6.
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ChangePhotoSheet } from "@/components/profile/ChangePhotoSheet";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SettingsRow } from "@/components/profile/SettingsRow";
import { Screen } from "@/components/ui/Screen";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";
import { fonts } from "@/constants/theme";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import data from "@/mocks/data.json";

const student = data.student;

export default function ProfileScreen() {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const { settings, updateSetting, photoUri } = useSettings();
  const insets = useSafeAreaInsets();
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);

  const fullName = `${student.firstName} ${student.lastName}`;
  const subtitle = `${student.matricule} · ${student.programme}, ${t(
    "profile.level",
  )} ${student.level}`;
  // The row value and card titles always use the language's native name.
  const languageName =
    data.languages.find((language) => language.code === settings.language)
      ?.nativeName ?? settings.language;

  const onSignOut = () => {
    Alert.alert(t("profile.signOutTitle"), t("profile.signOutMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("profile.signOut"),
        style: "destructive",
        onPress: () => {
          // No auth/sign-out function exists in the project yet (§6.6).
        },
      },
    ]);
  };

  const onPressPhoto = () => setPhotoSheetVisible(true);

  return (
    <SafeAreaProvider>
      <Screen
        style={{
          // §6.2: 24 pt horizontal gutter (Screen defaults to spacing.md = 12).
          paddingHorizontal: spacing.xl,
          // §6.2: avatar top = safe-area inset + spacing.xl (≈74 pt on a
          // ~50 pt status bar). `style` overrides Screen's fixed 32 pt padding,
          // so the total is not doubled.
          paddingTop: insets.top + spacing.xl,
          // §6.7: clear the floating tab bar (64 pt tall, offset max(inset, 28)).
          paddingBottom: Math.max(insets.bottom, 28) + 64 + spacing.xl,
        }}
      >
        <View>
          <ProfileHeader
            name={fullName}
            subtitle={subtitle}
            photoUri={photoUri}
            onPressPhoto={onPressPhoto}
          />

          <Text
            variant="overline"
            color="textMuted"
            style={{ marginTop: spacing.xl }}
          >
            {t("profile.preferences")}
          </Text>

          <View style={{ marginTop: spacing.xs }}>
            <SettingsRow
              icon="globe"
              label={t("profile.language")}
              value={languageName}
              showChevron
              // Absolute path: route groups like (tabs) are not part of the URL.
              onPress={() => router.push("/profile/language")}
            />
            <SettingsRow
              icon="bell"
              label={t("profile.classReminders")}
              trailing={
                <Switch
                  value={settings.classReminders}
                  onValueChange={(value) =>
                    updateSetting("classReminders", value)
                  }
                />
              }
              onPress={() =>
                updateSetting("classReminders", !settings.classReminders)
              }
              accessibilityRole="switch"
              accessibilityState={{ checked: settings.classReminders }}
            />
            <SettingsRow
              icon="moon"
              label={t("profile.darkMode")}
              trailing={
                <Switch
                  value={settings.darkMode}
                  onValueChange={(value) => updateSetting("darkMode", value)}
                />
              }
              onPress={() => updateSetting("darkMode", !settings.darkMode)}
              accessibilityRole="switch"
              accessibilityState={{ checked: settings.darkMode }}
            />
            <SettingsRow
              icon="help-circle"
              label={t("profile.help")}
              showChevron
              onPress={() => {
                // No destination specified in the design (§6.5).
              }}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onSignOut}
            style={{
              alignSelf: "flex-start",
              marginTop: spacing.sm,
              paddingVertical: spacing.md,
            }}
          >
            <Text
              variant="body"
              style={{ color: colors.danger, fontFamily: fonts.medium }}
            >
              {t("profile.signOut")}
            </Text>
          </Pressable>
        </View>
      </Screen>

      <ChangePhotoSheet
        visible={photoSheetVisible}
        onClose={() => setPhotoSheetVisible(false)}
      />
    </SafeAreaProvider>
  );
}
