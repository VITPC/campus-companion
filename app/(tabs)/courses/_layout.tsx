import { Stack } from "expo-router";

export default function CourseLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[courseId]" />
      <Stack.Screen name="[courseId]/results" />
      <Stack.Screen name="[courseId]/notes" />
      <Stack.Screen name="[courseId]/assignments" />
    </Stack>
  );
}