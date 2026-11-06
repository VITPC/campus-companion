// constants/theme.ts
export const palette = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  danger: "#DC2626",
  success: "#16A34A",
};

export const colors = {
  light: {
    background: "#FFFFFF",
    surface: "#F4F4F5",
    text: "#18181B",
    textMuted: "#71717A",
    border: "#E4E4E7",
    primary: palette.primary,
    danger: palette.danger,
  },
  dark: {
    background: "#09090B",
    surface: "#18181B",
    text: "#FAFAFA",
    textMuted: "#A1A1AA",
    border: "#27272A",
    primary: "#3B82F6",
    danger: "#EF4444",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
};

export const fonts = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
};

export const typography = {
  h1: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 40 },
  h2: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32 },
  h3: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 28 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  bodyBold: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
};

export type ThemeColors = typeof colors.light;
