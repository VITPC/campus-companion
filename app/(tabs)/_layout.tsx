import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/navigation/TabBar";
import { useTranslation } from "@/hooks/useTranslation";

// tabBarIcon gets `color` typed as ColorValue; Feather wants a string.
// Our TabBar always passes a hex string, so the cast is safe.
export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      // Our own tab bar (components/navigation/TabBar.tsx) replaces the default one
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: t("tabs.courses"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="book" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color as string} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
