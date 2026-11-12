import { View, ScrollView, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

import { useData } from "@/hooks/useData";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/Text";

export default function CourseDetailScreen() {
  // Retrieve the course ID safely from the route.
  const params = useLocalSearchParams<{
    courseId?: string | string[];
  }>();

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId ?? "";

  const {
    getCourse,
    getResults,
    getTimetable,
    getNotes,
    getAssignments,
  } = useData();

  const { colors, spacing, radius } = useTheme();

  // Retrieve data belonging to the selected course.
  const course = getCourse(courseId);
  const results = getResults(courseId);
  const timetable = getTimetable(courseId);
  const notes = getNotes(courseId);
  const assignments = getAssignments(courseId);

  // Display an error only when the course ID is missing
  // or does not match an existing course.
  if (!course) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.xl,
        }}
      >
        <StatusBar style="dark" />

        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={colors.textMuted}
        />

        <Text variant="h2" style={{ marginTop: spacing.md }}>
          Course not found
        </Text>

        <Text
          color="textMuted"
          style={{
            textAlign: "center",
            marginTop: spacing.sm,
          }}
        >
          {courseId
            ? `No course matches the ID "${courseId}".`
            : "No course ID was received. Please return to the course list and select a course again."}
        </Text>

        <Pressable
          onPress={() => router.replace("/(tabs)/courses")}
          style={{
            marginTop: spacing.xl,
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
          }}
        >
          <Text color="background" variant="bodyBold">
            Back to My Courses
          </Text>
        </Pressable>
      </View>
    );
  }

  // Course information.
  const nextClass = timetable[0];
  const newNotes = notes.filter((note) => note.isNew);

  const nextAssignment = assignments.find(
    (assignment) => assignment.status === "todo"
  );

  const attendance = Math.round((course.attendance ?? 0) * 100);

  const dueDay = nextAssignment
    ? new Date(nextAssignment.dueAt).toLocaleDateString("en-US", {
        weekday: "long",
      })
    : "";

  const publishedAssessments =
    results?.assessments.filter(
      (item) => item.status === "published"
    ).length ?? 0;

  // Navigate to a course section while preserving its ID.
  const openCourseSection = (
    section: "results" | "notes" | "assignments"
  ) => {
    router.push({
      pathname: `/(tabs)/courses/[courseId]/${section}`,
      params: { courseId: course.id },
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
          paddingBottom: 120,
        }}
      >
        {/* YELLOW COURSE HEADER */}
        <View
          style={{
            backgroundColor: colors.secondary,
            paddingHorizontal: spacing.xl,
            paddingTop: 60,
            paddingBottom: spacing.xxl,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          {/* Back button and course badge */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 42,
                height: 42,
                borderRadius: radius.full,
                backgroundColor: colors.background,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.text}
              />
            </Pressable>

            <View
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radius.full,
              }}
            >
              <Text variant="label" color="background">
                {course.code} · {course.type.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Course information */}
          <Text
            variant="h1"
            color="text"
            style={{ marginTop: spacing.xl }}
          >
            {course.title}
          </Text>

          <Text
            color="text"
            style={{
              marginTop: spacing.sm,
              fontSize: 16,
            }}
          >
            {course.lecturer} · {course.credits} credits · {course.room}
          </Text>

          {/* Course statistics */}
          <View
            style={{
              flexDirection: "row",
              marginTop: spacing.xl,
              gap: spacing.sm,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="h1" color="text">
                {results?.caAverage ?? "—"}
              </Text>

              <Text variant="bodyBold" color="text">
                CA AVG /20
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text variant="h1" color="text">
                {attendance}%
              </Text>

              <Text variant="bodyBold" color="text">
                ATTENDANCE
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text variant="h1" color="text">
                {nextClass?.day ?? "—"}
              </Text>

              <Text variant="bodyBold" color="text">
                NEXT · {nextClass?.start ?? "No schedule"}
              </Text>
            </View>
          </View>
        </View>

        {/* COURSE SPACE */}
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
          }}
        >
          <Text
            variant="h3"
            color="textMuted"
            style={{
              marginBottom: spacing.lg,
              letterSpacing: 1,
            }}
          >
            COURSE SPACE
          </Text>

          {/* RESULTS CARD */}
          <Pressable
            onPress={() => openCourseSection("results")}
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
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.md,
                backgroundColor: colors.primarySoft,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="bar-chart"
                size={25}
                color={colors.primary}
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: spacing.lg,
              }}
            >
              <Text variant="h3">Results</Text>

              <Text variant="body" color="textMuted">
                {publishedAssessments} published assessments
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={23}
              color={colors.textMuted}
            />
          </Pressable>

          {/* NOTES CARD */}
          <Pressable
            onPress={() => openCourseSection("notes")}
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
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.md,
                backgroundColor: colors.primarySoft,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={25}
                color={colors.primary}
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: spacing.lg,
              }}
            >
              <Text variant="h3">Notes</Text>

              <Text variant="body" color="textMuted">
                {notes.length} files · {newNotes.length} new this week
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={23}
              color={colors.textMuted}
            />
          </Pressable>

          {/* ASSIGNMENTS CARD */}
          <Pressable
            onPress={() => openCourseSection("assignments")}
            style={{
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.lg,
              padding: spacing.lg,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.md,
                backgroundColor: colors.primarySoft,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="calendar-clear-outline"
                size={25}
                color={colors.primary}
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: spacing.lg,
              }}
            >
              <Text variant="h3">Assignments</Text>

              <Text
                variant="body"
                color={nextAssignment ? "dangerText" : "textMuted"}
              >
                {nextAssignment
                  ? `${nextAssignment.title} · due ${dueDay}`
                  : "No pending assignments"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={23}
              color={colors.textMuted}
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
