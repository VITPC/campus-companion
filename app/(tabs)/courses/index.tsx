import {
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useData } from "@/hooks/useData";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/Text";

export default function CoursesScreen() {
  const { courses } = useData();
  const { colors, spacing, radius } = useTheme();

  const openCourse = (courseId: string) => {
    router.push({
      pathname: "/(tabs)/courses/[courseId]",
      params: {
        courseId: courseId,
      },
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xl,
          paddingBottom: 120,
        }}
      >
        {/* PAGE HEADER */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text variant="h1" color="text">
            My Courses
          </Text>

          <Text
            variant="body"
            color="textMuted"
            style={{ marginTop: spacing.xs }}
          >
            Access your courses, results, notes and assignments.
          </Text>
        </View>

        {/* COURSE COUNT */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: spacing.lg,
          }}
        >
          <Text variant="h3" color="text">
            All Courses
          </Text>

          <View
            style={{
              backgroundColor: colors.primarySoft,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: radius.full,
            }}
          >
            <Text variant="label" color="primary">
              {courses.length} Courses
            </Text>
          </View>
        </View>

        {/* COURSE LIST */}
        {courses.map((course) => (
          <Pressable
            key={course.id}
            onPress={() => openCourse(course.id)}
            style={{
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.lg,
              padding: spacing.lg,
              marginBottom: spacing.md,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* COURSE ICON */}
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: radius.md,
                backgroundColor: colors.primarySoft,
                justifyContent: "center",
                alignItems: "center",
                marginRight: spacing.md,
              }}
            >
              <Ionicons
                name="book-outline"
                size={25}
                color={colors.primary}
              />
            </View>

            {/* COURSE INFORMATION */}
            <View style={{ flex: 1 }}>
              <Text variant="label" color="primary">
                {course.code}
              </Text>

              <Text
                variant="h3"
                color="text"
                style={{ marginTop: spacing.xs }}
              >
                {course.title}
              </Text>

              <Text
                variant="caption"
                color="textMuted"
                style={{ marginTop: spacing.xs }}
              >
                {course.lecturer}
              </Text>

              <Text
                variant="caption"
                color="textMuted"
                style={{ marginTop: spacing.xs }}
              >
                {course.credits} Credits · {course.room}
              </Text>
            </View>

            {/* COURSE TYPE AND ARROW */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginLeft: spacing.sm,
              }}
            >
              <Ionicons
                name="chevron-forward"
                size={23}
                color={colors.primary}
              />
            </View>
          </Pressable>
        ))}

        {/* EMPTY STATE */}
        {courses.length === 0 && (
          <View
            style={{
              alignItems: "center",
              paddingVertical: spacing.xxl,
            }}
          >
            <Ionicons
              name="book-outline"
              size={45}
              color={colors.textMuted}
            />

            <Text variant="h3" style={{ marginTop: spacing.md }}>
              No courses available
            </Text>

            <Text
              variant="body"
              color="textMuted"
              style={{
                textAlign: "center",
                marginTop: spacing.xs,
              }}
            >
              Your courses will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
