import { Text as RNText, type TextProps } from "react-native";
import type { ThemeColors, typography } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type props = TextProps & {
  variant?: keyof typeof typography;
  color?: keyof ThemeColors;
};

export function Text({
  variant = "body",
  color = "text",
  style,
  ...rest
}: props) {
  const theme = useTheme();
  return (
    <RNText
      style={[theme.typography[variant], { color: theme.colors[color] }, style]}
      {...rest}
    />
  );
}
