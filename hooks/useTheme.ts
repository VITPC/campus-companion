import { useColorScheme } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

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
