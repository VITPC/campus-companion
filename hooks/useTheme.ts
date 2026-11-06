import { colors, radius, spacing, typography } from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme() ?? "light";
  return {
    colors: colors[scheme],
    spacing,
    radius,
    typography,
    isDark: scheme === "dark",
  };
}
