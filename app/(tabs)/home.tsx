import { router } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnnouncementCard } from "@/components/ui/AnnouncementCard";
import { Avatar } from "@/components/ui/Avatar";
import { CalendarEntry } from "@/components/ui/CalendarEntry";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { XStack } from "@/components/ui/XStack";
import { YStack } from "@/components/ui/YStack";
import { useSettings } from "@/context/SettingsContext";
import { useData } from "@/hooks/useData";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import data from "@/mocks/data.json";

export default function HomeScreen() {
  const { spacing, colors } = useTheme();
  const { announcements } = useData();
  const { t } = useTranslation();
  const { photoUri } = useSettings();

  return (
    <SafeAreaProvider>
      <Screen>
        <XStack
          style={{
            marginTop: spacing.lg,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <YStack>
            <Text variant="caption">Monday . 9th Nov</Text>
            <Text variant="h1">Morning, Ngwa</Text>
          </YStack>
          <Pressable onPress={() => router.push("/(tabs)/profile")}>
            <Avatar
              name={`${data.student.firstName} ${data.student.lastName}`}
              size={80}
              photoUri={photoUri}
            />
          </Pressable>
        </XStack>

        {/* Recent course for today */}
        <YStack
          style={{
            backgroundColor: colors.primary,
            borderRadius: spacing.xl,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.xl,
            gap: spacing.lg,
          }}
        >
          <XStack
            style={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontWeight: "bold",
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.xl,
                backgroundColor: colors.secondary,
                borderRadius: 1000,
              }}
            >
              Now. Ends in 25 Mins
            </Text>
            <Text style={{ color: "#fff" }}>Hall B2</Text>
          </XStack>

          <YStack>
            <Text variant="h2" style={{ color: "#fff" }}>
              Data Structures
            </Text>
            <Text style={{ color: "#fff", opacity: 0.5 }}>
              CSC 201 · Dr. Fon Mbah · 08:00–10:00
            </Text>
          </YStack>
        </YStack>

        {/* Later today */}
        <XStack
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Text variant="h2">{t("home.laterToday")}</Text>
          <Text style={{ textDecorationLine: "underline" }}>Full week</Text>
        </XStack>

        {/* Later today */}
        <CalendarEntry
          courseTitle="Mobile Development"
          time={"10:30"}
          hall={"CSC215-Lab3"}
        />
        <CalendarEntry
          courseTitle="Descrete Mathematics"
          time={"14:00"}
          hall={"MAT305-Amphi 250"}
        />
        {/*Announcement card*/}
        <XStack
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Text variant="bodyBold">{t("home.announcements")}</Text>
          <Text style={{ textDecorationLine: "underline" }}>See all</Text>
        </XStack>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 30 }}
          data={announcements}
          ItemSeparatorComponent={<View style={{ width: 30 }} />}
          ListEmptyComponent={<Text>No announcements</Text>}
          renderItem={({ item }) => <AnnouncementCard announcement={item} />}
        />
      </Screen>
    </SafeAreaProvider>
  );
}
