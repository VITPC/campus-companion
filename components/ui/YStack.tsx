import { type ViewProps, View } from "react-native";

export function YStack({ children, style }: ViewProps) {
  return <View style={{ flex: 1, ...style }}>{children}</View>;
}
