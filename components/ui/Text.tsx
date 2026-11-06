import { typography } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Text as RNText, TextProps } from "react-native";

type props = TextProps & {
  variant?: keyof typeof typography;
  color?: "text" | "textMuted" | "primary" | "danger";
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
