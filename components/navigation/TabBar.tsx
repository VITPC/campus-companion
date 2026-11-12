import type { Tabs } from "expo-router";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, fonts, radius, spacing } from "@/constants/theme";

// The props Expo Router passes to a custom tab bar
type TabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

const c = colors.light;

// Where each tab sits inside the bar, measured with onLayout
type TabLayout = { x: number; width: number };

// A quick spring that settles without a visible wobble
const SPRING = { duration: 450, dampingRatio: 0.85 };

export function TabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: TabBarProps) {
  console.log(state, descriptors, emitter, navigateToTab, insets);

  // The yellow pill is one shared view that slides between tabs,
  // instead of each tab drawing its own background.
  const [layouts, setLayouts] = useState<Record<string, TabLayout>>({});
  const pillX = useSharedValue(0);
  const pillWidth = useSharedValue(0);
  const placed = useRef(false);
  const activeKey = state.routes[state.index]?.key;

  useEffect(() => {
    const target = activeKey ? layouts[activeKey] : undefined;
    if (!target) return;
    if (!placed.current) {
      // First measurement: jump into place, don't slide in from the left
      pillX.value = target.x;
      pillWidth.value = target.width;
      placed.current = true;
      return;
    }
    // Tabs differ in width, so animate both position and width
    pillX.value = withSpring(target.x, SPRING);
    pillWidth.value = withSpring(target.width, SPRING);
  }, [activeKey, layouts, pillX, pillWidth]);

  const pillStyle = useAnimatedStyle(() => ({
    width: pillWidth.value,
    // Hidden until the tabs have been measured
    opacity: pillWidth.value > 0 ? 1 : 0,
    transform: [{ translateX: pillX.value }],
  }));

  const onTabLayout = (key: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) =>
      prev[key]?.x === x && prev[key]?.width === width
        ? prev
        : { ...prev, [key]: { x, width } },
    );
  };

  return (
    // We own this row, so gap and alignItems apply to the tabs directly.
    // 28 from the bottom, or more if the phone's home indicator needs it.
    <View style={[styles.bar, { bottom: Math.max(insets.bottom, 28) }]}>
      {/* Rendered first so it sits behind the icons and labels */}
      <Animated.View pointerEvents="none" style={[styles.pill, pillStyle]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        // Dark on yellow when active, white on blue when not
        const color = focused ? c.onSecondary : c.onPrimary;
        const label = options.title ?? route.name;

        // What the default tab button does: send tabPress, then navigate
        const onPress = () => {
          const event = emitter.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={() =>
              emitter.emit({ type: "tabLongPress", target: route.key })
            }
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onLayout={onTabLayout(route.key)}
            style={styles.tab}
          >
            {options.tabBarIcon?.({ focused, color, size: 20 })}
            <Text
              style={[styles.label, { color }, focused && styles.labelActive]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
    height: 64,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.full,
    backgroundColor: c.primary,
    shadowColor: c.text,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  tab: {
    height: 48,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
  },
  pill: {
    position: "absolute",
    left: 0,
    // Same height as a tab, centered in the 64px bar
    top: 8,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: c.secondary,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
  },
  labelActive: {
    fontFamily: fonts.bold,
  },
});
