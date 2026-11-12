// components/ui/Switch.tsx
// Custom switch matching the design: 50x30 track, 26 thumb, 2 inset.
// ON = primary track + secondary (yellow) thumb; OFF = border track + white thumb.
// Geometry is fixed by the design (MY_UI_IMPLEMENTATION.md §5.3), so the numbers
// below are constants rather than spacing tokens.
import { useEffect, useState } from "react";
import { Animated, Pressable } from "react-native";
import { palette, radius } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const THUMB_SIZE = 26;
const THUMB_INSET = 2;
// Travel distance = track − thumb − both insets
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_INSET * 2;
const ANIMATION_MS = 160;

type props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export function Switch({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}: props) {
  const { colors } = useTheme();
  // Lazy initialiser keeps one Animated.Value for the component's lifetime.
  const [translateX] = useState(
    () => new Animated.Value(value ? TRAVEL : 0),
  );

  // Keep the animation in sync when `value` changes from the outside too.
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? TRAVEL : 0,
      duration: ANIMATION_MS,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
      style={{
        width: TRACK_WIDTH,
        height: TRACK_HEIGHT,
        borderRadius: radius.full,
        backgroundColor: value ? colors.primary : colors.border,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          left: THUMB_INSET,
          top: THUMB_INSET,
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: radius.full,
          backgroundColor: value ? colors.secondary : palette.white,
          transform: [{ translateX }],
          shadowColor: palette.ink,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 2,
        }}
      />
    </Pressable>
  );
}
