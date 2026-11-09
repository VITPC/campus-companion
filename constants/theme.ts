// constants/theme.ts
// Design tokens for Campus Companion. Source of truth: design/README.md
// YIBS brand: blue (primary) + yellow (secondary). Neutrals are tinted toward the blue.
import type { TextStyle } from "react-native";

export const palette = {
  white: "#FFFFFF",
  // YIBS blue: swap these if you get the official hex
  blue: "#1B4DB1",
  blueDeep: "#123A8C",
  blueSoft: "#E6EDFB",
  blueMist: "#C5D3F2",
  // YIBS yellow
  yellow: "#FFC629",
  yellowSoft: "#FFF4D1",
  yellowDeep: "#8A6400",
  // Neutrals (blue-tinted)
  ink: "#0E1726",
  slate: "#5B6475",
  cloud: "#F3F5FA",
  line: "#E3E7EF",
  // Status
  red: "#E5484D",
  redDeep: "#B42318",
  redSoft: "#FDE8E8",
  green: "#2F9E5B",
  greenSoft: "#E3F3E9",
};

export const colors = {
  light: {
    background: palette.white,
    surface: palette.cloud,
    text: palette.ink,
    textMuted: palette.slate,
    border: palette.line,
    // Primary = YIBS blue: buttons, tab bar, key cards, selected states
    primary: palette.blue,
    primaryDeep: palette.blueDeep,
    primarySoft: palette.blueSoft,
    onPrimary: palette.white,
    onPrimaryMuted: palette.blueMist,
    // Secondary = YIBS yellow: active tab pill, current class, highlights
    secondary: palette.yellow,
    secondarySoft: palette.yellowSoft,
    secondaryText: palette.yellowDeep,
    onSecondary: palette.ink,
    danger: palette.red,
    dangerText: palette.redDeep,
    dangerSoft: palette.redSoft,
    success: palette.green,
    successSoft: palette.greenSoft,
  },
  dark: {
    background: "#0A1020",
    surface: "#141C2E",
    text: "#EEF2FA",
    textMuted: "#9AA4B8",
    border: "#243049",
    primary: "#4C7BE0",
    primaryDeep: palette.blue,
    primarySoft: "#16264A",
    onPrimary: palette.white,
    onPrimaryMuted: palette.blueMist,
    secondary: palette.yellow,
    secondarySoft: "#3A2F0A",
    secondaryText: "#FFD66B",
    onSecondary: palette.ink,
    danger: "#FF6B6E",
    dangerText: "#FF8A8C",
    dangerSoft: "#3B1618",
    success: "#4CC37E",
    successSoft: "#12301F",
  },
};

// Matches --spacing-* in the design (screen gutter = xl / 24)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  full: 999,
};

// Plus Jakarta Sans (Google Fonts) — loaded in app/_layout.tsx
export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
};

export const typography = {
  // Big numbers (results score)
  display: { fontFamily: fonts.bold, fontSize: 52, lineHeight: 56, letterSpacing: -1.5 },
  // Screen titles: "Courses", "Results"
  h1: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 38, letterSpacing: -0.64 },
  // Card titles: "Data Structures", "Linked lists lab"
  h2: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.44 },
  // Section headings: "Later today", "Announcements"
  h3: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyBold: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  // Small caps above titles: "SEMESTER 1 · 2026/27"
  overline: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.04,
    textTransform: "uppercase",
  },
  // Pills and badges: "NOW · ENDS IN 25 MIN", "1 due"
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.72,
    textTransform: "uppercase",
  },
} satisfies Record<string, TextStyle>;

export type ThemeColors = typeof colors.light;
