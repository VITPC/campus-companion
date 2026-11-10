import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/navigation/TabBar";

// tabBarIcon gets `color` typed as ColorValue; Feather wants a string.
// Our TabBar always passes a hex string, so the cast is safe.
export default function TabsLayout() {
  return (
    <Tabs
      // Our own tab bar (components/navigation/TabBar.tsx) replaces the default one
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color as string} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
