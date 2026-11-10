import { View, type ViewProps } from "react-native";

export function XStack({ children, style }: ViewProps) {
  return (
    <View style={{ flex: 1, flexDirection: "row", ...style }}>{children}</View>
  );
}
